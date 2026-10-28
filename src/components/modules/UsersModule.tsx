import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  KeyRound, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  CheckCircle2,
  X,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  CreditCard,
  Sliders,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { UserAccount, UserRole } from '../../types';
import { 
  SYSTEM_MODULES, 
  DEFAULT_ROLE_PERMISSIONS, 
  checkAccountLockStatus, 
  markInvoiceFullyPaid,
  ModulePermissionOption
} from '../../lib/accountLockService';

export const UsersModule: React.FC = () => {
  const { 
    accounts, 
    currentUser, 
    createOrUpdateAccount, 
    deleteAccount, 
    toggleAccountFreeze, 
    updateAccountPermissions,
    resetAccountsToDefault,
    availableRoles 
  } = useAuth();
  const { students, staff, invoices, verifyInvoicePayment, updateStudent, updateStaff } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'frozen_spp' | 'frozen_manual'>('all');
  
  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<UserAccount | null>(null);
  const [selectedSPPAccount, setSelectedSPPAccount] = useState<UserAccount | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('guru_sekolah_pagi');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formChildId, setFormChildId] = useState('');
  const [formStaffId, setFormStaffId] = useState('');
  const [formIsFrozen, setFormIsFrozen] = useState(false);
  const [formFreezeReason, setFormFreezeReason] = useState('');
  const [formPermissions, setFormPermissions] = useState<string[]>([]);
  const [activeFormTab, setActiveFormTab] = useState<'info' | 'permissions'>('info');

  const [showPlainPassword, setShowPlainPassword] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(res);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = 
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.email && acc.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchRole = selectedRoleFilter === 'all' || acc.role === selectedRoleFilter;

    const lockStatus = checkAccountLockStatus(acc, invoices);
    let matchStatus = true;
    if (selectedStatusFilter === 'active') {
      matchStatus = !lockStatus.isLocked;
    } else if (selectedStatusFilter === 'frozen_spp') {
      matchStatus = lockStatus.isLocked && lockStatus.lockType === 'spp_auto_freeze';
    } else if (selectedStatusFilter === 'frozen_manual') {
      matchStatus = lockStatus.isLocked && lockStatus.lockType === 'manual_freeze';
    }

    return matchSearch && matchRole && matchStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormUsername('');
    setFormPassword('123456');
    setFormName('');
    setFormRole('guru_sekolah_pagi');
    setFormEmail('');
    setFormPhone('');
    setFormChildId('');
    setFormStaffId('');
    setFormIsFrozen(false);
    setFormFreezeReason('');
    setFormPermissions(DEFAULT_ROLE_PERMISSIONS['guru_sekolah_pagi'] || []);
    setActiveFormTab('info');
    setFormError('');
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (acc: UserAccount) => {
    setEditingAccount(acc);
    setFormUsername(acc.username);
    setFormPassword('');
    setFormName(acc.name);
    setFormRole(acc.role);
    setFormEmail(acc.email || '');
    setFormPhone(acc.phone || '');

    // Auto-resolve childStudentId if not explicitly stored
    let resolvedChildId = acc.childStudentId || '';
    if (!resolvedChildId && acc.role === 'wali_murid') {
      const matchStd = students.find(s => s.accountUsername === acc.username || (acc.name && acc.name.toLowerCase().includes(s.nickname.toLowerCase())));
      if (matchStd) resolvedChildId = matchStd.id;
    }
    setFormChildId(resolvedChildId);

    // Auto-resolve staffId if not explicitly stored
    let resolvedStaffId = acc.staffId || '';
    if (!resolvedStaffId && acc.role !== 'wali_murid' && acc.role !== 'calon_wali_murid') {
      const matchStaff = staff.find(s => s.name === acc.name || s.accountUsername === acc.username);
      if (matchStaff) resolvedStaffId = matchStaff.id;
    }
    setFormStaffId(resolvedStaffId);

    setFormIsFrozen(acc.isFrozen || false);
    setFormFreezeReason(acc.freezeReason || '');
    setFormPermissions(
      acc.customPermissions && acc.customPermissions.length > 0 
        ? acc.customPermissions 
        : DEFAULT_ROLE_PERMISSIONS[acc.role] || []
    );
    setActiveFormTab('info');
    setFormError('');
    setShowAddEditModal(true);
  };

  // Change Role in Form and optionally reset default permissions
  const handleRoleChange = (newRole: UserRole) => {
    setFormRole(newRole);
    // If not manually customized, adopt role defaults
    setFormPermissions(DEFAULT_ROLE_PERMISSIONS[newRole] || []);
  };

  // Toggle single permission
  const handleTogglePermission = (modId: string) => {
    setFormPermissions(prev => 
      prev.includes(modId) ? prev.filter(p => p !== modId) : [...prev, modId]
    );
  };

  const handleSelectAllPermissions = () => {
    setFormPermissions(SYSTEM_MODULES.map(m => m.id));
  };

  const handleResetPermissionsToRole = () => {
    setFormPermissions(DEFAULT_ROLE_PERMISSIONS[formRole] || []);
  };

  const handleClearPermissions = () => {
    setFormPermissions([]);
  };

  // Save Account
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formUsername.trim() || !formName.trim()) {
      setFormError('Mohon isi nama lengkap dan username.');
      return;
    }

    if (!editingAccount && (!formPassword.trim() || formPassword.trim().length < 6)) {
      setFormError('Password baru wajib diisi minimal 6 karakter untuk keamanan sistem Supabase Auth.');
      return;
    }

    if (editingAccount && formPassword.trim() && formPassword.trim().length < 6) {
      setFormError('Jika mengubah password, panjang minimal harus 6 karakter.');
      return;
    }

    const cleanUsername = formUsername.trim().toLowerCase();
    const conflictAcc = accounts.find(
      a => a.username.toLowerCase() === cleanUsername && (!editingAccount || a.id !== editingAccount.id)
    );
    if (conflictAcc) {
      setFormError(`Username "${cleanUsername}" sudah digunakan oleh akun "${conflictAcc.name}". Silakan gunakan username lain.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrUpdateAccount({
        id: editingAccount?.id,
        username: cleanUsername,
        password: formPassword.trim() || undefined,
        name: formName.trim(),
        role: formRole,
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        childStudentId: formRole === 'wali_murid' ? (formChildId || undefined) : undefined,
        staffId: formRole !== 'wali_murid' && formRole !== 'calon_wali_murid' ? (formStaffId || undefined) : undefined,
        isFrozen: formIsFrozen,
        freezeReason: formIsFrozen ? formFreezeReason : undefined,
        status: formIsFrozen ? 'frozen' : 'active',
        customPermissions: formPermissions,
        avatarUrl: editingAccount?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });

      // Automatically synchronize student profile if wali_murid
      if (formRole === 'wali_murid' && formChildId) {
        updateStudent(formChildId, {
          accountUsername: cleanUsername,
          ...(formPassword.trim() ? { accountPassword: formPassword.trim() } : {})
        });
      }

      // Automatically synchronize staff profile if linked to staff
      if (formStaffId) {
        updateStaff(formStaffId, {
          accountUsername: cleanUsername,
          ...(formPassword.trim() ? { accountPassword: formPassword.trim() } : {}),
          name: formName.trim(),
          role: formRole
        });
      }

      setShowAddEditModal(false);
      showToast(`Akun ${cleanUsername} berhasil ${editingAccount ? 'diperbarui hak aksesnya' : 'dibuat'}! Data tersimpan & update otomatis.`);
    } catch (err: any) {
      setFormError(err?.message || 'Terjadi kegagalan saat menyimpan akun ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Freeze Toggle
  const handleQuickToggleFreeze = (acc: UserAccount) => {
    if (acc.username === 'admin') {
      alert('Akun Super Admin utama tidak dapat dibekukan.');
      return;
    }

    const nextFreeze = !acc.isFrozen;
    const reason = nextFreeze ? 'Dibekukan oleh Super Admin pada Pusat Akun.' : undefined;
    toggleAccountFreeze(acc.id, nextFreeze, reason);
    showToast(`Status akun ${acc.username} diubah menjadi: ${nextFreeze ? 'DIBEKUKAN' : 'AKTIF'}`);
  };

  // Delete Confirmation
  const confirmDelete = () => {
    if (!accountToDelete) return;
    if (accountToDelete.username === 'admin') {
      alert('Akun Super Admin utama tidak dapat dihapus.');
      setAccountToDelete(null);
      return;
    }

    deleteAccount(accountToDelete.id);
    showToast(`Akun ${accountToDelete.username} telah berhasil dihapus dari sistem.`);
    setAccountToDelete(null);
  };

  // Quick Unfreeze for Wali Murid by clearing unpaid invoice
  const handleAdminClearSPP = (childId: string) => {
    const studentInvoices = invoices.filter(inv => inv.studentId === childId && (inv.status === 'belum_bayar' || inv.status === 'terlambat' || inv.status === 'ditolak'));
    studentInvoices.forEach(inv => {
      markInvoiceFullyPaid(inv.id);
      try {
        verifyInvoicePayment(inv.id, true);
      } catch {
        // ignore
      }
    });

    setSelectedSPPAccount(null);
    showToast('Seluruh tunggakan SPP siswa telah ditandai lunas. Akun wali murid kini terbuka kembali secara otomatis!');
  };

  // Counts for summary stat cards
  const totalUsers = accounts.length;
  const totalWaliMurid = accounts.filter(a => a.role === 'wali_murid').length;
  const totalStaff = accounts.filter(a => a.role !== 'wali_murid' && a.role !== 'calon_wali_murid').length;
  
  const lockedSPPCount = accounts.filter(a => {
    const lock = checkAccountLockStatus(a, invoices);
    return lock.isLocked && lock.lockType === 'spp_auto_freeze';
  }).length;

  const lockedManualCount = accounts.filter(a => a.isFrozen).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-amber-200/80 shadow-md shadow-slate-200/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-xs flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-slate-950" />
              Modul Pusat Akun & Hak Akses
            </span>
            <span className="text-xs text-slate-500 font-semibold">Otoritas Super Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Manajemen Akun Login & Hak Akses Pengguna
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Super Admin memiliki wewenang penuh untuk <span className="font-bold text-slate-900">menambah</span> akun baru, <span className="font-bold text-slate-900">mengedit hak akses modul</span>, <span className="font-bold text-slate-900">menghapus akun</span>, serta mengontrol status pembekuan akun wali murid (otomatis tanggal 1 tiap bulan jika SPP belum lunas).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mereset seluruh akun ke pengaturan bawaan awal sistem? Seluruh akun default akan dikembalikan.')) {
                resetAccountsToDefault();
                showToast('Daftar akun telah direset ke pengaturan bawaan sistem.');
              }
            }}
            className="px-3.5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-all border border-slate-300"
            title="Kembalikan semua akun ke pengaturan bawaan awal"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Reset ke Akun Awal</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Akun</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">{totalUsers}</div>
          <div className="text-[10px] text-slate-500">Terdaftar di Little Star</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Guru & Pegawai</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-display">{totalStaff}</div>
          <div className="text-[10px] text-slate-500">Admin, Guru, & Terapis</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Wali Murid</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-display">{totalWaliMurid}</div>
          <div className="text-[10px] text-slate-500">Orang tua / Wali Siswa</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 bg-rose-50/40 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Akun Terkunci SPP</span>
            <Lock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-display">{lockedSPPCount}</div>
          <div className="text-[10px] text-rose-600 font-medium">Terkunci otomatis tgl 1</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, username, email, atau peran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'active', label: 'Aktif' },
            { id: 'frozen_spp', label: `Terkunci SPP (${lockedSPPCount})` },
            { id: 'frozen_manual', label: `Dibekukan Manual (${lockedManualCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Role Filter */}
        <select
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none cursor-pointer"
        >
          <option value="all">Semua Peran ({accounts.length})</option>
          {availableRoles.map(r => (
            <option key={r.role} value={r.role}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-900 font-display">
              Daftar Akun Pengguna ({filteredAccounts.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Kelola kredensial login, hak akses modul, dan status akun per pengguna.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
            Total Terdaftar: {accounts.length} Akun
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black border-b border-slate-100 tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Status & SPP</th>
                <th className="py-3 px-4">Hak Akses Modul</th>
                <th className="py-3 px-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada akun yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(acc => {
                  const isMainAdmin = acc.username === 'admin';
                  const lockStatus = checkAccountLockStatus(acc, invoices);
                  const isSPPLocked = lockStatus.isLocked && lockStatus.lockType === 'spp_auto_freeze';
                  const isManualFrozen = acc.isFrozen;

                  const permissions = acc.customPermissions || DEFAULT_ROLE_PERMISSIONS[acc.role] || [];

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={acc.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={acc.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
                          />
                          <div>
                            <div className="font-black text-slate-900 line-clamp-1">{acc.name}</div>
                            {acc.email && (
                              <div className="text-[10px] text-slate-400 font-normal">{acc.email}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        <div className="flex items-center gap-1.5">
                          <span>{acc.username}</span>
                          <button
                            onClick={() => handleCopyText(acc.username, `u-${acc.id}`)}
                            className="text-slate-300 hover:text-slate-600 cursor-pointer"
                            title="Salin username"
                          >
                            {copiedId === `u-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                            {acc.password ? '••••••••' : 'Terenkripsi (Auth)'}
                          </span>
                          {acc.password && (
                            <button
                              onClick={() => handleCopyText(acc.password || '', `p-${acc.id}`)}
                              className="text-slate-300 hover:text-slate-600 cursor-pointer"
                              title="Salin password sementara"
                            >
                              {copiedId === `p-${acc.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                          acc.role === 'super_admin' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                          acc.role === 'kepala_sekolah' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          acc.role === 'wali_murid' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          acc.role === 'staff_keuangan' ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                          'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {acc.role.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Status & SPP Info */}
                      <td className="py-3.5 px-4">
                        {isSPPLocked ? (
                          <div className="space-y-1">
                            <span 
                              onClick={() => setSelectedSPPAccount(acc)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 cursor-pointer hover:bg-rose-200 transition-colors"
                              title="Klik untuk melihat tagihan & unfreeze"
                            >
                              <Lock className="w-3 h-3 text-rose-600" />
                              <span>Terkunci SPP (Tgl 1)</span>
                            </span>
                            <div className="text-[10px] text-rose-600 font-bold font-mono">
                              Tunggakan: Rp {lockStatus.totalUnpaidAmount.toLocaleString('id-ID')}
                            </div>
                          </div>
                        ) : isManualFrozen ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-200 text-slate-800 border border-slate-300">
                            <Lock className="w-3 h-3 text-slate-600" />
                            <span>Dibekukan Manual</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </span>
                        )}
                      </td>

                      {/* Module Permissions Count */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleOpenEdit(acc)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          <Layers className="w-3 h-3 text-blue-600" />
                          <span>{permissions.length} Modul Diizinkan</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Freeze / Unfreeze Toggle */}
                          {!isMainAdmin && (
                            <button
                              onClick={() => handleQuickToggleFreeze(acc)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                acc.isFrozen 
                                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                                  : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                              }`}
                              title={acc.isFrozen ? 'Buka Pembekuan Akun' : 'Bekukan Akun'}
                            >
                              {acc.isFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Edit Account & Access Rights */}
                          <button
                            onClick={() => handleOpenEdit(acc)}
                            className="p-2 rounded-xl text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Akun & Hak Akses Modul"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Account */}
                          {!isMainAdmin && (
                            <button
                              onClick={() => setAccountToDelete(acc)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Account with Permissions Matrix */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-1">
                  <Shield className="w-3 h-3" />
                  Konfigurasi Akun & Otoritas
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                  {editingAccount ? `Edit Akun: ${editingAccount.username}` : 'Tambah Akun Pengguna Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan profil, password, hak akses modul, dan status pembekuan akun
                </p>
              </div>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 mb-5 gap-4">
              <button
                type="button"
                onClick={() => setActiveFormTab('info')}
                className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  activeFormTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>1. Informasi Akun & Peran</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('permissions')}
                className={`pb-2.5 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  activeFormTab === 'permissions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>2. Hak Akses Modul ({formPermissions.length} Dipilih)</span>
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}
              {activeFormTab === 'info' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kak Rina Wahyuni, S.Pd. atau Ibu Siti"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Username Login *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: guru.rina atau wali.anak"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password {editingAccount ? '(Kosongkan jika tidak diubah)' : '* (Min. 6 Karakter)'}
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomPassword}
                          className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                        >
                          Acak Password
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPlainPassword ? 'text' : 'password'}
                          required={!editingAccount}
                          placeholder={editingAccount ? 'Biarkan kosong untuk mempertahankan password lama' : 'Minimal 6 karakter...'}
                          value={formPassword}
                          onChange={(e) => setFormPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPlainPassword(!showPlainPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {showPlainPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Peran Utama (Role) *
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableRoles.map(r => (
                        <option key={r.role} value={r.role}>{r.label} ({r.role})</option>
                      ))}
                    </select>
                  </div>

                  {formRole === 'wali_murid' && (
                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        Hubungkan ke Siswa (Wajib untuk Wali Murid) *
                      </label>
                      <select
                        value={formChildId}
                        onChange={(e) => setFormChildId(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl text-xs text-slate-900 bg-white outline-none"
                      >
                        <option value="">-- Pilih Siswa Terkait --</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.fullName} ({s.nis}) - {s.className}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-amber-800 mt-1">
                        Akun wali murid akan otomatis terkunci tanggal 1 jika tagihan SPP siswa ini belum lunas.
                      </p>
                    </div>
                  )}

                  {formRole !== 'wali_murid' && formRole !== 'calon_wali_murid' && formRole !== 'super_admin' && (
                    <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
                      <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                        Hubungkan ke Profil Guru / Pegawai (Opsional)
                      </label>
                      <select
                        value={formStaffId}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setFormStaffId(sId);
                          const st = staff.find(s => s.id === sId);
                          if (st) {
                            if (!formName.trim()) setFormName(st.name);
                            if (!formEmail.trim() && st.email) setFormEmail(st.email);
                            if (!formPhone.trim() && st.phone) setFormPhone(st.phone);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 border border-blue-300 rounded-xl text-xs text-slate-900 bg-white outline-none"
                      >
                        <option value="">-- Tidak Terhubung / Guru Baru --</option>
                        {staff.map(st => (
                          <option key={st.id} value={st.id}>{st.name} ({st.jobTitle})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-blue-800 mt-1">
                        Menghubungkan akun ini ke data profil pendidik di modul Guru & Pegawai.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email (Opsional)
                      </label>
                      <input
                        type="email"
                        placeholder="email@littlestar.sch.id"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        No. WhatsApp / HP (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="0812xxxxxxxx"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Manual Freeze Switch */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Bekukan Akun Secara Manual</div>
                        <div className="text-[11px] text-slate-500">
                          Pengguna tidak dapat masuk ke sistem selama akun dalam status dibekukan
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formIsFrozen}
                        onChange={(e) => setFormIsFrozen(e.target.checked)}
                        className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                      />
                    </div>

                    {formIsFrozen && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                          Alasan Pembekuan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Permintaan wali murid, evaluasi administrasi..."
                          value={formFreezeReason}
                          onChange={(e) => setFormFreezeReason(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-800 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Tab 2: Granular Permissions Matrix */
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Kontrol Hak Akses Modul Sistem</span>
                      <p className="text-[11px] text-slate-500">
                        Pilih modul yang dapat dilihat dan dioperasikan oleh akun ini
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPermissionsToRole}
                        className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 cursor-pointer"
                      >
                        Default Peran
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPermissions}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-300 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                    {SYSTEM_MODULES.map(mod => {
                      const isChecked = formPermissions.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className={`p-3 rounded-2xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(mod.id)}
                            className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{mod.label}</span>
                              <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {mod.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{mod.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  {activeFormTab === 'info' ? (
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('permissions')}
                      className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lanjut Atur Hak Akses</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('info')}
                      className="text-slate-600 font-bold hover:underline cursor-pointer"
                    >
                      ← Kembali ke Info Akun
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>{editingAccount ? 'Simpan Perubahan' : 'Buat Akun'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-rose-200 space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 font-display">
                Hapus Akun Pengguna?
              </h3>
              <p className="text-xs text-slate-500">
                Tindakan ini permanen. Akun <span className="font-mono font-bold text-slate-800">{accountToDelete.username}</span> ({accountToDelete.name}) tidak akan dapat masuk lagi ke sistem.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama:</span>
                <span className="font-bold text-slate-900">{accountToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Username:</span>
                <span className="font-mono font-bold text-blue-700">{accountToDelete.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Peran:</span>
                <span className="capitalize font-bold text-slate-700">{accountToDelete.role.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Unpaid SPP & Quick Unfreeze for Super Admin */}
      {selectedSPPAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-display">
                    Status Pembekuan SPP (Otomatis Tgl 1)
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedSPPAccount.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSPPAccount(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs space-y-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Akun Wali Murid Ini Terkunci Otomatis</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Mulai tanggal 1 tiap bulannya, wali murid tidak dapat masuk ke sistem sampai pembayaran SPP diselesaikan atau diverifikasi oleh admin.
              </p>
            </div>

            {selectedSPPAccount.childStudentId && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Tagihan Belum Lunas:
                </span>
                {invoices
                  .filter(inv => inv.studentId === selectedSPPAccount.childStudentId && (inv.status === 'belum_bayar' || inv.status === 'terlambat' || inv.status === 'ditolak'))
                  .map(inv => (
                    <div key={inv.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">SPP Bulan {inv.month} {inv.year}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{inv.invoiceNumber} • {inv.program}</div>
                      </div>
                      <div className="text-right font-black font-mono text-rose-600">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleAdminClearSPP(selectedSPPAccount.childStudentId!)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tandai Lunas & Buka Pembekuan Akun Sekarang</span>
              </button>
              <button
                onClick={() => setSelectedSPPAccount(null)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
