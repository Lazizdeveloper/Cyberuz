
import React from 'react';
import { 
  Activity, 
  MapPin, 
  Monitor, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  Building2
} from 'lucide-react';
import { AuditEntry } from '../types';

const mockLogs: AuditEntry[] = [
  { id: 'L1', timestamp: '2024-05-20 14:24:12', user: 'S.Ahmedov', companyName: 'Artel Electronics', action: 'OPEN', documentName: 'Shartnoma.pdf', ipAddress: '192.168.1.45', location: 'Toshkent, UZ', status: 'SUCCESS' },
  { id: 'L2', timestamp: '2024-05-20 14:15:05', user: 'D.Normatov', companyName: 'UzAuto Motors', action: 'DOWNLOAD', documentName: 'Tex_Hujjat.xlsx', ipAddress: '84.54.12.10', location: 'Samarqand, UZ', status: 'WARNING' },
  { id: 'L3', timestamp: '2024-05-20 13:58:33', user: 'Noma\'lum', companyName: 'Kapital Bank', action: 'LOGIN', ipAddress: '45.122.33.4', location: 'Toshkent, UZ', status: 'DENIED' },
  { id: 'L4', timestamp: '2024-05-20 12:44:10', user: 'A.Qodirova', companyName: 'Beeline UZ', action: 'SEND', documentName: 'Reja_2025.docx', ipAddress: '192.168.1.12', location: 'Toshkent, UZ', status: 'SUCCESS' },
];

const AuditLogs: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit va Monitoring</h1>
          <p className="text-slate-500">Kompaniyalar bo'yicha hujjatlar harakati va tizim loglari.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          Real-vaqt monitoringi
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Hammasi</button>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
              <option>Barcha kompaniyalar</option>
              <option>Artel Electronics</option>
              <option>UzAuto Motors</option>
              <option>Kapital Bank</option>
            </select>
          </div>
          <button className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:underline">
            Xisobot yuklash <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {mockLogs.map((log) => (
            <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
                  log.status === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {log.status === 'SUCCESS' ? <CheckCircle2 className="w-6 h-6" /> :
                   log.status === 'WARNING' ? <ShieldAlert className="w-6 h-6" /> :
                   <XCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{log.user}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      <Building2 className="w-3 h-3" /> {log.companyName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{log.action}</span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    {log.documentName ? (
                      <>Hujjat: <span className="font-medium text-slate-900">{log.documentName}</span></>
                    ) : (
                      'Tizimga kirish amali'
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {log.timestamp}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Monitor className="w-3.5 h-3.5" />
                      {log.ipAddress}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {log.location}
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 shrink-0">
                Batafsil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
