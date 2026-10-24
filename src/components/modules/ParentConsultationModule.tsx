import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  Video, 
  MapPin, 
  Plus, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';

export const ParentConsultationModule: React.FC = () => {
  const { students, staff, consultations, addConsultationRequest } = useSchoolData();
  const { currentUser } = useAuth();

  // STRICTURE: Wali murid can ONLY view and request consultations for their own child
  const childId = currentUser?.childStudentId || 'std-001';
  const child = students.find(s => s.id === childId) || students[0];

  const parentConsultations = consultations.filter(c => c.studentId === child?.id);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [targetRole, setTargetRole] = useState<'kepala_sekolah' | 'guru_sekolah_pagi' | 'terapis' | 'shadow_teacher'>('kepala_sekolah');
  const [topic, setTopic] = useState('Evaluasi Perkembangan & Rapor');
  const [proposedDate, setProposedDate] = useState('2026-10-28');
  const [proposedTime, setProposedTime] = useState('10:00 WIB');
  const [consultationType, setConsultationType] = useState<'tatap_muka' | 'online_zoom' | 'panggilan_telepon'>('tatap_muka');
  const [notes, setNotes] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!child) return;

    addConsultationRequest({
      studentId: child.id,
      studentName: child.fullName,
      parentName: currentUser?.name || child.parent.fatherName,
      parentPhone: child.parent.whatsapp || '0812-9988-1122',
      targetRole,
      topic,
      notes,
      requestedDate: proposedDate,
      preferredTime: proposedTime,
      consultationType
    });

    setShowForm(false);
    setNotes('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Layanan Konsultasi & Supervisi
            </span>
            <span className="text-xs text-slate-500">Khusus Wali Murid</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Pengajuan Supervisi & Konsultasi Ananda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fasilitas komunikasi terarah bersama Kepala Sekolah, Guru Kelas, maupun Terapis ananda tercinta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-purple-50/80 border border-purple-200/80 p-2.5 px-3 rounded-2xl shrink-0">
            <img
              src={child.photoUrl}
              alt={child.fullName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-300"
            />
            <div>
              <div className="text-xs font-extrabold text-purple-950">{child.fullName}</div>
              <div className="text-[11px] text-purple-700 font-semibold">{child.className} · NIS: {child.nis}</div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-2xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Tutup Formulir' : 'Ajukan Konsultasi'}
          </button>
        </div>
      </div>

      {showToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengajuan supervisi/konsultasi Anda telah terkirim! Pihak sekolah akan segera mengonfirmasi jadwal pertemuan.</span>
        </div>
      )}

      {/* FORM: Ajukan Konsultasi */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-md animate-fadeIn space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              Formulir Pengajuan Supervisi & Konsultasi Baru
            </h3>
            <p className="text-xs text-slate-500">
              Silakan isi jadwal yang diinginkan dan topik yang ingin didiskusikan bersama tim sekolah.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pihak yang Dituju untuk Konsultasi
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="kepala_sekolah">Kepala Sekolah (Ibu Sarah Wijaya, M.Pd.)</option>
                  <option value="guru_sekolah_pagi">Guru Kelas (Ibu Ratna Dewi, S.Pd.)</option>
                  <option value="terapis">Terapis Okupasi & Sensori (Bapak Doni Prasetyo, S.Tr.Kes.)</option>
                  <option value="shadow_teacher">Guru Pendamping Khusus (Shadow Teacher)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bentuk Pertemuan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType('tatap_muka')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      consultationType === 'tatap_muka'
                        ? 'bg-purple-50 border-purple-500 text-purple-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Tatap Muka di Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('online_zoom')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      consultationType === 'online_zoom'
                        ? 'bg-purple-50 border-purple-500 text-purple-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Online Google Meet / Zoom
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik Utama Konsultasi
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Evaluasi Perkembangan & Rapor">Evaluasi Perkembangan & Rapor SDR</option>
                  <option value="Kendala Perilaku & Sensori di Rumah">Kendala Perilaku & Sensori di Rumah</option>
                  <option value="Penyesuaian Program / Shadow Teacher">Penyesuaian Program / Shadow Teacher</option>
                  <option value="Supervisi Sesi Kelas / Observasi Orang Tua">Permohonan Supervisi Sesi Kelas</option>
                  <option value="Lainnya">Diskusi Khusus Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usulan Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usulan Jam / Waktu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 10:00 WIB atau Pukul 13:30 WIB"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan atau Hal Khusus yang Ingin Dibahas
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan latar belakang pertanyaan atau observasi ananda di rumah yang ingin dikonsultasikan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Kirimkan Pengajuan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History of Consultation Requests */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Pengajuan Konsultasi & Supervisi Ananda ({parentConsultations.length})
            </h3>
            <p className="text-xs text-slate-400">
              Pantau jadwal yang telah disetujui dan masukan resmi dari pihak sekolah
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Respon Maksimal 1x24 Jam
          </span>
        </div>

        {parentConsultations.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {parentConsultations.map(cst => (
              <div key={cst.id} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      cst.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' :
                      cst.status === 'menunggu_konfirmasi' ? 'bg-amber-100 text-amber-800' :
                      cst.status === 'selesai' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {cst.status === 'disetujui' ? '✓ Jadwal Disetujui' :
                       cst.status === 'menunggu_konfirmasi' ? '⏳ Menunggu Konfirmasi Sekolah' :
                       cst.status === 'selesai' ? '★ Pertemuan Selesai' : 'Dibatalkan'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Diajukan: {cst.createdAt}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    {cst.consultationType === 'tatap_muka' ? (
                      <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Tatap Muka di Sekolah
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Video className="w-3.5 h-3.5 text-blue-600" /> Online Google Meet / Zoom
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{cst.topic}</h4>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4">
                    <span>
                      Pihak Dituju: <strong className="text-slate-800 capitalize">{cst.targetRole.replace(/_/g, ' ')}</strong>
                    </span>
                    <span>
                      Jadwal Diusulkan: <strong className="text-slate-800">{cst.requestedDate} ({cst.preferredTime})</strong>
                    </span>
                  </div>
                  {cst.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed italic">
                      "{cst.notes}"
                    </p>
                  )}
                </div>

                {/* Feedback / Confirmed Info from School */}
                {cst.confirmedDate && (
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                    <div className="font-bold text-purple-950 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-purple-700" />
                      Konfirmasi Resmi Pihak Sekolah:
                    </div>
                    <div className="text-purple-900">
                      Jadwal Pasti: <strong>{cst.confirmedDate}</strong> pukul <strong>{cst.confirmedTime}</strong>
                    </div>
                    {cst.feedbackNotes && (
                      <div className="text-purple-800 pt-1">
                        Catatan Respon: "{cst.feedbackNotes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p>Belum ada riwayat pengajuan konsultasi untuk ananda.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-purple-600 font-bold hover:underline cursor-pointer"
            >
              Klik di sini untuk membuat pengajuan baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
