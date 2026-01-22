import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentModel, DocumentSchema } from '../schemas/document.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';
import { CompaniesService } from '../companies/companies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentModel.name, schema: DocumentSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('UPLOAD_PATH') || './uploads',
        limits: {
          fileSize: parseInt(configService.get('MAX_FILE_SIZE')) || 50 * 1024 * 1024, // 50MB
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, CompaniesService],
  exports: [DocumentsService],
})
export class DocumentsModule {}