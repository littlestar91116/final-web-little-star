import { createClient } from '@supabase/supabase-js';

// Configuration keys in localStorage for user override if not in env
const STORAGE_KEY_URL = 'ls_supabase_url';
const STORAGE_KEY_KEY = 'ls_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  isCustom: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wscfomgzlcnkjvgxwoba.supabase.co';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZHIAFYFJoMZi4Z4vgVjvFg_1fmC3hYb';
  
  const savedUrl = localStorage.getItem(STORAGE_KEY_URL);
  const savedKey = localStorage.getItem(STORAGE_KEY_KEY);

  const activeUrl = savedUrl || envUrl;
  const activeKey = savedKey || envKey;

  const isConfigured = Boolean(activeUrl && activeKey && activeUrl.startsWith('https://'));

  return {
    url: activeUrl,
    anonKey: activeKey,
    isConnected: isConfigured,
    isCustom: Boolean(savedUrl || savedKey)
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    return true;
  } catch (err) {
    console.error('Failed to save Supabase config', err);
    return false;
  }
}

export function resetSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
}

// Create client dynamically
export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (config.isConnected) {
    try {
      return createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

// SQL Migration Script covering the 55 Tables as outlined in PRD Section 22
export const SUPABASE_55_TABLES_SQL = `-- ====================================================================
-- LITTLE STAR LEARNING CENTER MANAGEMENT SYSTEM
-- MASTER DATABASE SCHEMA (55 TABEL & ROW LEVEL SECURITY)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. IDENTITAS & PEGAWAI (TABEL 1 - 10)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    DROP TABLE public.roles CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Pastikan kolom ada jika tabel roles sudah dibuat sebelumnya
ALTER TABLE roles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO roles (id, name, description) VALUES
  ('super_admin', 'Super Admin', 'Akses penuh seluruh konfigurasi, database, & kelola akun'),
  ('admin_sekolah', 'Admin Sekolah', 'Pendaftaran PSB, data siswa, penugasan & operasional'),
  ('kepala_sekolah', 'Kepala Sekolah', 'Supervisi guru, review rapor, approval program & kasus'),
  ('guru_sekolah_pagi', 'Guru Sekolah Pagi', 'Jadwal kelas, tugas harian, lesson plan & asesmen'),
  ('terapis', 'Terapis', 'Sesi terapi, target wicara/okupasi, rekam SDR'),
  ('shadow_teacher', 'Shadow Teacher', 'Pendampingan khusus 1-on-1 & observasi adaptasi kelas'),
  ('daycare_teacher', 'DayCare Teacher', 'Pengasuhan, aktivitas harian, makan & istirahat'),
  ('staff_keuangan', 'Staff Keuangan', 'Kelola SPP 4 program & verifikasi transfer pembayaran'),
  ('wali_murid', 'Wali Murid', 'Portal orang tua, rapor, perkembangan anak & tagihan SPP'),
  ('calon_wali_murid', 'Calon Wali Murid', 'Formulir PSB online, upload berkas & booking observasi')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role_id TEXT REFERENCES roles(id) DEFAULT 'wali_murid',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  freeze_reason TEXT,
  staff_id TEXT,
  child_student_id TEXT,
  custom_permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastikan kolom ada jika tabel profiles sudah dibuat sebelumnya
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_id TEXT REFERENCES roles(id) DEFAULT 'wali_murid';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS freeze_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS staff_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS child_student_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT '[]'::jsonb;

-- Index profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles (status);

-- Triggers untuk sinkronisasi otomatis auth.users -> public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_full_name TEXT;
  v_username TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_app_meta_data->>'role', NEW.raw_user_meta_data->>'role', 'wali_murid');
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = v_role) THEN
    v_role := 'wali_murid';
  END IF;
  
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(COALESCE(NEW.email, 'User'), '@', 1));
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1));

  INSERT INTO public.profiles (
    id, email, username, full_name, role_id, phone, avatar_url, status, staff_id, child_student_id, custom_permissions
  )
  VALUES (
    NEW.id, NEW.email, LOWER(v_username), v_full_name, v_role,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'status', 'active'),
    NEW.raw_user_meta_data->>'staff_id',
    NEW.raw_user_meta_data->>'child_student_id',
    COALESCE(NEW.raw_user_meta_data->'custom_permissions', '[]'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_user_email_updated()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    UPDATE public.profiles
    SET email = NEW.email, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_updated();

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_id = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nip TEXT UNIQUE,
  full_name TEXT NOT NULL,
  gender CHAR(1) CHECK (gender IN ('L', 'P')),
  role_id TEXT REFERENCES roles(id),
  phone TEXT,
  email TEXT,
  job_title TEXT,
  status TEXT DEFAULT 'tetap',
  join_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  specialization TEXT,
  certification TEXT,
  education_degree TEXT
);

CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  father_name TEXT,
  mother_name TEXT,
  guardian_name TEXT,
  whatsapp TEXT,
  address TEXT,
  emergency_contact TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis TEXT UNIQUE,
  nisn TEXT,
  full_name TEXT NOT NULL,
  nickname TEXT,
  gender CHAR(1) CHECK (gender IN ('L', 'P')),
  birth_place TEXT,
  birth_date DATE NOT NULL,
  address TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'cuti', 'lulus', 'mutasi')),
  parent_id UUID REFERENCES parents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'orang_tua'
);

CREATE TABLE IF NOT EXISTS employee_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  contract_number TEXT,
  start_date DATE,
  end_date DATE,
  salary_terms TEXT
);

CREATE TABLE IF NOT EXISTS employee_leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'menunggu_persetujuan'
);

-- 3. AKADEMIK DAN PROGRAM (TABEL 11 - 19)
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g. 2026/2027
  is_active BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  room_number TEXT,
  capacity INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS student_class_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY, -- sekolah_pagi, terapi, daycare, shadow
  name TEXT NOT NULL,
  description TEXT,
  base_monthly_fee NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS program_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id TEXT REFERENCES programs(id),
  curriculum_summary TEXT,
  schedule_details TEXT,
  facilities TEXT
);

CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id),
  status TEXT DEFAULT 'aktif',
  enrolled_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id TEXT REFERENCES programs(id),
  class_id UUID REFERENCES classes(id),
  day_of_week INT,
  start_time TIME,
  end_time TIME,
  activity_name TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  program_id TEXT REFERENCES programs(id),
  status TEXT CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Tidak Hadir')),
  notes TEXT
);

-- 4. PENERIMAAN DAN KEUANGAN (TABEL 20 - 27)
CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL,
  child_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pendaftaran_awal'
);

CREATE TABLE IF NOT EXISTS admission_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID REFERENCES admissions(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id)
);

CREATE TABLE IF NOT EXISTS registration_fee_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id UUID REFERENCES academic_years(id),
  amount NUMERIC NOT NULL DEFAULT 500000
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id),
  program_id TEXT REFERENCES programs(id),
  month TEXT NOT NULL,
  year INT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'belum_bayar'
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  amount_paid NUMERIC NOT NULL,
  proof_url TEXT,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES staff(id),
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS observation_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  assessor_name TEXT,
  capacity INT DEFAULT 3,
  booked_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID REFERENCES admissions(id),
  slot_id UUID REFERENCES observation_slots(id),
  assessor_notes TEXT,
  decision TEXT DEFAULT 'menunggu_evaluasi'
);

CREATE TABLE IF NOT EXISTS admission_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_id UUID REFERENCES admissions(id),
  document_type TEXT,
  file_url TEXT,
  verified BOOLEAN DEFAULT false
);

-- 5. PENILAIAN, PEMBELAJARAN & SUPERVISI (TABEL 28 - 42)
CREATE TABLE IF NOT EXISTS learning_indicators (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  program_id TEXT REFERENCES programs(id)
);

CREATE TABLE IF NOT EXISTS assessment_rubrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id TEXT REFERENCES learning_indicators(id),
  scale_level INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS development_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  goal_text TEXT NOT NULL,
  target_date DATE
);

CREATE TABLE IF NOT EXISTS daily_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  teacher_id UUID REFERENCES teachers(id),
  date DATE DEFAULT CURRENT_DATE,
  score INT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS development_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  indicator_id TEXT REFERENCES learning_indicators(id),
  score INT,
  assessed_date DATE
);

CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id),
  week_number INT,
  plan_content TEXT
);

CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  month TEXT,
  summary TEXT,
  approved_by UUID REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS quarterly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  quarter INT,
  synthesis TEXT
);

CREATE TABLE IF NOT EXISTS semester_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  semester INT,
  roadmap TEXT
);

CREATE TABLE IF NOT EXISTS planning_matrix_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  area TEXT,
  target TEXT,
  recommendation TEXT
);

CREATE TABLE IF NOT EXISTS supervisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principal_id UUID REFERENCES staff(id),
  teacher_id UUID REFERENCES teachers(id),
  date DATE,
  feedback TEXT,
  rating INT
);

CREATE TABLE IF NOT EXISTS student_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE,
  student_id UUID REFERENCES students(id),
  priority TEXT CHECK (priority IN ('rendah', 'sedang', 'tinggi', 'darurat')),
  case_type TEXT,
  description TEXT,
  status TEXT DEFAULT 'dilaporkan'
);

CREATE TABLE IF NOT EXISTS case_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES student_cases(id) ON DELETE CASCADE,
  action_taken TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id),
  period TEXT CHECK (period IN ('harian', 'mingguan', 'bulanan', 'tiga_bulanan', 'enam_bulanan')),
  title TEXT,
  deadline DATE,
  status TEXT DEFAULT 'belum_dikerjakan'
);

CREATE TABLE IF NOT EXISTS task_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES task_assignments(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES staff(id),
  comments TEXT,
  status TEXT
);

-- 6. STUDENT DEVELOPMENT RECORD & COMPARISON (TABEL 43 - 48)
CREATE TABLE IF NOT EXISTS student_development_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) UNIQUE,
  summary_notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS development_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  is_consent_given BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS development_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  event_date DATE NOT NULL,
  event_type TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS development_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  indicator_id TEXT REFERENCES learning_indicators(id),
  baseline_score NUMERIC,
  current_score NUMERIC,
  target_score NUMERIC
);

CREATE TABLE IF NOT EXISTS development_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  evaluation_date DATE,
  therapist_notes TEXT,
  teacher_notes TEXT
);

CREATE TABLE IF NOT EXISTS program_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  decision TEXT CHECK (decision IN ('CONTINUE', 'MODIFY', 'REPLACE')),
  rationale TEXT,
  principal_signature BOOLEAN DEFAULT false,
  decision_date DATE DEFAULT CURRENT_DATE
);

-- 7. MEDIA, SISTEM & PENGATURAN (TABEL 49 - 55)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  program_id TEXT REFERENCES programs(id),
  media_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_name TEXT NOT NULL,
  content TEXT NOT NULL,
  student_nickname TEXT,
  is_published BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS media_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  parent_signed BOOLEAN DEFAULT false,
  consent_date DATE
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  actor_id UUID,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  school_name TEXT DEFAULT 'LITTLE STAR LEARNING CENTER',
  motto TEXT DEFAULT 'Membimbing Setiap Bintang Kecil Bersinar',
  address TEXT DEFAULT 'Jl. Bintang No. 12, Jakarta',
  phone TEXT DEFAULT '+62 812-3456-7890',
  email TEXT DEFAULT 'littlestar91116@gmail.com',
  bank_name TEXT DEFAULT 'BCA',
  bank_account_number TEXT DEFAULT '8271-9982-10',
  bank_account_holder TEXT DEFAULT 'LITTLE STAR LEARNING CENTER'
);

-- ROW LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_cases ENABLE ROW LEVEL SECURITY;

-- ROW LEVEL SECURITY (RLS) POLICIES ON PROFILES
DROP POLICY IF EXISTS "Public profiles can be viewed by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role" ON profiles;
DROP POLICY IF EXISTS "Super admin can do everything on profiles" ON profiles;

CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile non-role"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role_id = (SELECT p.role_id FROM profiles p WHERE p.id = auth.uid())
    AND status = (SELECT p.status FROM profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "Super admin can do everything on profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- SAMPLE INITIAL POLICIES ON STUDENTS
CREATE POLICY "Parents view own children" ON students FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM student_guardians sg 
    JOIN parents p ON sg.parent_id = p.id 
    WHERE sg.student_id = students.id AND p.profile_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role_id IN ('super_admin', 'admin_sekolah', 'kepala_sekolah', 'guru_sekolah_pagi', 'terapis', 'shadow_teacher', 'daycare_teacher')
  )
);
`;
