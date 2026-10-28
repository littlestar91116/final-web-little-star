import { SPPInvoice, UserAccount, UserRole } from '../types';
import { INITIAL_INVOICES } from './mockData';

export interface ModulePermissionOption {
  id: string;
  label: string;
  category: 'Utama' | 'PSB' | 'Akademik' | 'Pembelajaran' | 'Evaluasi' | 'Administrasi';
  description: string;
}

export const SYSTEM_MODULES: ModulePermissionOption[] = [
  { id: 'dashboard', label: 'Dashboard Utama / Ananda', category: 'Utama', description: 'Akses halaman ringkasan dan dashboard peran' },
  { id: 'admissions', label: 'Pendaftaran Siswa Baru (PSB)', category: 'PSB', description: 'Kelola formulir PSB online dan berkas calon siswa' },
  { id: 'observations', label: 'Jadwal & Observasi Calon Siswa', category: 'PSB', description: 'Jadwal slot asesmen psikologis dan observasi ruang' },
  { id: 'students', label: 'Database Siswa (Buku Induk)', category: 'Akademik', description: 'Data biodata siswa, kelas, riwayat terapi, dan orang tua' },
  { id: 'staff', label: 'Guru & Pegawai', category: 'Akademik', description: 'Kelola NIP, kualifikasi guru, dan penugasan spesialisasi' },
  { id: 'programs', label: 'Program Sekolah (4 Pilar)', category: 'Akademik', description: 'Sekolah Pagi, Layanan Terapi, DayCare, dan Shadow Teacher' },
  { id: 'schedule', label: 'Jadwal & Absensi Guru / Kelas', category: 'Akademik', description: 'Kalender sesi kelas harian dan presensi kehadiran' },
  { id: 'parent_schedule', label: 'Jadwal & Absen Siswa (Wali Murid)', category: 'Akademik', description: 'Presensi harian dan jadwal kegiatan ananda tercinta' },
  { id: 'tasks', label: 'Manajemen Tugas Guru', category: 'Pembelajaran', description: 'Lesson plan, asesmen harian, dan upload bukti media tugas' },
  { id: 'cases', label: 'Laporan Kasus & Disiplin Siswa', category: 'Pembelajaran', description: 'Penanganan insiden sensori, perilaku, dan tindak lanjut' },
  { id: 'supervision', label: 'Supervisi Kepala Sekolah', category: 'Pembelajaran', description: 'Evaluasi kinerja guru, telaah kasus, dan verifikasi rapor' },
  { id: 'sdr', label: 'Student Development Record (SDR)', category: 'Evaluasi', description: 'Rekam rubrik 6 domain perkembangan dan grafik capaian' },
  { id: 'comparison', label: 'Dev Comparison & Evaluasi', category: 'Evaluasi', description: 'Perbandingan baseline capaian target vs hasil aktual' },
  { id: 'finance', label: 'Keuangan & Tagihan SPP', category: 'Administrasi', description: 'Kelola SPP bulanan, verifikasi transfer, dan riwayat tagihan' },
  { id: 'consultations', label: 'Pengajuan Konsultasi & Supervisi', category: 'Administrasi', description: 'Permohonan konsultasi tatap muka, daring, atau telepon' },
  { id: 'gallery', label: 'Galeri & Dokumentasi Kegiatan', category: 'Administrasi', description: 'Publikasi foto dan video aktivitas belajar Little Star' },
  { id: 'users', label: 'Pusat Akun & Hak Akses', category: 'Administrasi', description: 'Kelola akun login, reset password, dan hak akses modul' },
  { id: 'settings', label: 'Pengaturan Website & Branding', category: 'Administrasi', description: 'Konfigurasi teks hero, WhatsApp CS, dan identitas sekolah' }
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: SYSTEM_MODULES.map(m => m.id),
  admin_sekolah: [
    'dashboard', 'admissions', 'observations', 'students', 'staff', 'programs',
    'schedule', 'tasks', 'cases', 'sdr', 'comparison', 'finance', 'gallery'
  ],
  kepala_sekolah: [
    'dashboard', 'admissions', 'observations', 'students', 'staff', 'programs',
    'schedule', 'tasks', 'cases', 'supervision', 'sdr', 'comparison', 'gallery'
  ],
  guru_sekolah_pagi: [
    'dashboard', 'students', 'programs', 'schedule', 'tasks', 'cases', 'sdr', 'gallery'
  ],
  terapis: [
    'dashboard', 'observations', 'students', 'programs', 'schedule', 'tasks', 'cases', 'sdr', 'comparison', 'gallery'
  ],
  shadow_teacher: [
    'dashboard', 'students', 'programs', 'schedule', 'tasks', 'cases', 'sdr', 'gallery'
  ],
  daycare_teacher: [
    'dashboard', 'students', 'programs', 'schedule', 'tasks', 'cases', 'gallery'
  ],
  staff_keuangan: [
    'dashboard', 'finance', 'admissions', 'gallery'
  ],
  wali_murid: [
    'dashboard', 'parent_schedule', 'finance', 'sdr', 'consultations'
  ],
  calon_wali_murid: [
    'admissions', 'observations'
  ]
};

export interface AccountLockStatus {
  isLocked: boolean;
  reason?: string;
  unpaidInvoices: SPPInvoice[];
  totalUnpaidAmount: number;
  lockType: 'spp_auto_freeze' | 'manual_freeze' | 'none';
  childName?: string;
  lockDate?: string;
}

export const getStoredInvoices = (): SPPInvoice[] => {
  try {
    const saved = localStorage.getItem('ls_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  } catch {
    return INITIAL_INVOICES;
  }
};

/**
 * Checks whether an account is locked/frozen:
 * 1. Manual Freeze by Super Admin (account.isFrozen)
 * 2. Automatic Freeze starting from 1st of each month if student has unpaid SPP ("akun mulai terkunci dari tanggal 1 tiap bulannya")
 */
export const checkAccountLockStatus = (
  account: UserAccount,
  invoicesList?: SPPInvoice[],
  customDate?: Date
): AccountLockStatus => {
  // 1. Check for Manual Freeze by Super Admin
  if (account.isFrozen) {
    return {
      isLocked: true,
      reason: account.freezeReason || 'Akun ini telah dinonaktifkan/dibekukan oleh Super Admin.',
      unpaidInvoices: [],
      totalUnpaidAmount: 0,
      lockType: 'manual_freeze'
    };
  }

  // 2. Automatic SPP freeze applies to wali_murid
  if (account.role === 'wali_murid') {
    const childId = account.childStudentId;
    if (!childId) {
      return { isLocked: false, unpaidInvoices: [], totalUnpaidAmount: 0, lockType: 'none' };
    }

    const allInvoices = invoicesList && invoicesList.length > 0 ? invoicesList : getStoredInvoices();
    const currentDate = customDate || new Date();
    const currentDay = currentDate.getDate(); // 1 to 31

    // Rule: "akun mulai terkunci dari tanggal 1 tiap bulannya jika ada wali siswa yang belum melakukan pembayaran SPP"
    // Starting on the 1st day of the month (currentDay >= 1), any unpaid invoice triggers automatic freeze.
    // Unpaid means: status === 'belum_bayar' | 'terlambat' | 'ditolak'.
    // If status is 'menunggu_verifikasi' or 'lunas', payment has been made so account is NOT locked.
    const unpaid = allInvoices.filter(inv => {
      if (inv.studentId !== childId) return false;
      const isUnpaid = inv.status === 'belum_bayar' || inv.status === 'terlambat' || inv.status === 'ditolak';
      return isUnpaid;
    });

    if (unpaid.length > 0) {
      const total = unpaid.reduce((sum, inv) => sum + (inv.amount - (inv.paidAmount || 0)), 0);
      const invoiceMonths = Array.from(new Set(unpaid.map(i => `${i.month} ${i.year}`))).join(', ');
      const childName = unpaid[0]?.studentName || 'Ananda';

      return {
        isLocked: true,
        reason: `Akun dibekukan secara otomatis mulai tanggal 1 tiap bulannya karena terdapat tagihan SPP ananda ${childName} (${invoiceMonths}) yang belum diselesaikan.`,
        unpaidInvoices: unpaid,
        totalUnpaidAmount: total,
        lockType: 'spp_auto_freeze',
        childName,
        lockDate: `Tanggal 1 ${unpaid[0]?.month || 'Bulan Berjalan'}`
      };
    }
  }

  return { isLocked: false, unpaidInvoices: [], totalUnpaidAmount: 0, lockType: 'none' };
};

/**
 * Marks an invoice as paid / awaiting verification and unlocks the account.
 */
export const markInvoicePaymentProof = (
  invoiceId: string, 
  proofUrl: string = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
  paidAmount?: number
): SPPInvoice[] => {
  const currentInvoices = getStoredInvoices();
  const updated = currentInvoices.map(inv => {
    if (inv.id === invoiceId) {
      return {
        ...inv,
        status: 'menunggu_verifikasi' as const,
        paymentProofUrl: proofUrl,
        paidAmount: paidAmount || inv.amount,
        paymentDate: new Date().toISOString().split('T')[0]
      };
    }
    return inv;
  });

  localStorage.setItem('ls_invoices', JSON.stringify(updated));
  return updated;
};

/**
 * Admin direct mark invoice as lunas (fully paid).
 */
export const markInvoiceFullyPaid = (invoiceId: string): SPPInvoice[] => {
  const currentInvoices = getStoredInvoices();
  const updated = currentInvoices.map(inv => {
    if (inv.id === invoiceId) {
      return {
        ...inv,
        status: 'lunas' as const,
        paidAmount: inv.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        verifiedBy: 'Super Admin (Override Pelunasan)'
      };
    }
    return inv;
  });

  localStorage.setItem('ls_invoices', JSON.stringify(updated));
  return updated;
};
