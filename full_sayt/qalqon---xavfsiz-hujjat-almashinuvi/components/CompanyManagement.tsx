
import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  ShieldCheck, 
  ExternalLink, 
  MoreHorizontal,
  Mail,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../hooks/useApi';

interface Company {
  _id: string;
  name: string;
  industry: string;
  adminEmail: string;
  documentCount: number;
  status: 'active' | 'suspended' | 'trial';
  storageUsed: number;
  plan: string;
  createdAt: string;
}

const CompanyManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    adminEmail: '',
    plan: 'basic'
  });

  const { data: companiesData, loading, error, refetch } = useCompanies();
  const { mutate: createCompany, loading: creating } = useCreateCompany();
  const { mutate: updateCompany } = useUpdateCompany();
  const { mutate: deleteCompany } = useDeleteCompany();

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(newCompany);
      setShowCreateModal(false);
      setNewCompany({ name: '', industry: '', adminEmail: '', plan: 'basic' });
      refetch();
    } catch (error) {
      console.error('Kompaniya yaratishda xatolik:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCompany({ id, data: { status } });
      refetch();
    } catch (error) {
      console.error('Status o\'zgartirishda xatolik:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Kompaniyalarni yuklashda xatolik</p>
          <p className="text-sm text-slate-400 mt-2">{error}</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tizimdagi Tashkilotlar</h1>
          <p className="text-slate-500">Platformadan foydalanayotgan barcha korxonalar va ularning holati.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Yangi Tashkilot Qo'shish
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-slate-200 rounded"></div>
              </div>
              <div className="w-32 h-6 bg-slate-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-slate-200 rounded"></div>
                <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 h-8 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData?.companies?.map((company: Company) => (
            <div key={company._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {company.name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      company.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                      company.status === 'trial' ? 'bg-blue-50 text-blue-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {company.status === 'active' ? 'Faol' : 
                       company.status === 'trial' ? 'Sinov' : 'To\'xtatilgan'}
                    </span>
                    <button className="text-slate-400 hover:text-slate-900">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{company.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{company.industry}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{company.adminEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span>{company.documentCount} ta hujjat nazoratda</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5" /> Audit
                  </button>
                  <button className="flex-1 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Papka
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ishlatilgan xotira:</span>
                <span className="text-sm font-bold text-slate-700">{formatBytes(company.storageUsed)}</span>
              </div>
            </div>
          ))}

          {/* Add New Company Card */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all min-h-[300px]"
          >
            <Building2 className="w-8 h-8 mb-2" />
            <span className="font-bold text-sm">Yangi Tashkilot</span>
          </button>
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Yangi Tashkilot Qo'shish</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tashkilot nomi
                </label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Artel Electronics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Soha
                </label>
                <input
                  type="text"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Elektronika"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={newCompany.adminEmail}
                  onChange={(e) => setNewCompany({ ...newCompany, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@artel.uz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reja
                </label>
                <select
                  value={newCompany.plan}
                  onChange={(e) => setNewCompany({ ...newCompany, plan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
