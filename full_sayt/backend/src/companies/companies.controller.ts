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
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyStatus } from '../schemas/company.schema';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi kompaniya yaratish' })
  @ApiResponse({ status: 201, description: 'Kompaniya muvaffaqiyatli yaratildi' })
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    return this.companiesService.create(createCompanyDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kompaniyalarni olish' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: CompanyStatus })
  @ApiResponse({ status: 200, description: 'Kompaniyalar ro\'yxati' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: CompanyStatus,
  ) {
    return this.companiesService.findAll(page, limit, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Kompaniyalar statistikasi' })
  @ApiResponse({ status: 200, description: 'Umumiy statistika' })
  getStats() {
    return this.companiesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kompaniyani ID bo\'yicha olish' })
  @ApiResponse({ status: 200, description: 'Kompaniya ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Kompaniya topilmadi' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kompaniya ma\'lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Kompaniya muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Kompaniya topilmadi' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Request() req) {
    return this.companiesService.update(id, updateCompanyDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kompaniyani o\'chirish' })
  @ApiResponse({ status: 200, description: 'Kompaniya muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Kompaniya topilmadi' })
  remove(@Param('id') id: string, @Request() req) {
    return this.companiesService.remove(id, req.user.sub);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Kompaniya holatini o\'zgartirish' })
  @ApiResponse({ status: 200, description: 'Holat muvaffaqiyatli o\'zgartirildi' })
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: CompanyStatus,
    @Request() req
  ) {
    return this.companiesService.updateStatus(id, status, req.user.sub);
  }
}