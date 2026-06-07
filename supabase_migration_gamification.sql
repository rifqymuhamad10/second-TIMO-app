-- ================================================
-- TIMO App - Gamification Features Migration
-- ================================================
-- Fitur: Streak dan Poin System
-- Tanggal: 2026-06-07
-- ================================================

-- 1. Tambah kolom gamification ke tabel users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_completion_date TIMESTAMP;

-- 2. Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_current_streak ON users(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_users_longest_streak ON users(longest_streak DESC);

-- 3. Update existing users dengan default values
UPDATE users 
SET 
  total_points = COALESCE(total_points, 0),
  current_streak = COALESCE(current_streak, 0),
  longest_streak = COALESCE(longest_streak, 0)
WHERE total_points IS NULL OR current_streak IS NULL OR longest_streak IS NULL;

-- 4. (Optional) Tambah constraint untuk memastikan nilai tidak negatif
ALTER TABLE users
ADD CONSTRAINT check_total_points_positive CHECK (total_points >= 0),
ADD CONSTRAINT check_current_streak_positive CHECK (current_streak >= 0),
ADD CONSTRAINT check_longest_streak_positive CHECK (longest_streak >= 0);

-- 5. (Optional) Buat view untuk leaderboard (future feature)
CREATE OR REPLACE VIEW leaderboard_points AS
SELECT 
  id,
  username,
  email,
  total_points,
  current_streak,
  longest_streak,
  ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank_points,
  ROW_NUMBER() OVER (ORDER BY current_streak DESC) as rank_streak
FROM users
WHERE total_points > 0 OR current_streak > 0
ORDER BY total_points DESC;

-- 6. (Optional) Buat function untuk reset streak otomatis
-- Function ini bisa dipanggil dengan cron job setiap hari
CREATE OR REPLACE FUNCTION reset_expired_streaks()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET current_streak = 0
  WHERE last_completion_date < CURRENT_DATE - INTERVAL '1 day'
    AND current_streak > 0;
END;
$$ LANGUAGE plpgsql;

-- 7. Verify migration
DO $$
BEGIN
  -- Check if columns exist
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name IN ('total_points', 'current_streak', 'longest_streak', 'last_completion_date')
  ) THEN
    RAISE NOTICE 'Migration berhasil! Kolom gamification sudah ditambahkan.';
  ELSE
    RAISE WARNING 'Migration gagal! Periksa kembali script.';
  END IF;
END $$;

-- ================================================
-- SELESAI
-- ================================================
-- Cara penggunaan:
-- 1. Copy seluruh script ini
-- 2. Buka Supabase Dashboard → SQL Editor
-- 3. Paste dan jalankan script
-- 4. Verify dengan query: SELECT * FROM users LIMIT 1;
-- ================================================
