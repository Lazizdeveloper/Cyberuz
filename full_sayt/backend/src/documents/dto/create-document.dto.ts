import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SecurityLevel } from '../../schemas/document.schema';

export class CreateDocumentDto {
  @ApiPropertyOptional({ example: 'Muhim_Hujjat.pdf' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: SecurityLevel })
  @IsOptional()
  @IsEnum(SecurityLevel)
  securityLevel?: SecurityLevel;

  @ApiPropertyOptional({ example: 'Bu hujjat muhim ma\'lumotlarni o\'z ichiga oladi' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['moliya', 'hisobot', '2024'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: ['hisobotlar', 'moliyaviy'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ type: 'string', format: 'binary', description: 'Yuklanadigan fayl' })
  file: any;
}