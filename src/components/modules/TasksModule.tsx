import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Plus, 
  FileText,
  User
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { TaskPeriod, TaskStatus } from '../../types';

export const TasksModule: React.FC = () => {
  const { tasks, students, staff, addTask, updateTaskStatus } = useSchoolData();
  const { currentUser } = useAuth();
  const isPrincipal = ['super_admin', 'kepala_sekolah'].includes(currentUser?.role || '');

  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<TaskPeriod>('harian');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [notes, setNotes] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchPeriod = selectedPeriod === 'all' || t.period === selectedPeriod;
    const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchPeriod && matchStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const std = students.find(s => s.id === targetStudentId);

    addTask({
      title,
      teacherId: currentUser?.id || 'stf-002',
      teacherName: currentUser?.name || 'Guru',
      program: 'sekolah_pagi',
      studentId: targetStudentId,
      studentName: std?.fullName,
      period,
      deadline,
      status: 'dikirim',
      notes
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Manajemen Tugas Guru
            </span>
            <span className="text-xs text-slate-500">5 Periode Evaluasi Terpadu</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Tugas & Laporan Berkala Guru/Terapis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuai PRD Bagian 12: Harian, Mingguan, Bulanan, 3 Bulanan, dan Planning Matrix 6 Bulanan.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Kirim Tugas / Laporan Baru
        </button>
      </div>

      {/* Period Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua Periode' },
          { id: 'harian', label: 'Harian' },
          { id: 'mingguan', label: 'Mingguan' },
          { id: 'bulanan', label: 'Bulanan' },
          { id: 'tiga_bulanan', label: 'Tiga Bulanan' },
          { id: 'enam_bulanan', label: 'Enam Bulanan' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPeriod(p.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedPeriod === p.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{t.title}</span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                  {t.period.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  t.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' :
                  t.status === 'sedang_direview' ? 'bg-amber-100 text-amber-800' :
                  t.status === 'perlu_revisi' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {t.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Penyusun: <strong>{t.teacherName}</strong> {t.studentName ? `· Siswa: ${t.studentName}` : ''} · Tenggat: {t.deadline}
              </div>

              {t.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  "{t.notes}"
                </p>
              )}

              {t.reviewerNotes && (
                <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 mt-1">
                  <strong>Catatan Kepala Sekolah:</strong> "{t.reviewerNotes}"
                </div>
              )}
            </div>

            {/* Principal Actions */}
            {isPrincipal && t.status !== 'disetujui' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateTaskStatus(t.id, 'perlu_revisi', 'Mohon lengkapi poin evaluasi indikator.')}
                  className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl"
                >
                  Minta Revisi
                </button>
                <button
                  onClick={() => updateTaskStatus(t.id, 'disetujui', 'Laporan disetujui tanpa catatan.')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: New Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Kirim Tugas / Laporan Guru</h3>
            <p className="text-xs text-slate-500 mb-4">Laporan akan diteruskan ke Kepala Sekolah untuk ditinjau</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Tugas / Rencana</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lesson Plan Mingguan: Mengenal Cuaca"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Periode</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as TaskPeriod)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="harian">Harian</option>
                    <option value="mingguan">Mingguan</option>
                    <option value="bulanan">Bulanan</option>
                    <option value="tiga_bulanan">Tiga Bulanan</option>
                    <option value="enam_bulanan">Enam Bulanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Tanggal</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Terkait Siswa (Opsional)</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="">-- Seluruh Siswa di Kelas --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.nickname})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Laporan / Rencana Pembelajaran</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tujuan, materi aktivitas, stimulasi motorik, dan capaian target..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Kirim ke Kepala Sekolah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
