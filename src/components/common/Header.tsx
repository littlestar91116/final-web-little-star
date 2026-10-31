import React, { useState } from 'react';
import { Bell, Database, Menu, ChevronDown, LogOut, KeyRound, Sparkles, Shield, User, Sliders } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { getSupabaseConfig } from '../../lib/supabase';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSupabaseModal: () => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSupabaseModal,
  activeModule,
  setActiveModule
}) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationAsRead, isSyncing } = useSchoolData();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const supabaseConfig = getSupabaseConfig();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!currentUser) return null;

  // Role color config for luxury feel
  const roleBadgeConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    super_admin: { label: 'Super Admin', bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/20', text: 'text-amber-800', border: 'border-amber-300' },
    admin_sekolah: { label: 'Admin TU & PSB', bg: 'bg-gradient-to-r from-blue-500/15 to-indigo-500/20', text: 'text-blue-800', border: 'border-blue-300' },
    kepala_sekolah: { label: 'Kepala Sekolah', bg: 'bg-gradient-to-r from-purple-500/15 to-fuchsia-500/20', text: 'text-purple-800', border: 'border-purple-300' },
    guru_sekolah_pagi: { label: 'Guru Pagi', bg: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/20', text: 'text-emerald-800', border: 'border-emerald-300' },
    terapis: { label: 'Terapis', bg: 'bg-gradient-to-r from-cyan-500/15 to-sky-500/20', text: 'text-cyan-800', border: 'border-cyan-300' },
    shadow_teacher: { label: 'Shadow Teacher', bg: 'bg-gradient-to-r from-indigo-500/15 to-blue-500/20', text: 'text-indigo-800', border: 'border-indigo-300' },
    daycare_teacher: { label: 'Guru DayCare', bg: 'bg-gradient-to-r from-amber-500/15 to-orange-500/20', text: 'text-orange-800', border: 'border-orange-300' },
    wali_murid: { label: 'Wali Murid', bg: 'bg-gradient-to-r from-rose-500/15 to-pink-500/20', text: 'text-rose-800', border: 'border-rose-300' },
    calon_wali_murid: { label: 'Calon Wali', bg: 'bg-gradient-to-r from-slate-500/15 to-gray-500/20', text: 'text-slate-800', border: 'border-slate-300' }
  };

  const currentRoleInfo = roleBadgeConfig[currentUser.role] || {
    label: currentUser.role.replace(/_/g, ' '),
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-amber-200/40 shadow-xs transition-all">
      {/* Top Royal Jewel Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 via-sky-400 to-emerald-400" />

      <div className="flex items-center justify-between gap-4 md:gap-8 max-w-7xl mx-auto px-4 lg:px-8 py-3">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-amber-50/70 border border-transparent hover:border-amber-200 transition-all cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => setActiveModule('dashboard')} 
            className="cursor-pointer"
          >
            <Logo size="md" showText={true} />
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-2 text-xs font-bold">
          {currentUser.role === 'wali_murid' ? (
            <>
              {[
                { id: 'dashboard', label: 'Dashboard Ananda' },
                { id: 'parent_schedule', label: 'Jadwal & Absen' },
                { id: 'finance', label: 'Tagihan SPP' },
                { id: 'sdr', label: 'Report SDR' },
                { id: 'consultations', label: 'Konsultasi' }
              ].map((item) => {
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20 font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'admissions', label: 'PSB & Observasi' },
                { id: 'students', label: 'Data Siswa' },
                { id: 'sdr', label: 'Rekam SDR' },
                { id: 'finance', label: 'SPP & Keuangan' }
              ].map((item) => {
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20 font-bold'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              {currentUser.role === 'super_admin' && (
                <button
                  onClick={() => setActiveModule('users')}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeModule === 'users'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/60'
                  }`}
                >
                  Manajemen Akun
                </button>
              )}
            </>
          )}
        </nav>

        {/* Zone 3: Actions (Supabase, Notifications, User Menu & Logout) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Supabase Status / Setup Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
              supabaseConfig.isConnected
                ? isSyncing 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300 hover:shadow-emerald-500/20'
                : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Koneksi Supabase & Sinkronisasi Otomatis"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${supabaseConfig.isConnected ? (isSyncing ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${supabaseConfig.isConnected ? (isSyncing ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-400'}`}></span>
            </span>
            <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConnected ? (isSyncing ? 'text-amber-600 animate-spin' : 'text-emerald-600') : 'text-slate-500'}`} />
            <span className="whitespace-nowrap">
              {supabaseConfig.isConnected ? (isSyncing ? 'Menyinkronkan...' : 'Auto-Sync Aktif') : 'Setup Supabase'}
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className={`relative p-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 border border-slate-200/70 hover:border-amber-300 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                unreadCount > 0 ? 'animate-bell-ring' : ''
              }`}
              aria-label="Pemberitahuan"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-1 text-[9px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/60 p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">Notifikasi Sistem</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{unreadCount} baru</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl text-xs transition-all cursor-pointer border ${
                        n.isRead 
                          ? 'bg-slate-50/70 border-slate-100 text-slate-600 hover:bg-slate-100/70' 
                          : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200/70 text-blue-950 font-medium shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account & Logout Control */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white/90 hover:bg-amber-50/50 transition-all border border-amber-300/60 shadow-xs hover:shadow-md hover:shadow-amber-500/10 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-amber-400/90 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${currentRoleInfo.bg} ${currentRoleInfo.text} ${currentRoleInfo.border} mt-0.5 inline-block w-fit`}>
                  {currentRoleInfo.label}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-68 max-w-xs bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/70 py-2.5 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <div className="font-extrabold text-xs text-slate-900 font-display">{currentUser.name}</div>
                  <div className="text-[11px] font-mono text-indigo-700 font-bold">@{currentUser.username}</div>
                  <div className="mt-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleInfo.bg} ${currentRoleInfo.text} ${currentRoleInfo.border}`}>
                      {currentRoleInfo.label}
                    </span>
                  </div>
                </div>

                {currentUser.role === 'super_admin' && (
                  <>
                    <button
                      onClick={() => {
                        setActiveModule('settings');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-rose-600" />
                      <span>Pengaturan Website</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModule('users');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Manajemen Akun & Password</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 border-t border-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
