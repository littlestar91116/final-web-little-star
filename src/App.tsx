/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider, useSchoolData } from './context/SchoolDataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { BrandingBanner } from './components/common/BrandingBanner';
import { SupabaseSetupModal } from './components/common/SupabaseSetupModal';
import { AccountFrozenModal } from './components/auth/AccountFrozenModal';
import { checkAccountLockStatus } from './lib/accountLockService';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PrincipalDashboard } from './components/dashboard/PrincipalDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';

// Modules
import { AdmissionsModule } from './components/modules/AdmissionsModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { StaffModule } from './components/modules/StaffModule';
import { ProgramsModule } from './components/modules/ProgramsModule';
import { TasksModule } from './components/modules/TasksModule';
import { CasesModule } from './components/modules/CasesModule';
import { SDRModule } from './components/modules/SDRModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { GalleryModule } from './components/modules/GalleryModule';
import { UsersModule } from './components/modules/UsersModule';
import { ParentScheduleModule } from './components/modules/ParentScheduleModule';
import { ParentConsultationModule } from './components/modules/ParentConsultationModule';
import { GalleryLandingPage } from './components/landing/GalleryLandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { SettingsModule } from './components/modules/SettingsModule';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { LogoIntroBackground } from './components/common/LogoIntroBackground';

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isLoading, authError, logout } = useAuth();
  const { invoices } = useSchoolData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showActiveFrozenPopup, setShowActiveFrozenPopup] = useState(true);

  // Wait for session restoration from Supabase Auth / storage to prevent redirect loops or flickering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-amber-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center animate-bounce shadow-xl shadow-amber-500/30 border border-amber-300">
            <span className="text-slate-950 font-black text-2xl">★</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-black text-amber-300 tracking-wider font-display uppercase">LITTLE STAR LEARNING CENTER</p>
            <p className="text-xs text-slate-400 font-medium">Memulihkan sesi akun & sinkronisasi data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, render the animated Gallery Landing Page as the initial entry point.
  // The Login button is placed in the top right, opening the LoginModal popup!
  if (!isAuthenticated || !currentUser) {
    return (
      <>
        {authError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-900/90 text-white border border-rose-500 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-md">
            {authError}
          </div>
        )}
        <GalleryLandingPage 
          onOpenLogin={() => setLoginModalOpen(true)} 
        />
        <LoginModal 
          isOpen={loginModalOpen} 
          onClose={() => setLoginModalOpen(false)} 
        />
      </>
    );
  }

  // Check if active parent account is locked / frozen due to unpaid SPP starting from 1st of month
  const activeLockStatus = (currentUser.role === 'wali_murid')
    ? checkAccountLockStatus(currentUser, invoices)
    : null;

  if (activeLockStatus?.isLocked) {
    return (
      <>
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center space-y-4 border-2 border-rose-300 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-black">
              🔒
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Akun Terkunci Otomatis (SPP Belum Bayar)
              </h2>
              <p className="text-xs text-rose-700 font-medium mt-1 leading-relaxed">
                Mulai tanggal 1 tiap bulannya, hak akses masuk akun wali murid terkunci otomatis karena terdapat tagihan SPP ananda yang belum diselesaikan.
              </p>
            </div>
            <button
              onClick={() => setShowActiveFrozenPopup(true)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Bayar / Unggah Bukti Bayar Sekarang
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>

        <AccountFrozenModal
          isOpen={showActiveFrozenPopup}
          onClose={() => setShowActiveFrozenPopup(false)}
          lockStatus={activeLockStatus}
          onPaymentSuccess={() => {
            setShowActiveFrozenPopup(false);
          }}
        />
      </>
    );
  }

  // Render role-appropriate dashboard view
  const renderDashboardView = () => {
    switch (currentUser.role) {
      case 'super_admin':
      case 'admin_sekolah':
        return <AdminDashboard setActiveModule={setActiveModule} />;
      case 'kepala_sekolah':
        return <PrincipalDashboard setActiveModule={setActiveModule} />;
      case 'guru_sekolah_pagi':
      case 'terapis':
      case 'shadow_teacher':
      case 'daycare_teacher':
        return <TeacherDashboard setActiveModule={setActiveModule} />;
      case 'wali_murid':
        return <ParentDashboard setActiveModule={setActiveModule} />;
      case 'calon_wali_murid':
        return <AdmissionsModule />;
      case 'staff_keuangan':
        return <FinanceModule />;
      default:
        return <AdminDashboard setActiveModule={setActiveModule} />;
    }
  };

  // Render selected module based on role and active module
  const renderActiveModule = () => {
    // STRICTURE: Wali Murid can ONLY access their own child's modules:
    // 1. Dashboard Ananda
    // 2. Jadwal & Absen Siswa
    // 3. Tagihan Siswa (SPP)
    // 4. Report Siswa (SDR)
    // 5. Pengajuan Supervisi / Konsultasi
    if (currentUser.role === 'wali_murid') {
      switch (activeModule) {
        case 'dashboard':
          return (
            <>
              <BrandingBanner />
              {renderDashboardView()}
            </>
          );
        case 'parent_schedule':
        case 'schedule':
          return <ParentScheduleModule />;
        case 'finance':
          return <FinanceModule />;
        case 'sdr':
        case 'comparison':
          return <SDRModule />;
        case 'consultations':
          return <ParentConsultationModule />;
        default:
          return (
            <div className="bg-white p-8 rounded-2xl border border-amber-200 text-center max-w-lg mx-auto my-12 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                🔒
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hak Akses Khusus Wali Murid</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Akun wali murid hanya memiliki otorisasi untuk mengakses Jadwal & Absen, Tagihan SPP, Rapor SDR, serta Pengajuan Konsultasi khusus untuk ananda tercinta.
                </p>
              </div>
              <button
                onClick={() => setActiveModule('dashboard')}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Kembali ke Dashboard Ananda
              </button>
            </div>
          );
      }
    }

    // Default modules for Super Admin, Teachers, and Staff
    switch (activeModule) {
      case 'dashboard':
        return (
          <>
            <BrandingBanner />
            {renderDashboardView()}
          </>
        );
      case 'admissions':
      case 'observations':
        return <AdmissionsModule />;
      case 'students':
        return <StudentsModule />;
      case 'staff':
        return <StaffModule />;
      case 'programs':
        return <ProgramsModule />;
      case 'tasks':
      case 'schedule':
        return <TasksModule />;
      case 'cases':
        return <CasesModule />;
      case 'supervision':
        return <PrincipalDashboard setActiveModule={setActiveModule} />;
      case 'sdr':
      case 'comparison':
        return <SDRModule />;
      case 'finance':
        return <FinanceModule />;
      case 'parent_schedule':
        return <ParentScheduleModule />;
      case 'consultations':
        return <ParentConsultationModule />;
      case 'gallery':
        return <GalleryModule onOpenLanding={() => setActiveModule('gallery_public')} />;
      case 'gallery_public':
        return (
          <div className="-m-4 lg:-m-8 -mb-24 lg:-mb-12">
            <GalleryLandingPage
              onOpenLogin={() => {}}
              onEnterDashboard={() => setActiveModule('dashboard')}
              onOpenSettings={() => setActiveModule('settings')}
            />
          </div>
        );
      case 'users':
        return currentUser.role === 'super_admin' ? (
          <UsersModule />
        ) : (
          <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
            Akses Ditolak: Modul ini hanya dapat diakses oleh Super Admin.
          </div>
        );
      case 'settings':
        return currentUser.role === 'super_admin' ? (
          <SettingsModule onPreviewLanding={() => setActiveModule('gallery_public')} />
        ) : (
          <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
            Akses Ditolak: Modul ini hanya dapat diakses oleh Super Admin.
          </div>
        );
      default:
        return (
          <>
            <BrandingBanner />
            {renderDashboardView()}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/25 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-amber-950">
      {/* Dynamic Ambient Luxury Lighting Orbs */}
      <div className="fixed -top-24 -right-24 w-120 h-120 bg-gradient-to-bl from-amber-400/10 via-yellow-300/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-24 -left-24 w-140 h-140 bg-gradient-to-tr from-blue-600/8 via-indigo-500/6 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-160 h-160 bg-purple-500/4 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        />

        {/* Main Content Viewport with Motion Transitions - Responsive for Phone & Laptop */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 lg:ml-72 pb-28 lg:pb-12 max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />

      {/* Supabase 55-Table Setup & Sync Modal */}
      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SchoolDataProvider>
        <SiteSettingsProvider>
          <LogoIntroBackground />
          <MainLayout />
        </SiteSettingsProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
