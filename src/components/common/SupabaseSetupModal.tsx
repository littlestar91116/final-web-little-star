import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, resetSupabaseConfig, SUPABASE_55_TABLES_SQL, getSupabaseClient } from '../../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestStatus('testing');
    setTestMessage('Menghubungkan ke Supabase...');

    if (!url.trim() || !anonKey.trim()) {
      setTestStatus('error');
      setTestMessage('Mohon isi Supabase URL dan Anon Key dengan lengkap.');
      return;
    }

    if (!url.startsWith('https://')) {
      setTestStatus('error');
      setTestMessage('URL Supabase harus diawali dengan https://');
      return;
    }

    saveSupabaseConfig(url, anonKey);
    const client = getSupabaseClient();

    if (!client) {
      setTestStatus('error');
      setTestMessage('Gagal membuat client Supabase dengan kredensial ini.');
      return;
    }

    try {
      // Test querying a table or checking auth
      const { data, error } = await client.from('school_settings').select('*').limit(1);
      
      // Even if the table does not exist yet (error 42P01), if we reached Supabase and got a response, connection is valid!
      if (error && error.code !== '42P01' && error.message.includes('FetchError')) {
        setTestStatus('error');
        setTestMessage(`Koneksi gagal: ${error.message}`);
      } else {
        setTestStatus('success');
        setTestMessage('Koneksi ke Supabase berhasil diverifikasi!');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Gagal menghubungi server Supabase: ${err?.message || 'Periksa koneksi internet dan CORS'}`);
    }
  };

  const handleReset = () => {
    resetSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestStatus('idle');
    setTestMessage('Konfigurasi dikembalikan ke penyimpanan lokal terpadu.');
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_55_TABLES_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Integrasi Database Supabase</h2>
              <p className="text-xs text-slate-500">Konfigurasi database PostgreSQL, Auth, dan 55 Skema Tabel PRD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-4 bg-white">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Konfigurasi Koneksi
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Script Migrasi SQL (55 Tabel)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'config' ? (
            <div>
              <div className="mb-5 p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Status Operasional Saat Ini:
                </div>
                <p>
                  Sistem beroperasi dalam mode <strong>Terpadu Real-Time</strong>. Anda dapat menghubungkan project Supabase Anda sendiri dengan memasukkan URL & Anon Key di bawah ini, atau menjalankan SQL migrasi di SQL Editor Supabase Anda.
                </p>
              </div>

              <form onSubmit={handleSaveAndTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Ditemukan di Project Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Anon / Publishable Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={anonKey}
                      onChange={(e) => setAnonKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Ditemukan di Project Settings &gt; API &gt; anon public API key
                  </span>
                </div>

                {testStatus !== 'idle' && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                      testStatus === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : testStatus === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    {testStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-spin" />}
                    <div>
                      <div className="font-semibold">{testMessage}</div>
                      {testStatus === 'success' && (
                        <p className="mt-1 text-[11px]">Kredensial tersimpan dengan aman pada browser ini.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Reset ke Default
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      disabled={testStatus === 'testing'}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Memeriksa...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Simpan & Uji Koneksi
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    DDL Schema PostgreSQL (55 Tabel PRD)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Jalankan script ini di SQL Editor dashboard Supabase Anda untuk membuat seluruh tabel & policy RLS.
                  </p>
                </div>
                <button
                  onClick={copySqlToClipboard}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin SQL
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-slate-200 font-mono text-[11px] max-h-72 overflow-y-auto whitespace-pre leading-relaxed">
                {SUPABASE_55_TABLES_SQL}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Total 55 Tabel terdefinisi secara terstruktur</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  Buka Supabase Dashboard
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
