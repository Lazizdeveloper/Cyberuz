import { IsString, IsEnum, IsOptional, IsArray, IsMongoId, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignChannel } from '../../schemas/phishing-campaign.schema';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Xavfsizlik Testi - Yanvar 2024' })
  @IsString({ message: 'Sarlavha matn bo\'lishi kerak' })
  title: string;

  @ApiPropertyOptional({ example: 'Xodimlarning phishing hujumlariga qarshi bilimini tekshirish' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: CampaignChannel })
  @IsEnum(CampaignChannel)
  channel: CampaignChannel;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId({ message: 'Noto\'g\'ri kompaniya ID' })
  companyId: string;

  @ApiProperty({ example: 'Hurmatli xodim, sizga yangi bonus to\'lovi haqida xabar...' })
  @IsString({ message: 'Xabar mazmuni matn bo\'lishi kerak' })
  messageContent: string;

  @ApiPropertyOptional({ example: 'Bonus to\'lovi haqida muhim xabar' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ example: 'HR Bo\'limi' })
  @IsOptional()
  @IsString()
  senderName?: string;

  @ApiPropertyOptional({ example: 'hr@company.uz' })
  @IsOptional()
  @IsString()
  senderEmail?: string;

  @ApiPropertyOptional({ example: 'https://fake-bonus-site.com' })
  @IsOptional()
  @IsString()
  landingPageUrl?: string;

  @ApiPropertyOptional({ example: ['Shoshilinch xabar', 'Noma\'lum yuboruvchi', 'Shubhali havola'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  redFlags?: string[];

  @ApiPropertyOptional({ example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  targetUsers?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  settings?: {
    autoComplete?: boolean;
    sendReminders?: boolean;
    trackClicks?: boolean;
    collectData?: boolean;
  };
}