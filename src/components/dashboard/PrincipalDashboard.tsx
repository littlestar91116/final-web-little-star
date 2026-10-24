import React from 'react';
import { 
  Award, 
  CheckSquare, 
  AlertTriangle, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  UserCheck, 
  Eye,
  Sparkles,
  Crown
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

interface PrincipalDashboardProps {
  setActiveModule: (mod: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ setActiveModule }) => {
  const { tasks, cases, sdrRecords, students, updateTaskStatus, setProgramDecision } = useSchoolData();

  const reviewTasks = tasks.filter(t => t.status === 'dikirim' || t.status === 'sedang_direview');
  const openCases = cases.filter(c => c.status !== 'selesai');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Principal Oversight Jewel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Tasks (Sapphire/Purple) */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-purple-200/80 shadow-lg shadow-purple-900/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-900/60 font-display">Tugas Guru Menunggu Review</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{reviewTasks.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Perlu Evaluasi
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Lesson Plan & Asesmen Harian</span>
          </div>
        </div>

        {/* Metric 2: Kasus Siswa Aktif (Rose) */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-lg shadow-rose-900/5 hover:shadow-xl hover:shadow-rose-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-900/60 font-display">Kasus Siswa Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{openCases.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Tindak Lanjut
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Regulasi sensori & emosi</span>
          </div>
        </div>

        {/* Metric 3: SDR Disetujui (Emerald) */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900/60 font-display">Rekam SDR Disetujui</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">
              {Object.values(sdrRecords).filter(r => r.principalApprovalDate).length}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              SDR Valid
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Siap dibagikan ke orang tua</span>
          </div>
        </div>

        {/* Metric 4: Supervisi (Gold) */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-amber-300/80 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900/60 font-display">Supervisi Bulan Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">4</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Kelas & Terapi
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Evaluasi pedagogik berkala</span>
          </div>
        </div>
      </div>

      {/* Task & Lesson Plan Review Queue */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-indigo-950/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-black text-slate-900 font-display">Antrean Review Tugas & Laporan Guru</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Lakukan persetujuan atau berikan catatan revisi untuk kelancaran kurikulum</p>
          </div>
          <button
            onClick={() => setActiveModule('tasks')}
            className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>Semua Tugas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {reviewTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Semua tugas guru telah ditinjau dengan baik.
            </div>
          ) : (
            reviewTasks.map(tsk => (
              <div key={tsk.id} className="p-4.5 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50/80 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 font-display">{tsk.title}</span>
                    <span className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      {tsk.period.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Oleh: <strong className="text-slate-900">{tsk.teacherName}</strong> · Program: <span className="font-semibold text-indigo-700">{tsk.program.replace('_', ' ')}</span>
                  </div>
                  {tsk.notes && (
                    <p className="text-xs text-slate-600 italic bg-white/90 p-2.5 rounded-xl border border-slate-200/70 mt-1 shadow-2xs">
                      "{tsk.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => updateTaskStatus(tsk.id, 'perlu_revisi', 'Mohon lengkapi rubrik penilaian indikator verbal.')}
                    className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all cursor-pointer"
                  >
                    Minta Revisi
                  </button>
                  <button
                    onClick={() => updateTaskStatus(tsk.id, 'disetujui', 'Disetujui oleh Kepala Sekolah.')}
                    className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Program Decision Review for SDR */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-xl shadow-indigo-950/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display">Keputusan Evaluasi Program (Development Comparison)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Penetapan status program semester depan: CONTINUE / MODIFY / REPLACE sesuai PRD Section 16.4</p>
          </div>
          <button
            onClick={() => setActiveModule('comparison')}
            className="text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>Analisis Grafik</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-blue-950 font-display">Arkana Dylan Pratama (NIS: LS-2026-001)</span>
              <span className="text-[10px] bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                Keputusan: CONTINUE
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Perkembangan indikator komunikasi dan motorik halus naik 50% dalam 3 bulan terakhir melalui sinergi Sekolah Pagi + Terapi Wicara.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => setProgramDecision('std-001', 'CONTINUE', 'Program sangat efektif dan dilanjutkan.')}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Lanjutkan (CONTINUE)
            </button>
            <button
              onClick={() => setProgramDecision('std-001', 'MODIFY', 'Penambahan intensitas sesi.')}
              className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-white hover:bg-amber-50 border border-amber-300 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Sesuaikan (MODIFY)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
