import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Plus, 
  User, 
  ChevronRight,
  Filter,
  Flame
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { StudentCase, ProgramType } from '../../types';

export const CasesModule: React.FC = () => {
  const { cases, students, addCase, updateCaseStatus } = useSchoolData();
  const { currentUser } = useAuth();
  const isPrincipal = ['super_admin', 'kepala_sekolah'].includes(currentUser?.role || '');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<StudentCase | null>(null);

  // New Case Form State
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [caseType, setCaseType] = useState<StudentCase['caseType']>('sensori');
  const [priority, setPriority] = useState<StudentCase['priority']>('sedang');
  const [program, setProgram] = useState<ProgramType>('sekolah_pagi');
  const [description, setDescription] = useState('');
  const [initialAction, setInitialAction] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('Kak Sarah Amanda, S.Psi.');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === targetStudentId);
    if (!std || !description.trim()) return;

    addCase({
      studentId: targetStudentId,
      studentName: std.fullName,
      program,
      reportedBy: currentUser?.name || 'Staff',
      reporterRole: (currentUser?.role || 'staff').replace(/_/g, ' '),
      caseType,
      priority,
      description,
      initialActionTaken: initialAction,
      status: 'dilaporkan',
      followUpPlan,
      assignedStaff
    });

    setShowAddModal(false);
    setDescription('');
    setInitialAction('');
    setFollowUpPlan('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              Pelaporan Kasus & Tindak Lanjut
            </span>
            <span className="text-xs text-slate-500">Privat & Rahasia Sekolah</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Manajemen Penanganan Kasus Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuai PRD Bagian 13: Pencatatan kronologi objektif, tindakan awal, eskalasi prioritas keselamatan, dan supervisi penyelesaian.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0"
        >
          <AlertTriangle className="w-4 h-4" />
          Laporkan Kasus Baru
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map(cs => {
          const isHighPriority = cs.priority === 'tinggi' || cs.priority === 'darurat';
          return (
            <div
              key={cs.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all ${
                isHighPriority ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500">{cs.caseNumber}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase flex items-center gap-1 ${
                    cs.priority === 'darurat' ? 'bg-red-600 text-white animate-pulse' :
                    cs.priority === 'tinggi' ? 'bg-rose-100 text-rose-800' :
                    cs.priority === 'sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isHighPriority && <Flame className="w-3 h-3 text-red-600" />}
                    Prioritas {cs.priority}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded uppercase">
                    Kasus: {cs.caseType}
                  </span>
                  <span className="text-[10px] text-slate-400">· Dilaporkan: {cs.dateTime}</span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                  cs.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  cs.status === 'dalam_tindak_lanjut' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {cs.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  Siswa: <strong className="text-slate-900 text-sm">{cs.studentName}</strong> · Pelapor: {cs.reportedBy} ({cs.reporterRole})
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px] uppercase">Kronologi Kejadian:</span>
                    <p className="text-slate-800 leading-relaxed">{cs.description}</p>
                  </div>
                  {cs.initialActionTaken && (
                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase">Tindakan Awal yang Diambil:</span>
                      <p className="text-slate-600 italic">{cs.initialActionTaken}</p>
                    </div>
                  )}
                  {cs.followUpPlan && (
                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="font-bold text-blue-900 block text-[11px] uppercase">Rencana Tindak Lanjut:</span>
                      <p className="text-blue-950 font-medium">{cs.followUpPlan}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Penanggung Jawab: <strong>{cs.assignedStaff}</strong></span>
                
                {cs.status !== 'selesai' && (
                  <button
                    onClick={() => updateCaseStatus(cs.id, 'selesai', 'Tindak lanjut terlaksana dengan baik.')}
                    className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tandai Selesai & Terverifikasi
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Laporkan Kasus */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Formulir Laporan Kasus Siswa</h3>
            <p className="text-xs text-slate-500 mb-4">
              Laporan ini bersifat rahasia dan segera dievaluasi oleh Kepala Sekolah
            </p>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.nickname})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Prioritas *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as StudentCase['priority'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-rose-700"
                  >
                    <option value="rendah">Rendah (Observasi Biasa)</option>
                    <option value="sedang">Sedang (Perlu Perhatian Tim)</option>
                    <option value="tinggi">Tinggi (Sensory Overload / Tantrum)</option>
                    <option value="darurat">Darurat (Keselamatan Fisik)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kasus</label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value as StudentCase['caseType'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="sensori">Sensori / Bising / Taktil</option>
                    <option value="perilaku">Perilaku Belajar / Emosi</option>
                    <option value="kesehatan_fisik">Kesehatan Fisik / Cedera</option>
                    <option value="sosialisasi">Interaksi Sosial Teman Sebaya</option>
                    <option value="keselamatan">Keselamatan Lingkungan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Program Terkait</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value as ProgramType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="sekolah_pagi">Sekolah Pagi</option>
                    <option value="terapi">Layanan Terapi</option>
                    <option value="daycare">DayCare</option>
                    <option value="shadow">Shadow Teacher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kronologi Objektif Kejadian *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsikan waktu, tempat, pemicu (trigger), dan respon anak secara objektif tanpa asumsi subjektif..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tindakan Awal yang Dilakukan</label>
                <textarea
                  rows={2}
                  placeholder="Langkah de-eskalasi yang telah diterapkan guru/terapis di lokasi..."
                  value={initialAction}
                  onChange={(e) => setInitialAction(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rencana Follow-Up & Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Contoh: Penggunaan earmuff & latihan pernapasan (PJ: Kak Dita)"
                  value={followUpPlan}
                  onChange={(e) => setFollowUpPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Kirim Laporan Kasus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
