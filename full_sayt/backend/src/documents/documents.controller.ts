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
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SecurityLevel, DocumentStatus } from '../schemas/document.schema';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Hujjat yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Hujjat muvaffaqiyatli yuklandi' })
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req
  ) {
    return this.documentsService.uploadDocument(file, createDocumentDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha hujjatlarni olish' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'securityLevel', required: false, enum: SecurityLevel })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Hujjatlar ro\'yxati' })
  findAll(
    @Query('companyId') companyId?: string,
    @Query('securityLevel') securityLevel?: SecurityLevel,
    @Query('status') status?: DocumentStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.documentsService.findAll(companyId, securityLevel, status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Hujjatni ID bo\'yicha olish' })
  @ApiResponse({ status: 200, description: 'Hujjat ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Hujjat topilmadi' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.documentsService.findOne(id, req.user.sub);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Hujjatni yuklash' })
  @ApiResponse({ status: 200, description: 'Fayl yuklandi' })
  @ApiResponse({ status: 404, description: 'Hujjat topilmadi' })
  async downloadDocument(@Param('id') id: string, @Request() req, @Res() res: Response) {
    const result = await this.documentsService.downloadDocument(id, req.user.sub);
    
    const file = fs.createReadStream(result.filePath);
    
    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.originalName}"`,
    });
    
    return new StreamableFile(file);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Hujjat ma\'lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Hujjat muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Hujjat topilmadi' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Request() req) {
    return this.documentsService.update(id, updateDocumentDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hujjatni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Hujjat muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Hujjat topilmadi' })
  remove(@Param('id') id: string, @Request() req) {
    return this.documentsService.remove(id, req.user.sub);
  }
}