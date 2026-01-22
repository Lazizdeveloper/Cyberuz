import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { DocumentModel, DocumentSchema } from '../schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}