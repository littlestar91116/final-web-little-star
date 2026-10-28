import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  AlertTriangle, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X, 
  ArrowRight, 
  Calendar, 
  UserCheck, 
  Sparkles,
  MessageCircle,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { AccountLockStatus, markInvoicePaymentProof } from '../../lib/accountLockService';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

interface AccountFrozenModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockStatus: AccountLockStatus | null;
  onPaymentSuccess?: () => void;
}

export const AccountFrozenModal: React.FC<AccountFrozenModalProps> = ({
  isOpen,
  onClose,
  lockStatus,
  onPaymentSuccess
}) => {
  const { directLoginAs, accounts } = useAuth();
  const { uploadPaymentProof } = useSchoolData();

  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [senderBank, setSenderBank] = useState('Bank Mandiri');
  const [senderName, setSenderName] = useState('');
  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80');
  const [submitting, setSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen || !lockStatus) return null;

  const unpaidList = lockStatus.unpaidInvoices || [];
  const totalDebt = lockStatus.totalUnpaidAmount || 0;

  const handleCopy = (text: string, bankId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      // Mark all unpaid invoices as paid / awaiting verification
      unpaidList.forEach(inv => {
        markInvoicePaymentProof(inv.id, proofUrl, inv.amount);
        try {
          uploadPaymentProof(inv.id, proofUrl);
        } catch {
          // ignore if outside provider
        }
      });

      setSubmitting(false);
      setPaymentDone(true);

      // Auto-unlock parent account
      setTimeout(() => {
        const parentAccount = accounts.find(a => a.childStudentId === unpaidList[0]?.studentId);
        if (parentAccount) {
          directLoginAs(parentAccount);
        }
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        onClose();
      }, 2000);
    }, 1200);
  };

  const waMessage = encodeURIComponent(
    `Assalamu'alaikum Admin Keuangan Little Star. Saya wali murid dari ${lockStatus.childName || 'Siswa'}. Saya ingin konfirmasi pembayaran SPP sebesar Rp ${totalDebt.toLocaleString('id-ID')} agar pembekuan akun dapat dibuka kembali. Terima kasih.`
  );
  const waUrl = `https://wa.me/6282199988769?text=${waMessage}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-rose-300 overflow-hidden my-auto"
        >
          {/* Top Amber-Rose Strip */}
          <div className="h-2.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-7 space-y-5 max-h-[88vh] overflow-y-auto">
            {/* Header Lock Alert */}
            <div className="text-center space-y-2 pt-2">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-3xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-600 mx-auto shadow-inner animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Akses Masuk Terkunci Otomatis
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Pemberitahuan Pembekuan Akun Wali Murid
                </h2>
                <p className="text-xs text-rose-700 font-semibold max-w-md mx-auto mt-1 leading-relaxed">
                  Akun mulai terkunci secara otomatis dari tanggal 1 setiap bulannya jika belum dilakukan pembayaran SPP ananda.
                </p>
              </div>
            </div>

            {/* Success State */}
            {paymentDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-900 font-display">
                    Konfirmasi Pembayaran Berhasil Diterima!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    Pembekuan akun telah dicabut. Sistem sedang mengalihkan Anda masuk ke Portal Dashboard Ananda...
                  </p>
                </div>
                <div className="flex justify-center pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-4 py-2 rounded-xl shadow-xs border border-emerald-200">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    Membuka Kunci Hak Akses...
                  </span>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Information Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Siswa Terkait:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      {lockStatus.childName || 'Ananda'}
                    </span>
                  </div>

                  {/* List of Unpaid SPP Invoices */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Rincian Tagihan SPP Belum Terbayar:
                    </span>
                    {unpaidList.map((inv) => (
                      <div 
                        key={inv.id}
                        className="p-2.5 rounded-xl bg-white border border-rose-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-black text-slate-900">
                            SPP Bulan {inv.month} {inv.year}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{inv.invoiceNumber}</span>
                            <span>•</span>
                            <span className="capitalize">{inv.program.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-rose-600 font-mono">
                            Rp {(inv.amount - (inv.paidAmount || 0)).toLocaleString('id-ID')}
                          </span>
                          <span className="block text-[9px] font-bold uppercase text-rose-500">
                            Belum Bayar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount Due */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Total Kewajiban SPP:
                    </span>
                    <span className="text-base sm:text-lg font-black text-rose-700 font-mono">
                      Rp {totalDebt.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Bank Account Details for Transfer */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Rekening Resmi Pembayaran Little Star</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Bank Mandiri</div>
                        <div className="font-mono font-bold text-slate-900">123-00-9876543-1</div>
                        <div className="text-[9px] text-slate-500">a.n. Little Star Learning</div>
                      </div>
                      <button
                        onClick={() => handleCopy('1230098765431', 'mandiri')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                        title="Salin No Rekening"
                      >
                        {copiedBank === 'mandiri' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">BCA</div>
                        <div className="font-mono font-bold text-slate-900">841-098-7654</div>
                        <div className="text-[9px] text-slate-500">a.n. Yayasan Little Star</div>
                      </div>
                      <button
                        onClick={() => handleCopy('8410987654', 'bca')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                        title="Salin No Rekening"
                      >
                        {copiedBank === 'bca' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant Upload / Payment Form */}
                {showPayForm ? (
                  <form onSubmit={handleConfirmPayment} className="space-y-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-200 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        Konfirmasi & Unggah Bukti Transfer
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPayForm(false)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Bank Pengirim
                        </label>
                        <select
                          value={senderBank}
                          onChange={(e) => setSenderBank(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 outline-none"
                        >
                          <option value="Bank Mandiri">Bank Mandiri</option>
                          <option value="BCA">BCA</option>
                          <option value="BNI">BNI</option>
                          <option value="BRI">BRI</option>
                          <option value="BSI">BSI</option>
                          <option value="Lainnya">Bank Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Nama Pemilik Rekening
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nama pengirim transfer..."
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                        URL Bukti Transfer / Resi
                      </label>
                      <input
                        type="text"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? (
                        <span>Memverifikasi Bukti Pembayaran...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Kirim Bukti & Buka Kunci Akun Sekarang</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  /* Action Buttons */
                  <div className="space-y-2 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPayForm(true)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Sudah Transfer? Unggah Bukti Bayar & Buka Akun</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Konfirmasi via WA Keuangan</span>
                      </a>

                      <button
                        onClick={onClose}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Kembali ke Halaman Login
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
