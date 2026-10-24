import React, { useState } from 'react';
import { 
  Sun, 
  HeartHandshake, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle2,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  CreditCard,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { SchoolProgramDetail, ProgramType } from '../../types';

export const ProgramsModule: React.FC = () => {
  const { detailedPrograms, addProgram, updateProgram, deleteProgram } = useSchoolData();
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Modal State for Add / Edit Program
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SchoolProgramDetail | null>(null);

  // Form Fields
  const [progCode, setProgCode] = useState<ProgramType | string>('sekolah_pagi');
  const [progTitle, setProgTitle] = useState('');
  const [progShortDesc, setProgShortDesc] = useState('');
  const [progSchedule, setProgSchedule] = useState('');
  const [progAgeGroup, setProgAgeGroup] = useState('');
  const [progPointsText, setProgPointsText] = useState('');
  const [progSpesial, setProgSpesial] = useState('');
  const [progFee, setProgFee] = useState('');
  const [progBadgeColor, setProgBadgeColor] = useState('from-blue-600 to-indigo-600');
  const [progIconName, setProgIconName] = useState('Sun');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'HeartHandshake': return HeartHandshake;
      case 'Sparkles': return Sparkles;
      case 'UserCheck': return UserCheck;
      default: return Sun;
    }
  };

  const handleOpenProgramModal = (prog?: SchoolProgramDetail) => {
    if (prog) {
      setEditingProgram(prog);
      setProgCode(prog.code);
      setProgTitle(prog.title);
      setProgShortDesc(prog.shortDesc);
      setProgSchedule(prog.schedule);
      setProgAgeGroup(prog.ageGroup);
      setProgPointsText(prog.points.join('\n'));
      setProgSpesial(prog.spesial);
      setProgFee(prog.fee || '');
      setProgBadgeColor(prog.badgeColor || 'from-blue-600 to-indigo-600');
      setProgIconName(prog.iconName || 'Sun');
    } else {
      setEditingProgram(null);
      setProgCode('sekolah_pagi');
      setProgTitle('');
      setProgShortDesc('');
      setProgSchedule('Senin - Jumat | 08.00 - 11.30 WIB');
      setProgAgeGroup('2 - 6 Tahun');
      setProgPointsText('Sensory Play & Eksplorasi Kreatif\nPra-Literasi & Pra-Matematika Menyenangkan\nPembiasaan Adab & Kemandirian');
      setProgSpesial('Didampingi psikolog dan guru bersertifikasi');
      setProgFee('Rp 1.500.000 / bulan');
      setProgBadgeColor('from-blue-600 to-indigo-600');
      setProgIconName('Sun');
    }
    setShowProgramModal(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim()) return;

    const pointsArray = progPointsText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (editingProgram) {
      updateProgram(editingProgram.id, {
        code: progCode,
        title: progTitle.trim(),
        shortDesc: progShortDesc.trim(),
        schedule: progSchedule.trim(),
        ageGroup: progAgeGroup.trim(),
        points: pointsArray.length > 0 ? pointsArray : ['Stimulasi terpadu holistik'],
        spesial: progSpesial.trim() || 'Layanan unggulan inklusif',
        fee: progFee.trim() || 'Rp 1.500.000 / bulan',
        badgeColor: progBadgeColor,
        iconName: progIconName
      });
      showToast(`Program sekolah "${progTitle}" berhasil diperbarui!`);
    } else {
      addProgram({
        code: progCode,
        title: progTitle.trim(),
        shortDesc: progShortDesc.trim(),
        schedule: progSchedule.trim() || 'Senin - Jumat',
        ageGroup: progAgeGroup.trim() || 'Anak Usia Dini',
        points: pointsArray.length > 0 ? pointsArray : ['Stimulasi tumbuh kembang anak'],
        spesial: progSpesial.trim() || 'Pendekatan ramah anak',
        fee: progFee.trim() || 'Hubungi Admin',
        badgeColor: progBadgeColor,
        iconName: progIconName
      });
      showToast(`Program sekolah baru "${progTitle}" berhasil ditambahkan!`);
    }

    setShowProgramModal(false);
  };

  const handleDeleteProgram = (prog: SchoolProgramDetail) => {
    if (confirm(`Apakah Anda yakin ingin menghapus program "${prog.title}"?`)) {
      deleteProgram(prog.id);
      showToast(`Program "${prog.title}" berhasil dihapus.`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-amber-300/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 fill-slate-950" />
              Kurikulum & Layanan Terpadu
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">Little Star Master Programs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-2">
            Program Sekolah & Layanan Unggulan
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium mt-1">
            Super Admin dapat menambah program baru, mengedit jadwal, rentang usia, rincian keunggulan fasilitas, tarif biaya pendidikan, hingga menghapus program.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => handleOpenProgramModal()}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-400/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Tambah Program Baru</span>
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-600 text-white border border-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailedPrograms.map(prog => {
          const IconComponent = getIcon(prog.iconName);

          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Header Badge & Age */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${prog.badgeColor || 'from-blue-600 to-indigo-600'} text-white flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl uppercase tracking-wider font-display">
                      Usia: {prog.ageGroup}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{prog.schedule}</span>
                  </span>
                </div>

                {/* Title & Short Description */}
                <h3 className="text-lg font-black text-slate-900 font-display mb-2 group-hover:text-blue-700 transition-colors">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {prog.shortDesc}
                </p>

                {/* Points / Facilities */}
                <div className="space-y-2 mb-5 bg-gradient-to-r from-slate-50/90 to-blue-50/30 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
                  <div className="font-black text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fasilitas & Keunggulan Program:</span>
                  </div>
                  {prog.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-700">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Special Tag, Fee, and Super Admin Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-amber-900 font-bold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{prog.spesial}</span>
                  </span>

                  {prog.fee && (
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-display">
                      Investasi: {prog.fee}
                    </span>
                  )}
                </div>

                {/* Super Admin Control Buttons */}
                {isSuperAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenProgramModal(prog)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Program</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProgram(prog)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================= */}
      {/* MODAL: TAMBAH / EDIT PROGRAM SEKOLAH                    */}
      {/* ======================================================= */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {editingProgram ? 'Edit Detail Program Sekolah' : 'Tambah Program Sekolah Baru'}
                </h3>
                <p className="text-xs text-slate-500">Konfigurasi kurikulum, jadwal, usia, keunggulan, dan tarif biaya</p>
              </div>
              <button
                onClick={() => setShowProgramModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Judul Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Program Sekolah Pagi (Early Childhood Education)"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Kode Kategori Program</label>
                  <select
                    value={progCode}
                    onChange={(e) => setProgCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="sekolah_pagi">Sekolah Pagi</option>
                    <option value="terapi">Layanan Terapi Terpadu</option>
                    <option value="daycare">DayCare Edukatif</option>
                    <option value="shadow">Shadow Teacher</option>
                    <option value="custom">Program Khusus / Tambahan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Kelompok Usia</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2 - 6 Tahun"
                    value={progAgeGroup}
                    onChange={(e) => setProgAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Jadwal Operasional</label>
                  <input
                    type="text"
                    placeholder="Senin - Jumat | 08.00 - 11.30 WIB"
                    value={progSchedule}
                    onChange={(e) => setProgSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Standar Biaya / Investasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 1.500.000 / bulan"
                    value={progFee}
                    onChange={(e) => setProgFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Deskripsi Singkat Program</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan ringkas tentang tujuan dan keutamaan program..."
                  value={progShortDesc}
                  onChange={(e) => setProgShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                  Poin Fasilitas & Keunggulan (Pisahkan dengan baris baru / Enter)
                </label>
                <textarea
                  rows={4}
                  placeholder="Sensory Play Harian&#10;Rasio Guru 1:5&#10;Ruang Kelas Ber-AC&#10;Evaluasi Terpadu"
                  value={progPointsText}
                  onChange={(e) => setProgPointsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Keistimewaan Khusus (Highlight Banner)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pendekatan Inklusif ramah neurodiversitas"
                  value={progSpesial}
                  onChange={(e) => setProgSpesial(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-amber-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {editingProgram ? 'Simpan Perubahan' : 'Tambah Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
