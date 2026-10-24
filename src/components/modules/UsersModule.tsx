import React, { useState } from 'react';
import { 
  Users, 
  KeyRound, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { UserAccount, UserRole } from '../../types';

export const UsersModule: React.FC = () => {
  const { accounts, currentUser, createOrUpdateAccount, deleteAccount, availableRoles } = useAuth();
  const { students, staff } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('guru_sekolah_pagi');
  const [formEmail, setFormEmail] = useState('');
  const [formChildId, setFormChildId] = useState('');
  const [formStaffId, setFormStaffId] = useState('');
  const [showPlainPassword, setShowPlainPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = 
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRoleFilter === 'all' || acc.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormUsername('');
    setFormPassword('12345');
    setFormName('');
    setFormRole('guru_sekolah_pagi');
    setFormEmail('');
    setFormChildId('');
    setFormStaffId('');
    setShowModal(true);
  };

  const handleOpenEdit = (acc: UserAccount) => {
    setEditingAccount(acc);
    setFormUsername(acc.username);
    setFormPassword(acc.password);
    setFormName(acc.name);
    setFormRole(acc.role);
    setFormEmail(acc.email || '');
    setFormChildId(acc.childStudentId || '');
    setFormStaffId(acc.staffId || '');
    setShowModal(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim() || !formName.trim()) {
      alert('Mohon isi username, password, dan nama pengguna dengan lengkap.');
      return;
    }

    createOrUpdateAccount({
      id: editingAccount?.id,
      username: formUsername.trim().toLowerCase(),
      password: formPassword.trim(),
      name: formName.trim(),
      role: formRole,
      email: formEmail.trim() || undefined,
      childStudentId: formRole === 'wali_murid' ? formChildId : undefined,
      staffId: formStaffId || undefined,
      avatarUrl: editingAccount?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    setShowModal(false);
    setToastMessage(`Akun ${formUsername} berhasil ${editingAccount ? 'diperbarui' : 'dibuat'}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDelete = (id: string, username: string) => {
    if (username === 'admin') {
      alert('Akun Super Admin utama (admin) tidak boleh dihapus demi keamanan sistem.');
      return;
    }
    if (confirm(`Yakin ingin menghapus akun ${username}?`)) {
      deleteAccount(id);
      setToastMessage(`Akun ${username} telah dihapus.`);
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Otoritas Super Admin
            </span>
            <span className="text-xs text-slate-500">Manajemen Akses & Kredensial</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Manajemen Akun Login (Username & Password)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin dapat menambahkan, mengedit username & password guru, wali murid, dan staff kapan saja tanpa perlu akun Google.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Akun Pengguna
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Role Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan username, nama, atau peran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none"
        >
          <option value="all">Semua Peran ({accounts.length})</option>
          {availableRoles.map(r => (
            <option key={r.role} value={r.role}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Account Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Daftar Akun Pengguna ({filteredAccounts.length})</h3>
          <span className="text-xs text-slate-400">Total Akun Terdaftar: {accounts.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Password</th>
                <th className="py-3 px-4">Hak Akses / Peran</th>
                <th className="py-3 px-4">Tautan Siswa/Staff</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredAccounts.map(acc => {
                const isSuperAdmin = acc.username === 'admin';
                return (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={acc.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={acc.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200"
                      />
                      <span>{acc.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {acc.username}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {acc.password}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        acc.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        acc.role === 'kepala_sekolah' ? 'bg-amber-100 text-amber-800' :
                        acc.role === 'wali_murid' ? 'bg-emerald-100 text-emerald-800' :
                        acc.role === 'staff_keuangan' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {acc.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {acc.childStudentId ? (
                        <span>Siswa ID: {acc.childStudentId}</span>
                      ) : acc.staffId ? (
                        <span>Staff ID: {acc.staffId}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(acc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Username & Password"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(acc.id, acc.username)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Modal Add / Edit Account */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingAccount ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan username dan password login yang dibuat langsung oleh Super Admin
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kak Rina Wahyuni, S.Pd."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: guru.rina"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPlainPassword ? 'text' : 'password'}
                      required
                      placeholder="Password..."
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPlainPassword(!showPlainPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPlainPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Peran / Hak Akses (Role) *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white"
                >
                  {availableRoles.map(r => (
                    <option key={r.role} value={r.role}>{r.label} ({r.role})</option>
                  ))}
                </select>
              </div>

              {formRole === 'wali_murid' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hubungkan ke Siswa
                  </label>
                  <select
                    value={formChildId}
                    onChange={(e) => setFormChildId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white"
                  >
                    <option value="">-- Pilih Siswa Terkait --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.nis})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="email@littlestar.sch.id"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs"
                >
                  {editingAccount ? 'Simpan Perubahan' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
