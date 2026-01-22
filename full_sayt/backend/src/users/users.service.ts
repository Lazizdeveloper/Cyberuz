import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserStatus } from '../schemas/user.schema';
import { Company, CompanyDocument } from '../schemas/company.schema';
import { AuditLog, AuditLogDocument, AuditAction, RiskLevel } from '../schemas/audit-log.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string) {
    // Check if user exists
    const existingUser = await this.userModel.findOne({ 
      email: createUserDto.email.toLowerCase() 
    });
    
    if (existingUser) {
      throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const user = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Update company employee count
    if (createUserDto.companyId) {
      await this.companyModel.findByIdAndUpdate(
        createUserDto.companyId,
        { $inc: { employeeCount: 1 } }
      );
    }

    // Log audit
    await this.createAuditLog({
      action: AuditAction.USER_CREATE,
      userId: savedUser._id,
      userEmail: savedUser.email,
      userName: `${savedUser.firstName} ${savedUser.lastName}`,
      companyId: savedUser.companyId,
      description: `Yangi foydalanuvchi yaratildi: ${savedUser.email}`,
      metadata: { createdBy },
    });

    const { password, ...result } = savedUser.toObject();
    return result;
  }

  async findAll(companyId?: string, page = 1, limit = 10) {
    const query = companyId ? { companyId } : {};
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .populate('companyId', 'name industry')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('companyId')
      .exec();

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .populate('companyId')
      .exec();

    // Log audit
    await this.createAuditLog({
      action: AuditAction.USER_UPDATE,
      userId: updatedUser._id,
      userEmail: updatedUser.email,
      userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      companyId: updatedUser.companyId,
      description: `Foydalanuvchi ma'lumotlari yangilandi: ${updatedUser.email}`,
      metadata: { updatedBy, changes: updateUserDto },
    });

    return updatedUser;
  }

  async remove(id: string, deletedBy?: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    await this.userModel.findByIdAndDelete(id);

    // Update company employee count
    if (user.companyId) {
      await this.companyModel.findByIdAndUpdate(
        user.companyId,
        { $inc: { employeeCount: -1 } }
      );
    }

    // Log audit
    await this.createAuditLog({
      action: AuditAction.USER_DELETE,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: user.companyId,
      description: `Foydalanuvchi o'chirildi: ${user.email}`,
      metadata: { deletedBy },
    });

    return { message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' };
  }

  async updateStatus(id: string, status: UserStatus, updatedBy?: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .select('-password')
      .populate('companyId')
      .exec();

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // Log audit
    await this.createAuditLog({
      action: AuditAction.USER_UPDATE,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      companyId: user.companyId,
      description: `Foydalanuvchi holati o'zgartirildi: ${status}`,
      metadata: { updatedBy, oldStatus: user.status, newStatus: status },
    });

    return user;
  }

  async updateRiskScore(id: string, riskScore: number) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { riskScore }, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  private async createAuditLog(data: Partial<AuditLog>) {
    const auditLog = new this.auditLogModel({
      ...data,
      timestamp: new Date(),
      riskLevel: data.riskLevel || RiskLevel.LOW,
    });
    
    return auditLog.save();
  }
}