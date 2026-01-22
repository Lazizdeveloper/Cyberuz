import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PhishingService } from './phishing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus, SimulationStatus } from '../schemas/phishing-campaign.schema';

@ApiTags('Phishing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post('campaigns')
  @ApiOperation({ summary: 'Yangi phishing kampaniyasi yaratish' })
  @ApiResponse({ status: 201, description: 'Kampaniya muvaffaqiyatli yaratildi' })
  createCampaign(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
    return this.phishingService.createCampaign(createCampaignDto, req.user.sub);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Barcha kampaniyalarni olish' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: CampaignStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Kampaniyalar ro\'yxati' })
  findAllCampaigns(
    @Query('companyId') companyId?: string,
    @Query('status') status?: CampaignStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.phishingService.findAllCampaigns(companyId, status, page, limit);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Kampaniyani ID bo\'yicha olish' })
  @ApiResponse({ status: 200, description: 'Kampaniya ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Kampaniya topilmadi' })
  findOneCampaign(@Param('id') id: string) {
    return this.phishingService.findOneCampaign(id);
  }

  @Patch('campaigns/:id')
  @ApiOperation({ summary: 'Kampaniya ma\'lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Kampaniya muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Kampaniya topilmadi' })
  updateCampaign(
    @Param('id') id: string, 
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Request() req
  ) {
    return this.phishingService.updateCampaign(id, updateCampaignDto, req.user.sub);
  }

  @Delete('campaigns/:id')
  @ApiOperation({ summary: 'Kampaniyani o\'chirish' })
  @ApiResponse({ status: 200, description: 'Kampaniya muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Kampaniya topilmadi' })
  deleteCampaign(@Param('id') id: string, @Request() req) {
    return this.phishingService.deleteCampaign(id, req.user.sub);
  }

  @Post('campaigns/:id/start')
  @ApiOperation({ summary: 'Kampaniyani boshlash' })
  @ApiResponse({ status: 200, description: 'Kampaniya muvaffaqiyatli boshlandi' })
  @ApiResponse({ status: 404, description: 'Kampaniya topilmadi' })
  startCampaign(@Param('id') id: string, @Request() req) {
    return this.phishingService.startCampaign(id, req.user.sub);
  }

  @Get('campaigns/:id/simulations')
  @ApiOperation({ summary: 'Kampaniya simulyatsiyalarini olish' })
  @ApiQuery({ name: 'status', required: false, enum: SimulationStatus })
  @ApiResponse({ status: 200, description: 'Simulyatsiyalar ro\'yxati' })
  getSimulations(
    @Param('id') campaignId: string,
    @Query('status') status?: SimulationStatus,
  ) {
    return this.phishingService.getSimulations(campaignId, status);
  }

  @Post('simulations/:id/action')
  @ApiOperation({ summary: 'Simulyatsiya harakatini qayd etish' })
  @ApiResponse({ status: 200, description: 'Harakat muvaffaqiyatli qayd etildi' })
  recordAction(
    @Param('id') simulationId: string,
    @Body() body: { action: SimulationStatus; metadata?: any },
  ) {
    return this.phishingService.recordSimulationAction(
      simulationId, 
      body.action, 
      body.metadata
    );
  }

  @Get('campaigns/:id/stats')
  @ApiOperation({ summary: 'Kampaniya statistikasi' })
  @ApiResponse({ status: 200, description: 'Kampaniya statistikalari' })
  getCampaignStats(@Param('id') id: string) {
    return this.phishingService.getCampaignStats(id);
  }

  @Get('companies/:companyId/stats')
  @ApiOperation({ summary: 'Kompaniya phishing statistikasi' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Kompaniya phishing statistikalari' })
  getCompanyStats(
    @Param('companyId') companyId: string,
    @Query('days') days?: number,
  ) {
    return this.phishingService.getCompanyPhishingStats(companyId, days);
  }
}