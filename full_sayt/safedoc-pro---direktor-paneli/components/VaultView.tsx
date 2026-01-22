
import React, { useState } from 'react';
import { Lock, File, MoreVertical, Shield, Clock, Download, Share2, Trash2, Upload, Plus } from 'lucide-react';
import { Document } from '../types';
import { useApi, useMutation } from '../hooks/useApi';
import { documentsAPI } from '../services/api';

const VaultView: React.FC = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Get documents from API
  const { data: documentsData, loading, refetch } = useApi(() => 
    documentsAPI.getAll({ limit: 50 })
  );

  // Upload mutation
  const { mutate: uploadDocument, loading: uploading } = useMutation(
    (formData: FormData) => documentsAPI.upload(formData),
    {
      onSuccess: () => {
        setUploadFile(null);
        refetch();
      },
      onError: (error) => {
        alert(`Upload xatoligi: ${error}`);
      }
    }
  );

  // Delete mutation
  const { mutate: deleteDocument } = useMutation(
    (id: string) => documentsAPI.delete(id),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        alert(`O'chirish xatoligi: ${error}`);
      }
    }
  );

  const documents = documentsData?.documents || [];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('securityLevel', 'confidential'); // Default security level
    
    uploadDocument(formData);
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const response = await documentsAPI.download(id);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Yuklab olishda xatolik yuz berdi');
    }
  };

  const handleDelete = (id: string, filename: string) => {
    if (confirm(`"${filename}" hujjatini o'chirishni tasdiqlaysizmi?`)) {
      deleteDocument(id);
    }
  };

  const getSecurityLevelLabel = (level: string) => {
    switch (level) {
      case 'confidential': return 'Maxfiy';
      case 'internal': return 'Xizmat doirasida';
      case 'public': return 'Umumiy';
      default: return 'Noma\'lum';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'confidential': return 'bg-red-50 text-red-600';
      case 'internal': return 'bg-blue-50 text-blue-600';
      case 'public': return 'bg-slate-50 text-slate-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Hujjatlar Ombori</h3>
          <p className="text-slate-400">Shifrlangan va xavfsiz saqlanayotgan barcha fayllar</p>
        </div>
        <div className="flex items-center gap-4">
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            />
            <button className="bg-slate-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2">
              <Upload size={18} />
              Fayl tanlash
            </button>
          </div>
          
          {uploadFile && (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
              <span className="text-sm text-blue-700">{uploadFile.name}</span>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Plus size={14} />
                )}
                Yuklash
              </button>
            </div>
          )}
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <File size={64} className="mx-auto mb-4 text-slate-300" />
          <h4 className="text-lg font-semibold text-slate-600 mb-2">Hujjatlar topilmadi</h4>
          <p className="text-slate-400">Birinchi hujjatingizni yuklang</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc: any) => (
            <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${getSecurityLevelColor(doc.securityLevel)}`}>
                  <File size={32} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDownload(doc.id, doc.filename)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                  >
                    <Download size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id, doc.filename)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">{doc.filename}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSecurityLevelColor(doc.securityLevel)}`}>
                      {getSecurityLevelLabel(doc.securityLevel)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {doc.size ? `${Math.round(doc.size / 1024)} KB` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mas'ul:</span>
                    <span className="font-medium text-slate-700">
                      {doc.uploadedBy?.firstName} {doc.uploadedBy?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Holat:</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <Lock size={12} />
                      <span className="font-bold">Shifrlangan</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Yuklangan:</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={12} />
                      <span>{new Date(doc.createdAt).toLocaleDateString('uz-UZ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultView;
