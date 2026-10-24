import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  X, 
  CheckCircle2, 
  Baby, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { ProgramType } from '../../types';
import { Logo } from '../common/Logo';

interface AdmissionRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionRegistrationModal: React.FC<AdmissionRegistrationModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { addAdmission } = useSchoolData();
  const { settings, getWhatsAppUrl } = useSiteSettings();

  // Step state: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdAppNumber, setCreatedAppNumber] = useState('');
  const [submittedChildName, setSubmittedChildName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [childName, setChildName] = useState('');
  const [childNickname, setChildNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('2022-06-15');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<ProgramType[]>(['sekolah_pagi']);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Document checkboxes
  const [hasBirthCert, setHasBirthCert] = useState(true);
  const [hasFamilyCard, setHasFamilyCard] = useState(true);
  const [hasChildPhoto, setHasChildPhoto] = useState(true);

  const programOptions: { id: ProgramType; label: string; desc: string; icon: string }[] = [
    { 
      id: 'sekolah_pagi', 
      label: settings.programNames.sekolah_pagi || 'Sekolah Pagi (Inklusif)', 
      desc: 'Kelas PAUD & TK stimulasi holistik', 
      icon: '🏫' 
    },
    { 
      id: 'terapi', 
      label: settings.programNames.terapi || 'Layanan Terapi Terpadu', 
      desc: 'Sensori Integrasi, Wicara & Okupasi', 
      icon: '🧩' 
    },
    { 
      id: 'daycare', 
      label: settings.programNames.daycare || 'DayCare Edukatif', 
      desc: 'Pengasuhan bernutrisi & bermain aktif', 
      icon: '🧸' 
    },
    { 
      id: 'shadow', 
      label: settings.programNames.shadow || 'Shadow Teacher Pendamping', 
      desc: 'Pendampingan one-on-one di kelas', 
      icon: '🤝' 
    }
  ];

  const toggleProgram = (prog: ProgramType) => {
    setSelectedPrograms(prev => 
      prev.includes(prog)
        ? (prev.length > 1 ? prev.filter(p => p !== prog) : prev)
        : [...prev, prog]
    );
  };

  const handleResetAndClose = () => {
    setStep('form');
    setChildName('');
    setChildNickname('');
    setBirthPlace('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setAddress('');
    setPaymentProofUrl('');
    setNotes('');
    setSelectedPrograms(['sekolah_pagi']);
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!childName.trim()) {
      setErrorMsg('Mohon isi nama lengkap calon siswa.');
      return;
    }
    if (!parentName.trim()) {
      setErrorMsg('Mohon isi nama orang tua atau wali murid.');
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMsg('Mohon isi nomor WhatsApp orang tua yang aktif.');
      return;
    }
    if (selectedPrograms.length === 0) {
      setErrorMsg('Mohon pilih minimal satu program sekolah.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      try {
        const generatedId = addAdmission({
          childName: childName.trim(),
          childNickname: childNickname.trim() || childName.trim().split(' ')[0],
          gender,
          birthDate,
          birthPlace: birthPlace.trim() || 'Jakarta',
          parentName: parentName.trim(),
          parentPhone: parentPhone.trim(),
          parentEmail: parentEmail.trim(),
          address: address.trim(),
          selectedPrograms,
          documents: {
            birthCertificate: hasBirthCert,
            familyCard: hasFamilyCard,
            childPhoto: hasChildPhoto
          },
          adminFeeAmount: settings.admissionFee,
          paymentStatus: paymentProofUrl.trim() ? 'menunggu_verifikasi' : 'belum_bayar',
          paymentProofUrl: paymentProofUrl.trim() || undefined,
          observationStatus: 'belum_dijadwalkan',
          admissionDecision: 'menunggu_observasi',
          notes: notes.trim()
        });

        const appNum = `PSB-2026-${Math.floor(100 + Math.random() * 900)}`;
        setCreatedAppNumber(appNum);
        setSubmittedChildName(childName.trim());
        setSubmitting(false);
        setStep('success');
      } catch (err) {
        setSubmitting(false);
        setErrorMsg('Terjadi kendala teknis saat menyimpan pendaftaran. Silakan coba kembali.');
      }
    }, 400);
  };

  const waConfirmationUrl = getWhatsAppUrl(
    `Assalamu’alaikum warahmatullahi wabarakatuh. Selamat pagi/siang Tim PSB ${settings.schoolName} ${settings.schoolUnit}. Saya ${parentName || 'Orang Tua'} ingin mengonfirmasi pendaftaran calon siswa baru atas nama ananda ${submittedChildName || childName} dengan nomor registrasi ${createdAppNumber || 'PSB-2026'}. Mohon informasi tahapan observasi selanjutnya. Terima kasih.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-300/60 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Royal Jewel Line */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 via-sky-400 to-emerald-400 shrink-0" />

            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-blue-50/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-tr from-amber-400 to-yellow-400 text-slate-950 rounded-2xl shadow-sm">
                  <UserPlus className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-900 border border-amber-300">
                      PSB 2026 / 2027
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Pendaftaran Resmi</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                    Pendaftaran Siswa Baru (PSB Online)
                  </h2>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup Formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Alert Error */}
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{errorMsg}</span>
                    </motion.div>
                  )}

                  {/* Section 1: Data Calon Siswa */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Baby className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
                        1. Data Calon Siswa (Ananda)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Nama Lengkap Anak <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Muhammad Dylan Al-Fatih"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Nama Panggilan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Dylan"
                          value={childNickname}
                          onChange={(e) => setChildNickname(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Jenis Kelamin <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setGender('L')}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              gender === 'L'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Laki-laki
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender('P')}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              gender === 'P'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Perempuan
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Kota Kelahiran
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Jakarta"
                          value={birthPlace}
                          onChange={(e) => setBirthPlace(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Tanggal Lahir <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Pilihan Program Sekolah */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
                          2. Pilihan Program Sekolah <span className="text-rose-500">*</span>
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">Boleh pilih lebih dari satu</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {programOptions.map(prog => {
                        const isSelected = selectedPrograms.includes(prog.id);
                        return (
                          <div
                            key={prog.id}
                            onClick={() => toggleProgram(prog.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-400 shadow-xs ring-1 ring-blue-400'
                                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{prog.icon}</span>
                              <div>
                                <div className="text-xs font-bold text-slate-900 leading-tight">
                                  {prog.label}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  {prog.desc}
                                </div>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Data Orang Tua / Wali */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
                        3. Data Orang Tua / Wali Murid
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Nama Lengkap Ayah / Bunda <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rahmat Hidayat, S.T."
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="0812-3456-7890"
                            value={parentPhone}
                            onChange={(e) => setParentPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Alamat Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="ayah.bunda@gmail.com"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                          Alamat Rumah Tinggal
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Jl. Anggrek No. 12, Jakarta"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Riwayat Perkembangan Anak */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
                        4. Catatan Kebutuhan & Riwayat Perkembangan
                      </h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 font-display">
                        Informasi Khusus Ananda (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Riwayat keterlambatan bicara (speech delay), tantrum, alergi makanan, atau kebiasaan motorik..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Dokumen Kesiapan */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-600 mb-2">
                        Dokumen Administrasi yang Disiapkan untuk Observasi:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { label: 'Akta Kelahiran', checked: hasBirthCert, toggle: () => setHasBirthCert(!hasBirthCert) },
                          { label: 'Kartu Keluarga', checked: hasFamilyCard, toggle: () => setHasFamilyCard(!hasFamilyCard) },
                          { label: 'Foto Calon Siswa', checked: hasChildPhoto, toggle: () => setHasChildPhoto(!hasChildPhoto) }
                        ].map((doc, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={doc.checked}
                              onChange={doc.toggle}
                              className="rounded text-amber-500 focus:ring-amber-400"
                            />
                            <span>{doc.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Biaya Formulir & Pembayaran */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-yellow-50/40 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4.5 h-4.5 text-amber-600" />
                        <div>
                          <div className="text-xs font-black text-slate-900 font-display">
                            Biaya Formulir & Observasi Tim Ahli
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Termasuk konsultasi psikolog/terapis & laporan tertulis
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-700 font-display">
                          Rp {settings.admissionFee.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-amber-200/60 font-mono">
                      Transfer Bank: <strong className="text-slate-900">{settings.bankName} {settings.bankAccountNumber}</strong> a.n. <strong>{settings.bankAccountHolder}</strong>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tautan Bukti Transfer (Opsional, dapat dikirim via WhatsApp nanti)
                      </label>
                      <input
                        type="url"
                        placeholder="https://... atau kirim bukti via WA"
                        value={paymentProofUrl}
                        onChange={(e) => setPaymentProofUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-500/25 cursor-pointer uppercase tracking-wider flex items-center gap-2"
                    >
                      {submitting ? (
                        <span>Menyimpan Formulir...</span>
                      ) : (
                        <>
                          <span>Kirim Pendaftaran Online</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 text-center space-y-5"
                >
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-xl mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Pendaftaran Berhasil Masuk
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                      Alhamdulillah, Berkas Terkirim!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Terima kasih atas kepercayaan Ayah & Bunda. Data calon siswa <strong>{submittedChildName}</strong> telah tercatat di sistem Little Star Learning Center.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Nomor Registrasi:</span>
                      <span className="font-mono font-black text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
                        {createdAppNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Calon Siswa:</span>
                      <span className="font-bold text-slate-900">{submittedChildName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Program:</span>
                      <span className="font-bold text-amber-700 uppercase">
                        {selectedPrograms.map(p => p.replace('_', ' ')).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status Awal:</span>
                      <span className="font-bold text-emerald-700">Menunggu Observasi</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={waConfirmationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 cursor-pointer uppercase tracking-wider"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi via WhatsApp Sekarang</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Selesai & Tutup
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
