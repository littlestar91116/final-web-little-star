import React, { useState } from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  KeyRound, 
  Edit2, 
  Plus, 
  Trash2,
  X,
  Lock,
  Search,
  Filter,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { StaffMember, UserRole, ProgramType, SchoolClass, JobPosition } from '../../types';

export const StaffModule: React.FC = () => {
  const { 
    staff, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    classes, 
    addClass, 
    updateClass, 
    deleteClass,
    positions,
    addPosition,
    updatePosition,
    deletePosition
  } = useSchoolData();

  const { currentUser, accounts, createOrUpdateAccount } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Sub-navigation tab: 'staff' | 'positions' | 'classes'
  const [activeTab, setActiveTab] = useState<'staff' | 'positions' | 'classes'>('staff');

  // Search & Role Filter for Staff
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // -------------------------------------------------------------
  // 1. Staff CRUD Modals State
  // -------------------------------------------------------------
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form fields for Staff
  const [staffName, setStaffName] = useState('');
  const [staffNip, setStaffNip] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('guru_sekolah_pagi');
  const [staffJobTitle, setStaffJobTitle] = useState('');
  const [staffGender, setStaffGender] = useState<'L' | 'P'>('P');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffStatus, setStaffStatus] = useState<'tetap' | 'kontrak' | 'part_time'>('tetap');
  const [staffQualification, setStaffQualification] = useState('');
  const [staffSpecialization, setStaffSpecialization] = useState('');
  const [staffPrograms, setStaffPrograms] = useState<ProgramType[]>(['sekolah_pagi']);
  const [staffStudentsCount, setStaffStudentsCount] = useState(10);
  const [staffPhotoUrl, setStaffPhotoUrl] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('12345');

  // Quick Account Credential Modal
  const [editingCredsStaff, setEditingCredsStaff] = useState<StaffMember | null>(null);
  const [quickUsername, setQuickUsername] = useState('');
  const [quickPassword, setQuickPassword] = useState('12345');
  const [showQuickCredModal, setShowQuickCredModal] = useState(false);

  // -------------------------------------------------------------
  // 2. Position CRUD Modals State
  // -------------------------------------------------------------
  const [showPosModal, setShowPosModal] = useState(false);
  const [editingPos, setEditingPos] = useState<JobPosition | null>(null);
  const [posTitle, setPosTitle] = useState('');
  const [posRoleCategory, setPosRoleCategory] = useState<UserRole>('guru_sekolah_pagi');
  const [posDescription, setPosDescription] = useState('');

  // -------------------------------------------------------------
  // 3. Class CRUD Modals State
  // -------------------------------------------------------------
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classTypeInput, setClassTypeInput] = useState('');
  const [classProgram, setClassProgram] = useState<ProgramType>('sekolah_pagi');
  const [classCapacity, setClassCapacity] = useState<number>(15);
  const [classRoom, setClassRoom] = useState('');
  const [classDescription, setClassDescription] = useState('');

  // Open Staff Modal for Create or Edit
  const handleOpenStaffModal = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setStaffName(member.name);
      setStaffNip(member.nip);
      setStaffRole(member.role);
      setStaffJobTitle(member.jobTitle);
      setStaffGender(member.gender);
      setStaffPhone(member.phone);
      setStaffEmail(member.email);
      setStaffStatus(member.status);
      setStaffQualification(member.qualification);
      setStaffSpecialization(member.specialization);
      setStaffPrograms(member.assignedPrograms);
      setStaffStudentsCount(member.assignedStudentsCount || 0);
      setStaffPhotoUrl(member.photoUrl);
      const acc = accounts.find(a => a.staffId === member.id || a.name === member.name);
      setStaffUsername(acc?.username || `staff.${member.name.split(' ')[0].toLowerCase()}`);
      setStaffPassword(acc?.password || '12345');
    } else {
      setEditingStaff(null);
      setStaffName('');
      setStaffNip(`ST-${String(staff.length + 1).padStart(2, '0')}-00${staff.length + 1}`);
      setStaffRole('guru_sekolah_pagi');
      setStaffJobTitle('Guru Kelas Sekolah Pagi');
      setStaffGender('P');
      setStaffPhone('081234567' + String(staff.length + 1).padStart(3, '0'));
      setStaffEmail('');
      setStaffStatus('tetap');
      setStaffQualification('S1 Pendidikan Anak Usia Dini / Psikologi');
      setStaffSpecialization('Stimulasi Perkembangan & Sentra Inklusif');
      setStaffPrograms(['sekolah_pagi']);
      setStaffStudentsCount(10);
      setStaffPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');
      setStaffUsername('');
      setStaffPassword('12345');
    }
    setShowStaffModal(true);
  };

  const toggleStaffProgram = (prog: ProgramType) => {
    setStaffPrograms(prev => 
      prev.includes(prog) ? prev.filter(p => p !== prog) : [...prev, prog]
    );
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    const finalPhoto = staffPhotoUrl.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    const finalEmail = staffEmail.trim() || `${staffName.split(' ')[0].toLowerCase()}@littlestar.sch.id`;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name: staffName.trim(),
        nip: staffNip.trim(),
        role: staffRole,
        jobTitle: staffJobTitle.trim(),
        gender: staffGender,
        phone: staffPhone.trim(),
        email: finalEmail,
        status: staffStatus,
        qualification: staffQualification.trim(),
        specialization: staffSpecialization.trim(),
        assignedPrograms: staffPrograms,
        assignedStudentsCount: Number(staffStudentsCount),
        photoUrl: finalPhoto
      });

      // Update account if username provided
      if (staffUsername.trim()) {
        createOrUpdateAccount({
          username: staffUsername.trim().toLowerCase(),
          password: staffPassword.trim() || '12345',
          name: staffName.trim(),
          role: staffRole,
          staffId: editingStaff.id,
          email: finalEmail,
          phone: staffPhone.trim(),
          avatarUrl: finalPhoto
        });
      }

      showToast(`Data pendidik "${staffName}" berhasil diperbarui!`);
    } else {
      const newStaffId = `stf-${Date.now().toString().slice(-4)}`;
      addStaff({
        nip: staffNip.trim() || `ST-0${staff.length + 1}-00${staff.length + 1}`,
        name: staffName.trim(),
        role: staffRole,
        jobTitle: staffJobTitle.trim() || 'Pendidik Little Star',
        gender: staffGender,
        phone: staffPhone.trim() || '081234567890',
        email: finalEmail,
        status: staffStatus,
        qualification: staffQualification.trim() || 'Sarjana Pendidikan',
        specialization: staffSpecialization.trim() || 'Stimulasi Anak Usia Dini',
        joinDate: new Date().toISOString().split('T')[0],
        assignedPrograms: staffPrograms.length > 0 ? staffPrograms : ['sekolah_pagi'],
        assignedStudentsCount: Number(staffStudentsCount) || 5,
        photoUrl: finalPhoto
      });

      const uName = staffUsername.trim() || `staff.${staffName.split(' ')[0].toLowerCase()}`;
      createOrUpdateAccount({
        username: uName.toLowerCase(),
        password: staffPassword.trim() || '12345',
        name: staffName.trim(),
        role: staffRole,
        staffId: newStaffId,
        email: finalEmail,
        phone: staffPhone.trim(),
        avatarUrl: finalPhoto
      });

      showToast(`Pendidik baru "${staffName}" dan akun login berhasil ditambahkan!`);
    }

    setShowStaffModal(false);
  };

  const handleDeleteStaff = (member: StaffMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pendidik "${member.name}" (${member.jobTitle})?`)) {
      deleteStaff(member.id);
      showToast(`Data pendidik "${member.name}" berhasil dihapus.`);
    }
  };

  // Quick Credential Edit
  const handleOpenQuickCreds = (member: StaffMember) => {
    setEditingCredsStaff(member);
    const existingAcc = accounts.find(a => a.staffId === member.id || a.name === member.name);
    setQuickUsername(existingAcc?.username || `staff.${member.name.split(' ')[0].toLowerCase()}`);
    setQuickPassword(existingAcc?.password || '12345');
    setShowQuickCredModal(true);
  };

  const handleSaveQuickCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredsStaff || !quickUsername.trim()) return;

    createOrUpdateAccount({
      username: quickUsername.trim().toLowerCase(),
      password: quickPassword.trim() || '12345',
      name: editingCredsStaff.name,
      role: editingCredsStaff.role,
      staffId: editingCredsStaff.id,
      email: editingCredsStaff.email,
      phone: editingCredsStaff.phone,
      avatarUrl: editingCredsStaff.photoUrl
    });

    setShowQuickCredModal(false);
    showToast(`Akun login untuk "${editingCredsStaff.name}" berhasil diperbarui!`);
  };

  // -------------------------------------------------------------
  // Position Actions
  // -------------------------------------------------------------
  const handleOpenPosModal = (pos?: JobPosition) => {
    if (pos) {
      setEditingPos(pos);
      setPosTitle(pos.title);
      setPosRoleCategory(pos.roleCategory);
      setPosDescription(pos.description || '');
    } else {
      setEditingPos(null);
      setPosTitle('');
      setPosRoleCategory('guru_sekolah_pagi');
      setPosDescription('');
    }
    setShowPosModal(true);
  };

  const handleSavePos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posTitle.trim()) return;

    if (editingPos) {
      updatePosition(editingPos.id, {
        title: posTitle.trim(),
        roleCategory: posRoleCategory,
        description: posDescription.trim()
      });
      showToast(`Jabatan "${posTitle}" berhasil diperbarui!`);
    } else {
      addPosition({
        title: posTitle.trim(),
        roleCategory: posRoleCategory,
        description: posDescription.trim()
      });
      showToast(`Jabatan baru "${posTitle}" berhasil ditambahkan!`);
    }
    setShowPosModal(false);
  };

  const handleDeletePos = (pos: JobPosition) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jabatan "${pos.title}"?`)) {
      deletePosition(pos.id);
      showToast(`Jabatan "${pos.title}" berhasil dihapus.`);
    }
  };

  // -------------------------------------------------------------
  // Class Actions
  // -------------------------------------------------------------
  const handleOpenClassModal = (cls?: SchoolClass) => {
    if (cls) {
      setEditingClass(cls);
      setClassNameInput(cls.name);
      setClassTypeInput(cls.type);
      setClassProgram(cls.program);
      setClassCapacity(cls.capacity);
      setClassRoom(cls.room);
      setClassDescription(cls.description || '');
    } else {
      setEditingClass(null);
      setClassNameInput('');
      setClassTypeInput('PAUD / TK A');
      setClassProgram('sekolah_pagi');
      setClassCapacity(15);
      setClassRoom('Ruang Bintang (Lantai 1)');
      setClassDescription('');
    }
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        name: classNameInput.trim(),
        type: classTypeInput.trim() || 'Kelas Belajar',
        program: classProgram,
        capacity: Number(classCapacity) || 12,
        room: classRoom.trim() || 'Ruang Kelas',
        description: classDescription.trim()
      });
      showToast(`Kelas "${classNameInput}" berhasil diperbarui!`);
    } else {
      addClass({
        name: classNameInput.trim(),
        type: classTypeInput.trim() || 'Kelas Belajar',
        program: classProgram,
        capacity: Number(classCapacity) || 12,
        room: classRoom.trim() || 'Ruang Kelas',
        description: classDescription.trim()
      });
      showToast(`Kelas baru "${classNameInput}" berhasil ditambahkan!`);
    }
    setShowClassModal(false);
  };

  const handleDeleteClass = (cls: SchoolClass) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas "${cls.name}"?`)) {
      deleteClass(cls.id);
      showToast(`Kelas "${cls.name}" berhasil dihapus.`);
    }
  };

  // Filtered staff list
  const filteredStaff = staff.filter(member => {
    const matchRole = staffRoleFilter === 'all' || member.role === staffRoleFilter;
    const q = staffSearch.toLowerCase();
    const matchSearch = 
      member.name.toLowerCase().includes(q) ||
      member.nip.toLowerCase().includes(q) ||
      member.jobTitle.toLowerCase().includes(q) ||
      member.specialization.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-amber-300/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 fill-slate-950" />
              Kelola SDM & Akademik
            </span>
            <span className="text-xs text-amber-300 font-mono font-bold">Super Admin Authority</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-2">
            Manajemen Pendidik, Jabatan & Kelas Sekolah
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium mt-1">
            Tambah, hapus, dan perbarui data seluruh guru sekolah pagi, terapis wicara & sensori, guru shadow pendamping khusus, guru daycare, beserta formasi jabatan dan pembagian kelas.
          </p>
        </div>

        {/* Tab Switcher - Smooth Swipe on Mobile, Clean on Laptop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md pb-1 sm:pb-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'staff'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Data Pendidik ({staff.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'positions'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jabatan Guru ({positions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'classes'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Jenis & Nama Kelas ({classes.length})</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-600 text-white border border-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* TAB 1: DATA GURU, TERAPIS, SHADOW & DAYCARE              */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'staff' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama pendidik, NIP, atau spesialisasi..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                value={staffRoleFilter}
                onChange={(e) => setStaffRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 outline-none cursor-pointer"
              >
                <option value="all">Semua Peran Pendidik</option>
                <option value="guru_sekolah_pagi">Guru Sekolah Pagi</option>
                <option value="terapis">Terapis (Wicara & Sensori)</option>
                <option value="shadow_teacher">Guru Shadow (Pendamping Khusus)</option>
                <option value="daycare_teacher">Guru & Pengasuh DayCare</option>
                <option value="kepala_sekolah">Kepala Sekolah</option>
                <option value="staff_keuangan">Staff Keuangan</option>
              </select>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => handleOpenStaffModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pendidik / Guru Baru</span>
              </button>
            )}
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map(member => {
              const acc = accounts.find(a => a.staffId === member.id || a.name === member.name);
              
              // Role badge color
              const roleBadgeColor = 
                member.role === 'guru_sekolah_pagi' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                member.role === 'terapis' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                member.role === 'shadow_teacher' ? 'bg-indigo-100 text-indigo-900 border-indigo-200' :
                member.role === 'daycare_teacher' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                member.role === 'kepala_sekolah' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                'bg-slate-100 text-slate-800 border-slate-200';

              return (
                <div 
                  key={member.id} 
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Top Identity Card */}
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-15 h-15 rounded-2xl object-cover ring-2 ring-blue-100 shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border mb-1 ${roleBadgeColor}`}>
                          {member.role.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 font-display truncate">{member.name}</h3>
                        <div className="text-[11px] text-blue-700 font-bold truncate">{member.jobTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {member.nip}</div>
                      </div>
                    </div>

                    {/* Login Credentials Box */}
                    <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50/60 border border-amber-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-600" />
                          Akun Login Pegawai:
                        </div>
                        <div className="font-mono text-[11px] text-blue-950 font-black mt-0.5">
                          User: <span className="text-blue-700">{acc?.username || `staff.${member.name.split(' ')[0].toLowerCase()}`}</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-600">
                          Pass: <span className="font-bold">{acc?.password || '12345'}</span>
                        </div>
                      </div>

                      {isSuperAdmin && (
                        <button
                          onClick={() => handleOpenQuickCreds(member)}
                          className="px-2.5 py-1 text-[11px] font-black text-blue-800 hover:bg-white rounded-xl border border-blue-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Kredensial</span>
                        </button>
                      )}
                    </div>

                    {/* Qualifications & Specialization */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-start gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">Kualifikasi: <strong className="text-slate-800">{member.qualification}</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">Spesialisasi: <span className="font-medium text-slate-800">{member.specialization}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.assignedPrograms.map(p => (
                        <span key={p} className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                          ★ {p.replace('_', ' ')}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-bold text-slate-700">{member.assignedStudentsCount} Siswa Terbina</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {member.status}
                      </span>
                    </div>

                    {/* Super Admin Action Buttons on Each Card */}
                    {isSuperAdmin && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenStaffModal(member)}
                          className="px-3 py-1.5 rounded-xl text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Profil</span>
                        </button>

                        <button
                          onClick={() => handleDeleteStaff(member)}
                          className="px-3 py-1.5 rounded-xl text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* TAB 2: JABATAN GURU, TERAPIS, SHADOW & DAYCARE           */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'positions' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">
                Daftar Formasi Jabatan Guru & Staf
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola jabatan spesifik untuk Guru Sekolah Pagi, Terapis Wicara/Sensori, Guru Shadow, dan Pendidik DayCare.
              </p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => handleOpenPosModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Jabatan Baru</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.map(pos => (
              <div 
                key={pos.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 uppercase tracking-wider">
                      {pos.roleCategory.replace(/_/g, ' ')}
                    </span>
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-display mb-1.5">{pos.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pos.description || 'Tidak ada catatan deskripsi tugas.'}
                  </p>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenPosModal(pos)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeletePos(pos)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* TAB 3: JENIS DAN NAMA KELAS                             */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'classes' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-wider">
                Daftar Jenis & Nama Kelas Sekolah
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola ruang dan jenis kelas untuk pendaftaran siswa, pembagian rombongan belajar, dan plotting pengajar.
              </p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => handleOpenClassModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map(cls => (
              <div 
                key={cls.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                      ★ {cls.program.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      Kapasitas: {cls.capacity} Siswa
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 font-display mb-1">{cls.name}</h4>
                  <div className="text-xs font-bold text-blue-700 mb-2">Jenis: {cls.type}</div>
                  
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                    <div className="font-semibold text-slate-800">Ruangan: {cls.room}</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {cls.description || 'Ruang stimulasi belajar terintegrasi.'}
                    </p>
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenClassModal(cls)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Kelas
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 1: ADD / EDIT STAFF MEMBER                         */}
      {/* ======================================================= */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  {editingStaff ? 'Edit Data Pendidik / Staf' : 'Tambah Pendidik / Guru Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Isi data profil guru sekolah pagi, terapis, shadow teacher, atau pendidik daycare
                </p>
              </div>
              <button
                onClick={() => setShowStaffModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kak Sarah Amanda, S.Psi."
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Nomor Induk Pegawai (NIP)</label>
                  <input
                    type="text"
                    placeholder="ST-02-002"
                    value={staffNip}
                    onChange={(e) => setStaffNip(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Peran Sistem (Role)</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="guru_sekolah_pagi">Guru Sekolah Pagi</option>
                    <option value="terapis">Terapis (Wicara & Sensori)</option>
                    <option value="shadow_teacher">Guru Shadow (Pendamping Khusus)</option>
                    <option value="daycare_teacher">Guru & Pengasuh DayCare</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="staff_keuangan">Staff Keuangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Jabatan / Posisi</label>
                  <input
                    type="text"
                    list="position-suggestions"
                    placeholder="Pilih atau ketik jabatan..."
                    value={staffJobTitle}
                    onChange={(e) => setStaffJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <datalist id="position-suggestions">
                    {positions.map(p => (
                      <option key={p.id} value={p.title} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Jenis Kelamin</label>
                  <select
                    value={staffGender}
                    onChange={(e) => setStaffGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="P">Perempuan</option>
                    <option value="L">Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Status Kepegawaian</label>
                  <select
                    value={staffStatus}
                    onChange={(e) => setStaffStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="tetap">Pegawai Tetap</option>
                    <option value="kontrak">Kontrak</option>
                    <option value="part_time">Part Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Kualifikasi Pendidikan</label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Psikologi Anak (UI)"
                    value={staffQualification}
                    onChange={(e) => setStaffQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Bidang Spesialisasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Oral Motor & Sensori Integrasi"
                    value={staffSpecialization}
                    onChange={(e) => setStaffSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Multi-Select Program yang Diampu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                  Program Yang Diampu (Multi-Select)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sekolah_pagi', label: 'Sekolah Pagi' },
                    { id: 'terapi', label: 'Layanan Terapi' },
                    { id: 'daycare', label: 'DayCare' },
                    { id: 'shadow', label: 'Shadow Teacher' }
                  ].map(p => {
                    const isChecked = staffPrograms.includes(p.id as ProgramType);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleStaffProgram(p.id as ProgramType)}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer ${
                          isChecked ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Credentials Setting */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="text-xs font-black text-amber-950 font-display flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Akun Login Aplikasi Pegawai (Wajib untuk Guru/Terapis)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Username Login</label>
                    <input
                      type="text"
                      placeholder="Contoh: sarah.amanda"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="text"
                      placeholder="Password login"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {editingStaff ? 'Simpan Perubahan' : 'Tambah Pendidik'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: QUICK EDIT STAFF CREDENTIALS                    */}
      {/* ======================================================= */}
      {showQuickCredModal && editingCredsStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">Ubah Akun Login Pegawai</h3>
                <p className="text-xs text-slate-500">{editingCredsStaff.name} ({editingCredsStaff.jobTitle})</p>
              </div>
              <button
                onClick={() => setShowQuickCredModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCreds} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username Login *
                </label>
                <input
                  type="text"
                  required
                  value={quickUsername}
                  onChange={(e) => setQuickUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password Login *
                </label>
                <input
                  type="text"
                  required
                  value={quickPassword}
                  onChange={(e) => setQuickPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickCredModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Simpan Kredensial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 3: ADD / EDIT JOB POSITION                         */}
      {/* ======================================================= */}
      {showPosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {editingPos ? 'Edit Formasi Jabatan' : 'Tambah Jabatan Pendidik Baru'}
                </h3>
                <p className="text-xs text-slate-500">Formasi jabatan guru, terapis, shadow, atau daycare</p>
              </div>
              <button
                onClick={() => setShowPosModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePos} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Nama Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Terapis Wicara & Artikulasi Oral Motor"
                  value={posTitle}
                  onChange={(e) => setPosTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Kategori Peran</label>
                <select
                  value={posRoleCategory}
                  onChange={(e) => setPosRoleCategory(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="guru_sekolah_pagi">Guru Sekolah Pagi</option>
                  <option value="terapis">Terapis (Wicara / Sensori)</option>
                  <option value="shadow_teacher">Guru Shadow (Pendamping Khusus)</option>
                  <option value="daycare_teacher">Guru & Pengasuh DayCare</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="staff_keuangan">Staff Keuangan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Deskripsi Wewenang & Tugas</label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan tugas utama dan tanggung jawab jabatan ini..."
                  value={posDescription}
                  onChange={(e) => setPosDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPosModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {editingPos ? 'Simpan Jabatan' : 'Tambah Jabatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 4: ADD / EDIT SCHOOL CLASS                         */}
      {/* ======================================================= */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-display">
                  {editingClass ? 'Edit Data Kelas' : 'Tambah Jenis & Nama Kelas Baru'}
                </h3>
                <p className="text-xs text-slate-500">Pengaturan rombongan belajar dan ruangan kelas</p>
              </div>
              <button
                onClick={() => setShowClassModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bintang Kejora (Kelas A)"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Jenis / Jenjang Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: PAUD / TK A"
                    value={classTypeInput}
                    onChange={(e) => setClassTypeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Program Terkait</label>
                  <select
                    value={classProgram}
                    onChange={(e) => setClassProgram(e.target.value as ProgramType)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="sekolah_pagi">Sekolah Pagi</option>
                    <option value="terapi">Layanan Terapi</option>
                    <option value="daycare">DayCare</option>
                    <option value="shadow">Shadow Teacher</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Kapasitas Maksimal Siswa</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={classCapacity}
                    onChange={(e) => setClassCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Ruangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang Bintang 1 (Lantai 1)"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-display">Deskripsi / Catatan Kelas</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan spesifikasi kelas atau target tumbuh kembang..."
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  {editingClass ? 'Simpan Kelas' : 'Tambah Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
