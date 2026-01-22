
import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertTriangle, ShieldCheck, Zap, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { getSecurityAnalysis } from '../services/gemini';
import { AuditLog } from '../types';

const mockLogs: AuditLog[] = [
  { id: '1', userId: 'usr-001', userName: 'Azizov Jasur', action: 'Ochdi', documentName: 'Qaror_№123.pdf', timestamp: '2023-11-20 14:20', ipAddress: '172.16.0.45', location: 'Toshkent, UZ', riskLevel: 'Low' },
  { id: '2', userId: 'usr-005', userName: 'Malikova Gulnoza', action: 'Yukladi', documentName: 'Moliya_Hisoboti_Q3.xlsx', timestamp: '2023-11-20 14:18', ipAddress: '172.16.0.12', location: 'Samarqand, UZ', riskLevel: 'Medium' },
  { id: '4', userId: 'usr-unknown', userName: 'Noma\'lum Foydalanuvchi', action: 'Ochdi', documentName: 'Maxfiy_Strategiya.pdf', timestamp: '2023-11-20 14:10', ipAddress: '84.15.66.12', location: 'Moskva, RU', riskLevel: 'High' },
];

const AIInsightsView: React.FC = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await getSecurityAnalysis(mockLogs);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <BrainCircuit size={28} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">AI Xavfsizlik Tahlilchisi</h2>
          </div>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Gemini AI orqali tizim loglarini avtomatik tahlil qilish va potentsial xavflarni oldindan aniqlash.
          </p>
          <button 
            onClick={fetchAnalysis}
            disabled={loading}
            className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Tahlil qilinmoqda..." : "Yangi tahlil yaratish"}
          </button>
        </div>
        <div className="absolute right-[-5%] top-[-10%] opacity-20 transform rotate-12">
            <BrainCircuit size={400} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
          <p className="font-medium">Sun'iy intellekt ma'lumotlarni tahlil qilmoqda...</p>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" />
              Umumiy Xulosa
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {analysis.summary}
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">Tavsiyalar</h4>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <ShieldCheck size={18} className="text-green-500 mt-0.5 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detected Risks */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              Aniqlangan Xavflar
            </h3>
            <div className="space-y-4">
              {analysis.risks.map((risk: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-blue-200 transition-all cursor-pointer">
                  <div className={`p-3 rounded-xl ${
                    risk.severity === 'High' ? 'bg-red-50 text-red-600' :
                    risk.severity === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800">{risk.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                        risk.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>{risk.severity}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {risk.description}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
            Tahlilni boshlash uchun tugmani bosing.
        </div>
      )}
    </div>
  );
};

export default AIInsightsView;
