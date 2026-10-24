import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Crown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ProgramType } from '../../types';

interface AdminDashboardProps {
  setActiveModule: (mod: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveModule }) => {
  const { students, staff, admissions, invoices, tasks, cases, verifyAdmissionPayment } = useSchoolData();

  // Metrics calculation
  const activeStudents = students.filter(s => s.status === 'aktif');
  const pendingAdmissions = admissions.filter(a => a.paymentStatus === 'menunggu_verifikasi');
  const pendingInvoices = invoices.filter(i => i.status === 'menunggu_verifikasi');
  const openCases = cases.filter(c => c.status !== 'selesai');
  const scheduledObservations = admissions.filter(a => a.observationStatus === 'terjadwal');

  // Distribution by program
  const programCounts: Record<ProgramType, number> = {
    sekolah_pagi: students.filter(s => s.enrolledPrograms.includes('sekolah_pagi')).length,
    terapi: students.filter(s => s.enrolledPrograms.includes('terapi')).length,
    daycare: students.filter(s => s.enrolledPrograms.includes('daycare')).length,
    shadow: students.filter(s => s.enrolledPrograms.includes('shadow')).length
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 4-Stat Luxury Jewel Metric Row with Staggered Motion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Siswa Aktif (Sapphire) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-blue-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-500/15 transition-shadow cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900/60 font-display">Total Siswa Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:rotate-6 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{activeStudents.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +2 baru
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Terdaftar di 4 program inklusif</span>
          </div>
        </motion.div>

        {/* Metric 2: Calon Siswa PSB (Gold Amber) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-amber-300/80 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-500/15 transition-shadow cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900/60 font-display">Calon Siswa (PSB)</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:rotate-6 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{admissions.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-600" /> {pendingAdmissions.length} verifikasi
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{scheduledObservations.length} jadwal observasi siap</span>
          </div>
        </motion.div>

        {/* Metric 3: Guru & Terapis (Emerald) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-500/15 transition-shadow cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900/60 font-display">Guru & Terapis</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:rotate-6 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{staff.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Hadir
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Wali kelas, terapis & pendamping</span>
          </div>
        </motion.div>

        {/* Metric 4: Verifikasi SPP (Rose Ruby) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-lg shadow-rose-900/5 hover:shadow-xl hover:shadow-rose-500/15 transition-shadow cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-900/60 font-display">Verifikasi SPP</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:rotate-6 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{pendingInvoices.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Menunggu cek
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Dari 4 kategori SPP terpisah</span>
          </div>
        </motion.div>
      </div>

      {/* Program Distribution Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/90 backdrop-blur-xl rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xl shadow-indigo-950/5 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="text-base font-black text-slate-900 font-display tracking-tight">
                Distribusi Siswa Menurut Program Pendidikan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap siswa Little Star dapat terdaftar pada lebih dari 1 program (Multi-Enrollment)
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveModule('programs')}
            className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer w-fit uppercase tracking-wider"
          >
            <span>Detail Program</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Program 1 */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white border border-blue-200/80 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-blue-800 block font-display">Sekolah Pagi</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums font-display">{programCounts.sekolah_pagi} Siswa</span>
              <span className="text-[10px] text-blue-600 font-semibold block mt-1">Usia 2 - 6 Tahun</span>
            </div>
            <div className="text-blue-600 bg-white p-3 rounded-2xl shadow-xs border border-blue-100">
              <BookOpen className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Program 2 */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border border-emerald-200/80 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-emerald-800 block font-display">Layanan Terapi</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums font-display">{programCounts.terapi} Siswa</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Wicara & Sensori</span>
            </div>
            <div className="text-emerald-600 bg-white p-3 rounded-2xl shadow-xs border border-emerald-100">
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Program 3 */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-white border border-amber-200/80 flex items-center justify-between hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-amber-800 block font-display">DayCare Edukatif</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums font-display">{programCounts.daycare} Siswa</span>
              <span className="text-[10px] text-amber-600 font-semibold block mt-1">Pengasuhan Penuh Kasih</span>
            </div>
            <div className="text-amber-600 bg-white p-3 rounded-2xl shadow-xs border border-amber-100">
              <Calendar className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Program 4 */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4.5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-white border border-purple-200/80 flex items-center justify-between hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-purple-800 block font-display">Shadow Teacher</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums font-display">{programCounts.shadow} Siswa</span>
              <span className="text-[10px] text-purple-600 font-semibold block mt-1">Pendampingan 1-on-1</span>
            </div>
            <div className="text-purple-600 bg-white p-3 rounded-2xl shadow-xs border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Pending PSB Verification */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-indigo-950/5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Pendaftaran PSB Menunggu Verifikasi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Verifikasi bukti transfer biaya formulir untuk membuka slot observasi</p>
            </div>
            <button
              onClick={() => setActiveModule('admissions')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {admissions.filter(a => a.paymentStatus === 'menunggu_verifikasi').length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ada pembayaran pendaftaran baru yang menunggu verifikasi.
              </div>
            ) : (
              admissions.filter(a => a.paymentStatus === 'menunggu_verifikasi').map(adm => (
                <div key={adm.id} className="p-4 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 font-display">{adm.childName}</span>
                      <span className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-mono font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        {adm.applicationNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Orang tua: <strong className="text-slate-700">{adm.parentName}</strong> ({adm.parentPhone})
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1">
                      Program: <span className="font-semibold text-indigo-700">{adm.selectedPrograms.join(', ')}</span> · Biaya: <strong className="text-slate-900 font-mono">Rp {adm.adminFeeAmount.toLocaleString('id-ID')}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => verifyAdmissionPayment(adm.id, false)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 cursor-pointer"
                    >
                      Tolak
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => verifyAdmissionPayment(adm.id, true)}
                      className="px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      Verifikasi
                    </motion.button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Observation Calendar & Case Alerts */}
        <div className="space-y-6 sm:space-y-8">
          {/* Scheduled Observations */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-indigo-950/5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">Jadwal Observasi Terdekat</h3>
                <p className="text-xs text-slate-500 mt-0.5">Siswa baru yang sudah terverifikasi biaya pendaftarannya</p>
              </div>
              <button
                onClick={() => setActiveModule('observations')}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                Kelola Slot <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {scheduledObservations.map(adm => (
                <div key={adm.id} className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-yellow-50/40 to-white border border-amber-300/70 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm shadow-xs font-display">
                      {adm.childName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-display">{adm.childName} ({adm.childNickname})</div>
                      <div className="text-[11px] text-amber-900 font-bold mt-0.5">
                        {adm.observationSlot?.date} | {adm.observationSlot?.time}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Petugas: {adm.observationSlot?.assessorName} ({adm.observationSlot?.room})
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 font-extrabold px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
                    Siap Observasi
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Open Student Cases Alert */}
          {openCases.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="p-5 rounded-3xl bg-gradient-to-r from-rose-50/90 to-pink-50/70 border border-rose-300/80 flex items-start gap-3.5 shadow-md shadow-rose-950/5"
            >
              <div className="p-2 rounded-2xl bg-rose-600 text-white shrink-0 mt-0.5 shadow-xs animate-bounce" style={{ animationDuration: '3s' }}>
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-rose-950 font-display">
                  {openCases.length} Kasus Siswa Memerlukan Monitoring Tindak Lanjut
                </div>
                <p className="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                  Termasuk laporan sensori ananda Keenan Alvaro di Kelas A oleh Kak Sarah Amanda.
                </p>
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setActiveModule('cases')}
                  className="mt-3 text-xs font-black text-rose-800 hover:text-rose-950 inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                  <span>Buka Laporan Kasus</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
