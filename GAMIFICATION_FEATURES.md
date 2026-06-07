# 🎮 Fitur Gamification - TIMO App

## Overview

Fitur gamification menambahkan elemen motivasi berupa **Streak** dan **Poin** untuk mendorong pengguna menyelesaikan tugas lebih cepat dan konsisten, mirip dengan sistem Duolingo.

---

## ✨ Fitur-Fitur

### 1. 🔥 Sistem Streak

**Apa itu Streak?**
Streak adalah jumlah hari berturut-turut user menyelesaikan minimal 1 tugas.

**Cara Kerja:**
- ✅ Selesaikan minimal 1 tugas setiap hari → Streak bertambah
- ❌ Tidak menyelesaikan tugas 1 hari → Streak reset ke 0
- 🏆 Rekor streak terpanjang tersimpan sebagai "Longest Streak"

**Komponen UI:**
- `StreakCard`: Menampilkan current streak dan longest streak
- Icon flame (🔥) untuk visualisasi streak
- Badge "Rekor Baru!" saat mencapai longest streak baru

---

### 2. ⭐ Sistem Poin

**Formula Perhitungan Poin:**

Poin dihitung berdasarkan **seberapa cepat** tugas diselesaikan dari deadline:

| Waktu Penyelesaian | Poin | Emoji |
|-------------------|------|-------|
| 3+ hari sebelum deadline | 100 | 🌟 |
| 2 hari sebelum deadline | 75 | ⭐ |
| 1 hari sebelum deadline | 50 | ✨ |
| Hari H deadline | 25 | 💫 |
| Terlambat | 10 | 🌠 |

**Level System:**
- Setiap 500 poin = naik 1 level
- Progress bar menunjukkan poin di level saat ini
- Contoh: 1250 poin = Level 3 (250/500 progress ke Level 4)

**Komponen UI:**
- `PointsCard`: Menampilkan total poin, level, dan progress bar
- Icon star (⭐) untuk visualisasi poin

---

### 3. 🎉 Reward Notification

**Kapan Muncul?**
Notifikasi reward otomatis muncul setiap kali user menyelesaikan tugas (status → "done")

**Informasi yang Ditampilkan:**
- 🌟 Poin yang didapat (+25 sampai +100)
- 🔥 Current streak setelah tugas selesai
- 🏆 Badge "Rekor Baru!" jika mencapai longest streak
- 💬 Pesan motivasi berdasarkan performa

**Pesan Motivasi:**
- Poin ≥75: "Luar biasa! Kamu menyelesaikan tugas jauh sebelum deadline! 🚀"
- Poin ≥50: "Bagus! Kamu menyelesaikan tugas tepat waktu! 👏"
- Poin <50: "Tetap semangat! Selesaikan lebih cepat untuk poin lebih banyak! 💪"

---

## 🏗️ Arsitektur Teknis

### File Structure

```
src/
├── services/
│   └── gamification-service.ts       # Logic poin & streak
├── models/
│   └── users-model.ts                # Database operations
├── components/
│   └── gamification/
│       ├── StreakCard.tsx           # Display streak
│       ├── PointsCard.tsx           # Display poin & level
│       └── RewardNotification.tsx   # Popup reward
└── app/
    └── dashboard/
        └── page.tsx                  # Integration di dashboard
```

### Functions

**gamification-service.ts:**
- `calculatePoints(completedAt, deadline)` - Hitung poin berdasarkan waktu
- `updateStreak(userId)` - Update streak user
- `addPoints(userId, points)` - Tambah poin ke user
- `processTaskCompletion(userId, deadline)` - Main function saat tugas selesai

**tasks-service.ts:**
- Modified `updateTaskForUser()` - Trigger gamification saat status → "done"

---

## 🎯 User Flow

1. **User menyelesaikan tugas:**
   - Klik tombol status atau ubah status ke "done"
   
2. **Backend processing:**
   - System menghitung poin berdasarkan deadline
   - System update streak (cek apakah hari berturut-turut)
   - System simpan total_points, current_streak, longest_streak ke database
   
3. **Frontend response:**
   - Reward notification muncul di kanan atas
   - StreakCard & PointsCard terupdate otomatis
   - Progress bar level beranimasi

4. **Auto-close notification:**
   - Notifikasi hilang otomatis setelah 5 detik
   - User bisa close manual dengan tombol X

---

## 📊 Database Schema

**Tabel users - Kolom tambahan:**

```sql
total_points INTEGER DEFAULT 0
current_streak INTEGER DEFAULT 0
longest_streak INTEGER DEFAULT 0
last_completion_date TIMESTAMP
```

**Indexes:**
```sql
idx_users_total_points (total_points DESC)
idx_users_current_streak (current_streak DESC)
```

---

## 🎨 Design System

Menggunakan **Neubrutalism Design** sesuai dengan style TIMO:

**Color Palette:**
- Streak Card: `bg-nb-orange` (Orange)
- Points Card: `bg-nb-yellow` (Yellow)
- Reward Notification: `bg-nb-green` (Green)

**Typography:**
- Headers: `font-display font-black` (Bold, uppercase)
- Body: `font-body` (Regular weight)
- Numbers: `font-display font-black text-3xl` (Extra large)

**Borders:**
- All cards: `border-nb border-nb-ink shadow-nb`
- Consistent 3px black borders (neubrutalism style)

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan di masa depan:

1. **Leaderboard** 🏆
   - Ranking user berdasarkan total poin
   - Ranking berdasarkan longest streak
   
2. **Badges & Achievements** 🎖️
   - "Speed Demon" - Selesaikan 10 tugas 3+ hari sebelum deadline
   - "Consistent" - Maintain streak 7 hari berturut-turut
   - "Comeback Kid" - Rebuild streak setelah putus
   
3. **Challenges** 🎯
   - Weekly challenge: Selesaikan 5 tugas minggu ini
   - Monthly challenge: Maintain streak 30 hari
   
4. **Rewards** 🎁
   - Unlock themes dengan poin
   - Unlock icons dengan achievement
   
5. **Analytics** 📈
   - Grafik poin per minggu/bulan
   - Grafik streak history
   - Peak productivity hours

---

## 💡 Tips Penggunaan

**Untuk User:**
1. Selesaikan tugas jauh sebelum deadline untuk poin maksimal
2. Konsisten selesaikan minimal 1 tugas/hari untuk maintain streak
3. Prioritaskan tugas dengan deadline terdekat

**Untuk Developer:**
1. Test dengan berbagai skenario waktu (sebelum/sesudah deadline)
2. Monitor performa query untuk leaderboard (jika implementasi)
3. Consider timezone untuk streak calculation
4. Add analytics tracking untuk gamification events

---

## 📝 Notes

- Poin tetap diberikan meskipun tugas terlambat (10 poin) untuk tetap memberikan motivasi
- Streak hanya bertambah 1x per hari (menyelesaikan 10 tugas dalam 1 hari = streak +1)
- Longest streak tidak akan pernah berkurang, hanya current streak yang reset
- Level tidak ada batas maksimal (unlimited progression)

---

**Dibuat dengan ❤️ untuk meningkatkan produktivitas mahasiswa!**
