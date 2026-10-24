import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Printer, 
  Eye, 
  FileEdit, 
  Sparkles, 
  CheckCircle2, 
  X,
  Phone,
  Mail,
  MapPin,
  KeyRound,
  Lock,
  UserCheck
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Student, ProgramType } from '../../types';

export const StudentsModule: React.FC = () => {
  const { students, addStudent, updateStudent } = useSchoolData();
  const { currentUser, accounts, createOrUpdateAccount } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form State
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('Jakarta');
  const [birthDate, setBirthDate] = useState('2021-06-15');
  const [className, setClassName] = useState('Bintang Kejora (Kelas A)');
  const [selectedPrograms, setSelectedPrograms] = useState<ProgramType[]>(['sekolah_pagi']);
  const [specialNotes, setSpecialNotes] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');

  // Parent credentials
  const [parentUsername, setParentUsername] = useState('');
  const [parentPassword, setParentPassword] = useState('12345');

  // Editing credentials state in detail modal
  const [editingCreds, setEditingCreds] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [credToast, setCredToast] = useState('');

  // Auto-generate suggested username when nickname changes
  const handleNicknameChange = (val: string) => {
    setNickname(val);
    if (!parentUsername || parentUsername.startsWith('wali.')) {
      setParentUsername(`wali.${val.trim().toLowerCase().replace(/\s+/g, '')}`);
    }
  };

  // Filtering
  const filteredStudents = students.filter(s => {
    const matchSearch = 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchProgram = 
      selectedProgramFilter === 'all' || 
      s.enrolledPrograms.includes(selectedProgramFilter as ProgramType);

    return matchSearch && matchProgram;
  });

  const toggleProgram = (prog: ProgramType) => {
    setSelectedPrograms(prev => 
      prev.includes(prog) ? prev.filter(p => p !== prog) : [...prev, prog]
    );
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newId = `std-${Date.now().toString().slice(-4)}`;
    const finalUsername = (parentUsername.trim() || `wali.${(nickname || fullName.split(' ')[0]).toLowerCase()}`).replace(/\s+/g, '');
    const finalPassword = parentPassword.trim() || '12345';

    addStudent({
      nis: `LS-2026-${String(students.length + 1).padStart(3, '0')}`,
      fullName,
      nickname: nickname || fullName.split(' ')[0],
      gender,
      birthPlace,
      birthDate,
      address: homeAddress,
      photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      academicYear: '2026/2027',
      status: 'aktif',
      className,
      enrolledPrograms: selectedPrograms,
      specialNeedsNotes: specialNotes,
      accountUsername: finalUsername,
      accountPassword: finalPassword,
      parent: {
        fatherName,
        motherName,
        relationship: 'Orang Tua',
        whatsapp: parentWhatsapp,
        email: parentEmail,
        address: homeAddress,
        emergencyContact: parentWhatsapp
      }
    });

    // Create the parent login account right away!
    createOrUpdateAccount({
      username: finalUsername,
      password: finalPassword,
      name: `Wali Murid ${nickname || fullName.split(' ')[0]} (${fatherName || motherName || 'Orang Tua'})`,
      role: 'wali_murid',
      email: parentEmail,
      phone: parentWhatsapp,
      childStudentId: newId,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    });

    setShowAddModal(false);
    setFullName('');
    setNickname('');
    setFatherName('');
    setMotherName('');
    setParentWhatsapp('');
    setParentUsername('');
    setParentPassword('12345');
  };

  const handleOpenDetail = (std: Student) => {
    setSelectedStudentDetail(std);
    const existingAcc = accounts.find(a => a.childStudentId === std.id || a.username === std.accountUsername);
    setEditUsername(existingAcc?.username || std.accountUsername || `wali.${std.nickname.toLowerCase()}`);
    setEditPassword(existingAcc?.password || std.accountPassword || '12345');
    setEditingCreds(false);
  };

  const handleSaveParentCreds = () => {
    if (!selectedStudentDetail) return;
    if (!editUsername.trim() || !editPassword.trim()) {
      alert('Username dan password tidak boleh kosong.');
      return;
    }

    createOrUpdateAccount({
      username: editUsername.trim().toLowerCase(),
      password: editPassword.trim(),
      name: `Wali Murid (${selectedStudentDetail.fullName})`,
      role: 'wali_murid',
      childStudentId: selectedStudentDetail.id,
      email: selectedStudentDetail.parent.email,
      phone: selectedStudentDetail.parent.whatsapp
    });

    updateStudent(selectedStudentDetail.id, {
      accountUsername: editUsername.trim().toLowerCase(),
      accountPassword: editPassword.trim()
    });

    setSelectedStudentDetail(prev => prev ? {
      ...prev,
      accountUsername: editUsername.trim().toLowerCase(),
      accountPassword: editPassword.trim()
    } : null);

    setEditingCreds(false);
    setCredToast('Akun login wali murid berhasil diperbarui!');
    setTimeout(() => setCredToast(''), 3000);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['NIS', 'Nama Lengkap', 'Panggilan', 'Jenis Kelamin', 'Kelas', 'Program', 'Orang Tua', 'WhatsApp', 'Username Akun', 'Password'];
    const rows = filteredStudents.map(s => [
      s.nis,
      `"${s.fullName}"`,
      s.nickname,
      s.gender,
      `"${s.className}"`,
      `"${s.enrolledPrograms.join(', ')}"`,
      `"${s.parent.fatherName} & ${s.parent.motherName}"`,
      s.parent.whatsapp,
      s.accountUsername || `wali.${s.nickname.toLowerCase()}`,
      s.accountPassword || '12345'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_Siswa_Little_Star_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Database Siswa Aktif
            </span>
            <span className="text-xs text-slate-500">Tahun Ajaran 2026/2027</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Manajemen Data Siswa & Akun Wali Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin dapat mengatur data siswa serta username & password akun wali murid secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download Spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV / Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak PDF
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => {
                setNickname('');
                setParentUsername('wali.');
                setShowAddModal(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Siswa & Akun
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, panggilan, atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedProgramFilter}
            onChange={(e) => setSelectedProgramFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none"
          >
            <option value="all">Semua Program ({students.length})</option>
            <option value="sekolah_pagi">Sekolah Pagi</option>
            <option value="terapi">Layanan Terapi</option>
            <option value="daycare">DayCare</option>
            <option value="shadow">Shadow Teacher</option>
          </select>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(std => {
          const parentAcc = accounts.find(a => a.childStudentId === std.id || a.username === std.accountUsername);
          return (
            <div
              key={std.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={std.photoUrl}
                      alt={std.fullName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-100"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{std.fullName}</h3>
                      <div className="text-[11px] text-slate-500">
                        Panggilan: <strong>{std.nickname}</strong> · {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {std.nis}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div>Kelas: <strong className="text-slate-800">{std.className}</strong></div>
                  <div>Lahir: {std.birthPlace}, {std.birthDate}</div>
                  
                  {/* Account Login Pill */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
                      <KeyRound className="w-3 h-3 text-amber-700" />
                      Login: {parentAcc?.username || std.accountUsername || `wali.${std.nickname.toLowerCase()}`}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-1 mb-3">
                  {std.enrolledPrograms.map(p => (
                    <span
                      key={p}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase"
                    >
                      {p.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Orang tua: {std.parent.fatherName || std.parent.motherName}</span>
                  <button
                    onClick={() => handleOpenDetail(std)}
                    className="px-3 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Profil & Akun
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Detail Modal Drawer */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudentDetail.photoUrl}
                  alt={selectedStudentDetail.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-100"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedStudentDetail.fullName}</h3>
                  <div className="text-xs text-slate-500">
                    NIS: {selectedStudentDetail.nis} {selectedStudentDetail.nisn ? `· NISN: ${selectedStudentDetail.nisn}` : ''}
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    {selectedStudentDetail.enrolledPrograms.map(p => (
                      <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                        {p.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {credToast && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{credToast}</span>
              </div>
            )}

            <div className="py-4 space-y-4 text-xs">
              {/* Credentials Box (Super Admin Editable) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>Akun Login Wali Murid:</span>
                  </div>
                  {isSuperAdmin && !editingCreds && (
                    <button
                      onClick={() => setEditingCreds(true)}
                      className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      Ubah Username/Password
                    </button>
                  )}
                </div>

                {editingCreds ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 uppercase">Username Login</label>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-blue-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 uppercase">Password</label>
                        <input
                          type="text"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingCreds(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveParentCreds}
                        className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                      >
                        Simpan Akun
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-6 text-xs text-amber-900 pt-1 font-mono">
                    <div>
                      <span className="text-[10px] text-amber-700 block uppercase">Username</span>
                      <strong className="text-sm text-blue-950 font-bold">{editUsername}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block uppercase">Password</span>
                      <strong className="text-sm text-slate-900 font-bold">{editPassword}</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas</span>
                  <span className="font-semibold text-slate-800 text-sm">{selectedStudentDetail.className}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tahun Ajaran / Masuk</span>
                  <span className="font-semibold text-slate-800">{selectedStudentDetail.academicYear} (Sejak {selectedStudentDetail.joinDate})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempat & Tgl Lahir</span>
                  <span className="font-semibold text-slate-800">{selectedStudentDetail.birthPlace}, {selectedStudentDetail.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Jenis Kelamin</span>
                  <span className="font-semibold text-slate-800">{selectedStudentDetail.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
              </div>

              {selectedStudentDetail.specialNeedsNotes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-0.5">Catatan Khusus Perkembangan:</span>
                  <p className="text-amber-800 leading-relaxed">{selectedStudentDetail.specialNeedsNotes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Informasi Orang Tua / Wali</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div>Ayah: <strong className="text-slate-800">{selectedStudentDetail.parent.fatherName}</strong></div>
                  <div>Ibu: <strong className="text-slate-800">{selectedStudentDetail.parent.motherName}</strong></div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp: <strong>{selectedStudentDetail.parent.whatsapp}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email: {selectedStudentDetail.parent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Alamat: {selectedStudentDetail.parent.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Data Siswa & Buat Akun Wali</h3>
            <p className="text-xs text-slate-500 mb-4">Input data siswa lengkap beserta username & password login wali murid</p>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Arkana Dylan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dylan"
                    value={nickname}
                    onChange={(e) => handleNicknameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Bintang Kejora (Kelas A)">Bintang Kejora (Kelas A)</option>
                  <option value="Bintang Timur (Playgroup)">Bintang Timur (Playgroup)</option>
                  <option value="Bintang Kecil (Toddler)">Bintang Kecil (Toddler)</option>
                  <option value="Kelas Terapi & Sensori">Kelas Terapi & Sensori</option>
                </select>
              </div>

              {/* Multi-Select Programs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Program Yang Diikuti (Multi-Select)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sekolah_pagi', label: 'Sekolah Pagi' },
                    { id: 'terapi', label: 'Layanan Terapi' },
                    { id: 'daycare', label: 'DayCare' },
                    { id: 'shadow', label: 'Shadow Teacher' }
                  ].map(p => {
                    const isChecked = selectedPrograms.includes(p.id as ProgramType);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleProgram(p.id as ProgramType)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer ${
                          isChecked ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No WhatsApp</label>
                  <input
                    type="tel"
                    value={parentWhatsapp}
                    onChange={(e) => setParentWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Super Admin: Create Username & Password for Parent */}
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2">
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kredensial Akun Login Wali Murid (Dibuat Super Admin):</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Username Login</label>
                    <input
                      type="text"
                      required
                      placeholder="wali.namapanggilan"
                      value={parentUsername}
                      onChange={(e) => setParentUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-mono font-bold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Password</label>
                    <input
                      type="text"
                      required
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-blue-700 block">
                  Wali murid akan menggunakan username & password ini untuk masuk ke portal orang tua.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Kebutuhan Belajar</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
                >
                  Simpan Siswa & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
