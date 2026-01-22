
import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle2,
  Package,
  Calendar,
  Download,
  PieChart,
  ArrowRightLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

const financialData = [
  { month: 'Yan', income: 12400, expense: 8200 },
  { month: 'Fev', income: 15600, expense: 9100 },
  { month: 'Mar', income: 18200, expense: 8800 },
  { month: 'Apr', income: 22400, expense: 10500 },
  { month: 'May', income: 25800, expense: 11200 },
];

const plans = [
  { name: 'Basic', price: '$99', storage: '100 GB', users: '10 gacha', active: 12, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Standard', price: '$299', storage: '500 GB', users: '50 gacha', active: 24, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Enterprise', price: 'Maxsus', storage: 'Cheksiz', users: 'Cheksiz', active: 6, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const history = [
  { id: 'T1024', name: 'Kapital Bank', type: 'INCOME', category: 'Obuna', date: '2024-05-20', amount: '+$4,500', status: 'Paid' },
  { id: 'X2001', name: 'Cloud Provider (Server)', type: 'EXPENSE', category: 'Infratuzilma', date: '2024-05-19', amount: '-$1,200', status: 'Paid' },
  { id: 'T1023', name: 'Artel Electronics', type: 'INCOME', category: 'Obuna', date: '2024-05-18', amount: '+$299', status: 'Paid' },
  { id: 'X2002', name: 'Security Audit Service', type: 'EXPENSE', category: 'Xizmatlar', date: '2024-05-15', amount: '-$850', status: 'Paid' },
  { id: 'T1022', name: 'UzAuto Motors', type: 'INCOME', category: 'Obuna', date: '2024-05-15', amount: '+$4,500', status: 'Pending' },
];

const Monetization: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monetizatsiya va Moliyaviy Nazorat</h1>
          <p className="text-slate-500">Tizim daromadlari, operatsion xarajatlar va foyda tahlili.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download className="w-4 h-4" /> Excel Eksport
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            Yangi Tranzaksiya +
          </button>
        </div>
      </div>

      {/* Primary Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Umumiy Daromad (Kirish)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$25,800</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <span className="text-rose-600 text-xs font-bold flex items-center bg-rose-50 px-2 py-1 rounded-full">
              +8% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Umumiy Xarajat (Chiqish)</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$11,200</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +22% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sof Foyda</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">$14,600</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-slate-400 text-xs font-bold px-2 py-1 rounded-full">
              Barqaror
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Obunachilar Soni</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">42 ta</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900">Daromad va Xarajat Balansi</h3>
              <p className="text-xs text-slate-400">Oxirgi 5 oylik moliyaviy dinamika</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 mr-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-xs font-medium text-slate-500">Daromad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                <span className="text-xs font-medium text-slate-500">Xarajat</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="income" fill="#2563eb" radius={[4, 4, 0, 0]} name="Daromad" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Xarajat" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" /> Operatsion Xarajatlar
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Server va Infratuzilma', value: '$4,200', pct: 40, color: 'bg-blue-500' },
              { label: 'Xavfsizlik Auditi', value: '$2,400', pct: 22, color: 'bg-indigo-500' },
              { label: 'Mijozlarga Xizmat', value: '$1,800', pct: 18, color: 'bg-emerald-500' },
              { label: 'Marketing va PR', value: '$1,200', pct: 10, color: 'bg-amber-500' },
              { label: 'Boshqa', value: '$1,600', pct: 10, color: 'bg-slate-400' },
            ].map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">{cat.label}</span>
                  <span className="text-slate-900">{cat.value}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 text-center italic">Xarajatlar o'tgan oydan 2.4% ga kamaydi</p>
          </div>
        </div>
      </div>

      {/* Financial History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" /> Oxirgi Tranzaksiyalar
          </h3>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg">Barchasi</button>
             <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Faqat Daromad</button>
             <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Faqat Xarajat</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ob'ekt/Kontragent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tur / Kategoriya</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sana</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Summa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-slate-400">{t.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'INCOME' ? 'Kirish' : 'Chiqish'}
                      </span>
                      <span className="text-xs text-slate-500">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {t.date}</div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {t.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                      {t.status}
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

export default Monetization;
