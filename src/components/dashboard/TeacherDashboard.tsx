import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  Sparkles,
  Camera,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ProgramType } from '../../types';

interface TeacherDashboardProps {
  setActiveModule: (mod: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveModule }) => {
  const { currentUser } = useAuth();
  const { students, tasks, cases, addTask, addCase } = useSchoolData();

  // Filter students based on teacher program
  const userRole = currentUser?.role || 'guru_sekolah_pagi';
  const teacherProgram = 
    userRole === 'guru_sekolah_pagi' ? 'sekolah_pagi' :
    userRole === 'terapis' ? 'terapi' :
    userRole === 'shadow_teacher' ? 'shadow' : 'daycare';

  const userName = currentUser?.name || 'Guru';
  const myStudents = students.filter(s => s.enrolledPrograms.includes(teacherProgram as ProgramType));
  const myTasks = tasks.filter(t => t.teacherName.toLowerCase().includes(userName.split(' ')[0].toLowerCase()) || t.program === teacherProgram);

  // Form states for quick assessment entry
  const [showQuickAssessment, setShowQuickAssessment] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(myStudents[0]?.id || '');
  const [activityNote, setActivityNote] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const handleSaveDailyTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityNote.trim()) return;

    const studentObj = students.find(s => s.id === selectedStudent);
    addTask({
      title: `Penilaian Harian: ${studentObj?.nickname || 'Siswa'}`,
      teacherId: currentUser?.id || 'stf-002',
      teacherName: currentUser?.name || 'Guru',
      program: teacherProgram as ProgramType,
      studentId: selectedStudent,
      studentName: studentObj?.fullName,
      period: 'harian',
      deadline: new Date().toISOString().split('T')[0],
      status: 'dikirim',
      notes: activityNote
    });

    setActivityNote('');
    setShowQuickAssessment(false);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Teacher Jewel Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-blue-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-900/60 font-display">Siswa Binaan Saya</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{myStudents.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Aktif Hari Ini
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Program: {teacherProgram.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-amber-300/80 shadow-lg shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900/60 font-display">Tugas & Asesmen</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">{myTasks.length}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Periode Berjalan
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Harian, mingguan, & bulanan</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900/60 font-display">Jadwal Sesi Hari Ini</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">3</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Sesi Selesai
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Ruang Kelas & Ruang Terapi</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-lg shadow-rose-900/5 hover:shadow-xl hover:shadow-rose-500/10 transition-all hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-900/60 font-display">Laporan Kasus</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums font-display">1</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Dalam Penanganan
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Eskalasi respon sensori</span>
          </div>
        </div>
      </div>

      {isSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Asesmen harian berhasil disimpan dan dikirim ke sistem SDR!</span>
        </div>
      )}

      {/* Quick Action: Log Today's Daily Assessment */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl shadow-indigo-950/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-black text-slate-900 font-display">Catat Penilaian Harian & Dokumentasi</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Input cepat capaian aktivitas dan stimulasi perkembangan anak hari ini
            </p>
          </div>
          <button
            onClick={() => setShowQuickAssessment(!showQuickAssessment)}
            className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showQuickAssessment ? 'Tutup Formulir' : 'Catat Aktivitas'}</span>
          </button>
        </div>

        {showQuickAssessment && (
          <form onSubmit={handleSaveDailyTask} className="p-5 rounded-2xl bg-gradient-to-r from-slate-50/90 to-amber-50/30 border border-amber-300/60 space-y-4 mb-6 animate-fadeIn shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">Pilih Siswa</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {myStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.nickname})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">Program</label>
                <input
                  type="text"
                  disabled
                  value={teacherProgram.replace('_', ' ').toUpperCase()}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                Catatan Observasi Perkembangan & Stimulasi
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Dylan mampu meremas playdough dan memasukkan stik dengan koordinasi dua tangan selama 15 menit tanpa terdistraksi..."
                value={activityNote}
                onChange={(e) => setActivityNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Camera className="w-3.5 h-3.5" /> Media foto/video dapat ditautkan ke galeri privat
              </span>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer uppercase tracking-wider"
              >
                Simpan & Kirim
              </button>
            </div>
          </form>
        )}

        {/* Task list for this teacher */}
        <div className="space-y-3">
          {myTasks.map(tsk => (
            <div key={tsk.id} className="p-4 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white to-slate-50/60 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 font-display">{tsk.title}</span>
                  <span className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {tsk.period}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Tenggat: <strong className="text-slate-700">{tsk.deadline}</strong> · Status: <span className="capitalize font-bold text-indigo-700">{tsk.status.replace('_', ' ')}</span>
                </div>
                {tsk.reviewerNotes && (
                  <div className="text-[10px] text-emerald-800 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                    Catatan Reviewer: "{tsk.reviewerNotes}"
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                tsk.status === 'disetujui' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300' :
                tsk.status === 'sedang_direview' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 border border-blue-300'
              }`}>
                {tsk.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
