import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  accounts: UserAccount[];
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  createOrUpdateAccount: (account: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }) => UserAccount;
  deleteAccount: (id: string) => void;
  availableRoles: { role: UserRole; label: string; description: string }[];
}

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-admin',
    username: 'admin',
    password: '12345',
    name: 'Administrator Utama',
    role: 'super_admin',
    email: 'admin@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-admin-sek',
    username: 'admin.sekolah',
    password: '12345',
    name: 'Admin Tata Usaha & PSB',
    role: 'admin_sekolah',
    email: 'tu@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-principal',
    username: 'kepala.nurul',
    password: '12345',
    name: 'Ibu Hj. Nurul Hidayati, M.Pd.',
    role: 'kepala_sekolah',
    email: 'nurul.hidayati@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-001',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-teacher-sarah',
    username: 'guru.sarah',
    password: '12345',
    name: 'Kak Sarah Amanda, S.Psi.',
    role: 'guru_sekolah_pagi',
    email: 'sarah.amanda@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-002',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-therapist-rian',
    username: 'terapis.rian',
    password: '12345',
    name: 'Kak Rian Prasetya, S.Tr.Kes.',
    role: 'terapis',
    email: 'rian.wicara@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-003',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-shadow-dita',
    username: 'shadow.dita',
    password: '12345',
    name: 'Kak Dita Anggraini, S.Pd.',
    role: 'shadow_teacher',
    email: 'dita.shadow@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-004',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-daycare-fitri',
    username: 'daycare.fitri',
    password: '12345',
    name: 'Bunda Fitri Melati, A.Md.Keb.',
    role: 'daycare_teacher',
    email: 'fitri.daycare@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-005',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-finance-ilham',
    username: 'keuangan.ilham',
    password: '12345',
    name: 'Bapak Ilham Pratama, S.E.',
    role: 'staff_keuangan',
    email: 'keuangan@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    staffId: 'stf-006',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-parent-dylan',
    username: 'wali.dylan',
    password: '12345',
    name: 'Ibu Ratna Dewi (Bunda Dylan)',
    role: 'wali_murid',
    email: 'ratna.pratama@gmail.com',
    childStudentId: 'std-001',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01'
  },
  {
    id: 'acc-applicant-rayyan',
    username: 'calon.rayyan',
    password: '12345',
    name: 'Ibu Shinta Bella (Calon Siswa Rayyan)',
    role: 'calon_wali_murid',
    email: 'shinta.bella@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01'
  }
];

export const ROLE_LIST: { role: UserRole; label: string; description: string }[] = [
  { role: 'super_admin', label: 'Super Admin', description: 'Akses penuh seluruh konfigurasi, database, & kelola akun' },
  { role: 'admin_sekolah', label: 'Admin Sekolah', description: 'Pendaftaran PSB, data siswa, penugasan & operasional' },
  { role: 'kepala_sekolah', label: 'Kepala Sekolah', description: 'Supervisi guru, review rapor, approval program & kasus' },
  { role: 'guru_sekolah_pagi', label: 'Guru Sekolah Pagi', description: 'Jadwal kelas, tugas harian, lesson plan & asesmen' },
  { role: 'terapis', label: 'Terapis', description: 'Sesi terapi, target wicara/okupasi, rekam rekam SDR' },
  { role: 'shadow_teacher', label: 'Shadow Teacher', description: 'Pendampingan khusus 1-on-1 & observasi adaptasi kelas' },
  { role: 'daycare_teacher', label: 'DayCare Teacher', description: 'Pengasuhan, aktivitas harian, makan & istirahat' },
  { role: 'staff_keuangan', label: 'Staff Keuangan', description: 'Kelola SPP 4 program & verifikasi transfer pembayaran' },
  { role: 'wali_murid', label: 'Wali Murid', description: 'Portal orang tua, rapor, perkembangan anak & tagihan SPP' },
  { role: 'calon_wali_murid', label: 'Calon Wali Murid', description: 'Formulir PSB online, upload berkas & booking observasi' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('ls_user_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure super admin exists with username: admin and password: 12345
        const hasAdmin = parsed.some((a: UserAccount) => a.username === 'admin');
        if (!hasAdmin) {
          return [INITIAL_ACCOUNTS[0], ...parsed];
        }
        return parsed;
      } catch (e) {
        return INITIAL_ACCOUNTS;
      }
    }
    return INITIAL_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const savedUser = localStorage.getItem('ls_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    // Default: start at login page (currentUser is null)
    return null;
  });

  useEffect(() => {
    localStorage.setItem('ls_user_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ls_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ls_current_user');
    }
  }, [currentUser]);

  const login = (usernameInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Find account by matching username (case-insensitive) and exact password
    const account = accounts.find(
      (a) => a.username.toLowerCase() === cleanUsername && a.password === cleanPassword
    );

    if (account) {
      setCurrentUser(account);
      return { success: true };
    }

    return {
      success: false,
      error: 'Username atau password salah. Silakan periksa kembali kredensial Anda.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ls_current_user');
  };

  const createOrUpdateAccount = (
    accountData: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }
  ): UserAccount => {
    let savedAcc: UserAccount;
    setAccounts((prev) => {
      // Check if existing by ID or username
      const existingIdx = prev.findIndex(
        (a) => (accountData.id && a.id === accountData.id) || a.username.toLowerCase() === accountData.username.toLowerCase()
      );

      if (existingIdx >= 0) {
        savedAcc = {
          ...prev[existingIdx],
          ...accountData,
          id: prev[existingIdx].id
        };
        const updated = [...prev];
        updated[existingIdx] = savedAcc;
        return updated;
      } else {
        savedAcc = {
          ...accountData,
          id: accountData.id || `acc-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return [savedAcc, ...prev];
      }
    });

    return savedAcc!;
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        accounts,
        login,
        logout,
        createOrUpdateAccount,
        deleteAccount,
        availableRoles: ROLE_LIST
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
