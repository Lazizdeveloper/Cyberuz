import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PhishingCampaign, PhishingCampaignDocument, CampaignStatus, CampaignChannel } from '../schemas/phishing-campaign.schema';
import { PhishingSimulation, SimulationStatus } from '../schemas/phishing-campaign.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class PhishingService {
  constructor(
    @InjectModel(PhishingCampaign.name) private campaignModel: Model<PhishingCampaignDocument>,
    @InjectModel(PhishingSimulation.name) private simulationModel: Model<any>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async createCampaign(createCampaignDto: CreateCampaignDto, createdBy: string) {
    // Validate company exists
    const company = await this.companyModel.findById(createCampaignDto.companyId);
    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }

    // Validate target users exist and belong to company
    if (createCampaignDto.targetUsers?.length > 0) {
      const users = await this.userModel.find({
        _id: { $in: createCampaignDto.targetUsers },
        companyId: createCampaignDto.companyId,
      });
      
      if (users.length !== createCampaignDto.targetUsers.length) {
        throw new BadRequestException('Ba\'zi foydalanuvchilar topilmadi yoki kompaniyaga tegishli emas');
      }
    }

    const campaign = new this.campaignModel({
      ...createCampaignDto,
      createdBy,
      status: CampaignStatus.DRAFT,
    });

    const savedCampaign = await campaign.save();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.PHISHING_TEST,
      userId: new Types.ObjectId(createdBy),
      companyId: new Types.ObjectId(createCampaignDto.companyId),
      description: `Phishing kampaniyasi yaratildi: ${createCampaignDto.title}`,
      metadata: { campaignId: savedCampaign._id, channel: createCampaignDto.channel },
    });

    return savedCampaign;
  }

  async findAllCampaigns(companyId?: string, status?: CampaignStatus, page = 1, limit = 10) {
    const query: any = {};
    if (companyId) query.companyId = companyId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      this.campaignModel
        .find(query)
        .populate('companyId', 'name')
        .populate('createdBy', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.campaignModel.countDocuments(query),
    ]);

    return {
      campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneCampaign(id: string) {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('companyId', 'name')
      .populate('createdBy', 'firstName lastName email')
      .populate('targetUsers', 'firstName lastName email department')
      .exec();

    if (!campaign) {
      throw new NotFoundException('Kampaniya topilmadi');
    }

    return campaign;
  }

  async updateCampaign(id: string, updateCampaignDto: UpdateCampaignDto, updatedBy: string) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) {
      throw new NotFoundException('Kampaniya topilmadi');
    }

    if (campaign.status === CampaignStatus.ACTIVE || campaign.status === CampaignStatus.COMPLETED) {
      throw new BadRequestException('Faol yoki tugallangan kampaniyani tahrirlash mumkin emas');
    }

    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .populate('companyId', 'name')
      .populate('createdBy', 'firstName lastName email')
      .exec();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.PHISHING_TEST,
      userId: new Types.ObjectId(updatedBy),
      companyId: campaign.companyId,
      description: `Phishing kampaniyasi yangilandi: ${campaign.title}`,
      metadata: { campaignId: id, changes: updateCampaignDto },
    });

    return updatedCampaign;
  }

  async deleteCampaign(id: string, deletedBy: string) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) {
      throw new NotFoundException('Kampaniya topilmadi');
    }

    if (campaign.status === CampaignStatus.ACTIVE) {
      throw new BadRequestException('Faol kampaniyani o\'chirish mumkin emas');
    }

    await this.campaignModel.findByIdAndDelete(id);

    // Delete related simulations
    await this.simulationModel.deleteMany({ campaignId: id });

    // Log audit
    await this.createAuditLog({
      action: AuditAction.PHISHING_TEST,
      userId: new Types.ObjectId(deletedBy),
      companyId: campaign.companyId,
      description: `Phishing kampaniyasi o'chirildi: ${campaign.title}`,
      metadata: { campaignId: id },
    });

    return { message: 'Kampaniya muvaffaqiyatli o\'chirildi' };
  }

  async startCampaign(id: string, startedBy: string) {
    const campaign = await this.campaignModel.findById(id).populate('targetUsers');
    if (!campaign) {
      throw new NotFoundException('Kampaniya topilmadi');
    }

    if (campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Faqat loyiha holatidagi kampaniyalarni boshlash mumkin');
    }

    if (!campaign.targetUsers || campaign.targetUsers.length === 0) {
      throw new BadRequestException('Maqsadli foydalanuvchilar tanlanmagan');
    }

    // Update campaign status
    await this.campaignModel.findByIdAndUpdate(id, {
      status: CampaignStatus.ACTIVE,
      startedAt: new Date(),
    });

    // Create simulations for each target user
    const simulations = [];
    for (const user of campaign.targetUsers as any[]) {
      const simulation = new this.simulationModel({
        campaignId: id,
        userId: user._id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        messageContent: campaign.messageContent,
        status: SimulationStatus.SENT,
        sentAt: new Date(),
      });
      
      simulations.push(simulation);
    }

    await this.simulationModel.insertMany(simulations);

    // Update campaign counters
    await this.campaignModel.findByIdAndUpdate(id, {
      sentCount: simulations.length,
    });

    // Log audit
    await this.createAuditLog({
      action: AuditAction.PHISHING_TEST,
      userId: new Types.ObjectId(startedBy),
      companyId: campaign.companyId,
      description: `Phishing kampaniyasi boshlandi: ${campaign.title}`,
      metadata: { 
        campaignId: id, 
        targetCount: simulations.length,
        channel: campaign.channel 
      },
      riskLevel: RiskLevel.MEDIUM,
    });

    return { 
      message: 'Kampaniya muvaffaqiyatli boshlandi',
      sentCount: simulations.length 
    };
  }

  async getSimulations(campaignId: string, status?: SimulationStatus) {
    const query: any = { campaignId };
    if (status) query.status = status;

    return this.simulationModel
      .find(query)
      .populate('userId', 'firstName lastName email department')
      .sort({ sentAt: -1 })
      .exec();
  }

  async recordSimulationAction(simulationId: string, action: SimulationStatus, metadata?: any) {
    const simulation = await this.simulationModel.findById(simulationId);
    if (!simulation) {
      throw new NotFoundException('Simulyatsiya topilmadi');
    }

    const updateData: any = { status: action };
    
    switch (action) {
      case SimulationStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case SimulationStatus.OPENED:
        updateData.openedAt = new Date();
        break;
      case SimulationStatus.CLICKED:
        updateData.clickedAt = new Date();
        break;
      case SimulationStatus.DATA_ENTERED:
        updateData.dataEnteredAt = new Date();
        updateData.enteredData = metadata?.enteredData;
        break;
      case SimulationStatus.REPORTED:
        updateData.reportedAt = new Date();
        break;
    }

    if (metadata) {
      updateData.metadata = { ...simulation.metadata, ...metadata };
      updateData.ipAddress = metadata.ipAddress;
      updateData.userAgent = metadata.userAgent;
      updateData.location = metadata.location;
    }

    await this.simulationModel.findByIdAndUpdate(simulationId, updateData);

    // Update campaign counters
    const campaign = await this.campaignModel.findById(simulation.campaignId);
    if (campaign) {
      const updateCampaign: any = {};
      
      switch (action) {
        case SimulationStatus.DELIVERED:
          updateCampaign.$inc = { deliveredCount: 1 };
          break;
        case SimulationStatus.OPENED:
          updateCampaign.$inc = { openedCount: 1 };
          break;
        case SimulationStatus.CLICKED:
          updateCampaign.$inc = { clickedCount: 1 };
          break;
        case SimulationStatus.DATA_ENTERED:
          updateCampaign.$inc = { dataEnteredCount: 1 };
          break;
        case SimulationStatus.REPORTED:
          updateCampaign.$inc = { reportedCount: 1 };
          break;
      }

      if (updateCampaign.$inc) {
        await this.campaignModel.findByIdAndUpdate(simulation.campaignId, updateCampaign);
      }
    }

    // Update user risk score if they fell for phishing
    if (action === SimulationStatus.CLICKED || action === SimulationStatus.DATA_ENTERED) {
      await this.userModel.findByIdAndUpdate(simulation.userId, {
        $inc: { riskScore: action === SimulationStatus.DATA_ENTERED ? 20 : 10 }
      });
    } else if (action === SimulationStatus.REPORTED) {
      // Decrease risk score for reporting
      await this.userModel.findByIdAndUpdate(simulation.userId, {
        $inc: { riskScore: -5 }
      });
    }

    // Log audit
    await this.createAuditLog({
      action: AuditAction.PHISHING_TEST,
      userId: simulation.userId,
      companyId: campaign?.companyId,
      description: `Phishing test natijasi: ${action}`,
      metadata: { 
        simulationId, 
        campaignId: simulation.campaignId,
        action,
        ...metadata 
      },
      riskLevel: action === SimulationStatus.DATA_ENTERED ? RiskLevel.HIGH : 
                 action === SimulationStatus.CLICKED ? RiskLevel.MEDIUM : RiskLevel.LOW,
    });

    return { message: 'Harakat qayd etildi' };
  }

  async getCampaignStats(id: string) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) {
      throw new NotFoundException('Kampaniya topilmadi');
    }

    const simulations = await this.simulationModel.find({ campaignId: id });
    
    const stats = {
      total: simulations.length,
      sent: campaign.sentCount,
      delivered: campaign.deliveredCount,
      opened: campaign.openedCount,
      clicked: campaign.clickedCount,
      dataEntered: campaign.dataEnteredCount,
      reported: campaign.reportedCount,
      clickRate: campaign.sentCount > 0 ? (campaign.clickedCount / campaign.sentCount * 100).toFixed(2) : 0,
      reportRate: campaign.sentCount > 0 ? (campaign.reportedCount / campaign.sentCount * 100).toFixed(2) : 0,
    };

    return stats;
  }

  async getCompanyPhishingStats(companyId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const campaigns = await this.campaignModel.find({
      companyId,
      createdAt: { $gte: startDate }
    });

    const totalStats = campaigns.reduce((acc, campaign) => {
      acc.totalCampaigns += 1;
      acc.totalSent += campaign.sentCount;
      acc.totalClicked += campaign.clickedCount;
      acc.totalReported += campaign.reportedCount;
      return acc;
    }, {
      totalCampaigns: 0,
      totalSent: 0,
      totalClicked: 0,
      totalReported: 0,
    });

    return {
      ...totalStats,
      clickRate: totalStats.totalSent > 0 ? 
        (totalStats.totalClicked / totalStats.totalSent * 100).toFixed(2) : 0,
      reportRate: totalStats.totalSent > 0 ? 
        (totalStats.totalReported / totalStats.totalSent * 100).toFixed(2) : 0,
    };
  }

  private async createAuditLog(data: Partial<AuditLog>) {
    const auditLog = new this.auditLogModel({
      ...data,
      timestamp: new Date(),
      riskLevel: data.riskLevel || RiskLevel.LOW,
    });
    
    return auditLog.save();
  }
}