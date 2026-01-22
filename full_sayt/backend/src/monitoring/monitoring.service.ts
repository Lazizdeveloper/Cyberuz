import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { DocumentModel, DocumentDocument } from '../schemas/document.schema';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentDocument>,
  ) {}

  async getLiveActivity(limit = 50) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return this.auditLogModel
      .find({ timestamp: { $gte: fiveMinutesAgo } })
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getSystemStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsersToday,
      totalCompanies,
      activeCompanies,
      totalDocuments,
      documentsUploadedToday,
      totalStorage,
      actionsToday,
      actionsThisWeek,
      highRiskActions,
      anomalies
    ] = await Promise.all([
      this.userModel.countDocuments({ status: 'active' }),
      
      this.auditLogModel.distinct('userId', { 
        timestamp: { $gte: today },
        action: { $in: [AuditAction.LOGIN, AuditAction.DOCUMENT_VIEW, AuditAction.DOCUMENT_DOWNLOAD] }
      }).then(users => users.length),
      
      this.companyModel.countDocuments(),
      this.companyModel.countDocuments({ status: 'active' }),
      
      this.documentModel.countDocuments({ status: 'active' }),
      this.documentModel.countDocuments({ 
        createdAt: { $gte: today },
        status: 'active'
      }),
      
      this.companyModel.aggregate([
        { $group: { _id: null, total: { $sum: '$storageUsed' } } }
      ]).then(result => result[0]?.total || 0),
      
      this.auditLogModel.countDocuments({ timestamp: { $gte: today } }),
      this.auditLogModel.countDocuments({ timestamp: { $gte: thisWeek } }),
      
      this.auditLogModel.countDocuments({ 
        timestamp: { $gte: today },
        riskLevel: { $in: [RiskLevel.HIGH, RiskLevel.CRITICAL] }
      }),
      
      this.auditLogModel.countDocuments({ 
        timestamp: { $gte: today },
        isAnomaly: true 
      })
    ]);

    return {
      users: {
        total: totalUsers,
        activeToday: activeUsersToday,
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies,
      },
      documents: {
        total: totalDocuments,
        uploadedToday: documentsUploadedToday,
      },
      storage: {
        total: totalStorage,
        formatted: this.formatBytes(totalStorage),
      },
      activity: {
        actionsToday,
        actionsThisWeek,
        highRiskActions,
        anomalies,
      },
    };
  }

  async getActivityChart(days = 7, companyId?: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const matchQuery: any = { timestamp: { $gte: startDate } };
    if (companyId) matchQuery.companyId = companyId;

    const activityData = await this.auditLogModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            hour: { $hour: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1, '_id.hour': 1 } }
    ]);

    return activityData.map(item => ({
      time: `${item._id.date} ${item._id.hour}:00`,
      actions: item.count,
    }));
  }

  async getTopActiveUsers(companyId?: string, limit = 10) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const matchQuery: any = { timestamp: { $gte: today } };
    if (companyId) matchQuery.companyId = companyId;

    return this.auditLogModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$userId',
          actionCount: { $sum: 1 },
          userName: { $first: '$userName' },
          userEmail: { $first: '$userEmail' },
          companyName: { $first: '$companyName' },
          lastAction: { $max: '$timestamp' }
        }
      },
      { $sort: { actionCount: -1 } },
      { $limit: limit }
    ]);
  }

  async getSecurityAlerts(companyId?: string) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const matchQuery: any = {
      timestamp: { $gte: oneHourAgo },
      $or: [
        { riskLevel: { $in: [RiskLevel.HIGH, RiskLevel.CRITICAL] } },
        { isAnomaly: true }
      ]
    };
    
    if (companyId) matchQuery.companyId = companyId;

    return this.auditLogModel
      .find(matchQuery)
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .sort({ timestamp: -1 })
      .limit(20)
      .exec();
  }

  async getDocumentActivity(companyId?: string, hours = 24) {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const matchQuery: any = {
      timestamp: { $gte: startTime },
      action: { 
        $in: [
          AuditAction.DOCUMENT_UPLOAD,
          AuditAction.DOCUMENT_VIEW,
          AuditAction.DOCUMENT_DOWNLOAD,
          AuditAction.DOCUMENT_EDIT,
          AuditAction.DOCUMENT_DELETE
        ]
      }
    };
    
    if (companyId) matchQuery.companyId = companyId;

    const [activityByAction, activityByHour, topDocuments] = await Promise.all([
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $hour: '$timestamp' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      this.auditLogModel.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$documentId',
            count: { $sum: 1 },
            documentName: { $first: '$documentName' },
            lastActivity: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      activityByAction,
      activityByHour,
      topDocuments,
    };
  }

  async getPerformanceMetrics() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const [
      requestsPerMinute,
      averageResponseTime,
      errorRate,
      activeConnections
    ] = await Promise.all([
      this.auditLogModel.countDocuments({ 
        timestamp: { $gte: oneHourAgo } 
      }).then(count => Math.round(count / 60)),
      
      // Simulated response time
      Promise.resolve(Math.random() * 100 + 50),
      
      // Simulated error rate
      Promise.resolve(Math.random() * 5),
      
      // Simulated active connections
      Promise.resolve(Math.floor(Math.random() * 100) + 50)
    ]);

    return {
      requestsPerMinute,
      averageResponseTime: Math.round(averageResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      activeConnections,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}