
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Eye, 
  Lock, 
  History, 
  Search, 
  Bell, 
  User, 
  LogOut,
  BrainCircuit,
  Target,
  GraduationCap
} from 'lucide-react';
import { Page } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import MonitoringView from './components/MonitoringView';
import VaultView from './components/VaultView';
import AuditView from './components/AuditView';
import AIInsightsView from './components/AIInsightsView';
import PhishingView from './components/PhishingView';

const MainApp: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  const navItems = [
    { id: Page.Dashboard, icon: LayoutDashboard, label: 'Boshqaruv Paneli' },
    { id: Page.Monitoring, icon: Eye, label: 'Jonli Monitoring' },
    { id: Page.Vault, icon: Lock, label: 'Hujjatlar Ombori' },
    { id: Page.Phishing, icon: Target, label: 'Phishing & O\'qitish' },
    { id: Page.Audit, icon: History, label: 'Audit Loglari' },
    { id: Page.AIInsights, icon: BrainCircuit, label: 'AI Tahlil' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">SafeDoc Pro</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activePage === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Chiqish</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {navItems.find(i => i.id === activePage)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Hujjat yoki foydalanuvchi qidirish..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User size={18} className="text-slate-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-700">
                    {user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user?.role === 'admin' ? 'Bosh Direktor' : user?.role || 'Direktor'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activePage === Page.Dashboard && <DashboardView />}
          {activePage === Page.Monitoring && <MonitoringView />}
          {activePage === Page.Vault && <VaultView />}
          {activePage === Page.Audit && <AuditView />}
          {activePage === Page.AIInsights && <AIInsightsView />}
          {activePage === Page.Phishing && <PhishingView />}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <MainApp />;
};

export default App;
