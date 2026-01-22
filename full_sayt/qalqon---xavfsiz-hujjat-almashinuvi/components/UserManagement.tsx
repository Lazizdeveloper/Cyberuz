
import React from 'react';
import { Shield, UserPlus, Mail, Phone, MoreHorizontal } from 'lucide-react';

const users = [
  { id: 1, name: 'Sanjar Ahmedov', role: 'Super Admin', dept: 'IT Bo\'limi', email: 's.ahmedov@qalqon.uz', status: 'active', img: 'https://picsum.photos/id/64/100/100' },
  { id: 2, name: 'Dilshod Normatov', role: 'Audit Manager', dept: 'Xavfsizlik', email: 'd.normatov@qalqon.uz', status: 'active', img: 'https://picsum.photos/id/65/100/100' },
  { id: 3, name: 'Malika Karimova', role: 'Editor', dept: 'HR Bo\'limi', email: 'm.karimova@qalqon.uz', status: 'inactive', img: 'https://picsum.photos/id/66/100/100' },
  { id: 4, name: 'Aziza Qodirova', role: 'Viewer', dept: 'Moliya', email: 'a.qodirova@qalqon.uz', status: 'active', img: 'https://picsum.photos/id/67/100/100' },
];

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Foydalanuvchilar</h1>
          <p className="text-slate-500">Tizimga kirish huquqiga ega bo'lgan xodimlar.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
          <UserPlus className="w-4 h-4" /> Yangi Foydalanuvchi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={user.img} alt={user.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              </div>
              <button className="text-slate-400 hover:text-slate-900 p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{user.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{user.dept}</p>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold mb-6">
              <Shield className="w-3 h-3" />
              {user.role}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+998 90 123 45 67</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                Profil
              </button>
              <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                Ruxsatlar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
