import { getSupabaseClient, getSupabaseConfig } from './supabase';
import { 
  Student, 
  StaffMember, 
  SchoolClass, 
  AdmissionApplication, 
  GalleryItem, 
  SPPInvoice, 
  StudentCase, 
  StudentAttendanceItem,
  TeacherTask,
  JobPosition,
  SchoolProgramDetail,
  ObservationSlot,
  ConsultationRequest,
  StudentDevelopmentRecord
} from '../types';

export function isUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mengonversi string ID apa pun (misal: 'std-001', 'pos-01', 'tsk-1234')
 * secara deterministik menjadi format UUID v4 valid sehingga upsert dan delete
 * di PostgreSQL/Supabase selalu konsisten dan tidak duplikat.
 */
export function toDeterministicUUID(str?: string): string {
  if (!str) return generateUUID();
  if (isUUID(str)) return str;
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const h1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const h3 = Math.abs(hash1 ^ hash2).toString(16).padStart(8, '0');
  const h4 = Math.abs(hash1 + hash2).toString(16).padStart(8, '0');
  const raw = (h1 + h2 + h3 + h4).slice(0, 32);
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-4${raw.slice(13, 16)}-a${raw.slice(17, 20)}-${raw.slice(20, 32)}`;
}

// ============================================================================
// 1. STUDENTS (SISWA)
// ============================================================================
export async function fetchStudentsFromSupabase(): Promise<Student[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      nis: row.nis || '',
      nisn: row.nisn || undefined,
      fullName: row.full_name || '',
      nickname: row.nickname || row.full_name?.split(' ')[0] || '',
      gender: (row.gender as 'L' | 'P') || 'L',
      birthPlace: row.birth_place || '',
      birthDate: row.birth_date || '2020-01-01',
      address: row.address || '',
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
      joinDate: row.join_date || (row.created_at ? row.created_at.split('T')[0] : '2026-01-01'),
      academicYear: row.academic_year || '2026/2027',
      status: row.status || 'aktif',
      className: row.class_name || 'Bintang Kejora (Kelas A)',
      enrolledPrograms: Array.isArray(row.enrolled_programs) ? row.enrolled_programs : ['sekolah_pagi'],
      specialNeedsNotes: row.special_needs_notes || undefined,
      parent: row.parent_info || {
        fatherName: 'Ayah',
        motherName: 'Ibu',
        relationship: 'Orang Tua',
        whatsapp: '+6281234567890',
        email: 'wali@littlestar.sch.id',
        address: row.address || '',
        emergencyContact: '+6281234567890'
      }
    }));
  } catch (err) {
    console.warn('fetchStudentsFromSupabase failed:', err);
    return null;
  }
}

export async function saveStudentToSupabase(student: Student): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(student.id);
    const payload = {
      id: dbId,
      nis: student.nis,
      nisn: student.nisn || null,
      full_name: student.fullName,
      nickname: student.nickname,
      gender: student.gender,
      birth_place: student.birthPlace,
      birth_date: student.birthDate,
      address: student.address,
      photo_url: student.photoUrl,
      status: student.status,
      class_name: student.className,
      enrolled_programs: student.enrolledPrograms,
      special_needs_notes: student.specialNeedsNotes || null,
      parent_info: student.parent,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('students').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveStudentToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveStudentToSupabase exception:', err);
    return null;
  }
}

export async function deleteStudentFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('students').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch (err) {
    console.warn('deleteStudentFromSupabase error:', err);
    return false;
  }
}

// ============================================================================
// 2. STAFF (GURU & PEGAWAI)
// ============================================================================
export async function fetchStaffFromSupabase(): Promise<StaffMember[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('staff').select('*').order('join_date', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      nip: row.nip || '',
      name: row.full_name || '',
      gender: (row.gender as 'L' | 'P') || 'P',
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: row.phone || '',
      email: row.email || '',
      role: row.role_id || 'guru_sekolah_pagi',
      jobTitle: row.job_title || 'Guru',
      qualification: row.qualification || 'S.Pd.',
      specialization: row.specialization || 'Pendidikan Khusus',
      joinDate: row.join_date || '2026-01-01',
      status: row.status || 'tetap',
      assignedPrograms: Array.isArray(row.assigned_programs) ? row.assigned_programs : ['sekolah_pagi'],
      assignedStudentsCount: row.assigned_students_count || 0
    }));
  } catch (err) {
    console.warn('fetchStaffFromSupabase failed:', err);
    return null;
  }
}

export async function saveStaffToSupabase(member: StaffMember): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(member.id);
    const payload = {
      id: dbId,
      nip: member.nip,
      full_name: member.name,
      gender: member.gender,
      role_id: member.role,
      phone: member.phone,
      email: member.email,
      job_title: member.jobTitle,
      status: member.status,
      photo_url: member.photoUrl,
      qualification: member.qualification,
      specialization: member.specialization,
      assigned_programs: member.assignedPrograms,
      join_date: member.joinDate || new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('staff').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveStaffToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveStaffToSupabase exception:', err);
    return null;
  }
}

export async function deleteStaffFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('staff').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch (err) {
    console.warn('deleteStaffFromSupabase error:', err);
    return false;
  }
}

// ============================================================================
// 3. CLASSES (KELAS)
// ============================================================================
export async function fetchClassesFromSupabase(): Promise<SchoolClass[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('classes').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name || '',
      type: row.type || 'Reguler',
      program: row.program || 'sekolah_pagi',
      capacity: row.capacity || 10,
      room: row.room_number || row.room || 'Ruang 1',
      description: row.description || ''
    }));
  } catch (err) {
    console.warn('fetchClassesFromSupabase failed:', err);
    return null;
  }
}

export async function saveClassToSupabase(cls: SchoolClass): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(cls.id);
    const payload = {
      id: dbId,
      name: cls.name,
      room_number: cls.room,
      capacity: cls.capacity,
      type: cls.type,
      program: cls.program,
      description: cls.description || ''
    };

    const { error } = await supabase.from('classes').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveClassToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveClassToSupabase exception:', err);
    return null;
  }
}

export async function deleteClassFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('classes').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch (err) {
    console.warn('deleteClassFromSupabase error:', err);
    return false;
  }
}

// ============================================================================
// 4. ADMISSIONS (PSB - PENDAFTARAN SISWA BARU)
// ============================================================================
export async function fetchAdmissionsFromSupabase(): Promise<AdmissionApplication[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      applicationNumber: row.application_number || `PSB-${Date.now()}`,
      childName: row.child_name || '',
      childNickname: row.child_nickname || row.child_name?.split(' ')[0] || '',
      gender: (row.gender as 'L' | 'P') || 'L',
      birthDate: row.birth_date || '2020-01-01',
      birthPlace: row.birth_place || '',
      parentName: row.parent_name || '',
      parentPhone: row.parent_phone || '',
      parentEmail: row.parent_email || '',
      address: row.address || '',
      selectedPrograms: Array.isArray(row.selected_programs) ? row.selected_programs : ['sekolah_pagi'],
      documents: row.documents || { birthCertificate: true, familyCard: true },
      adminFeeAmount: row.admin_fee_amount || 500000,
      paymentStatus: row.payment_status || 'belum_bayar',
      paymentProofUrl: row.payment_proof_url || undefined,
      paymentDate: row.payment_date || undefined,
      observationSlot: row.observation_slot || undefined,
      observationStatus: row.observation_status || 'belum_dijadwalkan',
      admissionDecision: row.admission_decision || 'menunggu_observasi',
      notes: row.notes || '',
      createdAt: row.created_at ? row.created_at.split('T')[0] : '2026-01-01'
    }));
  } catch (err) {
    console.warn('fetchAdmissionsFromSupabase failed:', err);
    return null;
  }
}

export async function saveAdmissionToSupabase(adm: AdmissionApplication): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(adm.id);
    const payload = {
      id: dbId,
      application_number: adm.applicationNumber,
      child_name: adm.childName,
      child_nickname: adm.childNickname,
      gender: adm.gender,
      birth_date: adm.birthDate,
      birth_place: adm.birthPlace,
      parent_name: adm.parentName,
      parent_phone: adm.parentPhone,
      parent_email: adm.parentEmail,
      address: adm.address,
      selected_programs: adm.selectedPrograms,
      documents: adm.documents,
      admin_fee_amount: adm.adminFeeAmount,
      payment_status: adm.paymentStatus,
      payment_proof_url: adm.paymentProofUrl || null,
      payment_date: adm.paymentDate || null,
      observation_slot: adm.observationSlot || null,
      observation_status: adm.observationStatus,
      admission_decision: adm.admissionDecision,
      notes: adm.notes || null,
      created_at: adm.createdAt ? new Date(adm.createdAt).toISOString() : new Date().toISOString()
    };

    const { error } = await supabase.from('admissions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveAdmissionToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveAdmissionToSupabase exception:', err);
    return null;
  }
}

export async function deleteAdmissionFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('admissions').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch (err) {
    return false;
  }
}

// ============================================================================
// 5. GALLERY (GALERI KEGIATAN)
// ============================================================================
export async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('gallery').select('*').order('uploaded_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || 'Foto Kegiatan',
      mediaType: row.media_type || (row.media_url?.includes('.mp4') ? 'video' : 'image'),
      mediaUrl: row.media_url,
      program: row.program_id || 'sekolah_pagi',
      category: row.category || 'kegiatan',
      date: row.uploaded_at ? row.uploaded_at.split('T')[0] : '2026-01-01',
      description: row.description || '',
      isPublic: row.is_public !== false,
      hasParentConsent: row.has_parent_consent !== false,
      studentIds: Array.isArray(row.student_ids) ? row.student_ids : []
    }));
  } catch (err) {
    console.warn('fetchGalleryFromSupabase failed:', err);
    return null;
  }
}

export async function saveGalleryItemToSupabase(item: GalleryItem): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(item.id);
    const payload = {
      id: dbId,
      title: item.title,
      program_id: item.program,
      category: item.category,
      media_url: item.mediaUrl,
      media_type: item.mediaType,
      description: item.description || '',
      is_public: item.isPublic !== false,
      has_parent_consent: item.hasParentConsent !== false,
      student_ids: item.studentIds || [],
      uploaded_at: item.date ? new Date(item.date).toISOString() : new Date().toISOString()
    };

    const { error } = await supabase.from('gallery').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveGalleryItemToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveGalleryItemToSupabase exception:', err);
    return null;
  }
}

export async function deleteGalleryItemFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('gallery').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch (err) {
    console.warn('deleteGalleryItemFromSupabase error:', err);
    return false;
  }
}

// ============================================================================
// 6. INVOICES (KEUANGAN / SPP)
// ============================================================================
export async function fetchInvoicesFromSupabase(): Promise<SPPInvoice[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      invoiceNumber: row.invoice_number || `INV-${Date.now()}`,
      studentId: row.student_id || '',
      studentName: row.student_name || 'Siswa',
      program: row.program_id || 'sekolah_pagi',
      month: row.month || 'Oktober',
      year: row.year || 2026,
      amount: Number(row.amount) || 0,
      dueDate: row.due_date || '2026-10-10',
      status: row.status || 'belum_bayar',
      paidAmount: Number(row.paid_amount) || 0,
      paymentProofUrl: row.payment_proof_url || undefined,
      paymentDate: row.payment_date || undefined,
      verifiedBy: row.verified_by || undefined
    }));
  } catch (err) {
    console.warn('fetchInvoicesFromSupabase failed:', err);
    return null;
  }
}

export async function saveInvoiceToSupabase(inv: SPPInvoice): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(inv.id);
    const payload = {
      id: dbId,
      invoice_number: inv.invoiceNumber,
      student_id: isUUID(inv.studentId) ? inv.studentId : null,
      student_name: inv.studentName,
      program_id: inv.program,
      month: inv.month,
      year: inv.year,
      amount: inv.amount,
      due_date: inv.dueDate,
      status: inv.status,
      paid_amount: inv.paidAmount || 0,
      payment_proof_url: inv.paymentProofUrl || null,
      payment_date: inv.paymentDate || null,
      verified_by: inv.verifiedBy || null,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('invoices').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveInvoiceToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveInvoiceToSupabase exception:', err);
    return null;
  }
}

export async function deleteInvoiceFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('invoices').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 7. STUDENT CASES (CATATAN KASUS)
// ============================================================================
export async function fetchCasesFromSupabase(): Promise<StudentCase[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('student_cases').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      caseNumber: row.case_number || `CS-${Date.now()}`,
      studentId: row.student_id || '',
      studentName: row.student_name || 'Siswa',
      program: row.program_id || 'sekolah_pagi',
      reportedBy: row.reported_by || 'Guru',
      reporterRole: row.reporter_role || 'Guru Kelas',
      dateTime: row.date_time || 'Baru saja',
      caseType: row.case_type || 'perilaku',
      priority: row.priority || 'sedang',
      description: row.description || '',
      initialActionTaken: row.initial_action_taken || '',
      status: row.status || 'dilaporkan',
      followUpPlan: row.followUpPlan || row.follow_up_plan || '',
      assignedStaff: row.assigned_staff || '',
      resolutionNotes: row.resolution_notes || undefined,
      resolvedAt: row.resolved_at || undefined
    }));
  } catch (err) {
    console.warn('fetchCasesFromSupabase failed:', err);
    return null;
  }
}

export async function saveCaseToSupabase(c: StudentCase): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(c.id);
    const payload = {
      id: dbId,
      case_number: c.caseNumber,
      student_id: isUUID(c.studentId) ? c.studentId : null,
      student_name: c.studentName,
      program_id: c.program,
      reported_by: c.reportedBy,
      reporter_role: c.reporterRole,
      date_time: c.dateTime,
      case_type: c.caseType,
      priority: c.priority,
      description: c.description,
      initial_action_taken: c.initialActionTaken,
      status: c.status,
      follow_up_plan: c.followUpPlan,
      assigned_staff: c.assignedStaff,
      resolution_notes: c.resolutionNotes || null,
      resolved_at: c.resolvedAt || null,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('student_cases').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveCaseToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveCaseToSupabase exception:', err);
    return null;
  }
}

export async function deleteCaseFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('student_cases').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 8. TASKS (TUGAS GURU & LAPORAN)
// ============================================================================
export async function fetchTasksFromSupabase(): Promise<TeacherTask[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || '',
      teacherId: row.teacher_id || '',
      teacherName: row.teacher_name || '',
      program: row.program || 'sekolah_pagi',
      studentId: row.student_id || undefined,
      studentName: row.student_name || undefined,
      period: row.period || 'mingguan',
      deadline: row.deadline || '',
      status: row.status || 'belum_dikerjakan',
      submissionDate: row.submission_date || undefined,
      notes: row.notes || undefined,
      reviewerNotes: row.reviewer_notes || undefined,
      mediaCount: row.media_count || 0
    }));
  } catch (err) {
    console.warn('fetchTasksFromSupabase failed:', err);
    return null;
  }
}

export async function saveTaskToSupabase(task: TeacherTask): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(task.id);
    const payload = {
      id: dbId,
      title: task.title,
      teacher_id: task.teacherId,
      teacher_name: task.teacherName,
      program: task.program,
      student_id: task.studentId || null,
      student_name: task.studentName || null,
      period: task.period,
      deadline: task.deadline,
      status: task.status,
      submission_date: task.submissionDate || null,
      notes: task.notes || null,
      reviewer_notes: task.reviewerNotes || null,
      media_count: task.mediaCount || 0,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('tasks').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('saveTaskToSupabase error:', error);
      return null;
    }
    return dbId;
  } catch (err) {
    console.warn('saveTaskToSupabase exception:', err);
    return null;
  }
}

export async function deleteTaskFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('tasks').delete().eq('id', toDeterministicUUID(id));
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 9. PROGRAMS (PROGRAM SEKOLAH DETAIL)
// ============================================================================
export async function fetchProgramsFromSupabase(): Promise<SchoolProgramDetail[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      code: row.code || row.id,
      title: row.title || '',
      shortDesc: row.short_desc || '',
      schedule: row.schedule || '',
      ageGroup: row.age_group || '',
      points: Array.isArray(row.points) ? row.points : [],
      spesial: row.spesial || '',
      fee: row.fee || '',
      badgeColor: row.badge_color || 'from-blue-600 to-indigo-600',
      iconName: row.icon_name || 'Sun'
    }));
  } catch (err) {
    console.warn('fetchProgramsFromSupabase failed:', err);
    return null;
  }
}

export async function saveProgramToSupabase(prog: SchoolProgramDetail): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const payload = {
      id: prog.id,
      code: prog.code,
      title: prog.title,
      short_desc: prog.shortDesc,
      schedule: prog.schedule,
      age_group: prog.ageGroup,
      points: prog.points,
      spesial: prog.spesial,
      fee: prog.fee,
      badge_color: prog.badgeColor,
      icon_name: prog.iconName,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('programs').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('saveProgramToSupabase error:', error);
    return prog.id;
  } catch (err) {
    return null;
  }
}

export async function deleteProgramFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('programs').delete().eq('id', id);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 10. POSITIONS (JABATAN / ROLE)
// ============================================================================
export async function fetchPositionsFromSupabase(): Promise<JobPosition[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('positions').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title || '',
      roleCategory: row.role_category,
      description: row.description || ''
    }));
  } catch (err) {
    return null;
  }
}

export async function savePositionToSupabase(pos: JobPosition): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const payload = {
      id: pos.id,
      title: pos.title,
      role_category: pos.roleCategory,
      description: pos.description || '',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('positions').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('savePositionToSupabase error:', error);
    return pos.id;
  } catch (err) {
    return null;
  }
}

export async function deletePositionFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    await supabase.from('positions').delete().eq('id', id);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 11. OBSERVATION SLOTS (SLOT OBSERVASI PSB)
// ============================================================================
export async function fetchObservationSlotsFromSupabase(): Promise<ObservationSlot[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('observation_slots').select('*').order('date', { ascending: true });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      date: row.date,
      timeSlot: row.time_slot || '',
      assessorName: row.assessor_name || '',
      room: row.room || '',
      capacity: row.capacity || 3,
      bookedCount: row.booked_count || 0
    }));
  } catch (err) {
    return null;
  }
}

export async function saveObservationSlotToSupabase(slot: ObservationSlot): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(slot.id);
    const payload = {
      id: dbId,
      date: slot.date,
      time_slot: slot.timeSlot,
      assessor_name: slot.assessorName,
      room: slot.room,
      capacity: slot.capacity,
      booked_count: slot.bookedCount,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('observation_slots').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('saveObservationSlotToSupabase error:', error);
    return dbId;
  } catch (err) {
    return null;
  }
}

// ============================================================================
// 12. STUDENT DEVELOPMENT RECORDS (SDR)
// ============================================================================
export async function fetchSDRFromSupabase(): Promise<Record<string, StudentDevelopmentRecord> | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('student_development_records').select('*');
    if (error || !data || data.length === 0) return null;

    const records: Record<string, StudentDevelopmentRecord> = {};
    for (const row of data) {
      records[row.student_id] = {
        studentId: row.student_id,
        academicYear: row.academic_year || '2026/2027',
        lastUpdated: row.last_updated || new Date().toISOString().split('T')[0],
        summaryNotes: row.summary_notes || '',
        scores: Array.isArray(row.scores) ? row.scores : [],
        programDecision: row.program_decision || 'CONTINUE',
        decisionRationale: row.decision_rationale || '',
        principalApprovalDate: row.principal_approval_date || undefined,
        planningMatrix: Array.isArray(row.planning_matrix) ? row.planning_matrix : []
      };
    }
    return records;
  } catch (err) {
    return null;
  }
}

export async function saveSDRToSupabase(studentId: string, record: Partial<StudentDevelopmentRecord>): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    const payload = {
      student_id: studentId,
      academic_year: record.academicYear || '2026/2027',
      last_updated: record.lastUpdated || new Date().toISOString().split('T')[0],
      summary_notes: record.summaryNotes || '',
      scores: record.scores || [],
      program_decision: record.programDecision || 'CONTINUE',
      decision_rationale: record.decisionRationale || '',
      principal_approval_date: record.principalApprovalDate || null,
      planning_matrix: record.planningMatrix || [],
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('student_development_records').upsert(payload, { onConflict: 'student_id' });
    if (error) console.warn('saveSDRToSupabase error:', error);
    return !error;
  } catch (err) {
    return false;
  }
}

// ============================================================================
// 13. CONSULTATION REQUESTS (KONSULTASI ORANG TUA)
// ============================================================================
export async function fetchConsultationsFromSupabase(): Promise<ConsultationRequest[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('consultation_requests').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      studentId: row.student_id || '',
      studentName: row.student_name || '',
      parentName: row.parent_name || '',
      parentPhone: row.parent_phone || '',
      targetRole: row.target_role || 'kepala_sekolah',
      targetStaffName: row.target_staff_name || undefined,
      requestedDate: row.requested_date || '',
      preferredTime: row.preferred_time || '',
      consultationType: row.consultation_type || 'tatap_muka',
      topic: row.topic || '',
      notes: row.notes || undefined,
      status: row.status || 'menunggu_konfirmasi',
      feedbackNotes: row.feedback_notes || undefined,
      confirmedDate: row.confirmed_date || undefined,
      confirmedTime: row.confirmed_time || undefined,
      createdAt: row.created_at ? row.created_at.split('T')[0] : '2026-10-28'
    }));
  } catch (err) {
    return null;
  }
}

export async function saveConsultationToSupabase(req: ConsultationRequest): Promise<string | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const dbId = toDeterministicUUID(req.id);
    const payload = {
      id: dbId,
      student_id: req.studentId,
      student_name: req.studentName,
      parent_name: req.parentName,
      parent_phone: req.parentPhone,
      target_role: req.targetRole,
      target_staff_name: req.targetStaffName || null,
      requested_date: req.requestedDate,
      preferred_time: req.preferredTime,
      consultation_type: req.consultationType,
      topic: req.topic,
      notes: req.notes || null,
      status: req.status,
      feedback_notes: req.feedbackNotes || null,
      confirmed_date: req.confirmedDate || null,
      confirmed_time: req.confirmedTime || null,
      created_at: req.createdAt ? new Date(req.createdAt).toISOString() : new Date().toISOString()
    };

    const { error } = await supabase.from('consultation_requests').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('saveConsultationToSupabase error:', error);
    return dbId;
  } catch (err) {
    return null;
  }
}

// ============================================================================
// 14. SITE SETTINGS (PENGATURAN WEBSITE & BRANDING)
// ============================================================================
export async function fetchSiteSettingsFromSupabase(): Promise<any | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('school_settings').select('*').eq('id', 'current').maybeSingle();
    if (error || !data || !data.settings) return null;
    return data.settings;
  } catch (err) {
    return null;
  }
}

export async function saveSiteSettingsToSupabase(settings: any): Promise<boolean> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return false;

  try {
    const payload = {
      id: 'current',
      settings,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('school_settings').upsert(payload, { onConflict: 'id' });
    if (error) console.warn('saveSiteSettingsToSupabase error:', error);
    return !error;
  } catch (err) {
    return false;
  }
}

// ============================================================================
// 15. REALTIME LISTENER UNTUK SEMUA PERUBAHAN TABEL
// ============================================================================
export function subscribeToAllChanges(
  callback: (table: string, eventType: string, newRow: any, oldRow: any) => void
) {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return () => {};

  try {
    const channel = supabase
      .channel('all-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload: any) => {
          callback(payload.table, payload.eventType, payload.new, payload.old);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('subscribeToAllChanges exception:', e);
    return () => {};
  }
}
