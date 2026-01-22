import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PhishingCampaignDocument = PhishingCampaign & Document;

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

export enum CampaignChannel {
  EMAIL = 'email',
  SMS = 'sms',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
}

export enum SimulationStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  DATA_ENTERED = 'data_entered',
  REPORTED = 'reported',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class PhishingCampaign {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: String, enum: CampaignChannel, required: true })
  channel: CampaignChannel;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  messageContent: string;

  @Prop({ trim: true })
  subject?: string;

  @Prop({ trim: true })
  senderName?: string;

  @Prop({ trim: true })
  senderEmail?: string;

  @Prop({ trim: true })
  landingPageUrl?: string;

  @Prop({ type: [String], default: [] })
  redFlags: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  targetUsers: Types.ObjectId[];

  @Prop({ default: 0 })
  sentCount: number;

  @Prop({ default: 0 })
  deliveredCount: number;

  @Prop({ default: 0 })
  openedCount: number;

  @Prop({ default: 0 })
  clickedCount: number;

  @Prop({ default: 0 })
  dataEnteredCount: number;

  @Prop({ default: 0 })
  reportedCount: number;

  @Prop({ type: Date })
  scheduledAt?: Date;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: Object })
  settings?: {
    autoComplete: boolean;
    sendReminders: boolean;
    trackClicks: boolean;
    collectData: boolean;
  };
}

@Schema({ timestamps: true })
export class PhishingSimulation {
  @Prop({ type: Types.ObjectId, ref: 'PhishingCampaign', required: true })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  userEmail: string;

  @Prop({ required: true, trim: true })
  userName: string;

  @Prop({ type: String, enum: SimulationStatus, default: SimulationStatus.SENT })
  status: SimulationStatus;

  @Prop({ required: true })
  messageContent: string;

  @Prop({ type: Date, default: Date.now })
  sentAt: Date;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ type: Date })
  openedAt?: Date;

  @Prop({ type: Date })
  clickedAt?: Date;

  @Prop({ type: Date })
  dataEnteredAt?: Date;

  @Prop({ type: Date })
  reportedAt?: Date;

  @Prop({ trim: true })
  ipAddress?: string;

  @Prop({ trim: true })
  userAgent?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ type: Object })
  enteredData?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const PhishingCampaignSchema = SchemaFactory.createForClass(PhishingCampaign);
export const PhishingSimulationSchema = SchemaFactory.createForClass(PhishingSimulation);