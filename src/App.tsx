/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { BrandingBanner } from './components/common/BrandingBanner';
import { SupabaseSetupModal } from './components/common/SupabaseSetupModal';

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

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  // If not logged in, render the animated Gallery Landing Page as the initial entry point.
  // The Login button is placed in the top right, opening the LoginModal popup!
  if (!isAuthenticated || !currentUser) {
    return (
      <>
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

        {/* Main Content Viewport with Motion Transitions */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-72 pb-24 lg:pb-12 max-w-full overflow-hidden">
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
          <MainLayout />
        </SiteSettingsProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
