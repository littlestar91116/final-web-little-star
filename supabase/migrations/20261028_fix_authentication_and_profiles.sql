-- ====================================================================
-- LITTLE STAR LEARNING CENTER: AUTHENTICATION & PROFILES MIGRATION
-- Memperbaiki hubungan auth.users dengan public.profiles, sinkronisasi trigger,
-- RLS policies, dan perlindungan role / status akun.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL ROLES & SEED DATA
-- Jika tabel roles lama terbuat dengan tipe id UUID, drop & buat ulang dengan tipe TEXT
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

-- Pastikan kolom ada jika tabel roles sudah ada sebelumnya di database
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

-- 3. TABEL PROFILES (DENGAN KOLOM STATUS, PERMISSIONS, & FOREIGN KEY KE AUTH.USERS)
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

-- Pastikan kolom yang mungkin belum ada di tabel profiles lama ditambahkan dengan aman
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role_id' AND data_type='uuid') THEN
    ALTER TABLE public.profiles ALTER COLUMN role_id TYPE TEXT USING role_id::text;
    ALTER TABLE public.profiles ALTER COLUMN role_id SET DEFAULT 'wali_murid';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role_id') THEN
    ALTER TABLE public.profiles ADD COLUMN role_id TEXT REFERENCES public.roles(id) DEFAULT 'wali_murid';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='status') THEN
    ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='freeze_reason') THEN
    ALTER TABLE public.profiles ADD COLUMN freeze_reason TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='staff_id') THEN
    ALTER TABLE public.profiles ADD COLUMN staff_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='child_student_id') THEN
    ALTER TABLE public.profiles ADD COLUMN child_student_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='custom_permissions') THEN
    ALTER TABLE public.profiles ADD COLUMN custom_permissions JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Indexes untuk performa lookup autentikasi & role check
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);

-- 4. FUNCTION & TRIGGER: SINKRONISASI OTOMATIS SAAT USER BARU DIBUAT DI AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_full_name TEXT;
  v_username TEXT;
BEGIN
  -- Ambil role dari raw_app_meta_data atau raw_user_meta_data, fallback ke 'wali_murid'
  v_role := COALESCE(
    NEW.raw_app_meta_data->>'role',
    NEW.raw_user_meta_data->>'role',
    'wali_murid'
  );

  -- Pastikan role ada di tabel roles, jika tidak fallback ke 'wali_murid'
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = v_role) THEN
    v_role := 'wali_murid';
  END IF;
  
  -- Ambil nama lengkap
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(COALESCE(NEW.email, 'User'), '@', 1)
  );

  -- Ambil username
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)
  );

  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    role_id,
    phone,
    avatar_url,
    status,
    staff_id,
    child_student_id,
    custom_permissions
  )
  VALUES (
    NEW.id,
    NEW.email,
    LOWER(v_username),
    v_full_name,
    v_role,
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

-- Trigger untuk sinkronisasi jika email di auth.users berubah
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

-- 5. HELPER FUNCTION: CEK APAKAH PENGGUNA ADALAH SUPER ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role_id = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Bersihkan policy lama jika ada
DROP POLICY IF EXISTS "Public profiles can be viewed by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can do everything on profiles" ON public.profiles;

-- Policy 1: Pengguna yang terautentikasi dapat membaca profiles (diperlukan untuk daftar guru, orang tua, absensi)
CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Pengguna dapat memperbarui nama, phone, avatar miliknya sendiri,
-- TETAPI tidak diperbolehkan mengubah role_id atau status miliknya sendiri secara langsung!
CREATE POLICY "Users can update own profile non-role"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role_id = (SELECT p.role_id FROM public.profiles p WHERE p.id = auth.uid())
    AND status = (SELECT p.status FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Policy 3: Super Admin memiliki hak penuh (SELECT, INSERT, UPDATE, DELETE) pada semua profiles
CREATE POLICY "Super admin can do everything on profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

