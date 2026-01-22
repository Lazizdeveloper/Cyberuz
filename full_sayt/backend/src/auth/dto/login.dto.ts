import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@safedoc.uz' })
  @IsEmail({}, { message: 'Noto\'g\'ri email format' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Parol matn bo\'lishi kerak' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  password: string;
}