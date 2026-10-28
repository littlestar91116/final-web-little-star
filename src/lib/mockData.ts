import { 
  Student, 
  StaffMember, 
  AdmissionApplication, 
  ObservationSlot, 
  TeacherTask, 
  StudentCase, 
  StudentDevelopmentRecord, 
  SPPInvoice, 
  GalleryItem, 
  NotificationItem, 
  ProgramInfo, 
  SchoolClass, 
  JobPosition, 
  SchoolProgramDetail, 
  ConsultationRequest, 
  StudentScheduleItem, 
  StudentAttendanceItem 
} from '../types';

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-01',
    name: 'Bintang Kejora (Kelas A)',
    type: 'PAUD / TK A',
    program: 'sekolah_pagi',
    capacity: 15,
    room: 'Ruang Bintang 1 (Lantai 1)',
    description: 'Kelas usia 4-5 tahun fokus pada kemandirian, pra-literasi, sosialisasi, dan regulasi sensori.'
  },
  {
    id: 'cls-02',
    name: 'Bintang Timur (Playgroup)',
    type: 'Kelompok Bermain',
    program: 'sekolah_pagi',
    capacity: 12,
    room: 'Ruang Bintang 2 (Lantai 1)',
    description: 'Kelas usia 3-4 tahun stimulasi sensori bermain, koordinasi motorik, dan pembiasaan adab.'
  },
  {
    id: 'cls-03',
    name: 'Bintang Kecil (Toddler)',
    type: 'Toddler Stimulation',
    program: 'sekolah_pagi',
    capacity: 10,
    room: 'Ruang Sensori Toddler (Lantai 1)',
    description: 'Stimulasi sensori eksplorasi balita usia 1.5 - 3 tahun bersama pendidik dan pengasuh.'
  },
  {
    id: 'cls-04',
    name: 'Kelas Terapi & Sensori Wicara',
    type: 'Layanan Terapi Individual',
    program: 'terapi',
    capacity: 8,
    room: 'Sensori Gym & Klinik Terapi (Lantai 2)',
    description: 'Sesi terapi intensif wicara, sensori integrasi, okupasi, dan modifikasi perilaku ABA.'
  },
  {
    id: 'cls-05',
    name: 'Little Explorers DayCare',
    type: 'DayCare Full Day',
    program: 'daycare',
    capacity: 20,
    room: 'DayCare Suites & Ruang Istirahat (Lantai 2)',
    description: 'Pengasuhan penuh kasih, nutrisi terjadwal, toilet training, tidur siang, dan stimulasi sore.'
  },
  {
    id: 'cls-06',
    name: 'Kelas Inklusi Shadow',
    type: 'Pendampingan 1-on-1',
    program: 'shadow',
    capacity: 6,
    room: 'Ruang Kelas Reguler & Resource Room',
    description: 'Pendampingan khusus 1-on-1 untuk mendukung adaptasi, atensi belajar, dan inklusi anak di kelas.'
  }
];

export const INITIAL_POSITIONS: JobPosition[] = [
  {
    id: 'pos-01',
    title: 'Kepala Sekolah & Konsultan Pendidikan',
    roleCategory: 'kepala_sekolah',
    description: 'Memimpin kurikulum inklusif, evaluasi SDR, supervisi guru, dan penerimaan murid baru.'
  },
  {
    id: 'pos-02',
    title: 'Wali Kelas Sekolah Pagi',
    roleCategory: 'guru_sekolah_pagi',
    description: 'Mengelola aktivitas harian kelas, RPPH, stimulasi bermain, dan laporan perkembangan anak.'
  },
  {
    id: 'pos-03',
    title: 'Terapis Wicara & Bahasa (Speech Therapist)',
    roleCategory: 'terapis',
    description: 'Menangani speech delay, stimulasi oral motor, artikulasi vokal-konsonan, dan bahasa reseptif-ekspresif.'
  },
  {
    id: 'pos-04',
    title: 'Terapis Sensori Integrasi & Okupasi',
    roleCategory: 'terapis',
    description: 'Stimulasi vestibular, proprioseptif, taktil, motorik halus, dan kemandirian aktivitas harian (ADL).'
  },
  {
    id: 'pos-05',
    title: 'Guru Pendamping Khusus (Shadow Teacher)',
    roleCategory: 'shadow_teacher',
    description: 'Mendampingi anak neurodiverse 1-on-1 di kelas, modulasi emosi, memfasilitasi komunikasi dan fokus.'
  },
  {
    id: 'pos-06',
    title: 'Pendidik & Pengasuh DayCare (Daycare Educator)',
    roleCategory: 'daycare_teacher',
    description: 'Mengasuh, stimulasi tumbuh kembang balita, mengelola jadwal tidur, makan, dan toilet training.'
  },
  {
    id: 'pos-07',
    title: 'Staff Administrasi & Keuangan SPP',
    roleCategory: 'staff_keuangan',
    description: 'Mengelola tagihan SPP, pencatatan pembayaran pendaftaran PSB, dan pembukuan sekolah.'
  }
];

export const INITIAL_PROGRAM_DETAILS: SchoolProgramDetail[] = [
  {
    id: 'prog-01',
    code: 'sekolah_pagi',
    title: 'Program Sekolah Pagi (Early Childhood Education)',
    shortDesc: 'Kurikulum bermain & belajar holistik untuk mengasah sensorik, kognitif, motorik, dan sosialisasi anak usia dini dalam lingkungan inklusif ramah anak.',
    schedule: 'Senin - Jumat | 08.00 - 11.30 WIB',
    ageGroup: '2 - 6 Tahun',
    points: [
      'Sensory Play & Eksplorasi Kreatif Harian',
      'Pra-Literasi, Fonik & Pra-Matematika Menyenangkan',
      'Pembiasaan Adab, Kemandirian & Sosialisasi Positif',
      'Rasio Guru-Anak Kecil (1 Guru membina 5 Anak)',
      'Ruang Kelas Luas, Ber-AC, Berkarpet & Ramah Anak'
    ],
    spesial: 'Pendekatan Inklusif ramah neurodiversitas didukung observasi psikolog berkala',
    fee: 'Rp 1.500.000 / bulan',
    badgeColor: 'from-blue-600 to-indigo-600',
    iconName: 'Sun'
  },
  {
    id: 'prog-02',
    code: 'terapi',
    title: 'Layanan Terapi Terpadu',
    shortDesc: 'Terapi Wicara (Speech Therapy), Okupasi, Sensori Integrasi, dan Perilaku (ABA) bersama tim profesional terapis berizin resmi.',
    schedule: 'Sesi Khusus (Senin - Sabtu | 08.00 - 17.00 WIB)',
    ageGroup: '1.5 - 12 Tahun',
    points: [
      'Terapi Wicara & Artikulasi Oral Motor',
      'Sensori Integrasi (Vestibular, Taktil & Proprioseptif)',
      'Terapi Okupasi & Kemandirian Aktivitas Keseharian (ADL)',
      'Terapi Perilaku (Applied Behavior Analysis / ABA)',
      'Ruangan Sensori Gym Khusus, Ayunan SI & Trampolin'
    ],
    spesial: 'Evaluasi perkembangan bulanan & Rapor SDR (Student Development Record) terintegrasi',
    fee: 'Rp 250.000 / sesi',
    badgeColor: 'from-emerald-600 to-teal-600',
    iconName: 'HeartHandshake'
  },
  {
    id: 'prog-03',
    code: 'daycare',
    title: 'DayCare & Pengasuhan Edukatif',
    shortDesc: 'Pengasuhan penuh kasih sayang, stimulasi nutrisi gizi seimbang, jadwal tidur teratur, toilet training, serta pembiasaan karakter baik.',
    schedule: 'Senin - Jumat | 07.30 - 17.30 WIB (Full Day)',
    ageGroup: '1 - 6 Tahun',
    points: [
      'Makanan & Snack Sehat Bergizi Terjadwal dari Ahli Gizi',
      'Tidur Siang Nyaman di Tempat Tidur Bersih Individual',
      'Stimulasi Tumbuh Kembang Setiap Pagi & Sore',
      'Toilet Training Terbimbing dengan Sabar dan Ramah',
      'Laporan Harian (Daily Log) Realtime: Makan, Tidur & BAB/BAK'
    ],
    spesial: 'Didampingi tenaga bidan & pengasuh terlatih bersertifikasi kompetensi',
    fee: 'Rp 2.000.000 / bulan',
    badgeColor: 'from-amber-500 to-yellow-500',
    iconName: 'Sparkles'
  },
  {
    id: 'prog-04',
    code: 'shadow',
    title: 'Pendampingan Khusus (Shadow Teacher)',
    shortDesc: 'Pendampingan 1-on-1 di kelas untuk membantu anak dengan kebutuhan khusus beradaptasi, fokus, regulasi emosi, dan mandiri bersosialisasi.',
    schedule: 'Menyesuaikan Jam Sekolah Anak (Pagi / Sesi Kelas)',
    ageGroup: '3 - 10 Tahun',
    points: [
      'Pendampingan 1 Guru untuk 1 Anak di Dalam Ruang Kelas',
      'Membantu Regulasi Emosi, Transisi & Fokus Belajar',
      'Menjembatani Interaksi Sosial dengan Teman Sebaya',
      'Penyusunan Individualized Education Program (IEP)',
      'Laporan Perkembangan Harian & Evaluasi Semesteran Bersama Orang Tua'
    ],
    spesial: 'Pendidik lulusan Pendidikan Luar Biasa (PLB) & Sarjana Psikologi',
    fee: 'Rp 3.500.000 / bulan',
    badgeColor: 'from-indigo-600 to-purple-600',
    iconName: 'UserCheck'
  }
];

export const SCHOOL_PROGRAMS: ProgramInfo[] = [
  {
    id: 'sekolah_pagi',
    name: 'Sekolah Pagi',
    title: 'Sekolah Pagi (Early Childhood Education)',
    shortDesc: 'Kurikulum bermain & belajar holistik untuk mengasah sensorik, kognitif, motorik, dan sosialisasi anak usia dini.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    schedule: 'Senin - Jumat | 08.00 - 11.30 WIB',
    ageGroup: '2 - 6 Tahun',
    iconName: 'Sun'
  },
  {
    id: 'terapi',
    name: 'Terapi',
    title: 'Layanan Terapi Terpadu',
    shortDesc: 'Terapi Wicara (Speech Therapy), Okupasi, Sensori Integrasi, dan Perilaku (ABA) bersama terapis berpengalaman.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    schedule: 'Sesuai Jadwal Sesi (Senin - Sabtu)',
    ageGroup: '1.5 - 12 Tahun',
    iconName: 'HeartHandshake'
  },
  {
    id: 'daycare',
    name: 'DayCare',
    title: 'DayCare & Pengasuhan Edukatif',
    shortDesc: 'Pengasuhan penuh kasih sayang, stimulasi nutrisi, jadwal tidur teratur, toilet training, serta pembiasaan karakter baik.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    schedule: 'Senin - Jumat | 07.30 - 17.30 WIB',
    ageGroup: '1 - 6 Tahun',
    iconName: 'Sparkles'
  },
  {
    id: 'shadow',
    name: 'Shadow Teacher',
    title: 'Pendampingan Khusus (Shadow)',
    shortDesc: 'Pendampingan 1-on-1 di kelas untuk membantu anak dengan kebutuhan khusus beradaptasi, fokus, dan mandiri.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    schedule: 'Menyesuaikan Jam Sekolah Siswa',
    ageGroup: '3 - 10 Tahun',
    iconName: 'UserCheck'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    nis: 'LS-2026-001',
    nisn: '3189024112',
    fullName: 'Arkana Dylan Pratama',
    nickname: 'Dylan',
    gender: 'L',
    birthPlace: 'Jakarta',
    birthDate: '2021-04-12',
    address: 'Jl. Melati Indah No. 14, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    joinDate: '2025-07-15',
    academicYear: '2026/2027',
    status: 'aktif',
    className: 'Bintang Kejora (Kelas A)',
    enrolledPrograms: ['sekolah_pagi', 'terapi'],
    specialNeedsNotes: 'Keterlambatan bicara ringan (Speech Delay), saat ini rutin Terapi Wicara 2x per minggu.',
    accountUsername: 'wali.dylan',
    accountPassword: '12345',
    parent: {
      fatherName: 'Bambang Pratama',
      motherName: 'Ratna Dewi Kusuma',
      relationship: 'Orang Tua Kandung',
      whatsapp: '081288992211',
      email: 'ratna.pratama@gmail.com',
      address: 'Jl. Melati Indah No. 14, Jakarta Selatan',
      emergencyContact: '081288992211 (Ibu Ratna)',
      fatherOccupation: 'Wiraswasta',
      motherOccupation: 'Arsitek'
    }
  },
  {
    id: 'std-002',
    nis: 'LS-2026-002',
    fullName: 'Clara Aurelia Wijaya',
    nickname: 'Clara',
    gender: 'P',
    birthPlace: 'Tangerang',
    birthDate: '2022-02-18',
    address: 'Cluster Anggrek B5/12, Tangerang Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
    joinDate: '2025-08-01',
    academicYear: '2026/2027',
    status: 'aktif',
    className: 'Bintang Timur (Playgroup)',
    enrolledPrograms: ['sekolah_pagi', 'daycare'],
    specialNeedsNotes: 'Tidak ada kebutuhan khusus. Sangat aktif secara motorik kasar.',
    parent: {
      fatherName: 'Hendro Wijaya',
      motherName: 'Siti Mariana',
      relationship: 'Orang Tua Kandung',
      whatsapp: '081399884433',
      email: 'hendro.wijaya@gmail.com',
      address: 'Cluster Anggrek B5/12, Tangerang Selatan',
      emergencyContact: '081399884433 (Bapak Hendro)',
      fatherOccupation: 'Karyawan Swasta',
      motherOccupation: 'Dokter Umum'
    }
  },
  {
    id: 'std-003',
    nis: 'LS-2026-003',
    fullName: 'Keenan Alvaro Syarif',
    nickname: 'Keenan',
    gender: 'L',
    birthPlace: 'Depok',
    birthDate: '2020-09-05',
    address: 'Pesona Depok Estate Blok C2, Depok',
    photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=150&auto=format&fit=crop&q=80',
    joinDate: '2025-06-10',
    academicYear: '2026/2027',
    status: 'aktif',
    className: 'Bintang Kejora (Kelas A)',
    enrolledPrograms: ['sekolah_pagi', 'shadow', 'terapi'],
    specialNeedsNotes: 'Diagnosis ASD (Spektrum Autisme ringan). Didampingi Shadow Teacher selama di kelas Sekolah Pagi.',
    parent: {
      fatherName: 'Ferry Syarif',
      motherName: 'Nadia Putri',
      relationship: 'Orang Tua Kandung',
      whatsapp: '081122334455',
      email: 'nadiaputri@yahoo.com',
      address: 'Pesona Depok Estate Blok C2, Depok',
      emergencyContact: '081122334455 (Ibu Nadia)',
      fatherOccupation: 'Konsultan IT',
      motherOccupation: 'Dosen'
    }
  },
  {
    id: 'std-004',
    nis: 'LS-2026-004',
    fullName: 'Mikaila Zahra Putri',
    nickname: 'Mikha',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2022-07-29',
    address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
    photoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbdd77e58a?w=150&auto=format&fit=crop&q=80',
    joinDate: '2026-01-08',
    academicYear: '2026/2027',
    status: 'aktif',
    className: 'Bintang Kecil (Toddler)',
    enrolledPrograms: ['daycare'],
    specialNeedsNotes: 'Sensitivitas tekstur makanan tertentu.',
    accountUsername: 'wali.mikha',
    accountPassword: '12345',
    parent: {
      fatherName: 'Aditya Kurniawan',
      motherName: 'Larasati',
      relationship: 'Orang Tua Kandung',
      whatsapp: '085712345678',
      email: 'larasati.kurnia@gmail.com',
      address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
      emergencyContact: '085712345678 (Ibu Larasati)',
      fatherOccupation: 'BUMN',
      motherOccupation: 'Karyawan Swasta'
    }
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-001',
    nip: 'ST-01-001',
    name: 'Ibu Hj. Nurul Hidayati, M.Pd.',
    gender: 'P',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '081234567001',
    email: 'nurul.hidayati@littlestar.sch.id',
    role: 'kepala_sekolah',
    jobTitle: 'Kepala Sekolah & Konsultan Pendidikan',
    qualification: 'S2 Magister Pendidikan Anak Usia Dini (UNJ)',
    specialization: 'Kurikulum PAUD Inklusif & Supervisi Pendidikan',
    joinDate: '2020-01-15',
    status: 'tetap',
    assignedPrograms: ['sekolah_pagi', 'terapi', 'daycare', 'shadow'],
    assignedStudentsCount: 42,
    accountUsername: 'kepala.nurul',
    accountPassword: '12345'
  },
  {
    id: 'stf-002',
    nip: 'ST-02-002',
    name: 'Kak Sarah Amanda, S.Psi.',
    gender: 'P',
    photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    phone: '081234567002',
    email: 'sarah.amanda@littlestar.sch.id',
    role: 'guru_sekolah_pagi',
    jobTitle: 'Wali Kelas Bintang Kejora (Kelas A)',
    qualification: 'S1 Psikologi Perkembangan Anak (UI)',
    specialization: 'Stimulasi Kognitif & Literasi Awal',
    joinDate: '2022-07-01',
    status: 'tetap',
    assignedPrograms: ['sekolah_pagi'],
    assignedStudentsCount: 14,
    accountUsername: 'guru.sarah',
    accountPassword: '12345'
  },
  {
    id: 'stf-003',
    nip: 'ST-03-003',
    name: 'Kak Rian Prasetya, S.Tr.Kes.',
    gender: 'L',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    phone: '081234567003',
    email: 'rian.wicara@littlestar.sch.id',
    role: 'terapis',
    jobTitle: 'Terapis Wicara & Sensori Integrasi',
    qualification: 'D4 Terapi Wicara & Bahasa (Poltekkes Surakarta)',
    specialization: 'Oral Motor, Speech Delay, Artikulasi',
    joinDate: '2021-09-10',
    status: 'tetap',
    assignedPrograms: ['terapi'],
    assignedStudentsCount: 11,
    accountUsername: 'terapis.rian',
    accountPassword: '12345'
  },
  {
    id: 'stf-004',
    nip: 'ST-04-004',
    name: 'Kak Dita Anggraini, S.Pd.',
    gender: 'P',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '081234567004',
    email: 'dita.shadow@littlestar.sch.id',
    role: 'shadow_teacher',
    jobTitle: 'Shadow Teacher (Pendamping Khusus)',
    qualification: 'S1 Pendidikan Luar Biasa (PLB UPI Bandung)',
    specialization: 'Pendampingan Autisme & Regulasi Emosi',
    joinDate: '2023-01-10',
    status: 'kontrak',
    assignedPrograms: ['shadow'],
    assignedStudentsCount: 3,
    accountUsername: 'shadow.dita',
    accountPassword: '12345'
  },
  {
    id: 'stf-005',
    nip: 'ST-05-005',
    name: 'Bunda Fitri Melati, A.Md.Keb.',
    gender: 'P',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    phone: '081234567005',
    email: 'fitri.daycare@littlestar.sch.id',
    role: 'daycare_teacher',
    jobTitle: 'Koordinator DayCare & Pengasuhan',
    qualification: 'D3 Kebidanan & Pengasuhan Anak Usia Dini',
    specialization: 'Nutrisi Anak, Higienitas & Toilet Training',
    joinDate: '2021-03-01',
    status: 'tetap',
    assignedPrograms: ['daycare'],
    assignedStudentsCount: 18,
    accountUsername: 'daycare.fitri',
    accountPassword: '12345'
  },
  {
    id: 'stf-006',
    nip: 'ST-06-006',
    name: 'Bapak Ilham Pratama, S.E.',
    gender: 'L',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '081234567006',
    email: 'keuangan@littlestar.sch.id',
    role: 'staff_keuangan',
    jobTitle: 'Staff Administrasi & Keuangan SPP',
    qualification: 'S1 Akuntansi (Universitas Trisakti)',
    specialization: 'Billing, Rekonsiliasi Bank, Laporan Keuangan',
    joinDate: '2022-02-15',
    status: 'tetap',
    assignedPrograms: ['sekolah_pagi', 'terapi', 'daycare', 'shadow'],
    assignedStudentsCount: 42,
    accountUsername: 'keuangan.ilham',
    accountPassword: '12345'
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-001',
    applicationNumber: 'PSB-2026-089',
    childName: 'Muhammad Rayyan Al-Ghifari',
    childNickname: 'Rayyan',
    gender: 'L',
    birthDate: '2022-10-15',
    birthPlace: 'Jakarta',
    parentName: 'Rahmat Hidayat & Shinta Bella',
    parentPhone: '081299887766',
    parentEmail: 'shinta.bella@gmail.com',
    address: 'Komp. Buncit Indah No. 8, Jakarta Selatan',
    selectedPrograms: ['sekolah_pagi', 'terapi'],
    documents: {
      birthCertificate: true,
      familyCard: true,
      medicalReport: true,
      childPhoto: true,
      childVideo: true
    },
    adminFeeAmount: 500000,
    paymentStatus: 'menunggu_verifikasi',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    paymentDate: '2026-10-22',
    observationStatus: 'belum_dijadwalkan',
    admissionDecision: 'menunggu_observasi',
    notes: 'Orang tua menyertakan surat rekomendasi dokter tumbuh kembang anak.',
    createdAt: '2026-10-21'
  },
  {
    id: 'adm-002',
    applicationNumber: 'PSB-2026-090',
    childName: 'Kayla Safira Wardhani',
    childNickname: 'Kayla',
    gender: 'P',
    birthDate: '2023-01-20',
    birthPlace: 'Bekasi',
    parentName: 'Dimas Wardhana',
    parentPhone: '081765432100',
    parentEmail: 'dimas.wardhana@gmail.com',
    address: 'Jl. Boulevard Hijau No. 22, Harapan Indah',
    selectedPrograms: ['daycare'],
    documents: {
      birthCertificate: true,
      familyCard: true,
      childPhoto: true
    },
    adminFeeAmount: 500000,
    paymentStatus: 'terverifikasi',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    paymentDate: '2026-10-20',
    observationSlot: {
      date: '2026-10-25',
      time: '09:00 - 10:00 WIB',
      assessorName: 'Kak Sarah Amanda, S.Psi.',
      room: 'Ruang Observasi Psikologi 1'
    },
    observationStatus: 'terjadwal',
    admissionDecision: 'menunggu_observasi',
    notes: 'Jadwal observasi terkonfirmasi.',
    createdAt: '2026-10-19'
  },
  {
    id: 'adm-003',
    applicationNumber: 'PSB-2026-091',
    childName: 'Zidane Arkananta',
    childNickname: 'Zidane',
    gender: 'L',
    birthDate: '2021-11-03',
    birthPlace: 'Tangerang',
    parentName: 'Bagus Wicaksono',
    parentPhone: '081900112233',
    parentEmail: 'bagus.wicak@gmail.com',
    address: 'Bintaro Jaya Sektor 9, Tangerang Selatan',
    selectedPrograms: ['sekolah_pagi', 'shadow'],
    documents: {
      birthCertificate: true,
      familyCard: true,
      medicalReport: true
    },
    adminFeeAmount: 500000,
    paymentStatus: 'belum_bayar',
    observationStatus: 'belum_dijadwalkan',
    admissionDecision: 'menunggu_observasi',
    notes: 'Menunggu orang tua transfer biaya administrasi pendaftaran.',
    createdAt: '2026-10-22'
  }
];

export const INITIAL_OBSERVATION_SLOTS: ObservationSlot[] = [
  {
    id: 'obs-01',
    date: '2026-10-25',
    timeSlot: '09:00 - 10:00 WIB',
    assessorName: 'Kak Sarah Amanda, S.Psi.',
    room: 'Ruang Observasi Psikologi 1',
    capacity: 2,
    bookedCount: 1
  },
  {
    id: 'obs-02',
    date: '2026-10-25',
    timeSlot: '10:30 - 11:30 WIB',
    assessorName: 'Kak Rian Prasetya, S.Tr.Kes.',
    room: 'Ruang Sensori Terapi 2',
    capacity: 2,
    bookedCount: 0
  },
  {
    id: 'obs-03',
    date: '2026-10-27',
    timeSlot: '09:00 - 10:00 WIB',
    assessorName: 'Ibu Hj. Nurul Hidayati, M.Pd.',
    room: 'Ruang Observasi Utama',
    capacity: 2,
    bookedCount: 1
  },
  {
    id: 'obs-04',
    date: '2026-10-27',
    timeSlot: '13:00 - 14:00 WIB',
    assessorName: 'Kak Dita Anggraini, S.Pd.',
    room: 'Ruang Observasi Psikologi 1',
    capacity: 2,
    bookedCount: 0
  }
];

export const INITIAL_TASKS: TeacherTask[] = [
  {
    id: 'tsk-001',
    title: 'Penilaian Harian Kegiatan Motorik Halus (Sensori Clay)',
    teacherId: 'stf-002',
    teacherName: 'Kak Sarah Amanda, S.Psi.',
    program: 'sekolah_pagi',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    period: 'harian',
    deadline: '2026-10-23',
    status: 'dikirim',
    submissionDate: '2026-10-23',
    notes: 'Dylan mampu meremas playdough dan menancapkan stik es krim dengan fokus selama 15 menit.',
    mediaCount: 3
  },
  {
    id: 'tsk-002',
    title: 'Lesson Plan Mingguan Tema: Alam Semesta & Bintang',
    teacherId: 'stf-002',
    teacherName: 'Kak Sarah Amanda, S.Psi.',
    program: 'sekolah_pagi',
    period: 'mingguan',
    deadline: '2026-10-24',
    status: 'sedang_direview',
    submissionDate: '2026-10-22',
    notes: 'Rencana aktivitas sensori luar ruangan, lagu bintang kecil, dan pengenalan warna primer.',
    reviewerNotes: 'Bagus sekali kak Sarah. Harap ditambahkan adaptasi stimulasi untuk anak yang sensori sensitif.'
  },
  {
    id: 'tsk-003',
    title: 'Rapor Bulanan Perkembangan Terapi Wicara Bulan Oktober',
    teacherId: 'stf-003',
    teacherName: 'Kak Rian Prasetya, S.Tr.Kes.',
    program: 'terapi',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    period: 'bulanan',
    deadline: '2026-10-28',
    status: 'draft',
    submissionDate: '2026-10-24',
    notes: 'Kosa kata baru bertambah 12 kata konsonan b, m, p.'
  },
  {
    id: 'tsk-004',
    title: 'Laporan 3 Bulanan Perkembangan Shadow Accompaniment',
    teacherId: 'stf-004',
    teacherName: 'Kak Dita Anggraini, S.Pd.',
    program: 'shadow',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    period: 'tiga_bulanan',
    deadline: '2026-10-20',
    status: 'disetujui',
    submissionDate: '2026-10-18',
    notes: 'Keenan sudah bisa duduk mandiri di meja kelas selama 20 menit tanpa tantrum.',
    reviewerNotes: 'Disetujui oleh Kepala Sekolah. Hasil sangat positif, pertahankan strategi reward token.'
  },
  {
    id: 'tsk-005',
    title: 'Planning Matrix & New Program Semester Ganjil',
    teacherId: 'stf-004',
    teacherName: 'Kak Dita Anggraini, S.Pd.',
    program: 'shadow',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    period: 'enam_bulanan',
    deadline: '2026-11-15',
    status: 'sedang_direview',
    submissionDate: '2026-10-21',
    notes: 'Penyusunan target 6 bulanan untuk komunikasi fungsional dan regulasi diri.'
  },
  {
    id: 'tsk-006',
    title: 'Daily Log DayCare: Catatan Asupan Gizi & Pola Tidur Siang',
    teacherId: 'stf-005',
    teacherName: 'Bunda Fitri Melati, A.Md.Keb.',
    program: 'daycare',
    studentId: 'std-002',
    studentName: 'Clara Aurelia Wijaya',
    period: 'harian',
    deadline: '2026-10-24',
    status: 'dikirim',
    submissionDate: '2026-10-24',
    notes: 'Clara makan siang habis 1 porsi (nasi tim sup sayur + ayam), tidur siang 1.5 jam pukul 12.30-14.00 WIB. Toilet training lancar 2x BAK mandiri.',
    mediaCount: 2
  },
  {
    id: 'tsk-007',
    title: 'Laporan Mingguan Menu Nutrisi & Stimulasi Motorik Toddler Daycare',
    teacherId: 'stf-005',
    teacherName: 'Bunda Fitri Melati, A.Md.Keb.',
    program: 'daycare',
    studentId: 'std-004',
    studentName: 'Mikaila Zahra Putri',
    period: 'mingguan',
    deadline: '2026-10-25',
    status: 'disetujui',
    submissionDate: '2026-10-23',
    notes: 'Evaluasi mingguan pola tidur dan pengenalan buah potong (pepaya & pisang). Ananda antusias berjemur pagi dan bermain bola warna.',
    reviewerNotes: 'Menu nutrisi sangat baik dan seimbang. Teruskan pemantauan grafik berat dan tinggi badan.'
  },
  {
    id: 'tsk-008',
    title: 'Penilaian Harian Sesi Terapi Sensori Integrasi & Ayunan Vestibular',
    teacherId: 'stf-003',
    teacherName: 'Kak Rian Prasetya, S.Tr.Kes.',
    program: 'terapi',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    period: 'harian',
    deadline: '2026-10-24',
    status: 'dikirim',
    submissionDate: '2026-10-24',
    notes: 'Sesi sensori gym 45 menit: toleransi ayunan gantung meningkat hingga 10 putaran ritmis tanpa kecemasan. Kontak mata membaik saat diminta instruksi verbal.',
    mediaCount: 2
  },
  {
    id: 'tsk-009',
    title: 'Catatan Observasi Harian Pendampingan Kelas Shadow: Interaksi Sosial',
    teacherId: 'stf-004',
    teacherName: 'Kak Dita Anggraini, S.Pd.',
    program: 'shadow',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    period: 'harian',
    deadline: '2026-10-24',
    status: 'dikirim',
    submissionDate: '2026-10-24',
    notes: 'Keenan berhasil berbagi mainan balok susun dengan temannya di sentra balok selama 10 menit dengan prompting minimal.'
  },
  {
    id: 'tsk-010',
    title: 'Laporan Bulanan Stimulasi Tumbuh Kembang Balita Daycare Oktober',
    teacherId: 'stf-005',
    teacherName: 'Bunda Fitri Melati, A.Md.Keb.',
    program: 'daycare',
    studentId: 'std-004',
    studentName: 'Mikaila Zahra Putri',
    period: 'bulanan',
    deadline: '2026-10-30',
    status: 'draft',
    notes: 'Pencapaian motorik kasar Mikha: mampu melompat dua kaki di matras busa dan memakai sandal sendiri.'
  }
];

export const INITIAL_CASES: StudentCase[] = [
  {
    id: 'cas-001',
    caseNumber: 'CS-2026-012',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    program: 'sekolah_pagi',
    reportedBy: 'Kak Sarah Amanda, S.Psi.',
    reporterRole: 'Guru Kelas A',
    dateTime: '2026-10-22 10:15 WIB',
    caseType: 'sensori',
    priority: 'sedang',
    description: 'Keenan mengalami sensory overload ketika terdengar suara sirine ambulans dari luar gerbang, menutup telinga dan menjatuhkan balok mainan.',
    initialActionTaken: 'Kak Dita (Shadow Teacher) segera mendampingi Keenan ke Quiet Corner, memakaikan earmuff peredam bising dan memberikan deep pressure blanket.',
    status: 'dalam_tindak_lanjut',
    followUpPlan: 'Siapkan noise-cancelling headphone di dekat meja Keenan dan latih teknik pernapasan dengan visual card.',
    assignedStaff: 'Kak Dita Anggraini, S.Pd.'
  },
  {
    id: 'cas-002',
    caseNumber: 'CS-2026-011',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    program: 'terapi',
    reportedBy: 'Kak Rian Prasetya, S.Tr.Kes.',
    reporterRole: 'Terapis Wicara',
    dateTime: '2026-10-18 14:00 WIB',
    caseType: 'perilaku',
    priority: 'rendah',
    description: 'Dylan menolak mengikuti instruksi peniupan peluit terapi pada 10 menit pertama sesi.',
    initialActionTaken: 'Mengubah media peniupan menjadi gelembung sabun (bubble blower) yang lebih menarik minatnya.',
    status: 'selesai',
    followUpPlan: 'Gunakan pendekatan play-based therapy dengan gelembung sebelum masuk ke instrumen tiup standar.',
    assignedStaff: 'Kak Rian Prasetya, S.Tr.Kes.',
    resolutionNotes: 'Sesi berikutnya Dylan sangat antusias dan kooperatif.',
    resolvedAt: '2026-10-21'
  }
];

export const INITIAL_SDR: Record<string, StudentDevelopmentRecord> = {
  'std-001': {
    studentId: 'std-001',
    academicYear: '2026/2027',
    lastUpdated: '2026-10-22',
    summaryNotes: 'Dylan menunjukkan progres yang menggembirakan pada kemampuan interaksi sosial dan pengucapan 2 kata berantai. Koordinasi motorik halus semakin presisi.',
    programDecision: 'CONTINUE',
    decisionRationale: 'Program Sekolah Pagi + Terapi Wicara memberikan sinergi yang sangat optimal bagi Dylan. Disarankan melanjutkan paket program yang sama untuk semester depan.',
    principalApprovalDate: '2026-10-20',
    scores: [
      {
        indicatorId: 'IND-MH-01',
        indicatorName: 'Koordinasi bilateral & memegang alat tulis',
        domain: 'motorik_halus',
        baselineScore: 2,
        previousScore: 3,
        currentScore: 4,
        targetScore: 5,
        rubricNotes: 'Dapat memegang krayon dengan tripod grip fungsional.'
      },
      {
        indicatorId: 'IND-MK-01',
        indicatorName: 'Keseimbangan & melompat 2 kaki',
        domain: 'motorik_kasar',
        baselineScore: 3,
        previousScore: 4,
        currentScore: 4,
        targetScore: 5,
        rubricNotes: 'Mampu melompat dari bangku rendah dengan pendaratan stabil.'
      },
      {
        indicatorId: 'IND-KM-01',
        indicatorName: 'Menyusun kalimat 2-3 kata fungsional',
        domain: 'komunikasi',
        baselineScore: 1,
        previousScore: 2,
        currentScore: 3,
        targetScore: 4,
        rubricNotes: 'Kerap mengungkapkan "mau minum", "buka pintu", "kakak lihat".'
      },
      {
        indicatorId: 'IND-SO-01',
        indicatorName: 'Berbagi mainan & bergantian (turn-taking)',
        domain: 'sosial',
        baselineScore: 2,
        previousScore: 3,
        currentScore: 4,
        targetScore: 4,
        rubricNotes: 'Bisa menunggu giliran main perosotan tanpa mendorong teman.'
      },
      {
        indicatorId: 'IND-KD-01',
        indicatorName: 'Kemandirian makan & minum sendiri',
        domain: 'kemandirian',
        baselineScore: 3,
        previousScore: 4,
        currentScore: 5,
        targetScore: 5,
        rubricNotes: 'Makan bekal snack mandiri dan merapikan kotak makannya.'
      },
      {
        indicatorId: 'IND-KG-01',
        indicatorName: 'Klasifikasi warna primer & bentuk dasar',
        domain: 'kognitif',
        baselineScore: 2,
        previousScore: 3,
        currentScore: 4,
        targetScore: 5,
        rubricNotes: 'Mengenal warna merah, biru, kuning, hijau dengan cepat.'
      }
    ],
    planningMatrix: [
      {
        developmentArea: 'Komunikasi Verbal',
        indicator: 'Ekspresi kalimat lengkap 3-4 kata',
        previousTarget: 'Meniru kata benda',
        actualAchievement: 'Sudah mengucapkan 2 kata fungsional',
        evaluationNotes: 'Kosa kata bertambah signifikan',
        nextTarget: 'Mengajukan pertanyaan "apa ini?" & "siapa itu?"',
        responsibleTeacher: 'Kak Rian Prasetya, S.Tr.Kes.'
      },
      {
        developmentArea: 'Motorik Halus',
        indicator: 'Menggunting pola garis lurus',
        previousTarget: 'Merobek kertas kertas warna',
        actualAchievement: 'Mampu memotong kertas 1 guntingan',
        evaluationNotes: 'Kekuatan jari jemari sudah membaik',
        nextTarget: 'Menggunting mengikuti garis lurus 10 cm',
        responsibleTeacher: 'Kak Sarah Amanda, S.Psi.'
      }
    ]
  }
};

export const INITIAL_INVOICES: SPPInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV/2026/10/001',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    program: 'sekolah_pagi',
    month: 'Oktober',
    year: 2026,
    amount: 1250000,
    dueDate: '2026-10-10',
    status: 'lunas',
    paidAmount: 1250000,
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    paymentDate: '2026-10-05',
    verifiedBy: 'Ilham Pratama, S.E.'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV/2026/10/002',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    program: 'terapi',
    month: 'Oktober',
    year: 2026,
    amount: 1600000, // 8 sessions @ 200.000
    sessionCount: 8,
    dueDate: '2026-10-10',
    status: 'lunas',
    paidAmount: 1600000,
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    paymentDate: '2026-10-05',
    verifiedBy: 'Ilham Pratama, S.E.'
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV/2026/10/003',
    studentId: 'std-002',
    studentName: 'Clara Aurelia Wijaya',
    program: 'sekolah_pagi',
    month: 'Oktober',
    year: 2026,
    amount: 1250000,
    dueDate: '2026-10-10',
    status: 'lunas',
    paidAmount: 1250000,
    paymentDate: '2026-10-08',
    verifiedBy: 'Ilham Pratama, S.E.'
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV/2026/10/004',
    studentId: 'std-002',
    studentName: 'Clara Aurelia Wijaya',
    program: 'daycare',
    month: 'Oktober',
    year: 2026,
    amount: 2200000,
    dueDate: '2026-10-10',
    status: 'lunas',
    paidAmount: 2200000,
    paymentDate: '2026-10-08',
    verifiedBy: 'Ilham Pratama, S.E.'
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV/2026/10/005',
    studentId: 'std-003',
    studentName: 'Keenan Alvaro Syarif',
    program: 'shadow',
    month: 'Oktober',
    year: 2026,
    amount: 2500000,
    dueDate: '2026-10-10',
    status: 'menunggu_verifikasi',
    paidAmount: 2500000,
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    paymentDate: '2026-10-21'
  },
  {
    id: 'inv-006',
    invoiceNumber: 'INV/2026/10/006',
    studentId: 'std-004',
    studentName: 'Mikaila Zahra Putri',
    program: 'daycare',
    month: 'Oktober',
    year: 2026,
    amount: 2200000,
    dueDate: '2026-10-10',
    status: 'belum_bayar',
    paidAmount: 0
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-001',
    title: 'Aktivitas Sensori Clay & Warna Alami di Kelas Bintang',
    program: 'sekolah_pagi',
    category: 'kegiatan',
    mediaUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: '2026-10-21',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-001', 'std-002'],
    description: 'Anak-anak bereksplorasi dengan tepung warna organik untuk menstimulasi taktil dan kekuatan jemari tangan.'
  },
  {
    id: 'gal-002',
    title: 'Video Pembelajaran: Terapi Sensori Integrasi & Ayunan Vestibular',
    program: 'terapi',
    category: 'terapi',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-little-girl-playing-with-colorful-building-blocks-42691-large.mp4',
    mediaType: 'video',
    date: '2026-10-20',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-001'],
    description: 'Latihan proprioseptif dan vestibular untuk melatih regulasi diri, fokus konsentrasi, dan kesiapan belajar.'
  },
  {
    id: 'gal-003',
    title: 'Sesi Latihan Artikulasi & Wicara Bersama Terapis Rian',
    program: 'terapi',
    category: 'terapi',
    mediaUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: '2026-10-19',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-001', 'std-003'],
    description: 'Stimulasi oral motor dan peniruan suara fonem vokal dengan media cermin dan kartu bergambar interaktif.'
  },
  {
    id: 'gal-004',
    title: 'Video Dokumentasi: Gerak & Lagu Anak Inklusif Sekolah Pagi',
    program: 'sekolah_pagi',
    category: 'kegiatan',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-children-playing-together-in-kindergarten-42692-large.mp4',
    mediaType: 'video',
    date: '2026-10-18',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-001', 'std-002', 'std-003'],
    description: 'Senam pagi ceria dan koordinasi motorik kasar seluruh ananda diiringi musik edukatif gembira.'
  },
  {
    id: 'gal-005',
    title: 'Makan Bersama & Pembiasaan Cuci Tangan Mandiri di DayCare',
    program: 'daycare',
    category: 'kegiatan',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: '2026-10-17',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-002', 'std-004'],
    description: 'Menanamkan kemandirian, adab makan, dan higienitas sanitasi dengan penuh kasih sayang.'
  },
  {
    id: 'gal-006',
    title: 'Pendampingan 1-on-1 Shadow Teacher: Fokus Transisi Kegiatan',
    program: 'shadow',
    category: 'kegiatan',
    mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    date: '2026-10-15',
    isPublic: true,
    hasParentConsent: true,
    studentIds: ['std-003'],
    description: 'Shadow teacher memfasilitasi komunikasi augmentatif dan visual schedule saat pergantian aktivitas kelas.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Pendaftaran Baru Menunggu Verifikasi',
    message: 'Orang tua Rayyan Al-Ghifari mengunggah bukti bayar pendaftaran Rp 500.000.',
    type: 'admission',
    priority: 'high',
    createdAt: '10 menit lalu',
    isRead: false
  },
  {
    id: 'notif-002',
    title: 'Laporan Kasus Siswa Ditambahkan',
    message: 'Kak Sarah Amanda melaporkan respon sensori suara bising Keenan di Kelas A.',
    type: 'case',
    priority: 'high',
    createdAt: '1 jam lalu',
    isRead: false
  },
  {
    id: 'notif-003',
    title: 'Tagihan SPP Shadow Terbayar',
    message: 'Bukti pembayaran SPP Shadow Ananda Keenan telah diunggah orang tua.',
    type: 'payment',
    priority: 'normal',
    createdAt: '3 jam lalu',
    isRead: false
  },
  {
    id: 'notif-004',
    title: 'Observasi Terjadwal Besok Lusa',
    message: 'Observasi calon siswa Kayla Safira dijadwalkan pada 25 Oktober 2026 pk 09:00 WIB.',
    type: 'supervision',
    priority: 'normal',
    createdAt: 'Kemarin',
    isRead: true
  }
];

export const INITIAL_SCHEDULES: StudentScheduleItem[] = [
  {
    id: 'sch-001',
    studentId: 'std-001',
    program: 'sekolah_pagi',
    day: 'Senin - Jumat',
    time: '08:00 - 11:30 WIB',
    activity: 'Kegiatan Belajar Tematik, Circle Time, Pra-Literasi & Bermain Sensori',
    teacherName: 'Kak Sarah Amanda, S.Psi.',
    room: 'Ruang Kelas A (Bintang Kejora)'
  },
  {
    id: 'sch-002',
    studentId: 'std-001',
    program: 'terapi',
    day: 'Selasa & Kamis',
    time: '13:00 - 14:00 WIB',
    activity: 'Terapi Wicara & Sensori Oral Motor',
    teacherName: 'Kak Rian Prasetya, S.Tr.Kes.',
    room: 'Klinik Terapi Wicara 1'
  },
  {
    id: 'sch-003',
    studentId: 'std-002',
    program: 'sekolah_pagi',
    day: 'Senin - Jumat',
    time: '08:00 - 11:30 WIB',
    activity: 'Belajar Kelompok Playgroup, Motorik Kasar & Lagu Anak',
    teacherName: 'Kak Sarah Amanda, S.Psi.',
    room: 'Ruang Playgroup'
  },
  {
    id: 'sch-004',
    studentId: 'std-002',
    program: 'daycare',
    day: 'Senin - Jumat',
    time: '11:30 - 17:30 WIB',
    activity: 'Makan Siang Bergizi, Tidur Siang, Mandi & Stimulasi Sore',
    teacherName: 'Bunda Fitri Melati, A.Md.Keb.',
    room: 'Area DayCare Edukatif'
  },
  {
    id: 'sch-005',
    studentId: 'std-003',
    program: 'shadow',
    day: 'Senin - Jumat',
    time: '08:00 - 11:30 WIB',
    activity: 'Pendampingan 1-on-1 Kelas Reguler, Regulasi Sensori & Adaptasi Sosial',
    teacherName: 'Kak Dita Anggraini, S.Pd.',
    room: 'Ruang Kelas A'
  }
];

export const INITIAL_ATTENDANCE: StudentAttendanceItem[] = [
  {
    id: 'att-001',
    studentId: 'std-001',
    date: '2026-10-23',
    status: 'Hadir',
    program: 'sekolah_pagi',
    notes: 'Ananda sangat ceria saat circle time dan menyanyikan lagu Bintang Kecil.'
  },
  {
    id: 'att-002',
    studentId: 'std-001',
    date: '2026-10-22',
    status: 'Hadir',
    program: 'terapi',
    notes: 'Sesi terapi wicara berjalan lancar, pengucapan konsonan b dan m semakin jelas.'
  },
  {
    id: 'att-003',
    studentId: 'std-001',
    date: '2026-10-21',
    status: 'Hadir',
    program: 'sekolah_pagi',
    notes: 'Mengikuti stimulasi motorik halus meremas clay dengan baik.'
  },
  {
    id: 'att-004',
    studentId: 'std-001',
    date: '2026-10-20',
    status: 'Hadir',
    program: 'terapi',
    notes: 'Latihan peniupan gelembung sabun dan respon instruksi 2 kata.'
  },
  {
    id: 'att-005',
    studentId: 'std-001',
    date: '2026-10-17',
    status: 'Izin',
    program: 'sekolah_pagi',
    notes: 'Izin kontrol dokter spesialis tumbuh kembang anak.'
  }
];

export const INITIAL_CONSULTATIONS: ConsultationRequest[] = [
  {
    id: 'cst-001',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    parentName: 'Ibu Ratna Dewi Kusuma',
    parentPhone: '081288992211',
    targetRole: 'terapis',
    targetStaffName: 'Kak Rian Prasetya, S.Tr.Kes.',
    requestedDate: '2026-10-28',
    preferredTime: '14:30 - 15:15 WIB',
    consultationType: 'tatap_muka',
    topic: 'Konsultasi Evaluasi Perkembangan Wicara di Rumah',
    notes: 'Ingin mendiskusikan metode stimulasi kosa kata baru yang tepat saat bersama keluarga di rumah.',
    status: 'disetujui',
    feedbackNotes: 'Disetujui. Pertemuan tatap muka dijadwalkan di Ruang Konseling Klinik Terapi.',
    confirmedDate: '2026-10-28',
    confirmedTime: '14:30 WIB',
    createdAt: '2026-10-21'
  },
  {
    id: 'cst-002',
    studentId: 'std-001',
    studentName: 'Arkana Dylan Pratama',
    parentName: 'Ibu Ratna Dewi Kusuma',
    parentPhone: '081288992211',
    targetRole: 'kepala_sekolah',
    targetStaffName: 'Ibu Hj. Nurul Hidayati, M.Pd.',
    requestedDate: '2026-11-05',
    preferredTime: '10:00 - 10:45 WIB',
    consultationType: 'tatap_muka',
    topic: 'Supervisi & Rencana Program Semester Genap',
    notes: 'Konsultasi lanjutan mengenai rekomendasi kelanjutan program Sekolah Pagi + Terapi semester depan.',
    status: 'menunggu_konfirmasi',
    createdAt: '2026-10-22'
  }
];
