import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Calendar, 
  ArrowUpRight, 
  Check, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Printer
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';

export const SDRModule: React.FC = () => {
  const { students, sdrRecords, setProgramDecision } = useSchoolData();
  const { currentUser } = useAuth();
  const isPrincipal = ['super_admin', 'kepala_sekolah'].includes(currentUser?.role || '');
  const isParent = currentUser?.role === 'wali_murid';
  const childId = currentUser?.childStudentId || 'std-001';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(isParent ? childId : (students[0]?.id || 'std-001'));
  const [activeTab, setActiveTab] = useState<'sdr' | 'comparison' | 'matrix'>('sdr');

  const effectiveStudentId = isParent ? childId : selectedStudentId;
  const activeStudent = students.find(s => s.id === effectiveStudentId) || students[0];
  const sdr = sdrRecords[effectiveStudentId] || sdrRecords['std-001'];

  const [decisionNotes, setDecisionNotes] = useState('');

  const handleDecision = (decision: 'CONTINUE' | 'MODIFY' | 'REPLACE') => {
    setProgramDecision(effectiveStudentId, decision, decisionNotes || 'Evaluasi berdasarkan analisis perbandingan indikator.');
    alert(`Keputusan program ${decision} berhasil ditetapkan dan ditandatangani oleh Kepala Sekolah!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Student Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Student Development Record (SDR)
            </span>
            <span className="text-xs text-slate-500">Tahun Ajaran 2026/2027</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Rekam Perkembangan & Perbandingan Indikator (SDR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat riwayat perkembangan siswa, evaluasi rubrik komparatif, dan Planning Matrix semesteran.
          </p>
        </div>

        {isParent ? (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Rapor Khusus Ananda Tercinta</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-600">Pilih Siswa:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.nickname}) - {s.className}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student Profile Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeStudent.photoUrl}
            alt={activeStudent.fullName}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{activeStudent.fullName}</h3>
              <span className="text-xs font-mono font-semibold text-slate-400">NIS: {activeStudent.nis}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Kelas: <strong className="text-slate-700">{activeStudent.className}</strong> · Terakhir diperbarui: {sdr?.lastUpdated || '2026-10-22'}
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {activeStudent.enrolledPrograms.map(p => (
                <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                  {p.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Current Decision Pill */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right md:max-w-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Keputusan Program</span>
          <span className={`text-sm font-extrabold inline-block px-2.5 py-0.5 rounded-lg mt-0.5 ${
            sdr?.programDecision === 'CONTINUE' ? 'bg-emerald-100 text-emerald-800' :
            sdr?.programDecision === 'MODIFY' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
          }`}>
            {sdr?.programDecision || 'CONTINUE'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {sdr?.principalApprovalDate ? `Disetujui Kepala Sekolah (${sdr.principalApprovalDate})` : 'Menunggu Approval'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 px-2">
        <button
          onClick={() => setActiveTab('sdr')}
          className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'sdr'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Rapor Indikator SDR
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'comparison'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Development Comparison (Perbandingan Skor)
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Planning Matrix Enam Bulanan
        </button>
      </div>

      {/* Tab 1: SDR Indicators */}
      {activeTab === 'sdr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Ringkasan Catatan Perkembangan Siswa</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              "{sdr?.summaryNotes || 'Siswa menunjukkan adaptasi yang sangat positif di lingkungan kelas dan sesi terapi.'}"
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Domain Perkembangan</th>
                    <th className="py-3 px-4">Indikator Terukur</th>
                    <th className="py-3 px-4 text-center">Baseline</th>
                    <th className="py-3 px-4 text-center">Capaian Saat Ini</th>
                    <th className="py-3 px-4 text-center">Target</th>
                    <th className="py-3 px-4">Catatan Rubrik Guru & Terapis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {sdr?.scores.map(sc => (
                    <tr key={sc.indicatorId} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-blue-900 capitalize">
                        {sc.domain.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4">{sc.indicatorName}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">{sc.baselineScore}/5</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {sc.currentScore}/5
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-700 font-semibold">{sc.targetScore}/5</td>
                      <td className="py-3.5 px-4 text-slate-600 italic text-[11px]">{sc.rubricNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Development Comparison Charts */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Perbandingan Perkembangan Lintas Periode</h3>
                <p className="text-xs text-slate-500">
                  Baseline (Awal Masuk) vs Periode Sebelumnya vs Periode Saat Ini vs Target
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-300 rounded" /> Baseline</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-400 rounded" /> Sebelumnya</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded" /> Saat Ini</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded" /> Target</span>
              </div>
            </div>

            {/* Visual comparative bar graphs */}
            <div className="space-y-5">
              {sdr?.scores.map(sc => (
                <div key={sc.indicatorId} className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">{sc.indicatorName}</strong>
                      <span className="text-slate-400 text-[11px] ml-2 capitalize">({sc.domain.replace('_', ' ')})</span>
                    </div>
                    <span className="font-mono text-emerald-700 font-bold">
                      {sc.currentScore > sc.previousScore ? `+${sc.currentScore - sc.previousScore} Poin` : 'Stabil'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-200 rounded flex items-center justify-center text-slate-600 font-bold">
                        {sc.baselineScore}
                      </div>
                      <span className="text-slate-400">Baseline</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-4 bg-amber-300 rounded flex items-center justify-center text-amber-950 font-bold">
                        {sc.previousScore}
                      </div>
                      <span className="text-slate-400">Sebelumnya</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-4 bg-emerald-500 text-white rounded flex items-center justify-center font-bold">
                        {sc.currentScore}
                      </div>
                      <span className="text-emerald-700 font-bold">Saat Ini</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-4 bg-blue-600 text-white rounded flex items-center justify-center font-bold">
                        {sc.targetScore}
                      </div>
                      <span className="text-blue-700 font-bold">Target</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Decision Actions for Principal */}
            {isPrincipal && (
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Keputusan Evaluasi Program Kepala Sekolah (PRD Section 16.4)
                  </h4>
                  <span className="text-[10px] text-blue-700">Wewenang: Kepala Sekolah & Super Admin</span>
                </div>
                <p className="text-xs text-blue-900">
                  Pilih rekomendasi keberlanjutan program anak untuk semester berikutnya berdasarkan data perbandingan indikator di atas:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleDecision('CONTINUE')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs"
                  >
                    CONTINUE (Lanjutkan Program)
                  </button>
                  <button
                    onClick={() => handleDecision('MODIFY')}
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-2xs"
                  >
                    MODIFY (Sesuaikan Intensitas / Target)
                  </button>
                  <button
                    onClick={() => handleDecision('REPLACE')}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
                  >
                    REPLACE (Ganti Program Pembelajaran)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Planning Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Planning Matrix Enam Bulanan & Target Baru</h3>
              <p className="text-xs text-slate-500">Dasar acuan pembelajaran semester berikutnya (PRD Section 16.5)</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Area Perkembangan</th>
                  <th className="py-3 px-4">Indikator</th>
                  <th className="py-3 px-4">Target Sebelumnya</th>
                  <th className="py-3 px-4">Capaian Aktual</th>
                  <th className="py-3 px-4">Evaluasi & Kendala</th>
                  <th className="py-3 px-4">Target Baru (Semester Depan)</th>
                  <th className="py-3 px-4">Penanggung Jawab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sdr?.planningMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-blue-900">{item.developmentArea}</td>
                    <td className="py-3.5 px-4">{item.indicator}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.previousTarget}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{item.actualAchievement}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.evaluationNotes}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-800">{item.nextTarget}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.responsibleTeacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
