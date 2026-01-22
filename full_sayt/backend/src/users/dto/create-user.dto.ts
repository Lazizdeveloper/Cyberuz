import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Abdurahmon' })
  @IsString({ message: 'Ism matn bo\'lishi kerak' })
  firstName: string;

  @ApiProperty({ example: 'Azizov' })
  @IsString({ message: 'Familiya matn bo\'lishi kerak' })
  lastName: string;

  @ApiProperty({ example: 'admin@safedoc.uz' })
  @IsEmail({}, { message: 'Noto\'g\'ri email format' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Parol matn bo\'lishi kerak' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ example: 'IT Bo\'limi' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Dasturchi' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  riskScore?: number;

  @ApiPropertyOptional({ example: ['read_documents', 'upload_documents'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}