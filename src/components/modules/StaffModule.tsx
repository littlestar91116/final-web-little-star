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
  X,
  Lock
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { StaffMember, UserRole, ProgramType } from '../../types';

export const StaffModule: React.FC = () => {
  const { staff } = useSchoolData();
  const { currentUser, accounts, createOrUpdateAccount } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('12345');
  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleOpenEditCreds = (member: StaffMember) => {
    setEditingStaffMember(member);
    const existingAcc = accounts.find(a => a.staffId === member.id || a.name === member.name);
    setEditUsername(existingAcc?.username || `staff.${member.name.split(' ')[0].toLowerCase()}`);
    setEditPassword(existingAcc?.password || '12345');
    setShowEditModal(true);
  };

  const handleSaveStaffCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffMember || !editUsername.trim() || !editPassword.trim()) return;

    createOrUpdateAccount({
      username: editUsername.trim().toLowerCase(),
      password: editPassword.trim(),
      name: editingStaffMember.name,
      role: editingStaffMember.role,
      staffId: editingStaffMember.id,
      email: editingStaffMember.email,
      phone: editingStaffMember.phone,
      avatarUrl: editingStaffMember.photoUrl
    });

    setShowEditModal(false);
    setToastMsg(`Kredensial login ${editingStaffMember.name} berhasil diperbarui!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Pendidik & Tenaga Kependidikan
            </span>
            <span className="text-xs text-slate-500">Little Star Learning Center</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Database Guru, Terapis & Akun Login Pegawai
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin dapat mengelola informasi kepegawaian serta mengatur username dan password login pengajar.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map(member => {
          const acc = accounts.find(a => a.staffId === member.id || a.name === member.name);
          return (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                    <div className="text-[11px] text-blue-700 font-semibold">{member.jobTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIP: {member.nip}</div>
                  </div>
                </div>

                {/* Login Credentials Box */}
                <div className="mb-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-amber-600" />
                      Akun Login Pegawai:
                    </div>
                    <div className="font-mono text-[11px] text-blue-900 font-bold mt-0.5">
                      User: {acc?.username || `staff.${member.name.split(' ')[0].toLowerCase()}`}
                    </div>
                    <div className="font-mono text-[10px] text-slate-600">
                      Pass: {acc?.password || '12345'}
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <button
                      onClick={() => handleOpenEditCreds(member)}
                      className="px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-white rounded-lg border border-blue-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Akun
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Kualifikasi: <strong>{member.qualification}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Spesialisasi: {member.specialization}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.assignedPrograms.map(p => (
                    <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                      {p.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{member.assignedStudentsCount} Siswa Terbina</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Status: {member.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Staff Credentials Modal */}
      {showEditModal && editingStaffMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ubah Akun Login Pegawai</h3>
                <p className="text-xs text-slate-500">{editingStaffMember.name} ({editingStaffMember.jobTitle})</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffCreds} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username Login Pegawai *
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
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
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs cursor-pointer"
                >
                  Simpan Kredensial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
