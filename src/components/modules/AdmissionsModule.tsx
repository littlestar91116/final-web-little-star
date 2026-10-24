import React, { useState } from 'react';
import { 
  UserPlus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  UploadCloud, 
  Eye, 
  UserCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { ProgramType } from '../../types';

export const AdmissionsModule: React.FC = () => {
  const { 
    admissions, 
    observationSlots, 
    addAdmission, 
    verifyAdmissionPayment, 
    bookObservationSlot,
    createObservationSlot,
    admitStudentFromAdmission
  } = useSchoolData();

  const { currentUser } = useAuth();
  const isAdminOrPrincipal = ['super_admin', 'admin_sekolah', 'kepala_sekolah'].includes(currentUser?.role || '');

  // Form states for new application
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childNickname, setChildNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthDate, setBirthDate] = useState('2022-05-10');
  const [birthPlace, setBirthPlace] = useState('Jakarta');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<ProgramType[]>(['sekolah_pagi']);
  const [notes, setNotes] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');

  // Observation booking modal
  const [selectedAdmForObs, setSelectedAdmForObs] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState('');

  // Convert to student modal
  const [admittingAdmId, setAdmittingAdmId] = useState<string | null>(null);
  const [targetClass, setTargetClass] = useState('Bintang Kejora (Kelas A)');

  const toggleProgram = (prog: ProgramType) => {
    setSelectedPrograms(prev => 
      prev.includes(prog) ? prev.filter(p => p !== prog) : [...prev, prog]
    );
  };

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !parentName.trim() || selectedPrograms.length === 0) {
      alert('Mohon isi nama anak, nama orang tua, dan minimal pilih satu program.');
      return;
    }

    addAdmission({
      childName,
      childNickname: childNickname || childName.split(' ')[0],
      gender,
      birthDate,
      birthPlace,
      parentName,
      parentPhone,
      parentEmail,
      address,
      selectedPrograms,
      documents: {
        birthCertificate: true,
        familyCard: true,
        childPhoto: true
      },
      adminFeeAmount: 500000,
      paymentStatus: paymentProofUrl ? 'menunggu_verifikasi' : 'belum_bayar',
      paymentProofUrl: paymentProofUrl || undefined,
      observationStatus: 'belum_dijadwalkan',
      admissionDecision: 'menunggu_observasi',
      notes
    });

    // Reset form
    setChildName('');
    setChildNickname('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setAddress('');
    setPaymentProofUrl('');
    setNotes('');
    setShowApplyModal(false);
  };

  const handleConfirmObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmForObs || !selectedSlotId) return;

    bookObservationSlot(selectedAdmForObs, selectedSlotId);
    setSelectedAdmForObs(null);
    setSelectedSlotId('');
  };

  const handleConfirmAdmit = () => {
    if (!admittingAdmId) return;
    admitStudentFromAdmission(admittingAdmId, targetClass);
    setAdmittingAdmId(null);
    alert('Siswa berhasil diterima dan terdaftar ke dalam Database Siswa Aktif!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Apply Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Penerimaan Siswa Baru (PSB)
            </span>
            <span className="text-xs text-slate-500">Tahun Ajaran 2026/2027</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Alur Pendaftaran & Observasi Calon Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulir pendaftaran multi-program, verifikasi administrasi, dan penjadwalan observasi terintegrasi.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Daftarkan Calon Siswa Baru
        </button>
      </div>

      {/* Flow Explanation Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-blue-600 block">Langkah 1</span>
          <span className="text-xs font-bold text-slate-800">Pendaftaran Online</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-amber-600 block">Langkah 2</span>
          <span className="text-xs font-bold text-slate-800">Biaya Administrasi</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-emerald-600 block">Langkah 3</span>
          <span className="text-xs font-bold text-slate-800">Verifikasi Admin</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-indigo-600 block">Langkah 4</span>
          <span className="text-xs font-bold text-slate-800">Pilih Slot Observasi</span>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Daftar Berkas Calon Siswa ({admissions.length})</h3>
          <span className="text-xs text-slate-400">Diurutkan dari pendaftaran terkini</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">No. Pendaftaran</th>
                <th className="py-3 px-4">Nama Calon Siswa</th>
                <th className="py-3 px-4">Orang Tua / Kontak</th>
                <th className="py-3 px-4">Program Pilihan</th>
                <th className="py-3 px-4">Biaya Pendaftaran</th>
                <th className="py-3 px-4">Status Observasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {admissions.map(adm => {
                const isPaid = adm.paymentStatus === 'terverifikasi';
                const hasObsSlot = adm.observationStatus === 'terjadwal';
                const isAdmitted = adm.admissionDecision === 'diterima';

                return (
                  <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{adm.applicationNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{adm.childName}</div>
                      <div className="text-[11px] text-slate-500">{adm.gender === 'L' ? 'Laki-laki' : 'Perempuan'} · Lahir: {adm.birthDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{adm.parentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{adm.parentPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {adm.selectedPrograms.map(p => (
                          <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 tabular-nums">
                        Rp {adm.adminFeeAmount.toLocaleString('id-ID')}
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                        adm.paymentStatus === 'terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                        adm.paymentStatus === 'menunggu_verifikasi' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {adm.paymentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {hasObsSlot ? (
                        <div className="text-[11px]">
                          <div className="font-bold text-emerald-700">{adm.observationSlot?.date}</div>
                          <div className="text-slate-500">{adm.observationSlot?.time}</div>
                          <div className="text-[10px] text-slate-400">{adm.observationSlot?.room}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {isPaid ? 'Siap pilih jadwal' : 'Terkunci (menunggu verifikasi bayar)'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Admin verify payment button */}
                        {isAdminOrPrincipal && adm.paymentStatus === 'menunggu_verifikasi' && (
                          <button
                            onClick={() => verifyAdmissionPayment(adm.id, true)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          >
                            Verifikasi
                          </button>
                        )}

                        {/* Booking observation slot (Only permitted after payment is verified) */}
                        {isPaid && !hasObsSlot && (
                          <button
                            onClick={() => setSelectedAdmForObs(adm.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-2xs"
                          >
                            Pilih Jadwal Observasi
                          </button>
                        )}

                        {/* Convert to active student */}
                        {isAdminOrPrincipal && hasObsSlot && !isAdmitted && (
                          <button
                            onClick={() => setAdmittingAdmId(adm.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Terima Siswa
                          </button>
                        )}

                        {isAdmitted && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Siswa Aktif
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation Slots Schedule Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ketersediaan Slot Observasi Calon Siswa</h3>
            <p className="text-xs text-slate-500">Kapasitas terbatas untuk mencegah pemesanan ganda (Double Booking Protection)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {observationSlots.map(slot => {
            const isFull = slot.bookedCount >= slot.capacity;
            return (
              <div key={slot.id} className={`p-4 rounded-xl border ${isFull ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-blue-50/50 border-blue-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">{slot.date}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isFull ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isFull ? 'Penuh' : `Tersedia (${slot.capacity - slot.bookedCount})`}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-900">{slot.timeSlot}</div>
                <div className="text-[11px] text-slate-500 mt-1">{slot.room}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Assessor: {slot.assessorName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: New Admission Application */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Formulir Pendaftaran Siswa Baru (PSB)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Lengkapi data calon peserta didik dan pilihan program Little Star Learning Center
            </p>

            <form onSubmit={handleCreateAdmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Anak *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rayyan"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rayyan"
                    value={childNickname}
                    onChange={(e) => setChildNickname(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Multi-Select Programs (Section 9.1 PRD) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilihan Program (Boleh Pilih Lebih Dari Satu) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sekolah_pagi', label: 'Sekolah Pagi (Early Childhood)' },
                    { id: 'terapi', label: 'Layanan Terapi (Wicara/Sensori)' },
                    { id: 'daycare', label: 'DayCare Edukatif' },
                    { id: 'shadow', label: 'Shadow Teacher Pendamping' }
                  ].map(p => {
                    const isChecked = selectedPrograms.includes(p.id as ProgramType);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleProgram(p.id as ProgramType)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.label}</span>
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rahmat Hidayat"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Rumah Lengkap</label>
                <input
                  type="text"
                  placeholder="Jl. Bunga Melati No. 10, Jakarta"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Bukti Transfer Biaya Formulir (Rp 500.000)
                </label>
                <input
                  type="url"
                  placeholder="https://... atau biarkan kosong jika transfer nanti"
                  value={paymentProofUrl}
                  onChange={(e) => setPaymentProofUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  BCA 8271-9982-10 a.n. LITTLE STAR LEARNING CENTER
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Khusus Perkembangan Awal</label>
                <textarea
                  rows={2}
                  placeholder="Informasi kebutuhan khusus, alergi, atau riwayat tumbuh kembang..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Kirim Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Book Observation Slot */}
      {selectedAdmForObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Pilih Jadwal Observasi Calon Siswa</h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih slot waktu yang tersedia untuk pelaksanaan observasi perkembangan anak
            </p>

            <form onSubmit={handleConfirmObservation} className="space-y-4">
              <div className="space-y-2">
                {observationSlots.map(slot => {
                  const isFull = slot.bookedCount >= slot.capacity;
                  const isSelected = selectedSlotId === slot.id;

                  return (
                    <button
                      type="button"
                      disabled={isFull}
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                        isFull
                          ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 text-amber-950 font-bold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{slot.date} | {slot.timeSlot}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Sisa: {slot.capacity - slot.bookedCount} slot
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {slot.room} · Assessor: {slot.assessorName}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAdmForObs(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlotId}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 rounded-xl shadow-2xs"
                >
                  Konfirmasi Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admit Student into active class */}
      {admittingAdmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Konfirmasi Penerimaan Siswa Aktif</h3>
            <p className="text-xs text-slate-500 mb-4">
              Calon siswa telah menyelesaikan observasi dan dinyatakan diterima. Pilih kelas awal untuk siswa ini.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Penempatan Kelas</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                >
                  <option value="Bintang Kejora (Kelas A)">Bintang Kejora (Kelas A)</option>
                  <option value="Bintang Timur (Playgroup)">Bintang Timur (Playgroup)</option>
                  <option value="Bintang Kecil (Toddler)">Bintang Kecil (Toddler)</option>
                  <option value="Kelas Terapi & Sensori">Kelas Terapi & Sensori</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                Sistem akan membuat nomor induk siswa (NIS) resmi dan menghubungkan data orang tua secara otomatis tanpa input ulang.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdmittingAdmId(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmAdmit}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs"
                >
                  Terima Menjadi Siswa Aktif
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
