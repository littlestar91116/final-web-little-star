import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Eye, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  CheckSquare, 
  AlertTriangle, 
  Award, 
  FileSpreadsheet, 
  BarChart3, 
  CreditCard, 
  Image as ImageIcon, 
  Database,
  Smartphone,
  X,
  Sparkles,
  KeyRound,
  LogOut,
  MessageSquare,
  Crown,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  onOpenSupabaseModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeModule,
  setActiveModule,
  onOpenSupabaseModal
}) => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role || 'super_admin';

  // Strict Menu for Wali Murid (Parent): Only permitted 5 modules
  const parentMenuSections = [
    {
      title: 'Portal Ananda',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      items: [
        { id: 'dashboard', label: 'Dashboard Ananda', icon: LayoutDashboard, color: 'text-rose-500 bg-rose-50' },
        { id: 'parent_schedule', label: 'Jadwal & Absen Siswa', icon: CalendarDays, color: 'text-amber-500 bg-amber-50' },
        { id: 'finance', label: 'Tagihan Siswa (SPP)', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50' },
        { id: 'sdr', label: 'Report Siswa (SDR)', icon: FileSpreadsheet, color: 'text-indigo-500 bg-indigo-50' },
        { id: 'consultations', label: 'Pengajuan Supervisi / Konsultasi', icon: MessageSquare, color: 'text-purple-500 bg-purple-50' }
      ]
    }
  ];

  // Menu for Staff & Super Admin
  const defaultMenuSections = [
    {
      title: 'Utama',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      items: [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, roles: ['*'], color: 'text-blue-600 bg-blue-50' }
      ]
    },
    {
      title: 'Penerimaan Siswa (PSB)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      items: [
        { id: 'admissions', label: 'Pendaftaran Siswa Baru', icon: UserPlus, roles: ['*'], color: 'text-amber-600 bg-amber-50' },
        { id: 'observations', label: 'Jadwal & Observasi', icon: Eye, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'terapis', 'calon_wali_murid'], color: 'text-orange-600 bg-orange-50' }
      ]
    },
    {
      title: 'Akademik & Siswa',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      items: [
        { id: 'students', label: 'Database Siswa', icon: Users, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher', 'daycare_teacher'], color: 'text-emerald-600 bg-emerald-50' },
        { id: 'staff', label: 'Guru & Pegawai', icon: GraduationCap, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah'], color: 'text-teal-600 bg-teal-50' },
        { id: 'programs', label: 'Program Sekolah (4)', icon: BookOpen, roles: ['*'], color: 'text-cyan-600 bg-cyan-50' },
        { id: 'schedule', label: 'Jadwal & Absensi Guru', icon: CalendarDays, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher', 'daycare_teacher'], color: 'text-sky-600 bg-sky-50' }
      ]
    },
    {
      title: 'Pembelajaran & Kasus',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      items: [
        { id: 'tasks', label: 'Manajemen Tugas Guru', icon: CheckSquare, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher', 'daycare_teacher'], color: 'text-purple-600 bg-purple-50' },
        { id: 'cases', label: 'Laporan Kasus Siswa', icon: AlertTriangle, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher', 'daycare_teacher'], color: 'text-rose-600 bg-rose-50' },
        { id: 'supervision', label: 'Supervisi Kepala Sekolah', icon: Award, roles: ['super_admin', 'kepala_sekolah'], color: 'text-fuchsia-600 bg-fuchsia-50' }
      ]
    },
    {
      title: 'Rekam Perkembangan (SDR)',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      items: [
        { id: 'sdr', label: 'Student Dev Record', icon: FileSpreadsheet, roles: ['*'], color: 'text-indigo-600 bg-indigo-50' },
        { id: 'comparison', label: 'Dev Comparison & Evaluasi', icon: BarChart3, roles: ['super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher'], color: 'text-blue-600 bg-blue-50' }
      ]
    },
    {
      title: 'Administrasi & Media',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      items: [
        { id: 'finance', label: 'Keuangan & SPP', icon: CreditCard, roles: ['super_admin', 'admin_sekolah', 'staff_keuangan'], color: 'text-emerald-600 bg-emerald-50' },
        { id: 'gallery', label: 'Galeri & Testimoni', icon: ImageIcon, roles: ['*'], color: 'text-violet-600 bg-violet-50' },
        { id: 'users', label: 'Manajemen Akun Login', icon: KeyRound, roles: ['super_admin'], color: 'text-amber-600 bg-amber-50' },
        { id: 'settings', label: 'Pengaturan Website', icon: Sliders, roles: ['super_admin'], color: 'text-rose-600 bg-rose-50' }
      ]
    }
  ];

  const activeMenuSections = role === 'wali_murid' ? parentMenuSections : defaultMenuSections;

  const handleNavClick = (id: string) => {
    setActiveModule(id);
    onClose();
  };

  const handleInstallPWA = () => {
    alert('Aplikasi Little Star Management siap diinstal sebagai Progressive Web App! Pada Android/Chrome, klik ikon "Install" di bilah browser atau menu ⋮ > "Tambahkan ke Layar Utama". Pada iOS Safari, klik ikon Bagikan (Share) > "Tambah ke Layar Utama".');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-amber-200/50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-amber-200/40 flex items-center justify-between bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-transparent">
          <div onClick={() => handleNavClick('dashboard')} className="cursor-pointer">
            <Logo size="sm" showText={true} />
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {activeMenuSections.map((sec, idx) => {
            const visibleItems = sec.items.filter(item => 
              !(item as any).roles || (item as any).roles.includes('*') || (item as any).roles.includes(role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-display">
                    {sec.title}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                </div>
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-lg shadow-blue-600/25 scale-[1.01]'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          isActive 
                            ? 'bg-white/20 text-white shadow-inner' 
                            : `${item.color} shadow-2xs`
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-300 shrink-0 ml-1 animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Actions: Supabase, PWA install & Logout */}
        <div className="p-3.5 border-t border-amber-200/40 space-y-2 bg-gradient-to-b from-white/60 to-amber-50/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSupabaseModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-white/90 border border-slate-200/80 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status Database</span>
            </span>
            <span className="text-[10px] bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-200">55 Tabel</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleInstallPWA}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 transition-all shadow-sm hover:shadow-md hover:shadow-amber-500/20 cursor-pointer uppercase tracking-wider"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-950" />
            <span>Pasang Aplikasi (PWA)</span>
          </motion.button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 bg-white/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>

          <div className="text-[10px] text-center text-slate-400 pt-1 font-medium">
            Little Star Learning Center © 2026
          </div>
        </div>
      </aside>
    </>
  );
};
