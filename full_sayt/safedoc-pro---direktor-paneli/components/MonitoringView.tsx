
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, User, MapPin, ExternalLink, Terminal } from 'lucide-react';
import { AuditLog } from '../types';
import { useApi, usePolling } from '../hooks/useApi';
import { monitoringAPI, auditAPI } from '../services/api';

const MonitoringView: React.FC = () => {
  // Get live activity with polling every 5 seconds
  const { data: liveActivity } = usePolling(() => monitoringAPI.getLiveActivity(20), 5000);
  
  // Get audit logs for detailed table
  const { data: auditData, loading: auditLoading } = useApi(() => 
    auditAPI.getLogs({ limit: 50 })
  );

  const logs = auditData?.logs || [];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      {/* Live Stream Terminal */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-green-500" />
            <span className="text-slate-300 text-sm font-mono font-bold tracking-widest">LIVE_TRAFFIC_LOGS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500">Connected to Mainframe</span>
          </div>
        </div>
        <div className="p-6 h-[400px] overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar">
          {liveActivity && liveActivity.length > 0 ? (
            liveActivity.map((log: any) => (
              <div key={log.id} className="flex items-start gap-4 py-1 text-slate-400 group hover:text-white transition-colors">
                <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`font-bold ${
                  log.riskLevel === 'High' ? 'text-red-500' : 
                  log.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                  {log.action?.toUpperCase() || 'ACTION'}
                </span>
                <span>-</span>
                <span className="text-slate-200">{log.userName || 'Unknown User'}</span>
                <span>accessing</span>
                <span className="text-green-400">"{log.documentName || log.resource || 'Unknown Resource'}"</span>
                <span className="text-slate-600">IP: {log.ipAddress || 'N/A'}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-2">
                  <button className="text-slate-500 hover:text-white"><ExternalLink size={14} /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-600">No live activity detected...</div>
          )}
          <div className="text-slate-600 animate-pulse mt-4">_ Awaiting next event...</div>
        </div>
      </div>

      {/* Structured Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Batafsil kuzatuv paneli</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <Filter size={16} />
              Filtrlar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Export (CSV)
            </button>
          </div>
        </div>
        
        {auditLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Foydalanuvchi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Harakat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hujjat nomi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joylashuv / IP</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Xavf darajasi</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User size={16} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{log.userName || 'Unknown User'}</p>
                          <p className="text-xs text-slate-400">{log.userId || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        log.action === 'view' || log.action === 'Ochdi' ? 'bg-blue-50 text-blue-600' :
                        log.action === 'upload' || log.action === 'Yukladi' ? 'bg-green-50 text-green-600' :
                        log.action === 'share' || log.action === 'Yubordi' ? 'bg-purple-50 text-purple-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {log.action || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{log.documentName || log.resource || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={12} />
                        {log.location || 'Unknown'}
                        <span className="text-slate-300">|</span>
                        {log.ipAddress || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          log.riskLevel === 'Low' ? 'bg-green-500' :
                          log.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-slate-600">{log.riskLevel || 'Low'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <ShieldCheck size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Hozircha faoliyat loglari yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MonitoringView;
