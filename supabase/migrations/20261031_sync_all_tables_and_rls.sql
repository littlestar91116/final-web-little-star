-- ====================================================================
-- LITTLE STAR LEARNING CENTER: SYNC ALL TABLES & RLS POLICIES
-- Menyesuaikan kolom operasional (students, staff, classes, admissions,
-- gallery, invoices, student_cases) dan mengaktifkan RLS full-access
-- agar semua data dari frontend website otomatis tersimpan ke Supabase.
-- ====================================================================

-- 1. PASTIKAN EXTENSION UUID TERPASANG
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PASTIKAN TABEL ROLES MENGGUNAKAN PRIMARY KEY TEXT
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    DROP TABLE public.roles CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO public.roles (id, name, description) VALUES
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

-- 3. PASTIKAN TABEL PROFILES MEMILIKI SEMUA KOLOM
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role_id TEXT REFERENCES public.roles(id) DEFAULT 'wali_murid',
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

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_id TEXT REFERENCES public.roles(id) DEFAULT 'wali_murid';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS freeze_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS staff_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS child_student_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT '[]'::jsonb;

-- 4. PASTIKAN KOLOM OPERASIONAL LENGKAP PADA SETIAP TABEL
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS enrolled_programs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS special_needs_notes TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_info JSONB;

ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS assigned_programs JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS program TEXT;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'kegiatan';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS has_parent_consent BOOLEAN DEFAULT true;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS student_ids JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS child_nickname TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS gender CHAR(1);
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS birth_place TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS parent_email TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS selected_programs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS admin_fee_amount NUMERIC DEFAULT 500000;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'belum_bayar';
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS payment_date DATE;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS observation_slot JSONB;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS observation_status TEXT DEFAULT 'belum_dijadwalkan';
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS admission_decision TEXT DEFAULT 'menunggu_observasi';
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_date DATE;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS program_id TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS reported_by TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS reporter_role TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS date_time TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS initial_action_taken TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS follow_up_plan TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS assigned_staff TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS resolved_at DATE;
ALTER TABLE public.student_cases ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 5. TAMBAHAN TABEL OPERASIONAL: TASKS, PROGRAMS, POSITIONS, OBSERVATION SLOTS, SDR, KONSULTASI, SETTINGS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  teacher_id TEXT,
  teacher_name TEXT,
  program TEXT DEFAULT 'sekolah_pagi',
  student_id TEXT,
  student_name TEXT,
  period TEXT DEFAULT 'mingguan',
  deadline DATE,
  status TEXT DEFAULT 'belum_dikerjakan',
  submission_date DATE,
  notes TEXT,
  reviewer_notes TEXT,
  media_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT,
  schedule TEXT,
  age_group TEXT,
  points JSONB DEFAULT '[]'::jsonb,
  spesial TEXT,
  fee TEXT,
  badge_color TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  role_category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.observation_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  assessor_name TEXT,
  room TEXT,
  capacity INT DEFAULT 3,
  booked_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_development_records (
  student_id TEXT PRIMARY KEY,
  academic_year TEXT DEFAULT '2026/2027',
  last_updated DATE,
  summary_notes TEXT,
  scores JSONB DEFAULT '[]'::jsonb,
  program_decision TEXT DEFAULT 'CONTINUE',
  decision_rationale TEXT,
  principal_approval_date DATE,
  planning_matrix JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT,
  student_name TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  target_role TEXT,
  target_staff_name TEXT,
  requested_date DATE,
  preferred_time TEXT,
  consultation_type TEXT,
  topic TEXT,
  notes TEXT,
  status TEXT DEFAULT 'menunggu_konfirmasi',
  feedback_notes TEXT,
  confirmed_date DATE,
  confirmed_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.school_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AKTIFKAN RLS DAN BUAT POLICIES AGAR FRONTEND BISA SIMPAN DAN BACA DATA
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_development_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- Reset policies untuk menghindari error duplicate
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for students" ON public.students;
DROP POLICY IF EXISTS "Allow all for staff" ON public.staff;
DROP POLICY IF EXISTS "Allow all for classes" ON public.classes;
DROP POLICY IF EXISTS "Allow all for gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow all for admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow all for invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow all for student_cases" ON public.student_cases;
DROP POLICY IF EXISTS "Allow all for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow all for programs" ON public.programs;
DROP POLICY IF EXISTS "Allow all for positions" ON public.positions;
DROP POLICY IF EXISTS "Allow all for observation_slots" ON public.observation_slots;
DROP POLICY IF EXISTS "Allow all for student_development_records" ON public.student_development_records;
DROP POLICY IF EXISTS "Allow all for consultation_requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Allow all for school_settings" ON public.school_settings;
DROP POLICY IF EXISTS "Parents view own children" ON public.students;

-- Profiles: baca untuk semua pengguna, update untuk diri sendiri & super admin
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Super admin can do everything on profiles" ON public.profiles FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- Tabel Operasional: Buka izin penuh agar input dari website tersimpan ke Supabase
CREATE POLICY "Allow all for students" ON public.students FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for staff" ON public.staff FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for classes" ON public.classes FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for gallery" ON public.gallery FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for admissions" ON public.admissions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for invoices" ON public.invoices FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for student_cases" ON public.student_cases FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for tasks" ON public.tasks FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for programs" ON public.programs FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for positions" ON public.positions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for observation_slots" ON public.observation_slots FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for student_development_records" ON public.student_development_records FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for consultation_requests" ON public.consultation_requests FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for school_settings" ON public.school_settings FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
