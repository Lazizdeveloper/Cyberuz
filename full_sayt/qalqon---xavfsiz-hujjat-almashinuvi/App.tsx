
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderSearch, 
  ShieldCheck, 
  Building2, 
  Activity, 
  Bell, 
  LogOut,
  Menu,
  Search,
  Lock,
  Wallet,
  Milestone
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DocumentFolders from './components/DocumentFolders';
import AuditLogs from './components/AuditLogs';
import SecurityCenter from './components/SecurityCenter';
import CompanyManagement from './components/CompanyManagement';
import Monetization from './components/Monetization';
import Roadmap from './components/Roadmap';
import Login from './components/Login';
import { ViewType } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, isLoading } = useAuth();

  const navigation = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard },
    { id: 'folders', label: 'Kompaniya Papkalari', icon: FolderSearch },
    { id: 'audit', label: 'Audit va Monitoring', icon: Activity },
    { id: 'companies', label: 'Tashkilotlar', icon: Building2 },
    { id: 'monetization', label: 'Monetizatsiya', icon: Wallet },
    { id: 'roadmap', label: 'Yo\'l Xaritasi', icon: Milestone },
    { id: 'security', label: 'Xavfsizlik Markazi', icon: ShieldCheck },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'folders': return <DocumentFolders />;
      case 'audit': return <AuditLogs />;
      case 'companies': return <CompanyManagement />;
      case 'monetization': return <Monetization />;
      case 'roadmap': return <Roadmap />;
      case 'security': return <SecurityCenter />;
      default: return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight">QALQON</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Chiqish</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 transition-all w-80 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.role === 'super_admin' ? 'Super Administrator' : 
                   user?.role === 'company_admin' ? 'Kompaniya Admini' : 'Foydalanuvchi'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {renderContent()}
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <Login />;
};

export default App;
