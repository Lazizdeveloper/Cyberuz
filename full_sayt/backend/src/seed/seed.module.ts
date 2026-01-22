import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { DocumentModel, DocumentSchema } from '../schemas/document.schema';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';
import { PhishingCampaign, PhishingCampaignSchema } from '../schemas/phishing-campaign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: DocumentModel.name, schema: DocumentSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: PhishingCampaign.name, schema: PhishingCampaignSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}