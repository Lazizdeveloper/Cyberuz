
import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Fingerprint, 
  Cpu, 
  AlertCircle,
  EyeOff
} from 'lucide-react';

const SecurityCenter: React.FC = () => {
  const securityRules = [
    { name: 'O\'zbekiston tashqarisidan kirishni taqiqlash', status: true, desc: 'Tizimga faqat mahalliy IP manzillar orqali kirish imkoniyati.' },
    { name: 'DLP (Data Leak Prevention)', status: true, desc: 'Maxfiy ma\'lumotlar yuklanayotganda avtomatik skanerlash va bloklash.' },
    { name: 'Ikki bosqichli autentifikatsiya (2FA)', status: false, desc: 'Har bir kirish uchun SMS yoki Authenticator ilovasi orqali tasdiqlash.' },
    { name: 'Skrinshot himoyasi', status: true, desc: 'Mobil ilovalarda va ayrim brauzerlarda skrinshot olishni cheklash.' },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Xavfsizlik Markazi</h1>
        <p className="text-slate-500">Tizim himoyasini boshqarish va xavfsizlik sozlamalari.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Himoya Qoidalari</h3>
            </div>
            <div className="p-0 divide-y divide-slate-100">
              {securityRules.map((rule, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{rule.name}</p>
                      <p className="text-sm text-slate-500 max-w-md">{rule.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={rule.status} className="sr-only peer" readOnly />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <Cpu className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="font-bold text-lg mb-2">Sun'iy Intellekt Tahlili</h4>
              <p className="text-slate-400 text-sm mb-4">Gemini AI shubhali harakatlarni 99.8% aniqlikda aniqlab, xavfni bartaraf etadi.</p>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                <Zap className="w-4 h-4" /> REJIM: AGRESSIV
              </div>
            </div>
            <div className="bg-indigo-600 rounded-2xl p-6 text-white">
              <Fingerprint className="w-8 h-8 text-indigo-200 mb-4" />
              <h4 className="font-bold text-lg mb-2">Biometrik Nazorat</h4>
              <p className="text-slate-100/70 text-sm mb-4">O'ta maxfiy hujjatlarni ochish uchun yuzni aniqlash texnologiyasi faollashtirilgan.</p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                Sozlash
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Xavfsizlik Ko'rsatkichi</h3>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="44" className="text-blue-600" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-bold text-slate-900">92%</span>
                  <p className="text-xs text-slate-500">XAVFSIZ</p>
                </div>
              </div>
              <p className="text-sm text-center text-slate-500 mt-6 px-4">Tizim himoyasi yuqori darajada. 2FA faollashtirilsa, 100% ga chiqadi.</p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
            <div className="flex items-start gap-3 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Shubhali Login</h4>
                <p className="text-xs text-rose-500 mt-1">Bugun 12:44 da Namangan viloyatidan noma'lum qurilma kirishga urindi. Qurilma avtomatik bloklandi.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Kriptografiya</h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Algoritm</span>
                <span className="text-sm font-mono text-slate-900">AES-GCM-256</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Kalit muddati</span>
                <span className="text-sm font-mono text-slate-900">24 kun qoldi</span>
              </div>
              <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                Kalitlarni yangilash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
