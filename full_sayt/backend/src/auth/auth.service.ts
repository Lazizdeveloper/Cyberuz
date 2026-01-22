import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole, UserStatus } from '../schemas/user.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .populate('companyId')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Noto\'g\'ri email yoki parol');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Hisobingiz faol emas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Noto\'g\'ri email yoki parol');
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(loginDto: LoginDto, req: any) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      companyId: user.companyId?._id,
    };

    // Update last login
    await this.userModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      lastLoginIP: req.ip,
    });

    // Log audit
    await this.createAuditLog({
      action: AuditAction.LOGIN,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: user.companyId?._id,
      companyName: user.companyId?.name,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      riskLevel: RiskLevel.LOW,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: user.companyId,
        permissions: user.permissions,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userModel.findOne({ 
      email: registerDto.email.toLowerCase() 
    });
    
    if (existingUser) {
      throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Create user
    const user = new this.userModel({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      role: registerDto.role || UserRole.EMPLOYEE,
      status: UserStatus.PENDING,
    });

    await user.save();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.USER_CREATE,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: user.companyId,
      riskLevel: RiskLevel.LOW,
      description: 'Yangi foydalanuvchi ro\'yxatdan o\'tdi',
    });

    const { password, ...result } = user.toObject();
    return result;
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).populate('companyId').exec();
  }

  private async createAuditLog(data: Partial<AuditLog>) {
    const auditLog = new this.auditLogModel({
      ...data,
      timestamp: new Date(),
    });
    
    return auditLog.save();
  }

  async logout(userId: string, req: any) {
    // Log audit
    const user = await this.userModel.findById(userId);
    if (user) {
      await this.createAuditLog({
        action: AuditAction.LOGOUT,
        userId: user._id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        companyId: user.companyId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        riskLevel: RiskLevel.LOW,
      });
    }

    return { message: 'Muvaffaqiyatli chiqildi' };
  }
}