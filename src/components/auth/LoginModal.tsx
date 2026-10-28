import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  X,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { AccountFrozenModal } from './AccountFrozenModal';
import { AccountLockStatus } from '../../lib/accountLockService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, accounts } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFrozenModal, setShowFrozenModal] = useState(false);
  const [frozenModalData, setFrozenModalData] = useState<AccountLockStatus | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Mohon masukkan username atau email dan password Anda.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        if (res.isLocked && res.lockStatus) {
          setFrozenModalData(res.lockStatus);
          setShowFrozenModal(true);
        } else {
          setErrorMsg(res.error || 'Username atau password salah.');
        }
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat memverifikasi akun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-950/60 border border-amber-300/50 p-5 sm:p-8 overflow-y-auto max-h-[92vh] light-sweep-effect"
          >
            {/* Top Royal Jewel Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 via-purple-600 to-blue-600" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo & School Header */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6 pt-2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-3xl blur-xs opacity-70 animate-pulse" />
                <div className="relative p-3 bg-white rounded-3xl shadow-md border border-amber-200">
                  <Logo size="lg" showText={false} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-sm uppercase tracking-wider shimmer-badge">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  Portal Masuk Sistem
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                  LITTLE STAR LEARNING CENTER
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Silakan masukkan akun resmi Anda untuk melanjutkan
                </p>
              </div>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-snug font-medium">{errorMsg}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                  Username atau Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    placeholder="Masukkan username atau email Anda..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-display">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Masukkan password Anda..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium font-mono bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer uppercase tracking-wider"
              >
                {loading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Quick Test Accounts for Instant Testing */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Akun Uji Coba Cepat:
              </span>
              {(() => {
                const adminAcc = accounts.find(a => a.role === 'super_admin');
                const dylanAcc = accounts.find(a => a.username === 'wali.dylan' || a.childStudentId === 'std-001') || accounts.find(a => a.role === 'wali_murid' && !a.isFrozen);
                const mikhaAcc = accounts.find(a => a.username === 'wali.mikha' || a.childStudentId === 'std-004') || accounts.find(a => a.role === 'wali_murid' && a.id !== dylanAcc?.id);

                return (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => { setUsername(adminAcc?.username || 'admin'); setPassword(adminAcc?.password || '12345'); }}
                      className="px-2 py-1 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold border border-purple-200 cursor-pointer"
                    >
                      Super Admin ({adminAcc?.username || 'admin'})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUsername(dylanAcc?.username || 'wali.dylan'); setPassword(dylanAcc?.password || '12345'); }}
                      className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold border border-emerald-200 cursor-pointer"
                    >
                      Wali Dylan ({dylanAcc?.username || 'wali.dylan'})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUsername(mikhaAcc?.username || 'wali.mikha'); setPassword(mikhaAcc?.password || '12345'); }}
                      className="px-2 py-1 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold border border-rose-200 cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5 text-rose-600" />
                      Wali Mikha ({mikhaAcc?.username || 'wali.mikha'})
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Admin Managed Account Notice */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Akun login dikelola oleh Super Admin Little Star Learning Center.</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Account Frozen Popup for Unpaid SPP starting from 1st of month */}
      <AccountFrozenModal
        isOpen={showFrozenModal}
        onClose={() => setShowFrozenModal(false)}
        lockStatus={frozenModalData}
        onPaymentSuccess={() => {
          setShowFrozenModal(false);
          onClose();
        }}
      />
    </AnimatePresence>
  );
};
