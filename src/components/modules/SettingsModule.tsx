import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Sparkles, 
  Building, 
  Layout, 
  CreditCard, 
  BookOpen, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Globe, 
  Eye, 
  Crown,
  AlertTriangle,
  Megaphone,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings, SiteSettings } from '../../context/SiteSettingsContext';

interface SettingsModuleProps {
  onPreviewLanding?: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onPreviewLanding }) => {
  const { currentUser } = useAuth();
  const { settings, updateSettings, resetSettings } = useSiteSettings();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'branding' | 'landing' | 'admission' | 'programs' | 'contact' | 'system'>('branding');
  const [formState, setFormState] = useState<SiteSettings>({ ...settings });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync if settings update
  React.useEffect(() => {
    setFormState({ ...settings });
  }, [settings]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-3xl border border-rose-200 space-y-3">
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-500" />
        <h3 className="text-base font-black">Akses Ditolak: Khusus Super Admin</h3>
        <p className="text-xs text-rose-700">
          Halaman Pengaturan Website ini hanya dapat diakses dan diubah oleh akun dengan otoritas Super Admin.
        </p>
      </div>
    );
  }

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formState);
    showNotification('Seluruh pengaturan website berhasil diperbarui dan langsung aktif!');
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh pengaturan website ke pengaturan awal pabrik?')) {
      resetSettings();
      showNotification('Pengaturan website telah dikembalikan ke kondisi default pabrik.');
    }
  };

  const tabs = [
    { id: 'branding', label: 'Identitas & Branding', icon: Building },
    { id: 'landing', label: 'Layar Awal & Hero', icon: Layout },
    { id: 'admission', label: 'Biaya & Rekening PSB', icon: CreditCard },
    { id: 'programs', label: 'Program & Tarif', icon: BookOpen },
    { id: 'contact', label: 'Kontak & WhatsApp', icon: Phone },
    { id: 'system', label: 'Mode Sistem & Reset', icon: ShieldAlert }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2.5 border border-emerald-400"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <Crown className="w-3.5 h-3.5 inline mr-1 fill-slate-950" />
              Otoritas Tertinggi Super Admin
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">CMS Master Controller</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            Pusat Pengaturan Website (Site Customizer)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium">
            Ubah identitas sekolah, teks landing page, nominal biaya & rekening PSB, kontak WhatsApp resmi, pengumuman berjalan, hingga mode sistem. Perubahan yang Anda simpan langsung aktif seketika di seluruh tampilan website.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          {onPreviewLanding && (
            <button
              type="button"
              onClick={onPreviewLanding}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-300/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat Tampilan Web</span>
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSaveAll()}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Simpan Perubahan</span>
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-black scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* TAB 1: BRANDING & IDENTITAS */}
          {activeTab === 'branding' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Identitas & Branding Sekolah</h3>
                <p className="text-xs text-slate-500">Nama sekolah, unit pendidikan, slogan resmi, dan deskripsi institusi.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Nama Institusi Utama
                  </label>
                  <input
                    type="text"
                    value={formState.schoolName}
                    onChange={(e) => setFormState({ ...formState, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Contoh: LITTLE STAR</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Unit / Sub-Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={formState.schoolUnit}
                    onChange={(e) => setFormState({ ...formState, schoolUnit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Contoh: LEARNING CENTER</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Slogan / Tagline Resmi
                </label>
                <input
                  type="text"
                  value={formState.tagline}
                  onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Deskripsi / Profil Singkat Sekolah
                </label>
                <textarea
                  rows={3}
                  value={formState.schoolDescription}
                  onChange={(e) => setFormState({ ...formState, schoolDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    URL File Logo Sekolah
                  </label>
                  <input
                    type="text"
                    value={formState.logoUrl}
                    onChange={(e) => setFormState({ ...formState, logoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Tema Nuansa Warna Utama
                  </label>
                  <select
                    value={formState.accentTheme}
                    onChange={(e) => setFormState({ ...formState, accentTheme: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="royal_gold">Royal Jewel & Gold (Emas Mewah)</option>
                    <option value="sapphire_blue">Sapphire Ocean Blue (Biru Mewah)</option>
                    <option value="emerald_luxury">Emerald Green (Zamrud Mewah)</option>
                    <option value="ruby_rose">Ruby & Rose Gold (Elegan)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LAYAR AWAL & HERO */}
          {activeTab === 'landing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Kustomisasi Layar Awal (Landing Page)</h3>
                <p className="text-xs text-slate-500">Sesuaikan teks hero showcase, pengumuman berjalan, dan opsi tombol.</p>
              </div>

              {/* Announcement Bar Toggle & Text */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4.5 h-4.5 text-amber-600" />
                    <div>
                      <div className="text-xs font-black text-slate-900 font-display">Banner Pengumuman Berjalan (Top Ticker)</div>
                      <div className="text-[10px] text-slate-500">Tampilkan teks kabar penting di bagian paling atas website</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.announcementBarEnabled}
                      onChange={(e) => setFormState({ ...formState, announcementBarEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {formState.announcementBarEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Isi Teks Pengumuman
                    </label>
                    <input
                      type="text"
                      value={formState.announcementBarText}
                      onChange={(e) => setFormState({ ...formState, announcementBarText: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs bg-white text-slate-900 outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Badge Label Atas Hero
                </label>
                <input
                  type="text"
                  value={formState.heroBadgeText}
                  onChange={(e) => setFormState({ ...formState, heroBadgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Judul Utama Hero (Heading)
                </label>
                <input
                  type="text"
                  value={formState.heroTitle}
                  onChange={(e) => setFormState({ ...formState, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Sub-Judul Hero (Deskripsi Singkat)
                </label>
                <textarea
                  rows={2}
                  value={formState.heroSubtitle}
                  onChange={(e) => setFormState({ ...formState, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Teks Tombol Pendaftaran Hero CTA
                  </label>
                  <input
                    type="text"
                    value={formState.heroCtaText}
                    onChange={(e) => setFormState({ ...formState, heroCtaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-700 font-display">Visibilitas Tombol & Komponen</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Tombol Pendaftaran Online (PSB)</span>
                    <input
                      type="checkbox"
                      checked={formState.showHeroAdmissionBtn}
                      onChange={(e) => setFormState({ ...formState, showHeroAdmissionBtn: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Tombol WhatsApp di Layar Hero</span>
                    <input
                      type="checkbox"
                      checked={formState.showHeroWhatsAppBtn}
                      onChange={(e) => setFormState({ ...formState, showHeroWhatsAppBtn: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Tombol WhatsApp Melayang (Floating Kanan Bawah)</span>
                    <input
                      type="checkbox"
                      checked={formState.showFloatingWhatsApp}
                      onChange={(e) => setFormState({ ...formState, showFloatingWhatsApp: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Tampilkan Seksi Testimoni Orang Tua</span>
                    <input
                      type="checkbox"
                      checked={formState.showTestimonialsSection}
                      onChange={(e) => setFormState({ ...formState, showTestimonialsSection: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BIAYA & REKENING PSB */}
          {activeTab === 'admission' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Biaya & Rekening Pembayaran PSB</h3>
                <p className="text-xs text-slate-500">Konfigurasi nominal formulir dan rekening tujuan transfer calon wali murid.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 font-display">Status Pendaftaran Online (PSB)</div>
                  <div className="text-[10px] text-slate-500">Jika ditutup, formulir pendaftaran di layar awal akan berstatus ditutup sementara</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, admissionIsOpen: !formState.admissionIsOpen })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    formState.admissionIsOpen
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                  }`}
                >
                  {formState.admissionIsOpen ? '✓ Pendaftaran DIBUKA' : '✕ Pendaftaran DITUTUP'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Nominal Biaya Pendaftaran & Observasi (Rp)
                  </label>
                  <input
                    type="number"
                    value={formState.admissionFee}
                    onChange={(e) => setFormState({ ...formState, admissionFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Terformat: Rp {formState.admissionFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Nama Bank Tujuan
                  </label>
                  <input
                    type="text"
                    value={formState.bankName}
                    onChange={(e) => setFormState({ ...formState, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Contoh: BCA / Mandiri / BSI</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Nomor Rekening Bank
                  </label>
                  <input
                    type="text"
                    value={formState.bankAccountNumber}
                    onChange={(e) => setFormState({ ...formState, bankAccountNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Atas Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    value={formState.bankAccountHolder}
                    onChange={(e) => setFormState({ ...formState, bankAccountHolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROGRAM & TARIF */}
          {activeTab === 'programs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Program & Biaya Pendidikan</h3>
                <p className="text-xs text-slate-500">Ubah label nama tampilan dan standar tarif biaya keempat pilar program sekolah.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'sekolah_pagi', defaultName: 'Sekolah Pagi', icon: '🏫' },
                  { key: 'terapi', defaultName: 'Layanan Terapi', icon: '🧩' },
                  { key: 'daycare', defaultName: 'DayCare', icon: '🧸' },
                  { key: 'shadow', defaultName: 'Shadow Teacher', icon: '🤝' }
                ].map(item => {
                  const k = item.key as keyof typeof formState.programNames;
                  return (
                    <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-slate-500 uppercase font-display">
                            Nama Program
                          </label>
                          <input
                            type="text"
                            value={formState.programNames[k]}
                            onChange={(e) => setFormState({
                              ...formState,
                              programNames: { ...formState.programNames, [k]: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase font-display">
                          Standar Tarif / Biaya
                        </label>
                        <input
                          type="text"
                          value={formState.programFees[k]}
                          onChange={(e) => setFormState({
                            ...formState,
                            programFees: { ...formState.programFees, [k]: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 5: KONTAK & WHATSAPP */}
          {activeTab === 'contact' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Kontak & Template Pesan WhatsApp</h3>
                <p className="text-xs text-slate-500">Sesuaikan nomor hotline WhatsApp resmi dan redaksi pesan otomatis saat wali murid klik konsultasi.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Nomor WhatsApp Resmi (Format Internasional)
                  </label>
                  <input
                    type="text"
                    placeholder="6282199988769"
                    value={formState.whatsappNumber}
                    onChange={(e) => setFormState({ ...formState, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Awali dengan kode negara 62 tanpa spasi atau strip</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Telepon Kantor / CS
                  </label>
                  <input
                    type="text"
                    value={formState.contactPhone}
                    onChange={(e) => setFormState({ ...formState, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Template Teks Pesan WhatsApp Konsultasi
                </label>
                <textarea
                  rows={4}
                  value={formState.whatsappDefaultMessage}
                  onChange={(e) => setFormState({ ...formState, whatsappDefaultMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Pesan ini akan otomatis terisi saat pengunjung mengklik tombol WhatsApp di manapun pada website.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Alamat Email Resmi Sekolah
                  </label>
                  <input
                    type="email"
                    value={formState.schoolEmail}
                    onChange={(e) => setFormState({ ...formState, schoolEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Jam Operasional Layanan
                  </label>
                  <input
                    type="text"
                    value={formState.schoolOperatingHours}
                    onChange={(e) => setFormState({ ...formState, schoolOperatingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Alamat Fisik Gedung Sekolah
                </label>
                <input
                  type="text"
                  value={formState.schoolAddress}
                  onChange={(e) => setFormState({ ...formState, schoolAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 6: MODE SISTEM & RESET */}
          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Mode Sistem & Keamanan</h3>
                <p className="text-xs text-slate-500">Pengaturan mode darurat/pemeliharaan serta opsi reset ke setelan pabrik.</p>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <div>
                      <div className="text-xs font-black text-slate-900 font-display">Mode Pemeliharaan (Maintenance Mode)</div>
                      <div className="text-[10px] text-slate-500">Jika aktif, pengunjung publik akan diarahkan ke layar pemberitahuan pemeliharaan</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.maintenanceMode}
                      onChange={(e) => setFormState({ ...formState, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {formState.maintenanceMode && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pesan Pemberitahuan Pemeliharaan
                    </label>
                    <textarea
                      rows={2}
                      value={formState.maintenanceMessage}
                      onChange={(e) => setFormState({ ...formState, maintenanceMessage: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-xs bg-white text-slate-900 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Factory Reset Action */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-black text-slate-900 font-display">Kembalikan ke Pengaturan Awal (Reset Factory)</div>
                  <p className="text-[11px] text-slate-600 max-w-lg leading-relaxed">
                    Menghapus seluruh kustomisasi dan mengembalikan teks, nomor kontak, serta konfigurasi website ke pengaturan default bawaan Little Star.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Setelan Pabrik</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Form Submit Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Perubahan disimpan persisten di browser & langsung berdampak ke seluruh halaman.
            </span>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>Simpan Perubahan Pengaturan</span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
