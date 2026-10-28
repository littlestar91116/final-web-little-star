import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, UserRole } from '../types';
import { checkAccountLockStatus, AccountLockStatus, DEFAULT_ROLE_PERMISSIONS } from '../lib/accountLockService';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';
import { 
  resolveIdentifierToEmail, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser 
} from '../lib/adminUserService';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  accounts: UserAccount[];
  login: (usernameOrEmail: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    isLocked?: boolean; 
    lockStatus?: AccountLockStatus; 
  }>;
  logout: () => Promise<void>;
  createOrUpdateAccount: (account: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }) => Promise<UserAccount> | UserAccount;
  deleteAccount: (id: string) => Promise<void> | void;
  toggleAccountFreeze: (id: string, isFrozen: boolean, reason?: string) => Promise<void> | void;
  updateAccountPermissions: (id: string, permissions: string[]) => Promise<void> | void;
  checkLock: (account: UserAccount) => AccountLockStatus;
  directLoginAs: (account: UserAccount) => void;
  resetAccountsToDefault: () => void;
  refreshAccounts: () => Promise<void>;
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
    createdAt: '2026-01-01',
    status: 'active'
  },
  {
    id: 'acc-admin-sek',
    username: 'admin.sekolah',
    password: '12345',
    name: 'Admin Tata Usaha & PSB',
    role: 'admin_sekolah',
    email: 'tu@littlestar.sch.id',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
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
    createdAt: '2026-01-01',
    status: 'active'
  },
  {
    id: 'acc-applicant-rayyan',
    username: 'calon.rayyan',
    password: '12345',
    name: 'Ibu Shinta Bella (Calon Siswa Rayyan)',
    role: 'calon_wali_murid',
    email: 'shinta.bella@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
    status: 'active'
  }
];

export const ROLE_LIST: { role: UserRole; label: string; description: string }[] = [
  { role: 'super_admin', label: 'Super Admin', description: 'Akses penuh seluruh konfigurasi, database, & kelola akun' },
  { role: 'admin_sekolah', label: 'Admin Sekolah', description: 'Pendaftaran PSB, data siswa, penugasan & operasional' },
  { role: 'kepala_sekolah', label: 'Kepala Sekolah', description: 'Supervisi guru, review rapor, approval program & kasus' },
  { role: 'guru_sekolah_pagi', label: 'Guru Sekolah Pagi', description: 'Jadwal kelas, tugas harian, lesson plan & asesmen' },
  { role: 'terapis', label: 'Terapis', description: 'Sesi terapi, target wicara/okupasi, rekam SDR' },
  { role: 'shadow_teacher', label: 'Shadow Teacher', description: 'Pendampingan khusus 1-on-1 & observasi adaptasi kelas' },
  { role: 'daycare_teacher', label: 'DayCare Teacher', description: 'Pengasuhan, aktivitas harian, makan & istirahat' },
  { role: 'staff_keuangan', label: 'Staff Keuangan', description: 'Kelola SPP 4 program & verifikasi transfer pembayaran' },
  { role: 'wali_murid', label: 'Wali Murid', description: 'Portal orang tua, rapor, perkembangan anak & tagihan SPP' },
  { role: 'calon_wali_murid', label: 'Calon Wali Murid', description: 'Formulir PSB online, upload berkas & booking observasi' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('ls_user_accounts');
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenIds = new Set<string>();
          const cleanList: UserAccount[] = [];
          for (const acc of parsed) {
            if (acc && acc.id && !seenIds.has(acc.id)) {
              seenIds.add(acc.id);
              cleanList.push(acc);
            }
          }
          if (!cleanList.some(a => a.role === 'super_admin')) {
            cleanList.unshift(INITIAL_ACCOUNTS[0]);
          }
          return cleanList;
        }
      } catch (e) {
        console.error('Failed to parse ls_user_accounts', e);
      }
    }
    try {
      localStorage.setItem('ls_user_accounts', JSON.stringify(INITIAL_ACCOUNTS));
    } catch {}
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
    return null;
  });

  // Helper to map Supabase profile to UserAccount
  const mapProfileToAccount = (profile: any, email?: string): UserAccount => {
    return {
      id: profile.id,
      username: profile.username || (profile.email ? profile.email.split('@')[0] : profile.id),
      name: profile.full_name || 'Pengguna Little Star',
      role: (profile.role_id as UserRole) || 'wali_murid',
      email: profile.email || email,
      phone: profile.phone || undefined,
      avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      childStudentId: profile.child_student_id || undefined,
      staffId: profile.staff_id || undefined,
      createdAt: profile.created_at ? profile.created_at.split('T')[0] : '2026-01-01',
      isFrozen: profile.status === 'frozen',
      freezeReason: profile.freeze_reason,
      status: profile.status || 'active',
      customPermissions: Array.isArray(profile.custom_permissions) 
        ? profile.custom_permissions 
        : DEFAULT_ROLE_PERMISSIONS[profile.role_id as UserRole] || []
    };
  };

  // Refresh and synchronize accounts list from Supabase profiles if connected
  const refreshAccounts = useCallback(async () => {
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();
    if (supabase && config.isConnected) {
      try {
        const { data: profiles, error } = await supabase.from('profiles').select('*');
        if (!error && profiles && profiles.length > 0) {
          const dbAccounts: UserAccount[] = profiles.map((p: any) => mapProfileToAccount(p));
          setAccounts((prev) => {
            // Merge dbAccounts with local initial accounts so default accounts remain intact
            const mergedMap = new Map<string, UserAccount>();
            for (const acc of prev) {
              mergedMap.set(acc.id, acc);
            }
            for (const acc of dbAccounts) {
              mergedMap.set(acc.id, acc);
            }
            const merged = Array.from(mergedMap.values());
            try {
              localStorage.setItem('ls_user_accounts', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Failed to fetch accounts from Supabase profiles:', err);
      }
    }
  }, []);

  // Initialize and restore Supabase session on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    async function initSession() {
      setIsLoading(true);
      setAuthError(null);

      if (supabase && config.isConnected) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('Error fetching Supabase session:', sessionError);
          }

          if (session?.user && isMounted) {
            // Fetch profile for the authenticated user
            const { data: profile, error: profError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profError) {
              console.warn('Error fetching user profile:', profError);
            }

            if (profile) {
              const account = mapProfileToAccount(profile, session.user.email);
              setCurrentUser(account);
              try {
                localStorage.setItem('ls_current_user', JSON.stringify(account));
              } catch {}
            } else {
              // Self-healing: if session is valid in Supabase Auth but missing in public.profiles, create it
              const defaultRole = (session.user.user_metadata?.role as UserRole) || 'wali_murid';
              const defaultName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Pengguna';
              const defaultUsername = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user';

              const { data: newProfile, error: insertErr } = await supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  email: session.user.email,
                  username: defaultUsername,
                  full_name: defaultName,
                  role_id: defaultRole,
                  status: 'active'
                }, { onConflict: 'id' })
                .select()
                .single();

              if (!insertErr && newProfile) {
                const healedAccount = mapProfileToAccount(newProfile, session.user.email);
                setCurrentUser(healedAccount);
                try {
                  localStorage.setItem('ls_current_user', JSON.stringify(healedAccount));
                } catch {}
              } else {
                console.warn('Auto-create profile failed:', insertErr);
                setAuthError('Profil akun tidak ditemukan di database. Hubungi Super Admin.');
              }
            }
          }
        } catch (err: any) {
          console.warn('Session restoration failed:', err);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    initSession();
    refreshAccounts();

    // Listen to Supabase Auth State Changes
    let authSubscription: any = null;
    if (supabase && config.isConnected) {
      const { data: subData } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem('ls_current_user');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile && isMounted) {
              const account = mapProfileToAccount(profile, session.user.email);
              setCurrentUser(account);
              try {
                localStorage.setItem('ls_current_user', JSON.stringify(account));
              } catch {}
            }
          }
        }
      });
      authSubscription = subData?.subscription;
    }

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [refreshAccounts]);

  // Real-time synchronization across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ls_user_accounts' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAccounts(parsed);
          }
        } catch {}
      }
      if (e.key === 'ls_current_user') {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
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

  // Unified login supporting both Supabase Auth and local accounts
  const login = async (
    identifierInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string; isLocked?: boolean; lockStatus?: AccountLockStatus }> => {
    const cleanIdentifier = identifierInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!cleanIdentifier || !cleanPassword) {
      return { success: false, error: 'Mohon masukkan username / email dan password Anda.' };
    }

    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    // 1. If Supabase is connected, attempt Supabase Auth login
    if (supabase && config.isConnected) {
      try {
        const resolvedEmail = await resolveIdentifierToEmail(cleanIdentifier, accounts);
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: resolvedEmail,
          password: cleanPassword
        });

        if (authError) {
          // If auth error is invalid credentials, attempt local accounts fallback
          if (authError.message.toLowerCase().includes('invalid login credentials')) {
            // Check if local account exists
            const localAcc = accounts.find(
              (a) => (a.username.toLowerCase() === cleanIdentifier.toLowerCase() || (a.email && a.email.toLowerCase() === cleanIdentifier.toLowerCase())) && a.password === cleanPassword
            );
            if (localAcc) {
              const lockStatus = checkAccountLockStatus(localAcc);
              if (lockStatus.isLocked) {
                return { success: false, isLocked: true, lockStatus, error: lockStatus.reason };
              }
              setCurrentUser(localAcc);
              return { success: true };
            }

            return {
              success: false,
              error: 'Username atau password salah. Silakan periksa kembali kredensial Anda.'
            };
          }

          if (authError.message.toLowerCase().includes('email not confirmed')) {
            return {
              success: false,
              error: 'Email akun belum dikonfirmasi. Silakan periksa kotak masuk email Anda.'
            };
          }

          return { success: false, error: authError.message };
        }

        if (authData?.user) {
          // Fetch profile from public.profiles
          const { data: profile, error: profErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          let userAccount: UserAccount;
          if (profile) {
            userAccount = mapProfileToAccount(profile, authData.user.email);
          } else {
            // Auto-heal missing profile row
            const defaultRole = (authData.user.user_metadata?.role as UserRole) || 'wali_murid';
            const defaultName = authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Pengguna';
            const defaultUsername = authData.user.user_metadata?.username || authData.user.email?.split('@')[0] || 'user';

            const { data: createdProfile } = await supabase
              .from('profiles')
              .upsert({
                id: authData.user.id,
                email: authData.user.email,
                username: defaultUsername,
                full_name: defaultName,
                role_id: defaultRole,
                status: 'active'
              }, { onConflict: 'id' })
              .select()
              .single();

            userAccount = createdProfile
              ? mapProfileToAccount(createdProfile, authData.user.email)
              : {
                  id: authData.user.id,
                  username: defaultUsername,
                  name: defaultName,
                  role: defaultRole,
                  email: authData.user.email,
                  createdAt: new Date().toISOString().split('T')[0],
                  status: 'active'
                };
          }

          // Check if account is frozen
          const lockStatus = checkAccountLockStatus(userAccount);
          if (lockStatus.isLocked) {
            return {
              success: false,
              isLocked: true,
              lockStatus,
              error: lockStatus.reason
            };
          }

          setCurrentUser(userAccount);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login exception, checking local fallback:', err);
      }
    }

    // 2. Local accounts authentication (offline / mock mode)
    const localAccount = accounts.find(
      (a) =>
        (a.username.toLowerCase() === cleanIdentifier.toLowerCase() ||
          (a.email && a.email.toLowerCase() === cleanIdentifier.toLowerCase())) &&
        a.password === cleanPassword
    );

    if (localAccount) {
      const lockStatus = checkAccountLockStatus(localAccount);
      if (lockStatus.isLocked) {
        return {
          success: false,
          isLocked: true,
          lockStatus,
          error: lockStatus.reason
        };
      }

      setCurrentUser(localAccount);
      return { success: true };
    }

    return {
      success: false,
      error: 'Username atau password salah. Silakan periksa kembali kredensial Anda.'
    };
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('ls_current_user');
  };

  const directLoginAs = (account: UserAccount) => {
    setCurrentUser(account);
  };

  const checkLock = (account: UserAccount): AccountLockStatus => {
    return checkAccountLockStatus(account);
  };

  const toggleAccountFreeze = async (id: string, isFrozen: boolean, reason?: string) => {
    const nextStatus = isFrozen ? 'frozen' : 'active';
    const freezeReason = isFrozen ? (reason || 'Dibekukan oleh Super Admin.') : undefined;

    // 1. Update in local state
    let targetAcc: UserAccount | undefined;
    setAccounts((prev) => {
      const updated = prev.map((acc) => {
        if (acc.id === id) {
          targetAcc = {
            ...acc,
            isFrozen,
            freezeReason,
            status: nextStatus
          };
          return targetAcc;
        }
        return acc;
      });
      try {
        localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Synchronize currentUser if affected
    setCurrentUser((prev) => {
      if (prev && prev.id === id && targetAcc) {
        const nextUser = { ...prev, ...targetAcc };
        try {
          localStorage.setItem('ls_current_user', JSON.stringify(nextUser));
        } catch {}
        return nextUser;
      }
      return prev;
    });

    // 3. Update in backend / Supabase
    if (targetAcc) {
      await updateAdminUser({
        id,
        username: targetAcc.username,
        name: targetAcc.name,
        role: targetAcc.role,
        isFrozen,
        freezeReason,
        status: nextStatus
      });
    }
  };

  const updateAccountPermissions = async (id: string, permissions: string[]) => {
    let targetAcc: UserAccount | undefined;
    setAccounts((prev) => {
      const updated = prev.map((acc) => {
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
      } catch {}
      return updated;
    });

    setCurrentUser((prev) => {
      if (prev && prev.id === id && targetAcc) {
        const nextUser = { ...prev, ...targetAcc };
        try {
          localStorage.setItem('ls_current_user', JSON.stringify(nextUser));
        } catch {}
        return nextUser;
      }
      return prev;
    });

    if (targetAcc) {
      await updateAdminUser({
        id,
        username: targetAcc.username,
        name: targetAcc.name,
        role: targetAcc.role,
        customPermissions: permissions
      });
    }
  };

  const createOrUpdateAccount = async (
    accountData: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }
  ): Promise<UserAccount> => {
    const cleanUsername = accountData.username.trim().toLowerCase();
    const cleanEmail = (accountData.email?.trim() || `${cleanUsername}@littlestar.sch.id`).toLowerCase();
    let savedAcc: UserAccount;

    // Check if updating existing
    const existingIdx = accounts.findIndex((a) => {
      if (accountData.id && a.id === accountData.id) return true;
      if (accountData.staffId && a.staffId === accountData.staffId) return true;
      if (accountData.childStudentId && a.childStudentId === accountData.childStudentId) return true;
      if (a.username.toLowerCase() === cleanUsername) return true;
      return false;
    });

    if (existingIdx >= 0) {
      const existing = accounts[existingIdx];
      savedAcc = {
        ...existing,
        ...accountData,
        id: existing.id,
        username: cleanUsername,
        email: cleanEmail,
        createdAt: existing.createdAt || new Date().toISOString().split('T')[0],
        customPermissions:
          accountData.customPermissions ?? existing.customPermissions ?? DEFAULT_ROLE_PERMISSIONS[accountData.role] ?? []
      };

      // Call backend update
      await updateAdminUser({
        id: existing.id,
        username: cleanUsername,
        name: accountData.name,
        role: accountData.role,
        email: cleanEmail,
        password: accountData.password,
        phone: accountData.phone,
        avatarUrl: accountData.avatarUrl,
        childStudentId: accountData.childStudentId,
        staffId: accountData.staffId,
        status: accountData.status || (accountData.isFrozen ? 'frozen' : 'active'),
        freezeReason: accountData.freezeReason,
        customPermissions: savedAcc.customPermissions
      });

      setAccounts((prev) => {
        const updated = [...prev];
        updated[existingIdx] = savedAcc;
        try {
          localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } else {
      // Call backend create
      const backendRes = await createAdminUser({
        username: cleanUsername,
        password: accountData.password || '12345',
        name: accountData.name,
        role: accountData.role,
        email: cleanEmail,
        phone: accountData.phone,
        avatarUrl: accountData.avatarUrl,
        childStudentId: accountData.childStudentId,
        staffId: accountData.staffId,
        status: accountData.status || (accountData.isFrozen ? 'frozen' : 'active'),
        freezeReason: accountData.freezeReason,
        customPermissions: accountData.customPermissions || DEFAULT_ROLE_PERMISSIONS[accountData.role] || []
      });

      const assignedId = backendRes.user?.id || accountData.id || `acc-${Date.now().toString().slice(-6)}`;
      savedAcc = {
        ...accountData,
        id: assignedId,
        username: cleanUsername,
        email: cleanEmail,
        createdAt: new Date().toISOString().split('T')[0],
        customPermissions: accountData.customPermissions || DEFAULT_ROLE_PERMISSIONS[accountData.role] || []
      };

      setAccounts((prev) => {
        const updated = [savedAcc, ...prev];
        try {
          localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    // Synchronize currentUser if the edited account is the currently logged-in user
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
        } catch {}
        return updatedUser;
      }
      return prevUser;
    });

    return savedAcc!;
  };

  const deleteAccount = async (id: string) => {
    await deleteAdminUser(id);

    setAccounts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('ls_user_accounts', JSON.stringify(updated));
      } catch {}
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
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isLoading,
        authError,
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
        refreshAccounts,
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
