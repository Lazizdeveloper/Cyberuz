import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsObject, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyStatus, CompanyPlan } from '../../schemas/company.schema';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Artel Electronics' })
  @IsString({ message: 'Kompaniya nomi matn bo\'lishi kerak' })
  name: string;

  @ApiProperty({ example: 'Elektronika ishlab chiqarish' })
  @IsString({ message: 'Soha matn bo\'lishi kerak' })
  industry: string;

  @ApiProperty({ example: 'admin@artel.uz' })
  @IsEmail({}, { message: 'Noto\'g\'ri email format' })
  adminEmail: string;

  @ApiPropertyOptional({ enum: CompanyStatus })
  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @ApiPropertyOptional({ enum: CompanyPlan })
  @IsOptional()
  @IsEnum(CompanyPlan)
  plan?: CompanyPlan;

  @ApiPropertyOptional({ example: 'https://artel.uz/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://artel.uz' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Toshkent, O\'zbekiston' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+998712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 5368709120 })
  @IsOptional()
  @IsNumber()
  storageLimit?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  employeeLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  settings?: {
    encryptionEnabled?: boolean;
    dlpEnabled?: boolean;
    auditRetentionDays?: number;
    allowedFileTypes?: string[];
    maxFileSize?: number;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  billing?: {
    monthlyFee?: number;
    currency?: string;
    paymentMethod?: string;
  };
}