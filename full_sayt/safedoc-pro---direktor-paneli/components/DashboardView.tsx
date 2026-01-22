
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { ShieldCheck, FileText, Users, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { monitoringAPI, auditAPI } from '../services/api';

const DashboardView: React.FC = () => {
  const { data: stats, loading: statsLoading } = useApi(() => monitoringAPI.getStats());
  const { data: activityChart, loading: chartLoading } = useApi(() => 
    monitoringAPI.getActivityChart({ days: 7 })
  );
  const { data: alerts, loading: alertsLoading } = useApi(() => 
    auditAPI.getSecurityAlerts({ days: 1 })
  );

  // Transform activity chart data for display
  const chartData = activityChart?.map(item => ({
    name: new Date(item.time).toLocaleDateString('uz-UZ', { weekday: 'short' }),
    count: item.actions
  })) || [];

  // Mock category data - in real app this would come from API
  const categoryData = [
    { name: 'Maxfiy', value: Math.floor((stats?.documents?.total || 0) * 0.4), color: '#3b82f6' },
    { name: 'Xizmat doirasida', value: Math.floor((stats?.documents?.total || 0) * 0.3), color: '#fbbf24' },
    { name: 'Umumiy', value: Math.floor((stats?.documents?.total || 0) * 0.3), color: '#10b981' },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Umumiy Hujjatlar" 
          value={stats?.documents?.total?.toLocaleString() || '0'} 
          change={`+${stats?.documents?.uploadedToday || 0}`} 
          trend="up" 
          icon={FileText} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Faol Foydalanuvchilar" 
          value={stats?.users?.activeToday?.toString() || '0'} 
          change={`${stats?.users?.total || 0} jami`} 
          trend="up" 
          icon={Users} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Xavfsizlik Ogohlantirishlari" 
          value={alerts?.length?.toString() || '0'} 
          change={`${stats?.activity?.highRiskActions || 0} yuqori xavfli`} 
          trend="down" 
          icon={AlertCircle} 
          iconColor="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Himoya Darajasi" 
          value="99.9%" 
          change="+0.1%" 
          trend="up" 
          icon={ShieldCheck} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Hujjatlar harakati dinamikasi</h3>
              <p className="text-sm text-slate-400">Oxirgi 7 kundagi umumiy harakatlar</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-sm font-medium outline-none p-2">
              <option>Oxirgi hafta</option>
              <option>Oxirgi oy</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320} minHeight={320}>
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    cursor={{stroke: '#3b82f6', strokeWidth: 2}}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>Ma'lumotlar yuklanmoqda...</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Toifalar bo'yicha hujjatlar</h3>
          <p className="text-sm text-slate-400 mb-8">Umumiy hujjatlar strukturasi</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height={256} minHeight={256}>
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-auto">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: cat.color}}></div>
                  <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{cat.value} ta</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Alerts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Muhim ogohlantirishlar</h3>
          <button className="text-sm text-blue-600 font-semibold hover:underline">Barchasini ko'rish</button>
        </div>
        <div className="space-y-4">
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : alerts && alerts.length > 0 ? (
            alerts.slice(0, 3).map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    alert.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
                    alert.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{alert.action}</p>
                    <p className="text-xs text-slate-500">{alert.userName} tomonidan amalga oshirildi</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(alert.timestamp).toLocaleString('uz-UZ')}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Hozircha ogohlantirishlar yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, iconColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change}
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mt-1">{value}</h4>
    </div>
  </div>
);

export default DashboardView;
