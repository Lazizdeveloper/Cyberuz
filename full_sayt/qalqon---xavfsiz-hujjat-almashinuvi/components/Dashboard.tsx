
import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  FileStack, 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useMonitoringStats, useActivityChart, useTopUsers } from '../hooks/useApi';

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  icon: any; 
  color: string;
  isPositive?: boolean;
  loading?: boolean;
}> = ({ title, value, trend, icon: Icon, color, isPositive = true, loading = false }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {loading ? (
          <div className="w-8 h-4 bg-slate-200 rounded animate-pulse"></div>
        ) : (
          <>
            {trend}
            <ArrowUpRight className={`w-4 h-4 ${!isPositive && 'rotate-90'}`} />
          </>
        )}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    {loading ? (
      <div className="w-20 h-8 bg-slate-200 rounded animate-pulse mt-1"></div>
    ) : (
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { data: stats, loading: statsLoading, error: statsError } = useMonitoringStats();
  const { data: activityData, loading: activityLoading } = useActivityChart({ days: 7 });
  const { data: topUsers, loading: usersLoading } = useTopUsers({ limit: 3 });

  // Transform activity data for chart
  const chartData = activityData?.map(item => ({
    time: new Date(item.time).toLocaleDateString('uz-UZ', { weekday: 'short' }),
    actions: item.actions
  })) || [];

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Ma'lumotlarni yuklashda xatolik yuz berdi</p>
          <p className="text-sm text-slate-400 mt-2">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Markaziy Boshqaruv</h1>
        <p className="text-slate-500">Kompaniyalar bo'yicha tizim holati va umumiy monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tashkilotlar" 
          value={stats ? `${stats.companies.total} ta` : '0 ta'}
          trend={stats ? `+${stats.companies.active}` : '+0'}
          icon={Building2} 
          color="bg-blue-600"
          loading={statsLoading}
        />
        <StatCard 
          title="Jami Hujjatlar" 
          value={stats ? `${stats.documents.total.toLocaleString()} ta` : '0 ta'}
          trend={stats ? `+${stats.documents.uploadedToday}` : '+0'}
          icon={FileStack} 
          color="bg-indigo-600"
          loading={statsLoading}
        />
        <StatCard 
          title="Xavfli Amallar" 
          value={stats ? `${stats.activity.highRiskActions} ta` : '0 ta'}
          trend={stats ? `${stats.activity.anomalies > 0 ? '+' : ''}${stats.activity.anomalies}` : '0'}
          icon={ShieldAlert} 
          color="bg-rose-600" 
          isPositive={false}
          loading={statsLoading}
        />
        <StatCard 
          title="Faol Foydalanuvchilar" 
          value={stats ? `${stats.users.activeToday} ta` : '0 ta'}
          trend={stats ? `${stats.users.total} jami` : '0'}
          icon={ShieldCheck} 
          color="bg-emerald-600"
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Kompaniyalar Faolligi (7 kun)</h3>
            <TrendingUp className="text-blue-600 w-5 h-5" />
          </div>
          {activityLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">Grafik yuklanmoqda...</p>
              </div>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300} minHeight={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="actions" stroke="#2563eb" fillOpacity={1} fill="url(#colorActions)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-center">
          <ShieldCheck className="w-12 h-12 text-blue-400 mb-6" />
          <h3 className="text-xl font-bold mb-4">Shifrlangan Saqlash</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Har bir kompaniya uchun alohida virtual konteyner yaratilgan. Ma'lumotlar AES-256 algoritmi bilan shifrlangan.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Mahalliy Serverlar</span>
              <span className="text-emerald-400">TOSHKENT</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-blue-500 h-full rounded-full w-full"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Xavfsizlik Protokoli</span>
              <span className="text-emerald-400">FAOL</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Saqlangan Ma'lumot</span>
              <span className="text-emerald-400">{stats?.storage.formatted || '0 Bytes'}</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Eng Faol Foydalanuvchilar</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">Hammasi</button>
        </div>
        <div className="p-0">
          {usersLoading ? (
            <div className="p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
                      <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-12 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : topUsers && topUsers.length > 0 ? (
            topUsers.map((user, i) => (
              <div key={user._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 border-b last:border-0 border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full ${
                    i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : 'bg-indigo-500'
                  }`}></div>
                  <div>
                    <p className="font-bold text-slate-900">{user.userName || 'Noma\'lum foydalanuvchi'}</p>
                    <p className="text-xs text-slate-500">{user.actionCount} ta amal</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {user.companyName || 'Kompaniya'}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">
              <p>Hozircha faol foydalanuvchilar yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
