import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Company } from '../schemas/company.schema';
import { DocumentModel } from '../schemas/document.schema';
import { AuditLog } from '../schemas/audit-log.schema';
import { PhishingCampaign } from '../schemas/phishing-campaign.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentModel>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    @InjectModel(PhishingCampaign.name) private phishingCampaignModel: Model<PhishingCampaign>,
  ) {}

  async seedAll() {
    console.log('🌱 Soxta ma\'lumotlar qo\'shilmoqda...');

    // Kompaniyalar yaratish
    const companies = await this.seedCompanies();
    console.log(`✅ ${companies.length} ta kompaniya yaratildi`);

    // Foydalanuvchilar yaratish
    const users = await this.seedUsers(companies);
    console.log(`✅ ${users.length} ta foydalanuvchi yaratildi`);

    // Hujjatlar yaratish
    const documents = await this.seedDocuments(companies, users);
    console.log(`✅ ${documents.length} ta hujjat yaratildi`);

    // Audit loglar yaratish
    const auditLogs = await this.seedAuditLogs(users, documents);
    console.log(`✅ ${auditLogs.length} ta audit log yaratildi`);

    // Phishing kampaniyalar yaratish
    const campaigns = await this.seedPhishingCampaigns(companies);
    console.log(`✅ ${campaigns.length} ta phishing kampaniya yaratildi`);

    console.log('🎉 Barcha soxta ma\'lumotlar muvaffaqiyatli qo\'shildi!');
  }

  private async seedCompanies() {
    const companiesData = [
      {
        name: 'O\'zbekiston Milliy Banki',
        industry: 'Banking',
        adminEmail: 'admin@uzbank.uz',
        plan: 'enterprise',
        status: 'active',
        settings: {
          maxUsers: 1000,
          maxStorage: 1000000000000, // 1TB
          features: ['encryption', 'audit', 'phishing', 'monitoring']
        }
      },
      {
        name: 'Toshkent Shahar Hokimligi',
        industry: 'Government',
        adminEmail: 'admin@toshkent.gov.uz',
        plan: 'enterprise',
        status: 'active',
        settings: {
          maxUsers: 500,
          maxStorage: 500000000000, // 500GB
          features: ['encryption', 'audit', 'monitoring']
        }
      },
      {
        name: 'UzAuto Motors',
        industry: 'Manufacturing',
        adminEmail: 'admin@uzauto.uz',
        plan: 'standard',
        status: 'active',
        settings: {
          maxUsers: 200,
          maxStorage: 200000000000, // 200GB
          features: ['encryption', 'audit']
        }
      },
      {
        name: 'Uzbekistan Airways',
        industry: 'Aviation',
        adminEmail: 'admin@uzairways.com',
        plan: 'standard',
        status: 'active',
        settings: {
          maxUsers: 300,
          maxStorage: 300000000000, // 300GB
          features: ['encryption', 'audit', 'monitoring']
        }
      },
      {
        name: 'Almaliq KMK',
        industry: 'Mining',
        adminEmail: 'admin@almalyk.uz',
        plan: 'basic',
        status: 'trial',
        settings: {
          maxUsers: 50,
          maxStorage: 50000000000, // 50GB
          features: ['encryption']
        }
      }
    ];

    const companies = [];
    for (const companyData of companiesData) {
      const existingCompany = await this.companyModel.findOne({ name: companyData.name });
      if (!existingCompany) {
        const company = new this.companyModel(companyData);
        await company.save();
        companies.push(company);
      }
    }
    return companies;
  }

  private async seedUsers(companies: any[]) {
    const usersData = [
      // O'zbekiston Milliy Banki
      {
        firstName: 'Aziz',
        lastName: 'Abdurahmonov',
        email: 'aziz.abdurahmonov@uzbank.uz',
        password: 'password123',
        role: 'company_admin',
        companyId: companies[0]?._id,
        permissions: ['read', 'write', 'delete', 'admin'],
        riskScore: 15
      },
      {
        firstName: 'Malika',
        lastName: 'Karimova',
        email: 'malika.karimova@uzbank.uz',
        password: 'password123',
        role: 'employee',
        companyId: companies[0]?._id,
        permissions: ['read', 'write'],
        riskScore: 25
      },
      {
        firstName: 'Bobur',
        lastName: 'Saidov',
        email: 'bobur.saidov@uzbank.uz',
        password: 'password123',
        role: 'viewer',
        companyId: companies[0]?._id,
        permissions: ['read'],
        riskScore: 45
      },
      // Toshkent Shahar Hokimligi
      {
        firstName: 'Gulnoza',
        lastName: 'Malikova',
        email: 'gulnoza.malikova@toshkent.gov.uz',
        password: 'password123',
        role: 'company_admin',
        companyId: companies[1]?._id,
        permissions: ['read', 'write', 'delete', 'admin'],
        riskScore: 10
      },
      {
        firstName: 'Jasur',
        lastName: 'Azizov',
        email: 'jasur.azizov@toshkent.gov.uz',
        password: 'password123',
        role: 'employee',
        companyId: companies[1]?._id,
        permissions: ['read', 'write'],
        riskScore: 30
      },
      // UzAuto Motors
      {
        firstName: 'Alisher',
        lastName: 'Karimov',
        email: 'alisher.karimov@uzauto.uz',
        password: 'password123',
        role: 'company_admin',
        companyId: companies[2]?._id,
        permissions: ['read', 'write', 'delete', 'admin'],
        riskScore: 20
      },
      {
        firstName: 'Shohruh',
        lastName: 'Botiriv',
        email: 'shohruh.botiriv@uzauto.uz',
        password: 'password123',
        role: 'viewer',
        companyId: companies[2]?._id,
        permissions: ['read'],
        riskScore: 55
      },
      // Uzbekistan Airways
      {
        firstName: 'Dilnoza',
        lastName: 'Rahimova',
        email: 'dilnoza.rahimova@uzairways.com',
        password: 'password123',
        role: 'employee',
        companyId: companies[3]?._id,
        permissions: ['read', 'write'],
        riskScore: 35
      },
      // Almaliq KMK
      {
        firstName: 'Otabek',
        lastName: 'Zokirov',
        email: 'otabek.zokirov@almalyk.uz',
        password: 'password123',
        role: 'company_admin',
        companyId: companies[4]?._id,
        permissions: ['read', 'write', 'delete', 'admin'],
        riskScore: 40
      }
    ];

    const users = [];
    for (const userData of usersData) {
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (!existingUser && userData.companyId) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new this.userModel({
          ...userData,
          password: hashedPassword
        });
        await user.save();
        users.push(user);
      }
    }
    return users;
  }

  private async seedDocuments(companies: any[], users: any[]) {
    const documentsData = [
      {
        name: 'Yillik_Moliyaviy_Hisobot_2024.pdf',
        originalName: 'Yillik Moliyaviy Hisobot 2024.pdf',
        filePath: '/uploads/documents/yillik_moliyaviy_hisobot_2024.pdf',
        fileSize: 2500000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        securityLevel: 'confidential',
        companyId: companies[0]?._id,
        uploadedBy: users[0]?._id,
        checksum: 'abc123def456',
        tags: ['moliya', 'yillik', 'hisobot'],
        categories: ['Hisobot'],
        metadata: {
          author: 'Moliya bo\'limi',
          title: 'Yillik Moliyaviy Hisobot 2024',
          pageCount: 45
        }
      },
      {
        name: 'Kadrlar_Siyosati_2024.docx',
        originalName: 'Kadrlar Siyosati 2024.docx',
        filePath: '/uploads/documents/kadrlar_siyosati_2024.docx',
        fileSize: 850000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileExtension: 'docx',
        securityLevel: 'internal',
        companyId: companies[1]?._id,
        uploadedBy: users[3]?._id,
        checksum: 'def456ghi789',
        tags: ['kadrlar', 'siyosat', 'hr'],
        categories: ['Siyosat'],
        metadata: {
          author: 'HR bo\'limi',
          title: 'Kadrlar Siyosati 2024',
          wordCount: 2500
        }
      },
      {
        name: 'Ishlab_Chiqarish_Rejasi_Q1.xlsx',
        originalName: 'Ishlab Chiqarish Rejasi Q1.xlsx',
        filePath: '/uploads/documents/ishlab_chiqarish_rejasi_q1.xlsx',
        fileSize: 1200000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx',
        securityLevel: 'confidential',
        companyId: companies[2]?._id,
        uploadedBy: users[5]?._id,
        checksum: 'ghi789jkl012',
        tags: ['ishlab-chiqarish', 'reja', 'q1'],
        categories: ['Reja'],
        metadata: {
          author: 'Ishlab chiqarish bo\'limi',
          title: 'Ishlab Chiqarish Rejasi Q1'
        }
      },
      {
        name: 'Parvoz_Jadvali_Mart_2024.pdf',
        originalName: 'Parvoz Jadvali Mart 2024.pdf',
        filePath: '/uploads/documents/parvoz_jadvali_mart_2024.pdf',
        fileSize: 950000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        securityLevel: 'public',
        companyId: companies[3]?._id,
        uploadedBy: users[7]?._id,
        checksum: 'jkl012mno345',
        tags: ['parvoz', 'jadval', 'mart'],
        categories: ['Jadval'],
        metadata: {
          author: 'Operatsiya bo\'limi',
          title: 'Parvoz Jadvali Mart 2024',
          pageCount: 12
        }
      },
      {
        name: 'Xavfsizlik_Protokoli_2024.pdf',
        originalName: 'Xavfsizlik Protokoli 2024.pdf',
        filePath: '/uploads/documents/xavfsizlik_protokoli_2024.pdf',
        fileSize: 1800000,
        mimeType: 'application/pdf',
        fileExtension: 'pdf',
        securityLevel: 'confidential',
        companyId: companies[4]?._id,
        uploadedBy: users[8]?._id,
        checksum: 'mno345pqr678',
        tags: ['xavfsizlik', 'protokol', 'konchilik'],
        categories: ['Protokol'],
        metadata: {
          author: 'Xavfsizlik bo\'limi',
          title: 'Xavfsizlik Protokoli 2024',
          pageCount: 28
        }
      },
      {
        name: 'Shartnoma_Loyihasi_2024.docx',
        originalName: 'Shartnoma Loyihasi 2024.docx',
        filePath: '/uploads/documents/shartnoma_loyihasi_2024.docx',
        fileSize: 650000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileExtension: 'docx',
        securityLevel: 'internal',
        companyId: companies[0]?._id,
        uploadedBy: users[1]?._id,
        checksum: 'pqr678stu901',
        tags: ['shartnoma', 'loyiha', 'yuridik'],
        categories: ['Shartnoma'],
        metadata: {
          author: 'Yuridik bo\'limi',
          title: 'Shartnoma Loyihasi 2024',
          wordCount: 1800
        }
      },
      {
        name: 'Byudjet_Tahlili_2024.xlsx',
        originalName: 'Byudjet Tahlili 2024.xlsx',
        filePath: '/uploads/documents/byudjet_tahlili_2024.xlsx',
        fileSize: 1450000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileExtension: 'xlsx',
        securityLevel: 'confidential',
        companyId: companies[1]?._id,
        uploadedBy: users[4]?._id,
        checksum: 'stu901vwx234',
        tags: ['byudjet', 'tahlil', 'moliya'],
        categories: ['Tahlil'],
        metadata: {
          author: 'Moliya bo\'limi',
          title: 'Byudjet Tahlili 2024'
        }
      }
    ];

    const documents = [];
    for (const docData of documentsData) {
      if (docData.companyId && docData.uploadedBy) {
        const document = new this.documentModel(docData);
        await document.save();
        documents.push(document);
      }
    }
    return documents;
  }

  private async seedAuditLogs(users: any[], documents: any[]) {
    const actions = ['document_view', 'document_download', 'document_upload', 'document_share', 'document_delete', 'document_edit'];
    const riskLevels = ['low', 'medium', 'high'];
    const locations = [
      'Toshkent, UZ',
      'Samarqand, UZ',
      'Buxoro, UZ',
      'Andijon, UZ',
      'Farg\'ona, UZ',
      'Namangan, UZ'
    ];

    const auditLogs = [];
    const now = new Date();

    // Oxirgi 30 kun uchun loglar yaratish
    for (let i = 0; i < 150; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomDocument = documents[Math.floor(Math.random() * documents.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomRiskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];

      if (randomUser && randomDocument) {
        const logDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        const auditLog = new this.auditLogModel({
          action: randomAction,
          userId: randomUser._id,
          userEmail: randomUser.email,
          userName: `${randomUser.firstName} ${randomUser.lastName}`,
          companyId: randomUser.companyId,
          documentId: randomDocument._id,
          documentName: randomDocument.originalName,
          riskLevel: randomRiskLevel,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: randomLocation,
          metadata: {
            fileSize: randomDocument.fileSize,
            securityLevel: randomDocument.securityLevel
          },
          timestamp: logDate
        });

        await auditLog.save();
        auditLogs.push(auditLog);
      }
    }

    return auditLogs;
  }

  private async seedPhishingCampaigns(companies: any[]) {
    // Get some users to use as creators
    const users = await this.userModel.find({ role: 'company_admin' }).limit(3);
    
    const campaignsData = [
      {
        title: 'Xavfsizlik Xabardorligi - Parol Yangilash',
        description: 'Xodimlarning parol xavfsizligi bo\'yicha bilimlarini tekshirish',
        channel: 'email',
        status: 'completed',
        companyId: companies[0]?._id,
        createdBy: users[0]?._id,
        messageContent: 'Sizning hisobingizda shubhali faollik aniqlandi. Xavfsizlik uchun parolingizni yangilang. Havola: https://fake-bank-login.com',
        subject: 'Muhim: Parolingizni zudlik bilan yangilang',
        senderName: 'IT Xavfsizlik',
        senderEmail: 'security@uzbank.uz',
        landingPageUrl: 'https://fake-bank-login.com',
        redFlags: ['Shoshilinch harakat talab qilish', 'Shubhali havola', 'Parol so\'rash'],
        sentCount: 250,
        deliveredCount: 245,
        openedCount: 180,
        clickedCount: 45,
        dataEnteredCount: 12,
        reportedCount: 8,
        scheduledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Moliyaviy Hisobot Tekshiruvi',
        description: 'Moliyaviy ma\'lumotlar bo\'yicha phishing hujumlarini aniqlash',
        channel: 'email',
        status: 'active',
        companyId: companies[1]?._id,
        createdBy: users[1]?._id,
        messageContent: 'Moliyaviy hisobotingizni ko\'rib chiqish va tasdiqlash uchun quyidagi havola orqali kiring. Muddati: 24 soat.',
        subject: 'Moliyaviy hisobotni tasdiqlang',
        senderName: 'Moliya Bo\'limi',
        senderEmail: 'finance@toshkent.gov.uz',
        landingPageUrl: 'https://fake-gov-portal.com',
        redFlags: ['Muddat cheklash', 'Tashqi havola', 'Shaxsiy ma\'lumot so\'rash'],
        sentCount: 150,
        deliveredCount: 148,
        openedCount: 95,
        clickedCount: 25,
        dataEnteredCount: 5,
        reportedCount: 15,
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'IT Texnik Yordam',
        description: 'Texnik yordam nomi ostida phishing hujumlarini aniqlash',
        channel: 'email',
        status: 'draft',
        companyId: companies[2]?._id,
        createdBy: users[2]?._id,
        messageContent: 'Tizim yangilanishi tufayli hisobingizni qayta tasdiqlashingiz kerak. Quyidagi havola orqali kiring.',
        subject: 'Tizim yangilanishi: Hisobingizni tasdiqlang',
        senderName: 'IT Support',
        senderEmail: 'it-support@uzauto.uz',
        landingPageUrl: 'https://fake-it-portal.com',
        redFlags: ['Tizim yangilanishi bahonasi', 'Login ma\'lumotlari so\'rash', 'Soxta IT manzil'],
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        dataEnteredCount: 0,
        reportedCount: 0
      }
    ];

    const campaigns = [];
    for (const campaignData of campaignsData) {
      if (campaignData.companyId && campaignData.createdBy) {
        const campaign = new this.phishingCampaignModel(campaignData);
        await campaign.save();
        campaigns.push(campaign);
      }
    }
    return campaigns;
  }

  async clearAll() {
    console.log('🗑️ Barcha ma\'lumotlar o\'chirilmoqda...');
    
    await this.auditLogModel.deleteMany({});
    await this.phishingCampaignModel.deleteMany({});
    await this.documentModel.deleteMany({});
    await this.userModel.deleteMany({ email: { $ne: 'admin@safedoc.uz' } });
    await this.companyModel.deleteMany({});
    
    console.log('✅ Barcha ma\'lumotlar o\'chirildi');
  }
}