
export interface Document {
  id: string;
  name: string;
  category: 'Maxfiy' | 'Xizmat doirasida' | 'Umumiy';
  owner: string;
  status: 'Encrypted' | 'Open';
  lastAccessed: string;
  fileSize: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: 'Ochdi' | 'Yukladi' | 'Yubordi' | "O'chirdi" | "O'zgartirdi";
  documentName: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  riskScore: number;
}

export interface ActiveSimulation {
  id: string;
  employeeId: string;
  employeeName: string;
  message: string;
  status: 'Sent' | 'Clicked' | 'DataEntered' | 'Reported';
  timestamp: string;
}

export interface PhishingCampaign {
  id: string;
  title: string;
  channel: 'Telegram' | 'Email' | 'SMS';
  sentCount: number;
  clickedCount: number;
  dataEnteredCount: number;
  status: 'Active' | 'Completed';
  lastTrend: string;
}

export enum Page {
  Dashboard = 'dashboard',
  Monitoring = 'monitoring',
  Vault = 'vault',
  Audit = 'audit',
  AIInsights = 'ai-insights',
  Phishing = 'phishing'
}
