import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirish' })
  @ApiResponse({ status: 401, description: 'Noto\'g\'ri ma\'lumotlar' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto, req);
  }

  @Post('register')
  @ApiOperation({ summary: 'Ro\'yxatdan o\'tish' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli ro\'yxatdan o\'tish' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumotlar' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchi profili' })
  @ApiResponse({ status: 200, description: 'Profil ma\'lumotlari' })
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tizimdan chiqish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqish' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub, req);
  }
}