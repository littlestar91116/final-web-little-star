import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Image as ImageIcon, 
  Film, 
  Filter, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  LogIn, 
  X, 
  Upload, 
  CheckCircle2, 
  Crown,
  ChevronRight,
  ShieldCheck,
  Search,
  ExternalLink,
  UserPlus,
  Sliders,
  Megaphone,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { GalleryItem, ProgramType } from '../../types';
import { Logo } from '../common/Logo';
import { AdmissionRegistrationModal } from './AdmissionRegistrationModal';

export const WHATSAPP_CONSULTATION_URL = "https://wa.me/6282199988769?text=Assalamu’alaikum+warahmatullahi+wabarakatuh.+Selamat+pagi,+Mr/Mrs.+Mohon+izin+menghubungi.+Perkenalkan,+saya+[Nama].+Saya+ingin+menanyakan+informasi+terkait+[keperluan+yang+ingin+ditanyakan]+di+sekolah.+Mohon+informasi+dan+arahannya.+Terima+kasih+atas+waktu+dan+bantuannya.+Wassalamu’alaikum+warahmatullahi+wabarakatuh.";

interface GalleryLandingPageProps {
  onOpenLogin: () => void;
  onEnterDashboard?: () => void;
  onOpenSettings?: () => void;
}

export const GalleryLandingPage: React.FC<GalleryLandingPageProps> = ({ 
  onOpenLogin,
  onEnterDashboard,
  onOpenSettings
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { gallery, addGalleryItem, deleteGalleryItem, toggleTakeDownGalleryItem } = useSchoolData();
  const { settings, getWhatsAppUrl } = useSiteSettings();

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const dynamicWhatsAppUrl = getWhatsAppUrl();

  // Filters
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedMediaItem, setSelectedMediaItem] = useState<GalleryItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Media Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newProgram, setNewProgram] = useState<ProgramType>('sekolah_pagi');
  const [newCategory, setNewCategory] = useState<'kegiatan' | 'prestasi' | 'terapi' | 'outing' | 'projek'>('kegiatan');
  const [newDescription, setNewDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) return;

    addGalleryItem({
      title: newTitle.trim(),
      mediaType: newMediaType,
      mediaUrl: newMediaUrl.trim(),
      program: newProgram,
      category: newCategory,
      description: newDescription.trim(),
      isPublic: newIsPublic,
      hasParentConsent: true
    });

    // Reset Form
    setNewTitle('');
    setNewMediaUrl('');
    setNewDescription('');
    setShowUploadModal(false);
    showNotification('Foto / Video berhasil ditambahkan ke galeri!');
  };

  const handleToggleTakeDown = (item: GalleryItem) => {
    toggleTakeDownGalleryItem(item.id);
    showNotification(
      item.isPublic 
        ? `"${item.title}" berhasil di-take down (status privat).` 
        : `"${item.title}" berhasil dipublikasikan kembali.`
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${title}" secara permanen?`)) {
      deleteGalleryItem(id);
      showNotification(`"${title}" berhasil dihapus.`);
    }
  };

  // Filter items: For public users, only show isPublic === true. Super admin sees all.
  const filteredItems = gallery.filter(item => {
    if (!isSuperAdmin && !item.isPublic) return false;
    if (selectedMediaType !== 'all' && item.mediaType !== selectedMediaType) return false;
    if (selectedProgram !== 'all' && item.program !== selectedProgram) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-sky-50/40 via-white to-amber-50/60 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-amber-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Background Lights - Bright & Cheerful */}
      <div className="fixed -top-32 -right-32 w-140 h-140 bg-gradient-to-bl from-amber-300/40 via-yellow-200/30 to-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed -bottom-32 -left-32 w-140 h-140 bg-gradient-to-tr from-sky-300/35 via-indigo-200/25 to-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-160 h-160 bg-purple-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Playful Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none -z-10" />

      {/* Top Royal Jewel Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 via-sky-400 to-emerald-400 shadow-sm" />

      {/* Dynamic Announcement Ticker (Managed by Super Admin in Pengaturan) */}
      {settings.announcementBarEnabled && settings.announcementBarText && (
        <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 py-2.5 px-4 text-xs font-black text-center flex items-center justify-center gap-2 shadow-sm font-display tracking-wider">
          <Megaphone className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
          <span className="truncate">{settings.announcementBarText}</span>
        </div>
      )}

      {/* Maintenance Mode Banner (if active) */}
      {settings.maintenanceMode && (
        <div className="bg-rose-600 text-white py-2.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{settings.maintenanceMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-amber-200/70 px-4 lg:px-8 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <Logo size="md" showText={true} />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online Admission Registration Button */}
            {settings.showHeroAdmissionBtn && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAdmissionModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-md shadow-amber-400/25 cursor-pointer uppercase tracking-wider shimmer-badge"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                <span>Daftar Siswa (PSB)</span>
              </motion.button>
            )}

            {/* WhatsApp Consultation Link */}
            <a
              href={dynamicWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Tanya WhatsApp</span>
            </a>

            {/* Login / Dashboard Button */}
            {isAuthenticated && currentUser ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onEnterDashboard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 cursor-pointer uppercase tracking-wider"
              >
                <span>Masuk Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/30 cursor-pointer uppercase tracking-wider shimmer-badge"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Masuk ke Sistem</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative px-4 lg:px-8 pt-10 pb-8 max-w-7xl mx-auto w-full text-center space-y-4">
        {/* Floating Twinkle Star Elements */}
        <div className="absolute top-6 left-12 hidden md:block pointer-events-none opacity-80">
          <span className="text-2xl animate-star-twinkle inline-block">✨</span>
        </div>
        <div className="absolute top-12 right-16 hidden md:block pointer-events-none opacity-80">
          <span className="text-2xl animate-bounce-subtle inline-block">⭐</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 text-amber-900 border border-amber-300/80 uppercase tracking-widest shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{settings.heroBadgeText || 'Dokumentasi Resmi Little Star Learning Center'}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight"
        >
          {settings.heroTitle || 'Galeri Foto & Video Pembelajaran Inklusif'}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          {settings.heroSubtitle || 'Membimbing Setiap Bintang Kecil Bersinar Sepenuh Hatinya. Potret kehangatan stimulasi motorik, terapi sensori integrasi, dan kemandirian ananda.'}
        </motion.p>

        {/* Hero CTA Buttons: Online Admission & WhatsApp Consultation */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2 flex flex-wrap justify-center items-center gap-3.5"
        >
          {settings.showHeroAdmissionBtn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdmissionModal(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-400/30 transition-all cursor-pointer shimmer-badge"
            >
              <UserPlus className="w-4.5 h-4.5 text-slate-950" />
              <span>{settings.heroCtaText || 'Daftar Siswa Baru (PSB Online)'}</span>
            </motion.button>
          )}

          {settings.showHeroWhatsAppBtn && (
            <a
              href={dynamicWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Konsultasi WhatsApp Sekolah</span>
            </a>
          )}
        </motion.div>
      </section>

      {/* Super Admin Control Bar (Visible when logged in as Super Admin) */}
      {isSuperAdmin && (
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/60 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-200/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-md">
                <Crown className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-950 font-display uppercase tracking-wider">
                  Mode Manajemen Super Admin Aktif
                </h3>
                <p className="text-[11px] text-amber-900 font-medium">
                  Anda memiliki otoritas penuh untuk mengunggah media baru, men-take down, atau menghapus file dokumentasi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {onOpenSettings && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenSettings}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-black shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Sliders className="w-4 h-4 text-rose-600" />
                  <span>Pengaturan Website</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/25 inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <Upload className="w-4 h-4 text-slate-950" />
                <span>Unggah Foto / Video Baru</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs & Search Bar */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-8 mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-amber-200/80 shadow-md shadow-slate-200/60">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'Semua Media', icon: Sparkles },
              { id: 'image', label: 'Foto Kegiatan', icon: ImageIcon },
              { id: 'video', label: 'Video Pembelajaran', icon: Film }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedMediaType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMediaType(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-amber-50/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Program Select & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-50/50 hover:bg-white border border-amber-200 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-colors"
            >
              <option value="all">Semua Program Sekolah</option>
              <option value="sekolah_pagi">Sekolah Pagi (Inklusif)</option>
              <option value="terapi">Layanan Terapi Terpadu</option>
              <option value="daycare">DayCare Edukatif</option>
              <option value="shadow">Shadow Teacher</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-10 pr-4 py-2.5 rounded-2xl bg-amber-50/50 hover:bg-white focus:bg-white border border-amber-200 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-amber-400 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Gallery Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 pb-16 flex-1">
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-3 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-amber-200 shadow-xs">
            <Film className="w-12 h-12 mx-auto text-amber-300" />
            <div className="text-base font-bold text-slate-800">Tidak ada media yang sesuai filter</div>
            <p className="text-xs text-slate-500">Coba ubah filter kategori atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const isVideo = item.mediaType === 'video';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className={`group relative overflow-hidden rounded-3xl bg-white border transition-all duration-300 shadow-md hover:shadow-2xl ${
                    item.isPublic 
                      ? 'border-amber-200/60 hover:border-amber-400/80 hover:shadow-amber-200/50' 
                      : 'border-rose-300/80 bg-rose-50/20'
                  }`}
                >
                  {/* Media Preview Container */}
                  <div 
                    onClick={() => setSelectedMediaItem(item)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    {isVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 group-hover:scale-105 transition-transform duration-500">
                        {item.mediaUrl.endsWith('.mp4') ? (
                          <video 
                            src={item.mediaUrl}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                            <Film className="w-16 h-16 text-amber-300/40" />
                          </div>
                        )}
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-white/90 text-amber-950 border border-amber-300/70 shadow-sm">
                      {isVideo ? <Film className="w-3 h-3 text-amber-600" /> : <ImageIcon className="w-3 h-3 text-amber-600" />}
                      <span>{isVideo ? 'Video' : 'Foto'}</span>
                    </div>

                    {/* Super Admin Status Badge */}
                    {isSuperAdmin && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                          item.isPublic 
                            ? 'bg-emerald-500/90 text-white border-emerald-400' 
                            : 'bg-rose-500/90 text-white border-rose-400'
                        }`}>
                          {item.isPublic ? 'Tayang Publik' : 'Di-Take Down'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold uppercase tracking-wider text-amber-600 font-display">
                        ★ {item.program.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedMediaItem(item)}
                      className="text-sm font-black text-slate-900 font-display group-hover:text-blue-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Super Admin Action Buttons on Each Card */}
                    {isSuperAdmin && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleTakeDown(item)}
                          className={`flex-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                            item.isPublic 
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {item.isPublic ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                              <span>Take Down</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Publikasikan</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                          title="Hapus Permanen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Sticky WhatsApp Button (Controlled by Super Admin in Settings) */}
      {settings.showFloatingWhatsApp && (
        <div className="fixed bottom-6 right-6 z-40">
          <a
            href={dynamicWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-2xl shadow-emerald-500/40 border border-emerald-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-950"></span>
            </span>
            <MessageCircle className="w-5 h-5 text-slate-950 fill-slate-950" />
            <span className="text-xs uppercase tracking-wider font-display pr-1 hidden sm:inline">
              Tanya WhatsApp
            </span>
          </a>
        </div>
      )}

      {/* Modal: Fullscreen Media Lightbox / Video Player */}
      <AnimatePresence>
        {selectedMediaItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMediaItem(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider font-display">
                    ★ {selectedMediaItem.program.replace('_', ' ')}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{selectedMediaItem.date}</span>
                </div>
                <button
                  onClick={() => setSelectedMediaItem(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Media Player Area */}
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                {selectedMediaItem.mediaType === 'video' ? (
                  selectedMediaItem.mediaUrl.endsWith('.mp4') ? (
                    <video 
                      src={selectedMediaItem.mediaUrl}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[60vh] w-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={selectedMediaItem.mediaUrl}
                      title={selectedMediaItem.title}
                      className="w-full aspect-video max-h-[60vh]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <img
                    src={selectedMediaItem.mediaUrl}
                    alt={selectedMediaItem.title}
                    className="max-h-[60vh] w-full object-contain"
                  />
                )}
              </div>

              {/* Media Details */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display">
                  {selectedMediaItem.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedMediaItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Super Admin Upload Media */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-amber-300 p-6 sm:p-7 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Upload className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 font-display">Unggah Foto / Video Baru</h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Judul Dokumentasi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sesi Terapi Wicara & Motorik Halus..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                      Jenis Media
                    </label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                    >
                      <option value="image">Foto (Gambar)</option>
                      <option value="video">Video (MP4 / Stream)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                      Program Sekolah
                    </label>
                    <select
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                    >
                      <option value="sekolah_pagi">Sekolah Pagi</option>
                      <option value="terapi">Layanan Terapi</option>
                      <option value="daycare">DayCare</option>
                      <option value="shadow">Shadow Teacher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    URL File / Tautan Media
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... atau https://...mp4"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Deskripsi Dokumentasi
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan keterangan aktivitas stimulasi atau momen belajar ananda..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isPublicCheck"
                    checked={newIsPublic}
                    onChange={(e) => setNewIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="isPublicCheck" className="text-xs text-slate-700 font-medium cursor-pointer select-none">
                    Tayangkan langsung di Galeri Publik Little Star
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 shadow-md shadow-amber-400/30 cursor-pointer uppercase tracking-wider"
                  >
                    Simpan & Unggah
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Online Admission Registration */}
      <AdmissionRegistrationModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
      />

      {/* Bright Elegant School Footer */}
      <footer className="mt-auto border-t border-amber-200/70 bg-white/80 backdrop-blur-xl py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={true} />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {settings.schoolName || 'Little Star'} Learning Center. All rights reserved. Membimbing Bintang Kecil Menuju Kemandirian & Prestasi.
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <a href={dynamicWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">
              Kontak Resmi
            </a>
            <span>·</span>
            <button onClick={() => setShowAdmissionModal(true)} className="hover:text-amber-600 transition-colors cursor-pointer">
              Pendaftaran (PSB)
            </button>
            <span>·</span>
            <button onClick={onOpenLogin} className="hover:text-blue-600 transition-colors cursor-pointer">
              Portal Masuk
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
