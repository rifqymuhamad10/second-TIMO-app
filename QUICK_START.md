# ⚡ Quick Start - Fitur Gamification

## 🚀 Setup dalam 5 Menit

### Step 1: Database Migration (2 menit)

1. Buka **Supabase Dashboard**
2. Klik **SQL Editor** di sidebar
3. Copy-paste file `supabase_migration_gamification.sql`
4. Klik **Run** / **Execute**
5. ✅ Selesai! Cek output: "Migration berhasil!"

**Shortcut Command:**
```bash
# Atau buka file dan copy manual
cat supabase_migration_gamification.sql
```

---

### Step 2: Install Dependencies (1 menit)

```bash
# Pastikan di folder second-TIMO-app
cd d:\TIMO\second-TIMO-app

# Install (jika belum)
npm install

# Atau
yarn install
```

---

### Step 3: Run Development Server (1 menit)

```bash
npm run dev
# atau
yarn dev
```

Buka browser: **http://localhost:3000**

---

### Step 4: Test Fitur (2 menit)

#### Test 1: Login
1. Login dengan akun existing
2. Lihat dashboard → **Streak Card** dan **Points Card** muncul

#### Test 2: Selesaikan Tugas
1. Buat tugas baru:
   - Judul: "Test Gamification"
   - Deadline: **3 hari dari sekarang**
   - Status: "Todo"

2. Klik **Status button** → pilih "Done"

3. Lihat hasil:
   - ✨ **Notification popup** muncul
   - 🔥 **Streak**: +1
   - ⭐ **Points**: +100 (karena 3 hari sebelum deadline)

#### Test 3: Cek Streak Consecutiveness
1. Besok (atau set system date), selesaikan tugas lagi
2. Streak harus bertambah 1
3. Skip 1 hari → Streak reset ke 1

---

## 📋 Checklist Implementation

Copy checklist ini untuk tracking progress:

```markdown
### Database
- [ ] Run migration script
- [ ] Verify kolom baru di tabel users
- [ ] Test query: SELECT * FROM users LIMIT 1;

### Backend
- [ ] File gamification-service.ts ada
- [ ] File users-model.ts updated
- [ ] File tasks-service.ts updated
- [ ] No TypeScript errors

### Frontend
- [ ] StreakCard.tsx component
- [ ] PointsCard.tsx component  
- [ ] RewardNotification.tsx component
- [ ] Dashboard.tsx updated
- [ ] No build errors

### Testing
- [ ] Login berhasil
- [ ] Dashboard menampilkan cards
- [ ] Selesaikan tugas → dapat poin
- [ ] Notification muncul
- [ ] Streak bertambah
- [ ] Level progress bar beranimasi

### Documentation
- [ ] Baca IMPLEMENTATION_SUMMARY.md
- [ ] Baca GAMIFICATION_FEATURES.md
- [ ] Baca MIGRATION_GUIDE.md
```

---

## 🐛 Troubleshooting Cepat

### ❌ Problem: "Cannot find module gamification-service"
**Solution:**
```bash
# Restart dev server
npm run dev
```

### ❌ Problem: "Column 'total_points' does not exist"
**Solution:**
```sql
-- Run migration lagi di Supabase
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
```

### ❌ Problem: Notification tidak muncul
**Solution:**
1. Buka **Console Browser** (F12)
2. Cek error messages
3. Pastikan API response include `gamification` object
4. Test manual:
   ```javascript
   // Console browser
   console.log(result.data?.gamification)
   ```

### ❌ Problem: Points/Streak tidak update
**Solution:**
1. Check network tab → API call berhasil?
2. Check Supabase → data tersimpan?
3. Refresh page → fetch ulang user stats
4. Clear localStorage dan login ulang

### ❌ Problem: Build error TypeScript
**Solution:**
```bash
# Check errors
npm run build

# Jika ada missing types
npm install --save-dev @types/node
```

---

## 🎯 Testing Scenarios

### Scenario 1: First Time User
```
1. Register akun baru
2. Login
3. Check stats:
   - Total Points: 0
   - Current Streak: 0
   - Longest Streak: 0
4. Create & complete 1 task
5. Check stats updated
```

### Scenario 2: Points Calculation
```
Test Case 1: Complete 3 days before deadline
- Create task with deadline +3 days
- Complete immediately
- Expected: +100 points

Test Case 2: Complete on deadline day
- Create task with deadline today
- Complete
- Expected: +25 points

Test Case 3: Complete after deadline
- Create task with deadline -1 day (yesterday)
- Complete
- Expected: +10 points
```

### Scenario 3: Streak Logic
```
Day 1: Complete 1 task → Streak = 1
Day 1 (later): Complete 2nd task → Streak still 1
Day 2: Complete 1 task → Streak = 2
Day 4 (skipped Day 3): Complete task → Streak = 1 (reset)
```

### Scenario 4: New Record
```
1. Current: streak = 5, longest = 5
2. Complete task next day → streak = 6
3. Check notification: "🏆 Rekor Baru!" appears
4. Longest streak updates to 6
```

---

## 📱 Mobile Testing

### iOS/Android
```bash
# Get local IP
ipconfig
# atau
ifconfig

# Access dari mobile
http://192.168.x.x:3000
```

### Responsive Breakpoints
- **Mobile**: < 640px (stack vertical)
- **Tablet**: 640-1024px (2 columns)
- **Desktop**: > 1024px (full grid)

---

## 🎨 Customization Quick Guide

### Change Colors:
```typescript
// StreakCard.tsx
bg-nb-orange → bg-nb-blue (ganti jadi biru)

// PointsCard.tsx
bg-nb-yellow → bg-nb-green (ganti jadi hijau)
```

### Change Points Formula:
```typescript
// gamification-service.ts
export function calculatePoints(completedAt: Date, deadline: Date): number {
  // Ubah formula di sini
  const daysBeforeDeadline = ...
  
  if (daysBeforeDeadline >= 3) {
    return 150; // Ganti dari 100 ke 150
  }
  // ...
}
```

### Change Level Threshold:
```typescript
// PointsCard.tsx
const level = Math.floor(totalPoints / 1000) + 1; // Ganti dari 500 ke 1000
const pointsInCurrentLevel = totalPoints % 1000;
const progressPercentage = (pointsInCurrentLevel / 1000) * 100;
```

---

## 🔍 Verification Commands

### Check Database:
```sql
-- Supabase SQL Editor

-- 1. Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('total_points', 'current_streak', 'longest_streak');

-- 2. Check data
SELECT id, username, total_points, current_streak, longest_streak 
FROM users 
LIMIT 5;

-- 3. Check leaderboard
SELECT username, total_points, current_streak 
FROM users 
ORDER BY total_points DESC 
LIMIT 10;
```

### Check API Response:
```bash
# Terminal (dengan token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/users/current

# Expected response:
{
  "data": {
    "id": 1,
    "username": "user123",
    "total_points": 100,
    "current_streak": 1,
    "longest_streak": 1,
    ...
  }
}
```

---

## 📚 Next Steps

After setup berhasil:

1. **Read Full Documentation:**
   - `GAMIFICATION_FEATURES.md` - Penjelasan lengkap fitur
   - `VISUAL_GUIDE.md` - UI/UX design guide

2. **Explore Code:**
   - `src/services/gamification-service.ts` - Logic
   - `src/components/gamification/` - UI components

3. **Customize:**
   - Ubah warna sesuai brand
   - Adjust formula poin
   - Tambah level rewards

4. **Add More Features:**
   - Leaderboard
   - Achievements
   - Social sharing

---

## 💡 Pro Tips

1. **Development Tip:**
   ```typescript
   // Untuk testing, set deadline manually
   const testDeadline = new Date();
   testDeadline.setDate(testDeadline.getDate() + 3); // +3 days
   ```

2. **Database Tip:**
   ```sql
   -- Reset user stats untuk testing ulang
   UPDATE users 
   SET total_points = 0, current_streak = 0, longest_streak = 0 
   WHERE id = YOUR_USER_ID;
   ```

3. **Debug Tip:**
   ```typescript
   // Tambah console.log di gamification-service.ts
   console.log('Points calculated:', points);
   console.log('Streak updated:', streakData);
   ```

---

## ✅ Done!

Jika semua step di atas berhasil:
- ✅ Database sudah ter-migrate
- ✅ App running tanpa error
- ✅ Gamification features working
- ✅ UI components muncul dengan baik

**Selamat! Fitur gamification sudah siap digunakan! 🎉**

---

**Need help?** Check `MIGRATION_GUIDE.md` untuk troubleshooting lebih detail.
