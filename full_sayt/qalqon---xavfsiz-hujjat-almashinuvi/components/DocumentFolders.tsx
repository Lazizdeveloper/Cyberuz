
import React, { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  Search, 
  MoreVertical, 
  Shield, 
  FileText, 
  ArrowLeft,
  Calendar,
  HardDrive
} from 'lucide-react';
import { SecurityLevel, Document } from '../types';

const mockCompanies = [
  { id: 'C1', name: 'Artel Electronics', docCount: 156, storage: '1.2 GB', lastUpdate: 'Bugun, 10:20' },
  { id: 'C2', name: 'UzAuto Motors', docCount: 842, storage: '4.5 GB', lastUpdate: 'Kecha, 18:45' },
  { id: 'C3', name: 'Kapital Bank', docCount: 2304, storage: '12.8 GB', lastUpdate: 'Bugun, 09:12' },
  { id: 'C4', name: 'Beeline Uzbekistan', docCount: 412, storage: '2.1 GB', lastUpdate: '3 kun oldin' },
];

const mockDocs: Document[] = [
  { id: '1', name: 'Shartnoma_V1.pdf', type: 'PDF', size: '2.4 MB', author: 'S.Ahmedov', companyId: 'C3', securityLevel: SecurityLevel.TOP_SECRET, lastActivity: '2 soat oldin', status: 'active' },
  { id: '2', name: 'Moliyaviy_Hisobot.xlsx', type: 'XLSX', size: '1.2 MB', author: 'D.Normatov', companyId: 'C3', securityLevel: SecurityLevel.CONFIDENTIAL, lastActivity: '5 soat oldin', status: 'active' },
  { id: '3', name: 'Strategiya_2025.docx', type: 'DOCX', size: '850 KB', author: 'A.Qodirova', companyId: 'C3', securityLevel: SecurityLevel.INTERNAL, lastActivity: '1 kun oldin', status: 'active' },
];

const DocumentFolders: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  if (selectedCompany) {
    const company = mockCompanies.find(c => c.id === selectedCompany);
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedCompany(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Folder className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{company?.name} papkasi</h1>
              <p className="text-slate-500">{company?.docCount} ta hujjat • {company?.storage} ishlatilgan</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            Hujjat Yuklash +
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Hujjat nomi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Daraja</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Muallif</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md flex items-center gap-1 w-fit">
                      <Shield className="w-3 h-3" /> {doc.securityLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{doc.author}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kompaniya Papkalari</h1>
          <p className="text-slate-500">Har bir tashkilot uchun alohida shifrlangan saqlash hududi.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Kompaniya qidirish..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCompanies.map((company) => (
          <div 
            key={company.id}
            onClick={() => setSelectedCompany(company.id)}
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Folder className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 truncate">{company.name}</h3>
            <p className="text-slate-500 text-sm mb-6">{company.docCount} ta hujjat</p>
            
            <div className="pt-4 border-t border-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {company.storage}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {company.lastUpdate}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
          <Folder className="w-8 h-8 mb-2" />
          <span className="font-bold text-sm">Yangi Papka</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentFolders;
