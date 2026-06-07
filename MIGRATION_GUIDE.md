# Migration Guide - Gamification Features

## Database Schema Updates

Untuk mengaktifkan fitur streak dan poin, Anda perlu menambahkan kolom-kolom berikut ke tabel `users` di Supabase:

### SQL Migration Script

Jalankan script SQL berikut di Supabase SQL Editor:

```sql
-- Tambah kolom gamification ke tabel users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_completion_date TIMESTAMP;

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_current_streak ON users(current_streak DESC);

-- Update existing users dengan default values
UPDATE users 
SET 
  total_points = COALESCE(total_points, 0),
  current_streak = COALESCE(current_streak, 0),
  longest_streak = COALESCE(longest_streak, 0)
WHERE total_points IS NULL OR current_streak IS NULL OR longest_streak IS NULL;
```

### Penjelasan Kolom Baru

1. **total_points** (INTEGER): Total poin yang dikumpulkan user
2. **current_streak** (INTEGER): Jumlah hari berturut-turut user menyelesaikan tugas
3. **longest_streak** (INTEGER): Rekor streak terpanjang user
4. **last_completion_date** (TIMESTAMP): Tanggal terakhir user menyelesaikan tugas

## Cara Kerja Fitur

### 1. Sistem Poin
Poin diberikan berdasarkan seberapa cepat tugas diselesaikan sebelum deadline:
- **3+ hari sebelum deadline**: 100 poin 🌟
- **2 hari sebelum deadline**: 75 poin ⭐
- **1 hari sebelum deadline**: 50 poin ✨
- **Hari H deadline**: 25 poin 💫
- **Terlambat**: 10 poin (tetap dapat poin untuk usaha) 🌠

### 2. Sistem Streak
- Streak bertambah 1 setiap hari user menyelesaikan minimal 1 tugas
- Streak akan reset jika user tidak menyelesaikan tugas selama 1 hari penuh
- Longest streak adalah rekor streak terpanjang yang pernah dicapai

### 3. Level System
- Setiap 500 poin = 1 Level
- Progress bar menunjukkan poin yang dikumpulkan di level saat ini

## Testing

Setelah menjalankan migration:

1. Login ke aplikasi
2. Buat tugas baru dengan deadline 3 hari ke depan
3. Ubah status tugas menjadi "done"
4. Lihat notifikasi reward muncul dengan poin yang didapat
5. Check dashboard - card Streak dan Poin akan terupdate

## Troubleshooting

### Poin tidak bertambah
- Pastikan migration sudah dijalankan
- Check console browser untuk error
- Pastikan kolom `total_points` ada di tabel users

### Streak tidak terupdate
- Pastikan kolom `current_streak`, `longest_streak`, dan `last_completion_date` ada
- Streak hanya bertambah jika menyelesaikan tugas di hari yang berbeda

### Notifikasi tidak muncul
- Check console browser untuk error
- Pastikan API `/api/tasks/[id]` mengembalikan data gamification
