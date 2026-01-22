import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Xavfsizlik sozlamalarini olish' })
  @ApiResponse({ status: 200, description: 'Xavfsizlik sozlamalari' })
  getSettings() {
    return this.securityService.getSecuritySettings();
  }

  @Post('settings')
  @ApiOperation({ summary: 'Xavfsizlik sozlamalarini yangilash' })
  @ApiResponse({ status: 200, description: 'Sozlamalar yangilandi' })
  updateSettings(@Body() settings: any) {
    return this.securityService.updateSecuritySettings(settings);
  }

  @Get('score')
  @ApiOperation({ summary: 'Xavfsizlik darajasini olish' })
  @ApiResponse({ status: 200, description: 'Xavfsizlik darajasi' })
  getSecurityScore() {
    return this.securityService.getSecurityScore();
  }

  @Post('validate-password')
  @ApiOperation({ summary: 'Parolni tekshirish' })
  @ApiResponse({ status: 200, description: 'Parol tekshiruv natijasi' })
  validatePassword(@Body('password') password: string) {
    return this.securityService.validatePassword(password);
  }

  @Get('report')
  @ApiOperation({ summary: 'Xavfsizlik hisoboti' })
  @ApiResponse({ status: 200, description: 'Xavfsizlik hisoboti' })
  getSecurityReport() {
    return this.securityService.generateSecurityReport();
  }
}