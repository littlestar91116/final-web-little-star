import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';
import { checkAccountLockStatus, AccountLockStatus, DEFAULT_ROLE_PERMISSIONS } from '../lib/accountLockService';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  accounts: UserAccount[];
  login: (username: string, password: string) => { success: boolean; error?: string; isLocked?: boolean; lockStatus?: AccountLockStatus };
  logout: () => void;
  createOrUpdateAccount: (account: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }) => UserAccount;
  deleteAccount: (id: string) => void;
  toggleAccountFreeze: (id: string, isFrozen: boolean, reason?: string) => void;
  updateAccountPermissions: (id: string, permissions: string[]) => void;
  checkLock: (account: UserAccount) => AccountLockStatus;
  directLoginAs: (account: UserAccount) => void;
  resetAccountsToDefault: () => void;
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
    id: 'acc-parent-mikha',
    username: 'wali.mikha',
    password: '12345',
    name: 'Ibu Larasati (Bunda Mikha)',
    role: 'wali_murid',
    email: 'larasati.kurnia@gmail.com',
    childStudentId: 'std-004',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
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
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Deduplicate by ID to eliminate any legacy duplicate entries
          const seenIds = new Set<string>();
          const cleanList: UserAccount[] = [];
          for (const acc of parsed) {
            if (acc && acc.id && !seenIds.has(acc.id)) {
              seenIds.add(acc.id);
              cleanList.push(acc);
            }
          }

          // Ensure at least one super admin exists so the user never gets locked out
          if (!cleanList.some(a => a.role === 'super_admin')) {
            cleanList.unshift(INITIAL_ACCOUNTS[0]);
          }

          return cleanList;
        }
      } catch (e) {
        console.error('Failed to parse ls_user_accounts', e);
      }
    }

    // First run: save INITIAL_ACCOUNTS to localStorage
    try {
      localStorage.setItem('ls_user_accounts', JSON.stringify(INITIAL_ACCOUNTS));
    } catch (e) {
      // ignore
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
    // Default: start at landing/login page
    return null;
  });

  // Listen to cross-tab storage changes for real-time automatic synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ls_user_accounts' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAccounts(parsed);
          }
        } catch {
          // ignore
        }
      }
      if (e.key === 'ls_current_user') {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ls_user_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('ls_current_user', JSON.stringify(currentUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem('ls_current_user');
    }
  }, [currentUser]);

  const login = (
    usernameInput: string, 
    passwordInput: string
  ): { success: boolean; error?: string; isLocked?: boolean; lockStatus?: AccountLockStatus } => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Find account by matching username (case-insensitive) and exact password
    const account = accounts.find(
      (a) => a.username.toLowerCase() === cleanUsername && a.password === cleanPassword
    );

    if (account) {
      // Check if account is frozen / locked (SPP unpaid from 1st of month or manual admin freeze)
      const lockStatus = checkAccountLockStatus(account);
      if (lockStatus.isLocked) {
        return {
          success: false,
          isLocked: true,
          lockStatus,
          error: lockStatus.reason
        };
      }

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

  const directLoginAs = (account: UserAccount) => {
    setCurrentUser(account);
  };

  const checkLock = (account: UserAccount): AccountLockStatus => {
    return checkAccountLockStatus(account);
  };

  const toggleAccountFreeze = (id: string, isFrozen: boolean, reason?: string) => {
    let targetAcc: UserAccount | undefined;
    setAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === id) {
          targetAcc = {
            ...acc,
            isFrozen,
            freezeReason: isFrozen ? (reason || 'Dibekukan oleh Super Admin.') : undefined,
            status: isFrozen ? ('frozen' as const) : ('active' as const)
          };
          return targetAcc;
        }
        return acc;
      });
      try {
        localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Auto-update currentUser if applicable
    setCurrentUser(prev => {
      if (prev && prev.id === id && targetAcc) {
        const nextUser = { ...prev, ...targetAcc };
        try {
          localStorage.setItem('ls_current_user', JSON.stringify(nextUser));
        } catch (e) {
          console.error(e);
        }
        return nextUser;
      }
      return prev;
    });
  };

  const updateAccountPermissions = (id: string, permissions: string[]) => {
    let targetAcc: UserAccount | undefined;
    setAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === id) {
          targetAcc = {
            ...acc,
            customPermissions: permissions
          };
          return targetAcc;
        }
        return acc;
      });
      try {
        localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Auto-update currentUser if applicable
    setCurrentUser(prev => {
      if (prev && prev.id === id && targetAcc) {
        const nextUser = { ...prev, ...targetAcc };
        try {
          localStorage.setItem('ls_current_user', JSON.stringify(nextUser));
        } catch (e) {
          console.error(e);
        }
        return nextUser;
      }
      return prev;
    });
  };

  const createOrUpdateAccount = (
    accountData: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }
  ): UserAccount => {
    const cleanUsername = accountData.username.trim().toLowerCase();
    let savedAcc: UserAccount;

    setAccounts((prev) => {
      // Find existing account by ID, staffId, childStudentId, or username
      const existingIdx = prev.findIndex((a) => {
        if (accountData.id && a.id === accountData.id) return true;
        if (accountData.staffId && a.staffId === accountData.staffId) return true;
        if (accountData.childStudentId && a.childStudentId === accountData.childStudentId) return true;
        if (a.username.toLowerCase() === cleanUsername) return true;
        return false;
      });

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        savedAcc = {
          ...existing,
          ...accountData,
          username: cleanUsername,
          id: existing.id,
          createdAt: existing.createdAt || new Date().toISOString().split('T')[0],
          customPermissions: accountData.customPermissions ?? existing.customPermissions ?? DEFAULT_ROLE_PERMISSIONS[accountData.role] ?? []
        };
        const updated = [...prev];
        updated[existingIdx] = savedAcc;
        try {
          localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      } else {
        const newId = accountData.id || `acc-${Date.now().toString().slice(-6)}`;
        savedAcc = {
          ...accountData,
          username: cleanUsername,
          id: newId,
          createdAt: new Date().toISOString().split('T')[0],
          customPermissions: accountData.customPermissions || DEFAULT_ROLE_PERMISSIONS[accountData.role] || []
        };
        const updated = [savedAcc, ...prev];
        try {
          localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      }
    });

    // Automatically synchronize currentUser if the modified account is the currently logged-in user
    setCurrentUser((prevUser) => {
      if (!prevUser) return null;
      if (
        (savedAcc && prevUser.id === savedAcc.id) ||
        (accountData.id && prevUser.id === accountData.id) ||
        prevUser.username.toLowerCase() === cleanUsername ||
        (accountData.staffId && prevUser.staffId === accountData.staffId) ||
        (accountData.childStudentId && prevUser.childStudentId === accountData.childStudentId)
      ) {
        const updatedUser = { ...prevUser, ...savedAcc };
        try {
          localStorage.setItem('ls_current_user', JSON.stringify(updatedUser));
        } catch (e) {
          console.error(e);
        }
        return updatedUser;
      }
      return prevUser;
    });

    return savedAcc!;
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setCurrentUser((prevUser) => {
      if (prevUser && prevUser.id === id) {
        localStorage.removeItem('ls_current_user');
        return null;
      }
      return prevUser;
    });
  };

  const resetAccountsToDefault = () => {
    setAccounts(INITIAL_ACCOUNTS);
    try {
      localStorage.setItem('ls_user_accounts', JSON.stringify(INITIAL_ACCOUNTS));
    } catch (e) {
      console.error(e);
    }
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
        toggleAccountFreeze,
        updateAccountPermissions,
        checkLock,
        directLoginAs,
        resetAccountsToDefault,
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
