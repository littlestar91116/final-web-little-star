export type UserRole = 
  | 'super_admin'
  | 'admin_sekolah'
  | 'kepala_sekolah'
  | 'guru_sekolah_pagi'
  | 'terapis'
  | 'shadow_teacher'
  | 'daycare_teacher'
  | 'staff_keuangan'
  | 'wali_murid'
  | 'calon_wali_murid';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  childStudentId?: string; // if role is wali_murid
  staffId?: string; // if teacher/staff
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  childStudentId?: string; // for wali_murid
}

export type ProgramType = 'sekolah_pagi' | 'terapi' | 'daycare' | 'shadow';

export interface ProgramInfo {
  id: ProgramType;
  name: string;
  title: string;
  shortDesc: string;
  badgeColor: string;
  schedule: string;
  ageGroup: string;
  iconName: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  type: string;
  program: ProgramType;
  capacity: number;
  room: string;
  description?: string;
}

export interface JobPosition {
  id: string;
  title: string;
  roleCategory: UserRole;
  description?: string;
}

export interface SchoolProgramDetail {
  id: string;
  code: ProgramType | string;
  title: string;
  shortDesc: string;
  schedule: string;
  ageGroup: string;
  points: string[];
  spesial: string;
  fee: string;
  badgeColor?: string;
  iconName?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  fullName: string;
  nickname: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  address: string;
  photoUrl: string;
  joinDate: string;
  academicYear: string;
  status: 'aktif' | 'cuti' | 'lulus' | 'mutasi';
  className: string;
  enrolledPrograms: ProgramType[];
  specialNeedsNotes?: string;
  accountUsername?: string;
  accountPassword?: string;
  parent: {
    fatherName: string;
    motherName: string;
    guardianName?: string;
    relationship: string;
    whatsapp: string;
    email: string;
    address: string;
    emergencyContact: string;
    fatherOccupation?: string;
    motherOccupation?: string;
  };
}

export interface StaffMember {
  id: string;
  nip: string;
  name: string;
  gender: 'L' | 'P';
  photoUrl: string;
  phone: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  qualification: string;
  specialization: string;
  joinDate: string;
  status: 'tetap' | 'kontrak' | 'part_time';
  assignedPrograms: ProgramType[];
  assignedStudentsCount: number;
  accountUsername?: string;
  accountPassword?: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  childName: string;
  childNickname: string;
  gender: 'L' | 'P';
  birthDate: string;
  birthPlace: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  selectedPrograms: ProgramType[];
  documents: {
    birthCertificate?: boolean;
    familyCard?: boolean;
    medicalReport?: boolean;
    childPhoto?: boolean;
    childVideo?: boolean;
  };
  adminFeeAmount: number;
  paymentStatus: 'belum_bayar' | 'menunggu_verifikasi' | 'terverifikasi' | 'ditolak';
  paymentProofUrl?: string;
  paymentDate?: string;
  observationSlot?: {
    date: string;
    time: string;
    assessorName: string;
    room: string;
  };
  observationStatus: 'belum_dijadwalkan' | 'terjadwal' | 'selesai';
  admissionDecision: 'menunggu_observasi' | 'diterima' | 'rekomendasi_khusus' | 'ditolak';
  notes?: string;
  createdAt: string;
}

export interface ObservationSlot {
  id: string;
  date: string;
  timeSlot: string;
  assessorName: string;
  room: string;
  capacity: number;
  bookedCount: number;
}

export type TaskPeriod = 'harian' | 'mingguan' | 'bulanan' | 'tiga_bulanan' | 'enam_bulanan';
export type TaskStatus = 
  | 'belum_dikerjakan'
  | 'draft'
  | 'dikirim'
  | 'sedang_direview'
  | 'perlu_revisi'
  | 'disetujui'
  | 'terlambat';

export interface TeacherTask {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  program: ProgramType;
  studentId?: string;
  studentName?: string;
  period: TaskPeriod;
  deadline: string;
  status: TaskStatus;
  submissionDate?: string;
  notes?: string;
  reviewerNotes?: string;
  mediaCount?: number;
}

export interface StudentCase {
  id: string;
  caseNumber: string;
  studentId: string;
  studentName: string;
  program: ProgramType;
  reportedBy: string;
  reporterRole: string;
  dateTime: string;
  caseType: 'perilaku' | 'sensori' | 'kesehatan_fisik' | 'sosialisasi' | 'keselamatan' | 'lainnya';
  priority: 'rendah' | 'sedang' | 'tinggi' | 'darurat';
  description: string;
  initialActionTaken: string;
  status: 'dilaporkan' | 'ditinjau' | 'dalam_tindak_lanjut' | 'menunggu_evaluasi' | 'selesai';
  followUpPlan: string;
  assignedStaff: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface DevelopmentIndicatorScore {
  indicatorId: string;
  indicatorName: string;
  domain: 'motorik_halus' | 'motorik_kasar' | 'komunikasi' | 'sosial' | 'kemandirian' | 'kognitif';
  baselineScore: number; // 1 to 5
  previousScore: number;
  currentScore: number;
  targetScore: number;
  rubricNotes: string;
}

export interface StudentDevelopmentRecord {
  studentId: string;
  academicYear: string;
  lastUpdated: string;
  summaryNotes: string;
  scores: DevelopmentIndicatorScore[];
  programDecision: 'CONTINUE' | 'MODIFY' | 'REPLACE';
  decisionRationale: string;
  principalApprovalDate?: string;
  planningMatrix: {
    developmentArea: string;
    indicator: string;
    previousTarget: string;
    actualAchievement: string;
    evaluationNotes: string;
    nextTarget: string;
    responsibleTeacher: string;
  }[];
}

export interface SPPInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  program: ProgramType;
  month: string;
  year: number;
  amount: number;
  dueDate: string;
  status: 'belum_bayar' | 'menunggu_verifikasi' | 'dibayar_sebagian' | 'lunas' | 'ditolak' | 'terlambat';
  paidAmount: number;
  paymentProofUrl?: string;
  paymentDate?: string;
  verifiedBy?: string;
  sessionCount?: number; // specific to Terapi
}

export interface GalleryItem {
  id: string;
  title: string;
  program: ProgramType;
  category: 'kegiatan' | 'prestasi' | 'terapi' | 'outing' | 'projek';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  date: string;
  isPublic: boolean;
  hasParentConsent: boolean;
  studentIds?: string[];
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'admission' | 'payment' | 'task' | 'case' | 'supervision' | 'sdr';
  priority: 'normal' | 'high';
  createdAt: string;
  isRead: boolean;
}

export interface ConsultationRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  targetRole: 'kepala_sekolah' | 'guru_sekolah_pagi' | 'terapis' | 'shadow_teacher';
  targetStaffName?: string;
  requestedDate: string;
  preferredTime: string;
  consultationType: 'tatap_muka' | 'online_zoom' | 'panggilan_telepon';
  topic: string;
  notes?: string;
  status: 'menunggu_konfirmasi' | 'disetujui' | 'selesai' | 'ditolak';
  feedbackNotes?: string;
  confirmedDate?: string;
  confirmedTime?: string;
  createdAt: string;
}

export interface StudentScheduleItem {
  id: string;
  studentId: string;
  program: ProgramType;
  day: string;
  time: string;
  activity: string;
  teacherName: string;
  room: string;
}

export interface StudentAttendanceItem {
  id: string;
  studentId: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Tidak Hadir';
  program: ProgramType;
  notes?: string;
}
