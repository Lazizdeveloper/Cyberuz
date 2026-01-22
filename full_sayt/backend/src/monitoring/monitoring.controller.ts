import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Monitoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('live-activity')
  @ApiOperation({ summary: 'Jonli faoliyat' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Jonli faoliyat ma\'lumotlari' })
  getLiveActivity(@Query('limit') limit?: number) {
    return this.monitoringService.getLiveActivity(limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Tizim statistikasi' })
  @ApiResponse({ status: 200, description: 'Umumiy tizim statistikasi' })
  getSystemStats() {
    return this.monitoringService.getSystemStats();
  }

  @Get('activity-chart')
  @ApiOperation({ summary: 'Faoliyat grafigi' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiResponse({ status: 200, description: 'Faoliyat grafigi ma\'lumotlari' })
  getActivityChart(
    @Query('days') days?: number,
    @Query('companyId') companyId?: string,
  ) {
    return this.monitoringService.getActivityChart(days, companyId);
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Eng faol foydalanuvchilar' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Eng faol foydalanuvchilar ro\'yxati' })
  getTopActiveUsers(
    @Query('companyId') companyId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.monitoringService.getTopActiveUsers(companyId, limit);
  }

  @Get('security-alerts')
  @ApiOperation({ summary: 'Xavfsizlik ogohlantirishlari' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiResponse({ status: 200, description: 'Xavfsizlik ogohlantirishlari' })
  getSecurityAlerts(@Query('companyId') companyId?: string) {
    return this.monitoringService.getSecurityAlerts(companyId);
  }

  @Get('document-activity')
  @ApiOperation({ summary: 'Hujjatlar faoliyati' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'hours', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hujjatlar faoliyati ma\'lumotlari' })
  getDocumentActivity(
    @Query('companyId') companyId?: string,
    @Query('hours') hours?: number,
  ) {
    return this.monitoringService.getDocumentActivity(companyId, hours);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Tizim ishlash ko\'rsatkichlari' })
  @ApiResponse({ status: 200, description: 'Tizim ishlash ma\'lumotlari' })
  getPerformanceMetrics() {
    return this.monitoringService.getPerformanceMetrics();
  }
}