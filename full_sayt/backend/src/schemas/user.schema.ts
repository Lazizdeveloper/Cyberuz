import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin',
  EMPLOYEE = 'employee',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  companyId?: Types.ObjectId;

  @Prop({ trim: true })
  department?: string;

  @Prop({ trim: true })
  position?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ default: 0 })
  riskScore: number;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop({ trim: true })
  lastLoginIP?: string;

  @Prop({ default: true })
  twoFactorEnabled: boolean;

  @Prop({ trim: true })
  twoFactorSecret?: string;

  @Prop({ type: Object })
  preferences?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);