import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument, CompanyStatus } from '../schemas/company.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, createdBy?: string) {
    // Check if company exists
    const existingCompany = await this.companyModel.findOne({ 
      adminEmail: createCompanyDto.adminEmail.toLowerCase() 
    });
    
    if (existingCompany) {
      throw new BadRequestException('Bu email bilan kompaniya allaqachon ro\'yxatdan o\'tgan');
    }

    // Create company
    const company = new this.companyModel({
      ...createCompanyDto,
      adminEmail: createCompanyDto.adminEmail.toLowerCase(),
      settings: {
        encryptionEnabled: true,
        dlpEnabled: true,
        auditRetentionDays: 365,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        maxFileSize: 50 * 1024 * 1024, // 50MB
        ...createCompanyDto.settings,
      },
    });

    const savedCompany = await company.save();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.COMPANY_CREATE,
      companyId: savedCompany._id,
      companyName: savedCompany.name,
      description: `Yangi kompaniya yaratildi: ${savedCompany.name}`,
      metadata: { createdBy, adminEmail: savedCompany.adminEmail },
    });

    return savedCompany;
  }

  async findAll(page = 1, limit = 10, status?: CompanyStatus) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      this.companyModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.companyModel.countDocuments(query),
    ]);

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, updatedBy?: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }

    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.COMPANY_UPDATE,
      companyId: updatedCompany._id,
      companyName: updatedCompany.name,
      description: `Kompaniya ma'lumotlari yangilandi: ${updatedCompany.name}`,
      metadata: { updatedBy, changes: updateCompanyDto },
    });

    return updatedCompany;
  }

  async remove(id: string, deletedBy?: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }

    // Check if company has users
    const userCount = await this.userModel.countDocuments({ companyId: id });
    if (userCount > 0) {
      throw new BadRequestException('Kompaniyada foydalanuvchilar mavjud. Avval ularni o\'chiring.');
    }

    await this.companyModel.findByIdAndDelete(id);

    // Log audit
    await this.createAuditLog({
      action: AuditAction.COMPANY_UPDATE,
      companyId: company._id,
      companyName: company.name,
      description: `Kompaniya o'chirildi: ${company.name}`,
      metadata: { deletedBy },
    });

    return { message: 'Kompaniya muvaffaqiyatli o\'chirildi' };
  }

  async updateStatus(id: string, status: CompanyStatus, updatedBy?: string) {
    const company = await this.companyModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!company) {
      throw new NotFoundException('Kompaniya topilmadi');
    }

    // Log audit
    await this.createAuditLog({
      action: AuditAction.COMPANY_UPDATE,
      companyId: company._id,
      companyName: company.name,
      description: `Kompaniya holati o'zgartirildi: ${status}`,
      metadata: { updatedBy, newStatus: status },
    });

    return company;
  }

  async getStats() {
    const [
      totalCompanies,
      activeCompanies,
      trialCompanies,
      suspendedCompanies,
      totalUsers,
      totalDocuments,
      totalStorage
    ] = await Promise.all([
      this.companyModel.countDocuments(),
      this.companyModel.countDocuments({ status: CompanyStatus.ACTIVE }),
      this.companyModel.countDocuments({ status: CompanyStatus.TRIAL }),
      this.companyModel.countDocuments({ status: CompanyStatus.SUSPENDED }),
      this.userModel.countDocuments(),
      this.companyModel.aggregate([
        { $group: { _id: null, total: { $sum: '$documentCount' } } }
      ]),
      this.companyModel.aggregate([
        { $group: { _id: null, total: { $sum: '$storageUsed' } } }
      ]),
    ]);

    return {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        trial: trialCompanies,
        suspended: suspendedCompanies,
      },
      users: totalUsers,
      documents: totalDocuments[0]?.total || 0,
      storage: totalStorage[0]?.total || 0,
    };
  }

  async updateStorageUsage(id: string, storageChange: number) {
    return this.companyModel.findByIdAndUpdate(
      id,
      { $inc: { storageUsed: storageChange } },
      { new: true }
    );
  }

  async updateDocumentCount(id: string, documentChange: number) {
    return this.companyModel.findByIdAndUpdate(
      id,
      { $inc: { documentCount: documentChange } },
      { new: true }
    );
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