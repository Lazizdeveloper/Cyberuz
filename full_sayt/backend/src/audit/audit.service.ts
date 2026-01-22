import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel, AuditStatus } from '../schemas/audit-log.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async findAll(
    companyId?: string,
    action?: AuditAction,
    riskLevel?: RiskLevel,
    status?: AuditStatus,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 50,
  ) {
    const query: any = {};
    
    if (companyId) query.companyId = companyId;
    if (action) query.action = action;
    if (riskLevel) query.riskLevel = riskLevel;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find(query)
        .populate('userId', 'firstName lastName email')
        .populate('companyId', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ timestamp: -1 })
        .exec(),
      this.auditLogModel.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats(companyId?: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchQuery: any = { timestamp: { $gte: startDate } };
    if (companyId) matchQuery.companyId = companyId;

    const [
      totalLogs,
      actionStats,
      riskStats,
      dailyStats,
      topUsers,
      anomalies
    ] = await Promise.all([
      this.auditLogModel.countDocuments(matchQuery),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
      ]),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$userId', count: { $sum: 1 }, userName: { $first: '$userName' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      this.auditLogModel.countDocuments({ ...matchQuery, isAnomaly: true })
    ]);

    return {
      totalLogs,
      actionStats,
      riskStats,
      dailyStats,
      topUsers,
      anomalies,
    };
  }

  async getRecentActivity(companyId?: string, limit = 20) {
    const query = companyId ? { companyId } : {};
    
    return this.auditLogModel
      .find(query)
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getSecurityAlerts(companyId?: string, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      timestamp: { $gte: startDate },
      $or: [
        { riskLevel: { $in: [RiskLevel.HIGH, RiskLevel.CRITICAL] } },
        { isAnomaly: true },
        { status: AuditStatus.BLOCKED }
      ]
    };

    if (companyId) query.companyId = companyId;

    return this.auditLogModel
      .find(query)
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .sort({ timestamp: -1 })
      .exec();
  }

  async createLog(logData: Partial<AuditLog>) {
    const auditLog = new this.auditLogModel({
      ...logData,
      timestamp: new Date(),
    });
    
    return auditLog.save();
  }

  async detectAnomalies(companyId?: string) {
    // Simple anomaly detection based on unusual patterns
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const query: any = { timestamp: { $gte: oneHourAgo } };
    if (companyId) query.companyId = companyId;

    // Find users with unusual activity
    const suspiciousActivity = await this.auditLogModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          actions: { $addToSet: '$action' },
          ips: { $addToSet: '$ipAddress' }
        }
      },
      {
        $match: {
          $or: [
            { count: { $gt: 50 } }, // Too many actions in 1 hour
            { 'ips.1': { $exists: true } } // Multiple IPs
          ]
        }
      }
    ]);

    // Mark as anomalies
    for (const activity of suspiciousActivity) {
      await this.auditLogModel.updateMany(
        { userId: activity._id, timestamp: { $gte: oneHourAgo } },
        { $set: { isAnomaly: true } }
      );
    }

    return suspiciousActivity;
  }

  async exportLogs(
    companyId?: string,
    startDate?: Date,
    endDate?: Date,
    format = 'json'
  ) {
    const query: any = {};
    
    if (companyId) query.companyId = companyId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    const logs = await this.auditLogModel
      .find(query)
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .sort({ timestamp: -1 })
      .exec();

    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['Timestamp', 'Action', 'User', 'Company', 'Document', 'IP Address', 'Risk Level', 'Status'];
      const rows = logs.map(log => [
        log.timestamp.toISOString(),
        log.action,
        log.userName || '',
        log.companyName || '',
        log.documentName || '',
        log.ipAddress || '',
        log.riskLevel,
        log.status
      ]);
      
      return { headers, rows, format: 'csv' };
    }

    return { logs, format: 'json' };
  }
}