
import React from 'react';
import { 
  File, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Eye, 
  Download, 
  History,
  Lock,
  Unlock
} from 'lucide-react';
import { SecurityLevel, Document } from '../types';

// Added missing companyId to satisfy Document interface
const mockDocs: Document[] = [
  { id: '1', name: 'Yillik_Moliyaviy_Hisobot_2023.pdf', type: 'PDF', size: '2.4 MB', author: 'Sanjar Ahmedov', companyId: 'C1', securityLevel: SecurityLevel.TOP_SECRET, lastActivity: '2 soat oldin', status: 'active' },
  { id: '2', name: 'Xodimlar_Ruyxati_Qonun_Buyicha.xlsx', type: 'XLSX', size: '1.2 MB', author: 'Dilshod Normatov', companyId: 'C2', securityLevel: SecurityLevel.CONFIDENTIAL, lastActivity: '5 soat oldin', status: 'active' },
  { id: '3', name: 'Yangi_Loyiha_Strategiyasi.docx', type: 'DOCX', size: '850 KB', author: 'Aziza Qodirova', companyId: 'C3', securityLevel: SecurityLevel.INTERNAL, lastActivity: '1 kun oldin', status: 'active' },
  { id: '4', name: 'Tashkiliy_Buyruq_N42.pdf', type: 'PDF', size: '420 KB', author: 'Sanjar Ahmedov', companyId: 'C1', securityLevel: SecurityLevel.TOP_SECRET, lastActivity: '3 kun oldin', status: 'locked' },
  { id: '5', name: 'Bozor_Tahlili_2024.pdf', type: 'PDF', size: '5.6 MB', author: 'Malika Karimova', companyId: 'C4', securityLevel: SecurityLevel.PUBLIC, lastActivity: '1 hafta oldin', status: 'archived' },
];

const DocumentList: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hujjatlar Ombori</h1>
          <p className="text-slate-500">Barcha maxfiy va umumiy hujjatlar ro'yxati.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Saralash
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            Hujjat Yuklash +
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hujjat nomi yoki muallif bo'yicha qidirish..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none">
          <option>Barcha turlar</option>
          <option>PDF</option>
          <option>DOCX</option>
          <option>XLSX</option>
        </select>
        <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none">
          <option>Barcha xavfsizlik darajalari</option>
          <option>O'ta maxfiy</option>
          <option>Maxfiy</option>
          <option>Ichki foydalanish</option>
          <option>Ochiq</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hujjat Nomi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Xavfsizlik</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Muallif</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Oxirgi Amal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        doc.type === 'PDF' ? 'bg-rose-50 text-rose-600' :
                        doc.type === 'XLSX' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <File className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      doc.securityLevel === SecurityLevel.TOP_SECRET ? 'bg-rose-100 text-rose-700' :
                      doc.securityLevel === SecurityLevel.CONFIDENTIAL ? 'bg-amber-100 text-amber-700' :
                      doc.securityLevel === SecurityLevel.INTERNAL ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {doc.securityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.lastActivity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.status === 'active' && <span className="text-emerald-600 flex items-center gap-1 text-xs font-bold"><Unlock className="w-3 h-3"/> Faol</span>}
                    {doc.status === 'locked' && <span className="text-rose-600 flex items-center gap-1 text-xs font-bold"><Lock className="w-3 h-3"/> Bloklangan</span>}
                    {doc.status === 'archived' && <span className="text-slate-500 flex items-center gap-1 text-xs font-bold">Arxivlangan</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button title="Ko'rish" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button title="Yuklab olish" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button title="Tarix" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                        <History className="w-4 h-4" />
                      </button>
                      <button title="Boshqa" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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

export default DocumentList;
