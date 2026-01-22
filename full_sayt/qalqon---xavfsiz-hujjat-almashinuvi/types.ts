
export enum SecurityLevel {
  PUBLIC = 'Ochiq',
  INTERNAL = 'Ichki foydalanish',
  CONFIDENTIAL = 'Maxfiy',
  TOP_SECRET = "O'ta maxfiy"
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  adminEmail: string;
  documentCount: number;
  status: 'active' | 'suspended';
  logo: string;
  storageUsed: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  author: string;
  companyId: string;
  securityLevel: SecurityLevel;
  lastActivity: string;
  status: 'active' | 'archived' | 'locked';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  companyName: string;
  action: 'OPEN' | 'DOWNLOAD' | 'MOVE' | 'SEND' | 'DELETE' | 'LOGIN';
  documentName?: string;
  ipAddress: string;
  location: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
}

export type ViewType = 'dashboard' | 'folders' | 'audit' | 'companies' | 'security' | 'monetization' | 'roadmap';
