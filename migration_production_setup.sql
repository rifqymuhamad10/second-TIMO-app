-- ============================================================
-- TIMO App — Production Setup Migration
-- ============================================================
-- PERINGATAN: Script ini MENGHAPUS semua data yang ada!
-- Jalankan sekali di Supabase SQL Editor sebelum deploy.
-- ============================================================

-- ============================================================
-- FASE 1: RESET SEMUA DATA LAMA
-- ============================================================

-- Hapus tabel invite tokens dulu kalau sudah ada (akan dibuat ulang di FASE 3)
DROP TABLE IF EXISTS task_invite_tokens CASCADE;

-- Hapus data di urutan yang benar (respek foreign key)
TRUNCATE TABLE task_members CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset auto-increment sequences
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS task_members_id_seq RESTART WITH 1;

-- ============================================================
-- FASE 2: TAMBAH KOLOM EMAIL VERIFICATION KE TABEL USERS
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
  ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP WITH TIME ZONE;

-- ============================================================
-- FASE 3: BUAT TABEL TASK_INVITE_TOKENS
-- (Untuk mengundang user yang belum terdaftar)
-- ============================================================

CREATE TABLE IF NOT EXISTS task_invite_tokens (
  id          SERIAL PRIMARY KEY,
  token       VARCHAR(255) UNIQUE NOT NULL,
  task_id     INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  invited_email VARCHAR(255) NOT NULL,
  invited_by  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at     TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_tokens_token
  ON task_invite_tokens(token);

CREATE INDEX IF NOT EXISTS idx_invite_tokens_email
  ON task_invite_tokens(invited_email);

-- ============================================================
-- FASE 4: ENABLE ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS pada semua tabel
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_invite_tokens  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FASE 5: RLS POLICIES
-- Semua akses dari browser (anon key) diblokir.
-- Server menggunakan service_role key yang bypass RLS.
-- ============================================================

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "no_public_users"              ON users;
DROP POLICY IF EXISTS "no_public_sessions"           ON sessions;
DROP POLICY IF EXISTS "no_public_tasks"              ON tasks;
DROP POLICY IF EXISTS "no_public_task_members"       ON task_members;
DROP POLICY IF EXISTS "no_public_task_invite_tokens" ON task_invite_tokens;

-- Buat policies yang memblokir akses langsung dari browser
CREATE POLICY "no_public_users"
  ON users FOR ALL
  USING (false);

CREATE POLICY "no_public_sessions"
  ON sessions FOR ALL
  USING (false);

CREATE POLICY "no_public_tasks"
  ON tasks FOR ALL
  USING (false);

CREATE POLICY "no_public_task_members"
  ON task_members FOR ALL
  USING (false);

CREATE POLICY "no_public_task_invite_tokens"
  ON task_invite_tokens FOR ALL
  USING (false);

-- ============================================================
-- VERIFIKASI
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE 'Migration selesai!';
  RAISE NOTICE '- Data lama sudah dihapus';
  RAISE NOTICE '- Kolom email_verified sudah ditambahkan ke users';
  RAISE NOTICE '- Tabel task_invite_tokens sudah dibuat';
  RAISE NOTICE '- RLS sudah diaktifkan di semua tabel';
END $$;

-- ============================================================
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Paste seluruh script ini
-- 3. Klik "Run"
-- 4. Cek output: harus ada 4 NOTICE sukses
-- ============================================================
