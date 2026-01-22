import { 
  Controller, 
  Get, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditAction, RiskLevel, AuditStatus } from '../schemas/audit-log.schema';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Audit loglarini olish' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'action', required: false, enum: AuditAction })
  @ApiQuery({ name: 'riskLevel', required: false, enum: RiskLevel })
  @ApiQuery({ name: 'status', required: false, enum: AuditStatus })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Audit loglar ro\'yxati' })
  findAll(
    @Query('companyId') companyId?: string,
    @Query('action') action?: AuditAction,
    @Query('riskLevel') riskLevel?: RiskLevel,
    @Query('status') status?: AuditStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.auditService.findAll(
      companyId, action, riskLevel, status, start, end, page, limit
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Audit statistikasi' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Audit statistikalari' })
  getStats(
    @Query('companyId') companyId?: string,
    @Query('days') days?: number,
  ) {
    return this.auditService.getStats(companyId, days);
  }

  @Get('recent')
  @ApiOperation({ summary: 'So\'nggi faoliyat' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'So\'nggi faoliyat ro\'yxati' })
  getRecentActivity(
    @Query('companyId') companyId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getRecentActivity(companyId, limit);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Xavfsizlik ogohlantirishlari' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Xavfsizlik ogohlantirishlari' })
  getSecurityAlerts(
    @Query('companyId') companyId?: string,
    @Query('days') days?: number,
  ) {
    return this.auditService.getSecurityAlerts(companyId, days);
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Anomaliyalarni aniqlash' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiResponse({ status: 200, description: 'Aniqlangan anomaliyalar' })
  detectAnomalies(@Query('companyId') companyId?: string) {
    return this.auditService.detectAnomalies(companyId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Audit loglarini eksport qilish' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'format', required: false, enum: ['json', 'csv'] })
  @ApiResponse({ status: 200, description: 'Eksport qilingan ma\'lumotlar' })
  exportLogs(
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('format') format?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.auditService.exportLogs(companyId, start, end, format);
  }
}