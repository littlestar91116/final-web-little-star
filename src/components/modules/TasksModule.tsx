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
  User,
  Search,
  X,
  Sparkles,
  Award,
  BookOpen,
  Trash2,
  Edit2,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { TaskPeriod, TaskStatus, ProgramType, TeacherTask } from '../../types';

export const TasksModule: React.FC = () => {
  const { tasks, students, staff, addTask, updateTask, deleteTask, updateTaskStatus } = useSchoolData();
  const { currentUser } = useAuth();
  const isPrincipal = ['super_admin', 'kepala_sekolah'].includes(currentUser?.role || '');
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [quickDatePreset, setQuickDatePreset] = useState<'all' | 'today' | 'this_month'>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TeacherTask | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [taskProgram, setTaskProgram] = useState<ProgramType>('sekolah_pagi');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [period, setPeriod] = useState<TaskPeriod>('harian');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [targetStudentId, setTargetStudentId] = useState('');
  const [notes, setNotes] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Quick report templates by role
  const REPORT_TEMPLATES: Record<ProgramType, { title: string; defaultNote: string }> = {
    sekolah_pagi: {
      title: 'RPPH Harian: Kegiatan Sentra & Stimulasi Pra-Akademik',
      defaultNote: 'Aktivitas bermain sensori, pengenalan bentuk geometri, stimulasi pra-membaca dengan kartu bergambar, dan pembiasaan adab merapikan mainan mandiri.'
    },
    terapi: {
      title: 'Laporan Sesi Terapi Wicara & Sensori Integrasi',
      defaultNote: 'Artikulasi fonem bilabial (b, p, m), modulasi sensori ayunan vestibular 15 menit, stimulasi proprioseptif, dan peningkatan atensi kontak mata.'
    },
    shadow: {
      title: 'Laporan Pendampingan 1-on-1 di Ruang Kelas Reguler',
      defaultNote: 'Pendampingan regulasi emosi saat pergantian aktivitas kelas, membantu ananda fokus instruksi guru utama selama 25 menit, dan fasilitasi bermain bersama teman sebaya.'
    },
    daycare: {
      title: 'Daily Log DayCare: Pola Tidur, Asupan Gizi & Stimulasi Toddler',
      defaultNote: 'Porsi makan siang habis (nasi tim, sayur bayam, telur dadar), tidur siang nyaman 1.5 jam, toilet training mandiri 2x, dan stimulasi motorik kasar bermain puzzle busa sore hari.'
    }
  };

  const handleApplyTemplate = (prog: ProgramType) => {
    const tpl = REPORT_TEMPLATES[prog];
    if (tpl) {
      setTitle(tpl.title);
      setNotes(tpl.defaultNote);
    }
  };

  // Filter Tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.slice(0, 7); // e.g. "2026-10"

  const filteredTasks = tasks.filter(t => {
    // 1. Text Search across Student Name, Teacher Name, and Title
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStudent = t.studentName ? t.studentName.toLowerCase().includes(q) : false;
      const matchTeacher = t.teacherName.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes ? t.notes.toLowerCase().includes(q) : false;
      if (!matchStudent && !matchTeacher && !matchTitle && !matchNotes) return false;
    }

    // 2. Specific Date Filter (deadline or submissionDate)
    if (filterDate) {
      const matchDate = t.deadline === filterDate || t.submissionDate === filterDate;
      if (!matchDate) return false;
    }

    // 3. Quick Date Preset Filter
    if (quickDatePreset === 'today') {
      const matchToday = t.deadline === todayStr || t.submissionDate === todayStr;
      if (!matchToday) return false;
    } else if (quickDatePreset === 'this_month') {
      const matchMonth = (t.deadline && t.deadline.startsWith(thisMonthStr)) || 
                         (t.submissionDate && t.submissionDate.startsWith(thisMonthStr));
      if (!matchMonth) return false;
    }

    // 4. Program Filter
    if (selectedProgram !== 'all' && t.program !== selectedProgram) return false;

    // 5. Period Filter
    if (selectedPeriod !== 'all' && t.period !== selectedPeriod) return false;

    // 6. Status Filter
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDate('');
    setQuickDatePreset('all');
    setSelectedProgram('all');
    setSelectedPeriod('all');
    setSelectedStatus('all');
  };

  const isAnyFilterActive = searchQuery || filterDate || quickDatePreset !== 'all' || selectedProgram !== 'all' || selectedPeriod !== 'all' || selectedStatus !== 'all';

  // Open modal for new task or editing
  const handleOpenAddModal = (existing?: TeacherTask) => {
    if (existing) {
      setEditingTask(existing);
      setTitle(existing.title);
      setTaskProgram(existing.program);
      setSelectedTeacherId(existing.teacherId);
      setPeriod(existing.period);
      setDeadline(existing.deadline);
      setTargetStudentId(existing.studentId || '');
      setNotes(existing.notes || '');
    } else {
      setEditingTask(null);
      // Auto-determine teacher's program if current user is teacher
      const currentRole = currentUser?.role || 'guru_sekolah_pagi';
      const autoProg: ProgramType = 
        currentRole === 'guru_sekolah_pagi' ? 'sekolah_pagi' :
        currentRole === 'terapis' ? 'terapi' :
        currentRole === 'shadow_teacher' ? 'shadow' :
        currentRole === 'daycare_teacher' ? 'daycare' : 'sekolah_pagi';

      setTaskProgram(autoProg);
      setSelectedTeacherId(currentUser?.id || staff[0]?.id || 'stf-002');
      setPeriod('harian');
      setDeadline(new Date().toISOString().split('T')[0]);
      setTargetStudentId(students[0]?.id || '');

      const tpl = REPORT_TEMPLATES[autoProg];
      setTitle(tpl.title);
      setNotes(tpl.defaultNote);
    }
    setShowAddModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const std = students.find(s => s.id === targetStudentId);
    const assignedStaff = staff.find(st => st.id === selectedTeacherId);
    const teacherName = assignedStaff ? assignedStaff.name : (currentUser?.name || 'Pendidik Little Star');

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        program: taskProgram,
        teacherId: selectedTeacherId || editingTask.teacherId,
        teacherName,
        studentId: targetStudentId || undefined,
        studentName: std?.fullName || undefined,
        period,
        deadline,
        notes: notes.trim()
      });
      showToast(`Laporan "${title}" berhasil diperbarui!`);
    } else {
      addTask({
        title: title.trim(),
        teacherId: selectedTeacherId || currentUser?.id || 'stf-002',
        teacherName,
        program: taskProgram,
        studentId: targetStudentId || undefined,
        studentName: std?.fullName || undefined,
        period,
        deadline,
        status: 'dikirim',
        submissionDate: new Date().toISOString().split('T')[0],
        notes: notes.trim()
      });
      showToast(`Laporan baru "${title}" berhasil dikirim ke Kepala Sekolah!`);
    }

    setShowAddModal(false);
  };

  const handleDeleteTask = (task: TeacherTask) => {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan "${task.title}"?`)) {
      deleteTask(task.id);
      showToast(`Laporan "${task.title}" berhasil dihapus.`);
    }
  };

  // Program count statistics for obligations
  const countsByProgram = {
    sekolah_pagi: tasks.filter(t => t.program === 'sekolah_pagi').length,
    terapi: tasks.filter(t => t.program === 'terapi').length,
    shadow: tasks.filter(t => t.program === 'shadow').length,
    daycare: tasks.filter(t => t.program === 'daycare').length
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-amber-300/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <CheckSquare className="w-3.5 h-3.5 inline mr-1 fill-slate-950" />
              Sistem Pelaporan Terpadu
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">5 Periode Evaluasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-2">
            Tugas & Laporan Berkala Seluruh Guru
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium mt-1">
            Fitur pencarian tanggal & nama siswa/guru. Seluruh pengajar (Sekolah Pagi, Terapis, Guru Shadow, dan DayCare) wajib mengisi evaluasi harian, mingguan, bulanan, 3 bulanan, dan matriks 6 bulanan.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Kirim Tugas / Laporan Baru</span>
        </button>
      </div>

      {/* Obligation Notice Banner: ALL 4 TEACHER ROLES MUST SUBMIT */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-blue-50/60 p-5 rounded-3xl border-2 border-amber-300/80 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-sm">
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-950 font-display uppercase tracking-wider">
                🌟 Kewajiban Pengisian Seluruh Guru, Terapis, Shadow & DayCare
              </h3>
              <p className="text-[11px] text-amber-900 font-medium">
                Sesuai standar mutu Little Star, seluruh divisi pengajar wajib mengisi logbook harian & evaluasi berkala siswa binaannya.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-white/95 rounded-2xl border border-blue-200/90 shadow-2xs">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-900">1. Guru Sekolah Pagi</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{countsByProgram.sekolah_pagi} Laporan Masuk</div>
            <div className="text-[10px] text-slate-500">RPPH & Sentra Inklusif</div>
          </div>

          <div className="p-3 bg-white/95 rounded-2xl border border-emerald-200/90 shadow-2xs">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900">2. Terapis Wicara & Sensori</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{countsByProgram.terapi} Laporan Masuk</div>
            <div className="text-[10px] text-slate-500">Oral Motor & Sensori Gym</div>
          </div>

          <div className="p-3 bg-white/95 rounded-2xl border border-indigo-200/90 shadow-2xs">
            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900">3. Guru Shadow Pendamping</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{countsByProgram.shadow} Laporan Masuk</div>
            <div className="text-[10px] text-slate-500">Pendampingan 1-on-1 Kelas</div>
          </div>

          <div className="p-3 bg-white/95 rounded-2xl border border-amber-200/90 shadow-2xs">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">4. Guru & Pengasuh DayCare</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{countsByProgram.daycare} Laporan Masuk</div>
            <div className="text-[10px] text-slate-500">Daily Log Tidur, Nutrisi & Toilet</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-600 text-white border border-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* PENCARIAN & FILTER KONTROL BAR (Sesuai Permintaan User: Pencarian dengan Tanggal & Nama Siswa / Guru) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* 1. Search Query across Student Name / Teacher Name */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa, guru, atau judul laporan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Date Picker Filter */}
          <div className="md:col-span-4 relative flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setQuickDatePreset('all');
                }}
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 hover:bg-white focus:bg-white cursor-pointer"
                title="Pilih tanggal laporan / tenggat tugas"
              />
            </div>
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                className="p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer"
                title="Hapus filter tanggal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. Program / Role Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50/50 hover:bg-white focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">Semua Program Pengajar</option>
              <option value="sekolah_pagi">Guru Sekolah Pagi</option>
              <option value="terapi">Terapis Wicara & Sensori</option>
              <option value="shadow">Guru Shadow Teacher</option>
              <option value="daycare">Guru & Pengasuh DayCare</option>
            </select>
          </div>
        </div>

        {/* Quick Date Presets & Period Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Preset:</span>
            {[
              { id: 'all', label: 'Semua Waktu' },
              { id: 'today', label: 'Hari Ini' },
              { id: 'this_month', label: 'Bulan Ini' }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setQuickDatePreset(preset.id as any);
                  setFilterDate('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  quickDatePreset === preset.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}

            <span className="text-slate-300 mx-1 shrink-0">|</span>

            {/* Period Filters */}
            {[
              { id: 'all', label: 'Semua Periode' },
              { id: 'harian', label: 'Harian' },
              { id: 'mingguan', label: 'Mingguan' },
              { id: 'bulanan', label: 'Bulanan' },
              { id: 'tiga_bulanan', label: '3 Bulanan' },
              { id: 'enam_bulanan', label: '6 Bulanan' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedPeriod === p.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">
              Menampilkan <strong>{filteredTasks.length}</strong> laporan
            </span>
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task & Periodic Report List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada laporan yang sesuai filter</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Coba ubah tanggal pencarian, kata kunci nama guru/siswa, atau klik "Reset Filter".
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer"
            >
              Tampilkan Semua Laporan
            </button>
          </div>
        ) : (
          filteredTasks.map(t => {
            const progBadgeColor = 
              t.program === 'sekolah_pagi' ? 'bg-blue-100 text-blue-900 border-blue-200' :
              t.program === 'terapi' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
              t.program === 'shadow' ? 'bg-indigo-100 text-indigo-900 border-indigo-200' :
              'bg-amber-100 text-amber-900 border-amber-200';

            return (
              <div 
                key={t.id} 
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${progBadgeColor}`}>
                      ★ {t.program.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Periode: {t.period.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      t.status === 'disetujui' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                      t.status === 'sedang_direview' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      t.status === 'perlu_revisi' ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 font-display">
                    {t.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Pendidik: <span className="text-blue-700 font-bold">{t.teacherName}</span>
                    </span>

                    {t.studentName && (
                      <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        Siswa Binaan: <strong className="text-slate-900">{t.studentName}</strong>
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Tenggat: <strong className="text-slate-800">{t.deadline}</strong>
                      {t.submissionDate && <span> (Dikirim: {t.submissionDate})</span>}
                    </span>
                  </div>

                  {t.notes && (
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                      "{t.notes}"
                    </div>
                  )}

                  {t.reviewerNotes && (
                    <div className="text-xs text-emerald-900 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 leading-relaxed font-bold">
                      ⭐ Catatan Kepala Sekolah: "{t.reviewerNotes}"
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0">
                  {/* Principal / Admin Approve & Revision Actions */}
                  {isPrincipal && t.status !== 'disetujui' && (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        onClick={() => updateTaskStatus(t.id, 'perlu_revisi', 'Mohon lengkapi catatan evaluasi capaian stimulasi ananda.')}
                        className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer"
                      >
                        Minta Revisi
                      </button>
                      <button
                        onClick={() => updateTaskStatus(t.id, 'disetujui', 'Laporan disetujui, stimulasi perkembangan berjalan optimal.')}
                        className="px-3.5 py-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 w-full justify-end">
                    <button
                      onClick={() => handleOpenAddModal(t)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 cursor-pointer"
                      title="Edit Laporan"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {(isSuperAdmin || isPrincipal) && (
                      <button
                        onClick={() => handleDeleteTask(t)}
                        className="p-1 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer"
                        title="Hapus Laporan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================= */}
      {/* MODAL: INPUT TUGAS / LAPORAN GURU                       */}
      {/* ======================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {editingTask ? 'Edit Tugas & Laporan Guru' : 'Kirim Tugas & Laporan Guru Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Wajib untuk Guru Sekolah Pagi, Terapis, Guru Shadow, dan Guru DayCare
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Program & Teacher Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Divisi Pengajar / Program *
                  </label>
                  <select
                    value={taskProgram}
                    onChange={(e) => {
                      const newP = e.target.value as ProgramType;
                      setTaskProgram(newP);
                      handleApplyTemplate(newP);
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="sekolah_pagi">Guru Sekolah Pagi</option>
                    <option value="terapi">Terapis Wicara & Sensori</option>
                    <option value="shadow">Guru Shadow (Pendamping Khusus)</option>
                    <option value="daycare">Guru & Pengasuh DayCare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                    Pendidik Pengisi *
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Judul Tugas / Rencana Pembelajaran / Laporan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lesson Plan Mingguan: Mengenal Cuaca"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Periode Laporan</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as TaskPeriod)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="harian">Harian (Daily Assessment / Logbook)</option>
                    <option value="mingguan">Mingguan (Weekly Lesson Plan)</option>
                    <option value="bulanan">Bulanan (Monthly Progress Report)</option>
                    <option value="tiga_bulanan">Tiga Bulanan (Quarterly Review)</option>
                    <option value="enam_bulanan">Enam Bulanan (Planning Matrix SDR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Tanggal Laporan / Tenggat</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Student Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Terkait Siswa Binaan (Pilih Siswa)
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="">-- Seluruh Siswa di Kelas / Rombongan Belajar --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.nickname}) · Kelas: {s.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes / Report Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 font-display">
                    Isi Laporan / Rencana Capaian Stimulasi *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(taskProgram)}
                    className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Muat Template Bantuan
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Deskripsikan capaian aktivitas, respon anak, stimulasi motorik, komunikasi, regulasi diri, atau logbook harian..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {editingTask ? 'Simpan Perubahan' : 'Kirim Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
