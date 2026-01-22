
import React from 'react';
import { Search, Filter, Download, History, User, FileText, Globe, ShieldCheck } from 'lucide-react';

const AuditView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Tizim Auditi</h3>
            <p className="text-sm text-slate-400">Barcha harakatlarning o'zgarmas tarixi</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Auditdan qidirish..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <Filter size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900">
              <Download size={16} />
              Hisobotni yuklash
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Vaqt</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Foydalanuvchi</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Harakat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hujjat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">IP Manzil</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    2023-11-20 14:32:0{i}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">AA</div>
                      <span className="text-sm font-medium text-slate-700">A. Abdurahmonov</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">Faylni o'chirdi</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-700 font-medium">hisobot_v1.pdf</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <Globe size={12} />
                      172.16.0.45
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <ShieldCheck size={14} />
                      Tasdiqlandi
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditView;