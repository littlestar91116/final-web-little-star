import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Plus, 
  ExternalLink,
  Download,
  Calendar,
  Building2,
  UploadCloud,
  Sparkles
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { ProgramType } from '../../types';

export const FinanceModule: React.FC = () => {
  const { invoices, students, verifyInvoicePayment, createInvoice, uploadPaymentProof } = useSchoolData();
  const { currentUser } = useAuth();
  const isFinanceOrAdmin = ['super_admin', 'admin_sekolah', 'staff_keuangan'].includes(currentUser?.role || '');
  const isParent = currentUser?.role === 'wali_murid';
  const childId = currentUser?.childStudentId || 'std-001';
  const child = students.find(s => s.id === childId) || students[0];

  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Parent upload modal state
  const [uploadInvoiceId, setUploadInvoiceId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // New Invoice Form (for Admin / Finance)
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [invoiceProgram, setInvoiceProgram] = useState<ProgramType>('sekolah_pagi');
  const [invoiceMonth, setInvoiceMonth] = useState('November');
  const [invoiceYear, setInvoiceYear] = useState(2026);
  const [invoiceAmount, setInvoiceAmount] = useState(1250000);
  const [sessionCount, setSessionCount] = useState(8);

  // STRICTURE: Wali murid ONLY sees their child's invoices
  const baseInvoices = isParent 
    ? invoices.filter(inv => inv.studentId === child?.id)
    : invoices;

  const filteredInvoices = baseInvoices.filter(inv => {
    const matchSearch = inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProg = selectedProgram === 'all' || inv.program === selectedProgram;
    const matchStat = selectedStatus === 'all' || inv.status === selectedStatus;
    return matchSearch && matchProg && matchStat;
  });

  const totalCollected = baseInvoices.filter(i => i.status === 'lunas').reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = baseInvoices.filter(i => i.status === 'menunggu_verifikasi').reduce((acc, curr) => acc + curr.amount, 0);
  const totalUnpaid = baseInvoices.filter(i => i.status === 'belum_bayar').reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === targetStudentId);
    if (!std) return;

    createInvoice({
      studentId: targetStudentId,
      studentName: std.fullName,
      program: invoiceProgram,
      month: invoiceMonth,
      year: invoiceYear,
      amount: invoiceAmount,
      dueDate: `${invoiceYear}-11-10`,
      status: 'belum_bayar',
      paidAmount: 0,
      sessionCount: invoiceProgram === 'terapi' ? sessionCount : undefined
    });

    setShowCreateModal(false);
  };

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadInvoiceId || !proofUrl.trim()) return;

    uploadPaymentProof(uploadInvoiceId, proofUrl);
    setUploadInvoiceId(null);
    setProofUrl('');
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {isParent ? 'Tagihan SPP Ananda' : 'Modul Keuangan & SPP'}
            </span>
            <span className="text-xs text-slate-500">4 Kategori Program Terpisah</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {isParent ? 'Tagihan SPP & Status Pembayaran Ananda' : 'Pengelolaan Tagihan SPP & Verifikasi Pembayaran'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isParent 
              ? 'Rincian tagihan resmi Little Star Learning Center khusus untuk ananda tercinta.'
              : 'Sesuai PRD Section 17: SPP Sekolah Pagi, Shadow, Terapi (biaya per sesi), dan DayCare memiliki tagihan masing-masing.'}
          </p>
        </div>

        {isParent ? (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-2.5 px-3 rounded-2xl shrink-0">
            <img
              src={child.photoUrl}
              alt={child.fullName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-300"
            />
            <div>
              <div className="text-xs font-extrabold text-blue-950">{child.fullName}</div>
              <div className="text-[11px] text-blue-700 font-semibold">{child.className} · NIS: {child.nis}</div>
            </div>
          </div>
        ) : (
          isFinanceOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Buat Tagihan SPP Baru
            </button>
          )
        )}
      </div>

      {uploadSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Bukti transfer berhasil diunggah! Pihak tata usaha / staff keuangan akan segera memverifikasi.</span>
        </div>
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {isParent ? 'Total Terbayar (Lunas)' : 'Total Terkumpul (Lunas)'}
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            Rp {totalCollected.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Bulan Berjalan (Oktober 2026)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Menunggu Verifikasi
          </span>
          <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
            Rp {totalPending.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isParent ? 'Struk pembayaran sedang ditinjau sekolah' : 'Struk transfer siap dicek'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Belum Terbayar
          </span>
          <span className="text-2xl font-extrabold text-rose-600 tabular-nums">
            Rp {totalUnpaid.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {isParent ? 'Tagihan jatuh tempo tanggal 10 tiap bulan' : 'Menunggu pembayaran orang tua'}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isParent ? "Cari nomor invoice..." : "Cari berdasarkan nama siswa atau nomor invoice..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none cursor-pointer"
          >
            <option value="all">Semua Jenis SPP</option>
            <option value="sekolah_pagi">SPP Sekolah Pagi</option>
            <option value="terapi">SPP Terapi</option>
            <option value="daycare">SPP DayCare</option>
            <option value="shadow">SPP Shadow</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="lunas">Lunas</option>
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="belum_bayar">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {isParent ? `Tagihan SPP Ananda (${filteredInvoices.length})` : `Daftar Tagihan SPP (${filteredInvoices.length})`}
          </h3>
          <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-xl font-medium">
            Rekening Tujuan: <strong>BCA 8271-9982-10</strong> a.n. LITTLE STAR LEARNING CENTER
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Program SPP</th>
                <th className="py-3 px-4">Bulan / Periode</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inv.studentName}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      SPP {inv.program.replace('_', ' ')}
                    </span>
                    {inv.sessionCount && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">({inv.sessionCount} sesi)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">{inv.month} {inv.year}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      inv.status === 'lunas' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'menunggu_verifikasi' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isFinanceOrAdmin && inv.status === 'menunggu_verifikasi' && (
                        <>
                          <button
                            onClick={() => verifyInvoicePayment(inv.id, false)}
                            className="px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => verifyInvoicePayment(inv.id, true)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            Verifikasi Lunas
                          </button>
                        </>
                      )}

                      {/* Wali Murid Action: Upload Transfer Receipt */}
                      {isParent && inv.status === 'belum_bayar' && (
                        <button
                          onClick={() => setUploadInvoiceId(inv.id)}
                          className="px-3 py-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          Unggah Bukti Bayar
                        </button>
                      )}

                      {inv.status === 'lunas' && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lunas Terverifikasi
                        </span>
                      )}

                      {!isFinanceOrAdmin && inv.status === 'menunggu_verifikasi' && (
                        <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Parent Upload Payment Proof */}
      {uploadInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Unggah Bukti Transfer SPP</h3>
            <p className="text-xs text-slate-500 mb-4">
              Silakan masukkan tautan/URL gambar bukti transfer BCA Anda untuk diverifikasi oleh admin.
            </p>

            <form onSubmit={handleUploadProof} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Bukti Transfer (Image / Struk)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... atau paste link foto struk"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-200/60">
                <strong>Rekening Tujuan:</strong> BCA 8271-9982-10 a.n. LITTLE STAR LEARNING CENTER
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadInvoiceId(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs cursor-pointer"
                >
                  Kirim Bukti Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Invoice (For Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Buat Tagihan SPP Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Setiap jenis program memiliki tagihan tersendiri</p>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Siswa</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis SPP Program</label>
                <select
                  value={invoiceProgram}
                  onChange={(e) => {
                    const prog = e.target.value as ProgramType;
                    setInvoiceProgram(prog);
                    if (prog === 'sekolah_pagi') setInvoiceAmount(1250000);
                    if (prog === 'terapi') setInvoiceAmount(1600000);
                    if (prog === 'daycare') setInvoiceAmount(2200000);
                    if (prog === 'shadow') setInvoiceAmount(2500000);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="sekolah_pagi">SPP Sekolah Pagi (Rp 1.250.000)</option>
                  <option value="terapi">SPP Terapi (Rp 200.000 / sesi)</option>
                  <option value="daycare">SPP DayCare (Rp 2.200.000)</option>
                  <option value="shadow">SPP Shadow Teacher (Rp 2.500.000)</option>
                </select>
              </div>

              {invoiceProgram === 'terapi' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Sesi Terapi</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={sessionCount}
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setSessionCount(count);
                      setInvoiceAmount(count * 200000);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Khusus Terapi, biaya disesuaikan jumlah sesi di bulan tersebut
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Tagihan (Rp)</label>
                <input
                  type="number"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan</label>
                  <select
                    value={invoiceMonth}
                    onChange={(e) => setInvoiceMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={invoiceYear}
                    onChange={(e) => setInvoiceYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Buat Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
