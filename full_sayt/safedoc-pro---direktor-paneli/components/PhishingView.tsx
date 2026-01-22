
import React, { useState } from 'react';
import { 
  Target, 
  Send, 
  AlertTriangle, 
  MessageSquare, 
  Mail, 
  Smartphone,
  ChevronRight,
  Zap,
  User,
  Loader2,
  CheckCircle2,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { generatePhishingScenario } from '../services/gemini';
import { Employee, ActiveSimulation } from '../types';

const mockEmployees: Employee[] = [
  { id: 'emp-1', name: 'Javohir Orifov', department: 'Moliya', email: 'j.orifov@comp.uz', riskScore: 45 },
  { id: 'emp-2', name: 'Malika Sobirova', department: 'HR', email: 'm.sobirova@comp.uz', riskScore: 12 },
  { id: 'emp-3', name: 'Rustam Karimov', department: 'Logistika', email: 'r.karimov@comp.uz', riskScore: 78 },
  { id: 'emp-4', name: 'Sardor Azimov', department: 'IT Savdo', email: 's.azimov@comp.uz', riskScore: 30 },
];

const campaignData = [
  { name: 'Yan', clickRate: 45, reportRate: 10 },
  { name: 'Feb', clickRate: 38, reportRate: 15 },
  { name: 'Mar', clickRate: 30, reportRate: 22 },
  { name: 'Apr', clickRate: 25, reportRate: 35 },
  { name: 'May', clickRate: 18, reportRate: 48 },
  { name: 'Iyun', clickRate: 12, reportRate: 60 },
];

const PhishingView: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<any>(null);
  const [simulations, setSimulations] = useState<ActiveSimulation[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'active'>('create');

  const handleGenerate = async (trend: string) => {
    if (!selectedEmployee) return;
    setLoading(true);
    const result = await generatePhishingScenario(`${trend} - Xodim: ${selectedEmployee.name}, Bo'lim: ${selectedEmployee.department}`);
    setGeneratedScenario(result);
    setLoading(false);
  };

  const handleSendSimulation = () => {
    if (!selectedEmployee || !generatedScenario) return;
    
    const newSim: ActiveSimulation = {
      id: `sim-${Date.now()}`,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      message: generatedScenario.messageContent,
      status: 'Sent',
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setSimulations([newSim, ...simulations]);
    setGeneratedScenario(null);
    setSelectedEmployee(null);
    setActiveTab('active');

    // Demo maqsadida 3 soniyadan keyin xodim "aldanganini" simulyatsiya qilamiz
    setTimeout(() => {
        setSimulations(prev => prev.map(s => 
            s.id === newSim.id ? { ...s, status: 'Clicked' } : s
        ));
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stats */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 rounded-2xl backdrop-blur-md">
                <Target className="text-indigo-400" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Shaxsiylashtirilgan Phishing Simulyatori</h3>
                <p className="text-indigo-300 text-sm">AI yordamida xodimlar xavfsizlik darajasini aniqlash</p>
              </div>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-sm">
                <button 
                    onClick={() => setActiveTab('create')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Yangi Test
                </button>
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Faol Simulyatsiyalar ({simulations.length})
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-indigo-300 text-xs font-bold uppercase mb-2">Umumiy Aldanish</p>
                <h4 className="text-3xl font-black">12.4%</h4>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                    <div className="bg-rose-500 h-full rounded-full w-[12.4%]"></div>
                </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-indigo-300 text-xs font-bold uppercase mb-2">AI Simulyatsiyalar</p>
                <h4 className="text-3xl font-black">{simulations.length} <span className="text-sm text-indigo-400 font-medium">ta faol</span></h4>
                <p className="text-xs text-indigo-400 mt-4">Oxirgi 24 soat ichida</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-indigo-300 text-xs font-bold uppercase mb-2">O'qitish Samarasi</p>
                <h4 className="text-3xl font-black">94%</h4>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                    <div className="bg-emerald-500 h-full rounded-full w-[94%]"></div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" />
              Xodimni tanlang
            </h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {mockEmployees.map((emp) => (
                <button 
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                    selectedEmployee?.id === emp.id 
                    ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200' 
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      emp.riskScore > 50 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                  {emp.riskScore > 50 && (
                    <AlertTriangle size={16} className="text-rose-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Generator Context */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            {!selectedEmployee ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full">
                    <User size={48} />
                </div>
                <p className="max-w-xs font-medium">Iltimos, test yubormoqchi bo'lgan xodimingizni chap ro'yxatdan tanlang.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-slate-800">Ssenariy turini tanlang</h4>
                        <p className="text-sm text-slate-400">{selectedEmployee.name} uchun maxsus hujum</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold ${
                        selectedEmployee.riskScore > 50 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                        Risk Score: {selectedEmployee.riskScore}%
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'bank', icon: Smartphone, label: 'Click/Bank', trend: 'Click.uz orqali soxta bonus xabari' },
                        { id: 'hr', icon: Mail, label: 'HR Hujjat', trend: 'Muntazam tibbiy ko\'rik haqida soxta buyruq' },
                        { id: 'tg', icon: MessageSquare, label: 'Telegram', trend: 'Hisobingizga boshqa qurilmadan kirildi xabari' },
                        { id: 'fin', icon: Zap, label: 'AI Maxsus', trend: 'Moliya bo\'limidan kutilmagan mukofot puli' },
                    ].map((ctx) => (
                        <button 
                            key={ctx.id}
                            onClick={() => handleGenerate(ctx.trend)}
                            disabled={loading}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center gap-3 text-center group"
                        >
                            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <ctx.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">{ctx.label}</span>
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="text-sm text-slate-500 font-medium">AI xodim profiliga mos ssenariy yaratmoqda...</p>
                    </div>
                )}

                {generatedScenario && !loading && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
                        <div className="bg-slate-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="text-amber-400" size={16} />
                                <span className="text-white text-sm font-bold">AI YARATGAN SSENARIY</span>
                            </div>
                            <span className="text-slate-400 text-xs font-mono">{generatedScenario.channel}</span>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Xabar Mazmuni:</h5>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic leading-relaxed">
                                    {generatedScenario.messageContent}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">E'tibor berish kerak bo'lgan "Red Flags":</h5>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {generatedScenario.redFlags?.map((flag: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button 
                                onClick={handleSendSimulation}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
                            >
                                <Send size={20} />
                                Simulyatsiyani yuborish
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-bold text-slate-800">Faol Monitoring</h4>
                    <p className="text-sm text-slate-400">Xodimlarning phishing testiga bo'lgan reaksiyasi</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Sent
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl text-xs font-bold text-rose-600">
                        <AlertTriangle size={14} />
                        Clicked
                    </div>
                </div>
            </div>
            {simulations.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                    Hozircha hech qanday faol simulyatsiya yo'q.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Vaqt</th>
                                <th className="px-8 py-4">Xodim</th>
                                <th className="px-8 py-4">Xabar</th>
                                <th className="px-8 py-4">Holat</th>
                                <th className="px-8 py-4">Natija</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {simulations.map((sim) => (
                                <tr key={sim.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6 text-sm text-slate-500">{sim.timestamp}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                                {sim.employeeName[0]}
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">{sim.employeeName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-slate-600 line-clamp-1 max-w-xs">{sim.message}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            sim.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                            sim.status === 'Clicked' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                                            'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {sim.status === 'Sent' && <Send size={10} />}
                                            {sim.status === 'Clicked' && <AlertTriangle size={10} />}
                                            {sim.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {sim.status === 'Clicked' ? (
                                            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                                                <AlertTriangle size={14} />
                                                Panelga xabar keldi: ALDANDI
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 text-xs">Kutilmoqda...</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      )}
      
      {/* Historical Data View (Optional) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-800">Oylik Progress</h3>
            <p className="text-sm text-slate-400">Aldanish va xabar berish nisbati</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span>Click Rate</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>Report Rate</span>
              </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="clickRate" stroke="#f43f5e" strokeWidth={3} dot={{fill: '#f43f5e', r: 4}} />
              <Line type="monotone" dataKey="reportRate" stroke="#10b981" strokeWidth={3} dot={{fill: '#10b981', r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PhishingView;
