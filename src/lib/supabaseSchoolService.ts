import { getSupabaseClient, getSupabaseConfig } from './supabase';
import { 
  Student, 
  StaffMember, 
  SchoolClass, 
  AdmissionApplication, 
  GalleryItem, 
  SPPInvoice, 
  StudentCase, 
  StudentAttendanceItem 
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

// ============================================================================
// 1. STUDENTS (SISWA)
// ============================================================================
export async function fetchStudentsFromSupabase(): Promise<Student[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

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
    const dbId = isUUID(student.id) ? student.id : generateUUID();
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
    await supabase.from('students').delete().eq('id', id);
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
    if (error || !data) return null;

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
    const dbId = isUUID(member.id) ? member.id : generateUUID();
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
    await supabase.from('staff').delete().eq('id', id);
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
    if (error || !data) return null;

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
    const dbId = isUUID(cls.id) ? cls.id : generateUUID();
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
    await supabase.from('classes').delete().eq('id', id);
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
    if (error || !data) return null;

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
    const dbId = isUUID(adm.id) ? adm.id : generateUUID();
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

// ============================================================================
// 5. GALLERY (GALERI KEGIATAN)
// ============================================================================
export async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('gallery').select('*').order('uploaded_at', { ascending: false });
    if (error || !data) return null;

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
    const dbId = isUUID(item.id) ? item.id : generateUUID();
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
    await supabase.from('gallery').delete().eq('id', id);
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
    if (error || !data) return null;

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
    const dbId = isUUID(inv.id) ? inv.id : generateUUID();
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

// ============================================================================
// 7. STUDENT CASES (CATATAN KASUS)
// ============================================================================
export async function fetchCasesFromSupabase(): Promise<StudentCase[] | null> {
  const supabase = getSupabaseClient();
  const config = getSupabaseConfig();
  if (!supabase || !config.isConnected) return null;

  try {
    const { data, error } = await supabase.from('student_cases').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

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
      followUpPlan: row.follow_up_plan || '',
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
    const dbId = isUUID(c.id) ? c.id : generateUUID();
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
