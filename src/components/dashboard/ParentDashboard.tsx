import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  CreditCard, 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

interface ParentDashboardProps {
  setActiveModule: (mod: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ setActiveModule }) => {
  const { currentUser } = useAuth();
  const { students, sdrRecords, invoices, gallery, uploadPaymentProof } = useSchoolData();

  // Child mapped to current parent (e.g. Dylan std-001)
  const childId = currentUser?.childStudentId || 'std-001';
  const child = students.find(s => s.id === childId) || students[0];
  const childSdr = sdrRecords[child?.id];
  const childInvoices = invoices.filter(i => i.studentId === child?.id);
  const childPhotos = gallery.filter(g => g.studentIds?.includes(child?.id));

  // Payment upload modal state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !proofUrlInput.trim()) return;

    uploadPaymentProof(selectedInvoiceId, proofUrlInput);
    setSelectedInvoiceId(null);
    setProofUrlInput('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
      className="space-y-8"
    >
      {/* Child Profile Luxury Card */}
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-300/60 p-6 sm:p-8 shadow-xl shadow-indigo-950/5 light-sweep-effect">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-400/10 via-rose-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 rounded-3xl blur-xs opacity-75 animate-pulse" />
              <img
                src={child.photoUrl}
                alt={child.fullName}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                ✓
              </div>
            </motion.div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
                  NIS: {child.nis}
                </span>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300">
                  Status: Aktif Bersinar
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                {child.fullName} <span className="text-amber-600">({child.nickname})</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Kelas: <strong className="text-slate-900">{child.className}</strong> · Tahun Ajaran: {child.academicYear}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {child.enrolledPrograms.map(p => (
                  <span key={p} className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wider font-display">
                    ★ {p.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-white p-4.5 rounded-2xl border border-indigo-200/80 space-y-1.5 md:max-w-xs shadow-xs"
          >
            <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5 font-display">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Catatan Tumbuh Kembang:</span>
            </div>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed font-medium">
              {child.specialNeedsNotes || 'Perkembangan anak berjalan sangat baik sesuai milestone usianya.'}
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Bukti transfer berhasil diunggah! Staff administrasi sekolah akan segera memverifikasi.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Permitted Features Quick Access Cards with Motion Spring */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <motion.button
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onClick={() => setActiveModule('parent_schedule')}
          className="p-5 bg-white/95 rounded-3xl border border-blue-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-shadow text-left flex flex-col justify-between space-y-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 font-display">Jadwal & Absen Siswa</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Kegiatan kelas & absensi harian</div>
          </div>
        </motion.button>

        {/* Card 2 */}
        <motion.button
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onClick={() => setActiveModule('finance')}
          className="p-5 bg-white/95 rounded-3xl border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-shadow text-left flex flex-col justify-between space-y-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700 font-display">Tagihan Siswa (SPP)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Status tagihan & upload bukti</div>
          </div>
        </motion.button>

        {/* Card 3 */}
        <motion.button
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onClick={() => setActiveModule('sdr')}
          className="p-5 bg-white/95 rounded-3xl border border-amber-300/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-shadow text-left flex flex-col justify-between space-y-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-amber-700 font-display">Report Siswa (SDR)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Rapor capaian & rubrik evaluasi</div>
          </div>
        </motion.button>

        {/* Card 4 */}
        <motion.button
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onClick={() => setActiveModule('consultations')}
          className="p-5 bg-white/95 rounded-3xl border border-purple-200/80 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 transition-shadow text-left flex flex-col justify-between space-y-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 group-hover:text-purple-700 font-display">Supervisi & Konsultasi</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Diskusi Kepala / Guru / Terapis</div>
          </div>
        </motion.button>
      </div>

      {/* 2-Column Split: SPP Billing & SDR Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* SPP Billing Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-indigo-950/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Tagihan SPP Ananda ({childInvoices.length} Program)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap program memiliki administrasi dan rincian terpisah
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            {childInvoices.map(inv => (
              <div key={inv.id} className="p-4.5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50/70 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 uppercase font-display">
                      SPP {inv.program.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      inv.status === 'lunas' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300' :
                      inv.status === 'menunggu_verifikasi' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300' : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-900 border border-rose-300'
                    }`}>
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Bulan: {inv.month} {inv.year} {inv.sessionCount ? `(${inv.sessionCount} Sesi Terapi)` : ''}
                  </div>
                  <div className="text-base font-black text-blue-950 mt-1 tabular-nums font-display">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {inv.status === 'belum_bayar' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedInvoiceId(inv.id)}
                      className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Unggah Bukti</span>
                    </motion.button>
                  ) : inv.status === 'menunggu_verifikasi' ? (
                    <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Menunggu Cek
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Lunas Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Transfer Bank Info */}
          <div className="mt-5 p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent rounded-2xl border border-amber-300/70 text-[11px] text-amber-950 space-y-1">
            <div className="font-extrabold flex items-center gap-1 font-display">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Rekening Resmi Pembayaran Little Star:</span>
            </div>
            <div>Bank Central Asia (BCA) No: <strong className="font-mono text-xs">8271-9982-10</strong> a.n. <strong>LITTLE STAR LEARNING CENTER</strong></div>
          </div>
        </div>

        {/* SDR Summary & Milestones with Animated Progress Bars */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-indigo-950/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Ringkasan Rapor & SDR Terpublikasi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Capaian indikator belajar yang telah diverifikasi Kepala Sekolah</p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => setActiveModule('sdr')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              Lihat Detail SDR <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {childSdr ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200/70 text-xs text-slate-700">
                <span className="font-black text-blue-950 block mb-1 font-display">Evaluasi & Catatan Wali Kelas:</span>
                "{childSdr.summaryNotes}"
              </div>

              <div className="space-y-3 pt-1">
                {childSdr.scores.slice(0, 4).map(sc => (
                  <div key={sc.indicatorId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 capitalize font-display">{sc.domain.replace('_', ' ')}</span>
                      <span className="text-amber-700 font-mono font-bold text-[11px]">Skor: {sc.currentScore} / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(sc.currentScore / 5) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                        className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-2.5 rounded-full shadow-xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">{sc.rubricNotes}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Rapor perkembangan semester sedang dalam tahap penyusunan oleh tim guru.
            </div>
          )}
        </div>
      </div>

      {/* Upload Proof Modal with Spring Motion */}
      <AnimatePresence>
        {selectedInvoiceId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-amber-200"
            >
              <h3 className="text-base font-black text-slate-900 font-display mb-1">Unggah Bukti Pembayaran SPP</h3>
              <p className="text-xs text-slate-500 mb-5">
                Masukkan tautan gambar struk transfer atau bukti m-banking Anda
              </p>

              <form onSubmit={handleUploadProof} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    URL Bukti Transfer (Image / Struk)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://... atau paste link gambar"
                    value={proofUrlInput}
                    onChange={(e) => setProofUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSelectedInvoiceId(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 rounded-xl shadow-md shadow-amber-500/20 cursor-pointer uppercase tracking-wider"
                  >
                    Kirim Bukti
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
