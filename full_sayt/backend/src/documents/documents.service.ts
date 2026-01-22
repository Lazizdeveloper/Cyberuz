import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { DocumentModel, DocumentDocument, SecurityLevel, DocumentStatus } from '../schemas/document.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { CompaniesService } from '../companies/companies.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    private companiesService: CompaniesService,
    private configService: ConfigService,
  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    createDocumentDto: CreateDocumentDto,
    uploadedBy: string,
  ) {
    // Validate file
    if (!file) {
      throw new BadRequestException('Fayl tanlanmagan');
    }

    // Get user and company info
    const user = await this.userModel.findById(uploadedBy).populate('companyId');
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const company = user.companyId as any;
    if (!company) {
      throw new BadRequestException('Foydalanuvchi kompaniyaga tegishli emas');
    }

    // Check storage limit
    if (company.storageUsed + file.size > company.storageLimit) {
      throw new BadRequestException('Saqlash limiti tugagan');
    }

    // Check file type
    const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
    if (!company.settings?.allowedFileTypes?.includes(fileExtension)) {
      throw new BadRequestException('Fayl turi ruxsat etilmagan');
    }

    // Generate file checksum
    const fileBuffer = fs.readFileSync(file.path);
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check for duplicates
    const existingDoc = await this.documentModel.findOne({
      companyId: company._id,
      checksum,
      status: { $ne: DocumentStatus.DELETED },
    });

    if (existingDoc) {
      // Remove uploaded file
      fs.unlinkSync(file.path);
      throw new BadRequestException('Bu fayl allaqachon mavjud');
    }

    // Encrypt file if required
    let isEncrypted = false;
    let encryptionKey = '';
    
    if (createDocumentDto.securityLevel === SecurityLevel.CONFIDENTIAL || 
        createDocumentDto.securityLevel === SecurityLevel.TOP_SECRET) {
      isEncrypted = true;
      encryptionKey = this.generateEncryptionKey();
      this.encryptFile(file.path, encryptionKey);
    }

    // Create document record
    const document = new this.documentModel({
      name: createDocumentDto.name || file.originalname,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileExtension,
      securityLevel: createDocumentDto.securityLevel || SecurityLevel.INTERNAL,
      companyId: company._id,
      uploadedBy: user._id,
      description: createDocumentDto.description,
      tags: createDocumentDto.tags || [],
      categories: createDocumentDto.categories || [],
      isEncrypted,
      encryptionKey: isEncrypted ? encryptionKey : undefined,
      checksum,
    });

    const savedDocument = await document.save();

    // Update company storage and document count
    await this.companiesService.updateStorageUsage(company._id, file.size);
    await this.companiesService.updateDocumentCount(company._id, 1);

    // Log audit
    await this.createAuditLog({
      action: AuditAction.DOCUMENT_UPLOAD,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: company._id,
      companyName: company.name,
      documentId: savedDocument._id,
      documentName: savedDocument.name,
      description: `Hujjat yuklandi: ${savedDocument.name}`,
      metadata: { 
        fileSize: file.size, 
        securityLevel: createDocumentDto.securityLevel,
        isEncrypted 
      },
    });

    return savedDocument;
  }

  async findAll(
    companyId?: string,
    securityLevel?: SecurityLevel,
    status?: DocumentStatus,
    page = 1,
    limit = 10,
  ) {
    const query: any = {};
    
    if (companyId) query.companyId = companyId;
    if (securityLevel) query.securityLevel = securityLevel;
    if (status) query.status = status;
    else query.status = { $ne: DocumentStatus.DELETED };

    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.documentModel
        .find(query)
        .populate('companyId', 'name')
        .populate('uploadedBy', 'firstName lastName email')
        .populate('lastModifiedBy', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.documentModel.countDocuments(query),
    ]);

    return {
      documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const document = await this.documentModel
      .findById(id)
      .populate('companyId')
      .populate('uploadedBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .exec();

    if (!document) {
      throw new NotFoundException('Hujjat topilmadi');
    }

    // Check permissions
    const user = await this.userModel.findById(userId);
    if (!this.canAccessDocument(document, user)) {
      throw new ForbiddenException('Hujjatga kirish huquqi yo\'q');
    }

    // Update view count and last accessed
    await this.documentModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
      lastAccessed: new Date(),
      lastAccessedBy: userId,
    });

    // Log audit
    await this.createAuditLog({
      action: AuditAction.DOCUMENT_VIEW,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: document.companyId,
      documentId: document._id,
      documentName: document.name,
      description: `Hujjat ko'rildi: ${document.name}`,
    });

    return document;
  }

  async downloadDocument(id: string, userId: string) {
    const document = await this.documentModel
      .findById(id)
      .populate('companyId')
      .exec();

    if (!document) {
      throw new NotFoundException('Hujjat topilmadi');
    }

    const user = await this.userModel.findById(userId);
    if (!this.canAccessDocument(document, user)) {
      throw new ForbiddenException('Hujjatga kirish huquqi yo\'q');
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('Fayl topilmadi');
    }

    // Decrypt file if encrypted
    let filePath = document.filePath;
    if (document.isEncrypted) {
      filePath = this.decryptFile(document.filePath, document.encryptionKey);
    }

    // Update download count
    await this.documentModel.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 },
    });

    // Log audit
    await this.createAuditLog({
      action: AuditAction.DOCUMENT_DOWNLOAD,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: document.companyId,
      documentId: document._id,
      documentName: document.name,
      description: `Hujjat yuklandi: ${document.name}`,
      riskLevel: document.securityLevel === SecurityLevel.TOP_SECRET ? RiskLevel.HIGH : RiskLevel.LOW,
    });

    return {
      filePath,
      originalName: document.originalName,
      mimeType: document.mimeType,
    };
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, updatedBy: string) {
    const document = await this.documentModel.findById(id);
    if (!document) {
      throw new NotFoundException('Hujjat topilmadi');
    }

    const user = await this.userModel.findById(updatedBy);
    if (!this.canEditDocument(document, user)) {
      throw new ForbiddenException('Hujjatni tahrirlash huquqi yo\'q');
    }

    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(
        id,
        { ...updateDocumentDto, lastModifiedBy: updatedBy },
        { new: true }
      )
      .populate('companyId')
      .populate('uploadedBy', 'firstName lastName email')
      .exec();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.DOCUMENT_EDIT,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: document.companyId,
      documentId: document._id,
      documentName: document.name,
      description: `Hujjat tahrirlandi: ${document.name}`,
      metadata: { changes: updateDocumentDto },
    });

    return updatedDocument;
  }

  async remove(id: string, deletedBy: string) {
    const document = await this.documentModel.findById(id);
    if (!document) {
      throw new NotFoundException('Hujjat topilmadi');
    }

    const user = await this.userModel.findById(deletedBy);
    if (!this.canDeleteDocument(document, user)) {
      throw new ForbiddenException('Hujjatni o\'chirish huquqi yo\'q');
    }

    // Soft delete
    await this.documentModel.findByIdAndUpdate(id, {
      status: DocumentStatus.DELETED,
      lastModifiedBy: deletedBy,
    });

    // Update company storage and document count
    await this.companiesService.updateStorageUsage(document.companyId.toString(), -document.fileSize);
    await this.companiesService.updateDocumentCount(document.companyId.toString(), -1);

    // Log audit
    await this.createAuditLog({
      action: AuditAction.DOCUMENT_DELETE,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: document.companyId,
      documentId: document._id,
      documentName: document.name,
      description: `Hujjat o'chirildi: ${document.name}`,
      riskLevel: RiskLevel.MEDIUM,
    });

    return { message: 'Hujjat muvaffaqiyatli o\'chirildi' };
  }

  private canAccessDocument(document: DocumentDocument, user: UserDocument): boolean {
    // Super admin can access all
    if (user.role === 'super_admin') return true;
    
    // Same company users can access
    if (document.companyId.toString() === user.companyId?.toString()) return true;
    
    // Check if shared with user
    if (document.sharedWith?.includes(user._id)) return true;
    
    return false;
  }

  private canEditDocument(document: DocumentDocument, user: UserDocument): boolean {
    // Super admin can edit all
    if (user.role === 'super_admin') return true;
    
    // Document owner can edit
    if (document.uploadedBy.toString() === user._id.toString()) return true;
    
    // Company admin can edit company documents
    if (user.role === 'company_admin' && 
        document.companyId.toString() === user.companyId?.toString()) return true;
    
    return false;
  }

  private canDeleteDocument(document: DocumentDocument, user: UserDocument): boolean {
    return this.canEditDocument(document, user);
  }

  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private encryptFile(filePath: string, key: string): void {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(filePath + '.enc');
    
    input.pipe(cipher).pipe(output);
    
    // Replace original file with encrypted version
    fs.unlinkSync(filePath);
    fs.renameSync(filePath + '.enc', filePath);
  }

  private decryptFile(filePath: string, key: string): string {
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(algorithm, key);
    
    const tempPath = filePath + '.temp';
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(tempPath);
    
    input.pipe(decipher).pipe(output);
    
    return tempPath;
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