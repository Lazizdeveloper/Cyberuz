import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingService } from './phishing.service';
import { PhishingController } from './phishing.controller';
import { PhishingCampaign, PhishingCampaignSchema, PhishingSimulation, PhishingSimulationSchema } from '../schemas/phishing-campaign.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingCampaign.name, schema: PhishingCampaignSchema },
      { name: PhishingSimulation.name, schema: PhishingSimulationSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [PhishingController],
  providers: [PhishingService],
  exports: [PhishingService],
})
export class PhishingModule {}