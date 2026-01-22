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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli yaratildi' })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Foydalanuvchilar ro\'yxati' })
  findAll(
    @Query('companyId') companyId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll(companyId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Foydalanuvchini ID bo\'yicha olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchi ma\'lumotlarini yangilash' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.sub);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Foydalanuvchi holatini o\'zgartirish' })
  @ApiResponse({ status: 200, description: 'Holat muvaffaqiyatli o\'zgartirildi' })
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: UserStatus,
    @Request() req
  ) {
    return this.usersService.updateStatus(id, status, req.user.sub);
  }

  @Patch(':id/risk-score')
  @ApiOperation({ summary: 'Foydalanuvchi xavf darajasini yangilash' })
  @ApiResponse({ status: 200, description: 'Xavf darajasi yangilandi' })
  updateRiskScore(
    @Param('id') id: string, 
    @Body('riskScore') riskScore: number
  ) {
    return this.usersService.updateRiskScore(id, riskScore);
  }
}