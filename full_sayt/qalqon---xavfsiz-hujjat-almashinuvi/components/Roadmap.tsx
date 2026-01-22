
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Rocket, 
  Map, 
  Layout, 
  ShieldCheck, 
  Cloud,
  Smartphone,
  Zap,
  Lock
} from 'lucide-react';

const roadmapItems = [
  {
    phase: 'Q1 2024: Poydevor',
    status: 'completed',
    items: [
      { title: 'AES-256 Shifrlash integratsiyasi', icon: Lock, done: true },
      { title: 'Markaziy Monitoring Paneli', icon: Layout, done: true },
      { title: 'Toshkent Data Center Setup', icon: Cloud, done: true },
    ]
  },
  {
    phase: 'Q2 2024: Kengayish',
    status: 'active',
    items: [
      { title: 'DLP (Data Leak Prevention) moduli', icon: ShieldCheck, done: true },
      { title: 'Mobil Ilova (iOS & Android)', icon: Smartphone, done: false },
      { title: 'AI-Powered Anomaliyalar tahlili', icon: Zap, done: false },
    ]
  },
  {
    phase: 'Q3 2024: Integratsiya',
    status: 'planned',
    items: [
      { title: 'ERP Tizimlar bilan API bog\'lanish', icon: Rocket, done: false },
      { title: 'Blockchain Audit Log (Tahrirlab bo\'lmas)', icon: CheckCircle2, done: false },
      { title: 'Ovozli buyruqlar va biometrika', icon: Clock, done: false },
    ]
  }
];

const Roadmap: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loyiha Yo'l Xaritasi (Roadmap)</h1>
          <p className="text-slate-500">Qalqon platformasining kelajakdagi rivojlanish bosqichlari.</p>
        </div>
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
          <Map className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connection Line */}
        <div className="absolute top-24 left-0 w-full h-0.5 bg-slate-200 hidden md:block -z-10"></div>

        {roadmapItems.map((phase, idx) => (
          <div key={idx} className="space-y-6">
            <div className={`relative p-6 rounded-2xl border ${
              phase.status === 'completed' ? 'bg-emerald-50 border-emerald-100' :
              phase.status === 'active' ? 'bg-blue-50 border-blue-100 ring-2 ring-blue-600 ring-offset-4 ring-offset-slate-50' :
              'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  phase.status === 'completed' ? 'text-emerald-600' :
                  phase.status === 'active' ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {phase.status}
                </span>
                {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {phase.status === 'active' && <Clock className="w-5 h-5 text-blue-500 animate-spin-slow" />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{phase.phase}</h3>
            </div>

            <div className="space-y-4">
              {phase.items.map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  item.done ? 'bg-white border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'
                }`}>
                  <div className={`p-2 rounded-lg ${item.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${item.done ? 'text-slate-900' : 'text-slate-500'}`}>{item.title}</p>
                  </div>
                  {item.done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section for Next Feature */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold tracking-widest mb-4">
            <Rocket className="w-3 h-3" /> KEYINGI KATTA YANGILANISH
          </div>
          <h2 className="text-3xl font-bold mb-4">Qalqon AI Analytics 2.0</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            Sun'iy intellekt endi nafaqat xavfni aniqlaydi, balki hujjatlar harakatini tahlil qilib, 
            potentsial sizib chiqishlarni u sodir bo'lmasdan oldin bashorat qiladi.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md flex-1 text-center">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-slate-500">ANIQLIK</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md flex-1 text-center">
              <p className="text-2xl font-bold">Real-vaqt</p>
              <p className="text-xs text-slate-500">TEZLIK</p>
            </div>
          </div>
        </div>
        <div className="w-64 h-64 relative shrink-0">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <Zap className="w-full h-full text-blue-500 relative z-10 animate-bounce-slow" />
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Roadmap;
