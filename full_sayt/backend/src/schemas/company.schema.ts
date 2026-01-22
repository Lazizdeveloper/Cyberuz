import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

export enum CompanyStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
}

export enum CompanyPlan {
  BASIC = 'basic',
  STANDARD = 'standard',
  ENTERPRISE = 'enterprise',
}

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  industry: string;

  @Prop({ required: true, unique: true, lowercase: true })
  adminEmail: string;

  @Prop({ type: String, enum: CompanyStatus, default: CompanyStatus.TRIAL })
  status: CompanyStatus;

  @Prop({ type: String, enum: CompanyPlan, default: CompanyPlan.BASIC })
  plan: CompanyPlan;

  @Prop({ trim: true })
  logo?: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ default: 0 })
  documentCount: number;

  @Prop({ default: 0 })
  storageUsed: number; // bytes

  @Prop({ default: 1073741824 }) // 1GB default
  storageLimit: number; // bytes

  @Prop({ default: 0 })
  employeeCount: number;

  @Prop({ default: 10 })
  employeeLimit: number;

  @Prop({ type: Date })
  subscriptionStart?: Date;

  @Prop({ type: Date })
  subscriptionEnd?: Date;

  @Prop({ type: Object })
  settings?: {
    encryptionEnabled: boolean;
    dlpEnabled: boolean;
    auditRetentionDays: number;
    allowedFileTypes: string[];
    maxFileSize: number;
  };

  @Prop({ type: Object })
  billing?: {
    monthlyFee: number;
    currency: string;
    paymentMethod: string;
    lastPayment?: Date;
    nextPayment?: Date;
  };
}

export const CompanySchema = SchemaFactory.createForClass(Company);