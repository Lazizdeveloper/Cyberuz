import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  DOCUMENT_UPLOAD = 'document_upload',
  DOCUMENT_VIEW = 'document_view',
  DOCUMENT_DOWNLOAD = 'document_download',
  DOCUMENT_EDIT = 'document_edit',
  DOCUMENT_DELETE = 'document_delete',
  DOCUMENT_SHARE = 'document_share',
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  COMPANY_CREATE = 'company_create',
  COMPANY_UPDATE = 'company_update',
  SECURITY_ALERT = 'security_alert',
  PHISHING_TEST = 'phishing_test',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AuditStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  WARNING = 'warning',
  BLOCKED = 'blocked',
}

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: String, enum: AuditAction, required: true })
  action: AuditAction;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ trim: true })
  userEmail?: string;

  @Prop({ trim: true })
  userName?: string;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  companyId?: Types.ObjectId;

  @Prop({ trim: true })
  companyName?: string;

  @Prop({ type: Types.ObjectId, ref: 'DocumentModel' })
  documentId?: Types.ObjectId;

  @Prop({ trim: true })
  documentName?: string;

  @Prop({ type: String, enum: AuditStatus, default: AuditStatus.SUCCESS })
  status: AuditStatus;

  @Prop({ type: String, enum: RiskLevel, default: RiskLevel.LOW })
  riskLevel: RiskLevel;

  @Prop({ trim: true })
  ipAddress?: string;

  @Prop({ trim: true })
  userAgent?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Object })
  requestData?: Record<string, any>;

  @Prop({ type: Object })
  responseData?: Record<string, any>;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ trim: true })
  sessionId?: string;

  @Prop({ default: false })
  isAnomaly: boolean;

  @Prop({ type: [String], default: [] })
  flags: string[];
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);