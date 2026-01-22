import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocumentDocument = DocumentModel & Document;

export enum SecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  TOP_SECRET = 'top_secret',
}

export enum DocumentStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  LOCKED = 'locked',
  DELETED = 'deleted',
}

@Schema({ timestamps: true })
export class DocumentModel {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  originalName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  fileSize: number; // bytes

  @Prop({ required: true, trim: true })
  mimeType: string;

  @Prop({ required: true, trim: true })
  fileExtension: string;

  @Prop({ type: String, enum: SecurityLevel, default: SecurityLevel.INTERNAL })
  securityLevel: SecurityLevel;

  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.ACTIVE })
  status: DocumentStatus;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastModifiedBy?: Types.ObjectId;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ default: false })
  isEncrypted: boolean;

  @Prop({ trim: true })
  encryptionKey?: string;

  @Prop({ trim: true })
  checksum: string;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: Date })
  lastAccessed?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastAccessedBy?: Types.ObjectId;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    pageCount?: number;
    wordCount?: number;
  };

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  sharedWith: Types.ObjectId[];

  @Prop({ type: Object })
  permissions?: {
    canView: Types.ObjectId[];
    canEdit: Types.ObjectId[];
    canDownload: Types.ObjectId[];
    canShare: Types.ObjectId[];
  };
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);