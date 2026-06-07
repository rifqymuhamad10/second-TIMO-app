# ✅ Setup Checklist - Gamification Features

> Gunakan checklist ini untuk memastikan semua langkah setup sudah dilakukan dengan benar

## 📋 Pre-Setup Verification

Sebelum mulai, pastikan:

- [ ] ✅ Node.js 20+ terinstall (`node --version`)
- [ ] ✅ npm atau yarn terinstall (`npm --version`)
- [ ] ✅ Supabase project sudah dibuat dan berjalan
- [ ] ✅ TIMO App base sudah berfungsi (bisa login/register)
- [ ] ✅ File `.env.local` sudah dikonfigurasi dengan benar

---

## 🗄️ Database Setup

### Step 1: Backup Database (Recommended)
- [ ] Buka Supabase Dashboard
- [ ] Pergi ke Settings → Database
- [ ] Download backup atau catat current schema
- [ ] Save backup file di tempat aman

### Step 2: Run Migration
- [ ] Buka Supabase Dashboard
- [ ] Klik **SQL Editor** di sidebar
- [ ] Buat new query
- [ ] Copy isi file `supabase_migration_gamification.sql`
- [ ] Paste ke SQL Editor
- [ ] Klik **Run** atau tekan `Ctrl + Enter`
- [ ] Tunggu hingga muncul "Migration berhasil!"

### Step 3: Verify Database Changes
- [ ] Run query berikut untuk verify:
  ```sql
  SELECT column_name, data_type, column_default
  FROM information_schema.columns 
  WHERE table_name = 'users' 
  AND column_name IN ('total_points', 'current_streak', 'longest_streak', 'last_completion_date');
  ```
- [ ] Pastikan 4 kolom muncul di hasil
- [ ] Check indexes:
  ```sql
  SELECT indexname FROM pg_indexes 
  WHERE tablename = 'users' 
  AND indexname LIKE 'idx_users_%';
  ```
- [ ] Pastikan ada 3 index baru

### Step 4: Test Database
- [ ] Run query test:
  ```sql
  SELECT id, username, total_points, current_streak, longest_streak 
  FROM users 
  LIMIT 1;
  ```
- [ ] Pastikan query berhasil tanpa error
- [ ] Default values harus 0 untuk numeric columns

---

## 💻 Application Setup

### Step 1: Install Dependencies
- [ ] Buka terminal/command prompt
- [ ] Navigate ke folder project:
  ```bash
  cd d:\TIMO\second-TIMO-app
  ```
- [ ] Install dependencies:
  ```bash
  npm install
  # atau
  yarn install
  ```
- [ ] Tunggu hingga selesai tanpa error

### Step 2: Verify File Structure
- [ ] Check folder `src/components/gamification/` ada
- [ ] Verify 3 files ada di folder tersebut:
  - [ ] `StreakCard.tsx`
  - [ ] `PointsCard.tsx`
  - [ ] `RewardNotification.tsx`
- [ ] Check file `src/services/gamification-service.ts` ada
- [ ] Verify `src/models/users-model.ts` ada function `updateUserStats`

### Step 3: Type Check
- [ ] Run TypeScript check:
  ```bash
  npx tsc --noEmit
  ```
- [ ] Pastikan tidak ada error
- [ ] Jika ada error, periksa import paths

### Step 4: Build Test
- [ ] Run build command:
  ```bash
  npm run build
  ```
- [ ] Pastikan build berhasil tanpa error
- [ ] Check output size (harus bertambah ~3KB)

---

## 🚀 Running & Testing

### Step 1: Start Development Server
- [ ] Run dev server:
  ```bash
  npm run dev
  ```
- [ ] Tunggu hingga muncul "Ready in Xms"
- [ ] Buka browser: `http://localhost:3000`
- [ ] Pastikan app loading tanpa error

### Step 2: Login Test
- [ ] Login dengan akun existing
- [ ] Pastikan redirect ke dashboard berhasil
- [ ] Check browser console (F12) - tidak ada error merah

### Step 3: Dashboard Visual Check
- [ ] Dashboard muncul dengan benar
- [ ] Check cards berikut muncul:
  - [ ] 📋 Total Tugas card
  - [ ] ⏳ Tugas Aktif card
  - [ ] ✅ Tugas Selesai card
  - [ ] 🔥 **Streak Card** (NEW)
  - [ ] ⭐ **Points Card** (NEW)
- [ ] Check initial values:
  - [ ] Current Streak: 0
  - [ ] Longest Streak: 0
  - [ ] Total Points: 0
  - [ ] Level: 1

### Step 4: Create Test Task
- [ ] Klik tombol "+ Tambah Tugas Baru"
- [ ] Modal form terbuka
- [ ] Isi form:
  - Judul: "Test Gamification"
  - Mata Kuliah: "Testing"
  - Prioritas: High
  - Status: Todo
  - Deadline: **3 hari dari sekarang**
- [ ] Klik "Simpan Tugas"
- [ ] Task muncul di task grid

### Step 5: Complete Task Test
- [ ] Find task "Test Gamification" di dashboard
- [ ] Klik status button atau icon edit
- [ ] Ubah status menjadi **"Done"**
- [ ] Save changes

### Step 6: Verify Gamification Works
- [ ] ✨ **Notification popup muncul** di kanan atas
- [ ] Check notification content:
  - [ ] "Tugas Selesai! 🎉"
  - [ ] "Poin Didapat: +100 ⭐" (karena 3 hari sebelum deadline)
  - [ ] "Streak: 1 🔥"
  - [ ] Pesan motivasi muncul
- [ ] Notification hilang otomatis setelah ~5 detik
- [ ] Check dashboard cards updated:
  - [ ] Streak Card: Current Streak = 1
  - [ ] Points Card: Total Points = 100
  - [ ] Points Card: Level 1, Progress bar ada isi

### Step 7: Test Different Scenarios

**Scenario A: Complete on Deadline Day**
- [ ] Create task dengan deadline hari ini
- [ ] Complete task
- [ ] Verify dapat **25 poin**

**Scenario B: Complete Late**
- [ ] Create task dengan deadline kemarin
- [ ] Complete task
- [ ] Verify dapat **10 poin**

**Scenario C: Multiple Completions Same Day**
- [ ] Complete 2 tasks di hari yang sama
- [ ] Verify poin bertambah untuk setiap task
- [ ] Verify streak tetap 1 (tidak bertambah)

---

## 🔍 Validation Checks

### API Response Check
- [ ] Buka browser DevTools (F12)
- [ ] Tab **Network**
- [ ] Complete sebuah task
- [ ] Find request `PUT /api/tasks/[id]`
- [ ] Check response body includes:
  ```json
  {
    "data": {
      "task": { ... },
      "gamification": {
        "pointsEarned": 100,
        "totalPoints": 100,
        "currentStreak": 1,
        "longestStreak": 1,
        "isNewRecord": true
      }
    }
  }
  ```

### Console Check
- [ ] Buka browser console (F12 → Console tab)
- [ ] Pastikan tidak ada error merah
- [ ] Warning kuning boleh diabaikan (jika ada)

### Database Verification
- [ ] Kembali ke Supabase Dashboard
- [ ] SQL Editor → Run query:
  ```sql
  SELECT id, username, total_points, current_streak, longest_streak, last_completion_date
  FROM users 
  WHERE id = YOUR_USER_ID;
  ```
- [ ] Verify nilai sudah terupdate di database
- [ ] `total_points` harus > 0
- [ ] `current_streak` harus > 0
- [ ] `last_completion_date` harus berisi tanggal hari ini

---

## 📱 Mobile/Responsive Testing

### Desktop (> 1024px)
- [ ] All cards tampil dalam grid 2 kolom
- [ ] Notification muncul di kanan atas
- [ ] Semua text readable
- [ ] Icons muncul dengan benar

### Tablet (640-1024px)
- [ ] Cards responsive, width menyesuaikan
- [ ] Task grid 2 kolom
- [ ] Notification tetap di kanan

### Mobile (< 640px)
- [ ] All cards stack vertical (1 kolom)
- [ ] Mobile navigation muncul di bawah
- [ ] Notification width menyesuaikan screen
- [ ] Touch interaction works
- [ ] Scroll smooth

**Test di berbagai device:**
- [ ] Desktop browser (Chrome/Edge/Firefox)
- [ ] Mobile browser (iOS Safari/Android Chrome)
- [ ] Tablet (jika ada)

---

## 🐛 Error Handling Test

### Test Invalid Data
- [ ] Try complete task without deadline → Should not crash
- [ ] Try with invalid token → Should return 401
- [ ] Try update other user's task → Should return 403

### Test Edge Cases
- [ ] Complete task twice → Second time no gamification
- [ ] Complete task far in future deadline → Should get points
- [ ] Complete very old task → Should get 10 points

### Test UI Edge Cases
- [ ] Close notification manually (X button) → Should work
- [ ] Complete task while notification showing → Should queue/replace
- [ ] Very large points (999,999) → Should format correctly

---

## 🎨 Visual Quality Check

### Color & Style
- [ ] Streak Card: Orange background
- [ ] Points Card: Yellow background
- [ ] Notification: Green background
- [ ] All have black 3px borders (neubrutalism)
- [ ] Shadows visible and correct

### Typography
- [ ] Headers in uppercase, bold
- [ ] Numbers large and readable
- [ ] Body text clear
- [ ] Icons proper size

### Animation
- [ ] Notification slides in smoothly from right
- [ ] Progress bar animates width change
- [ ] Hover effects work on buttons
- [ ] No janky animations

---

## 📊 Performance Check

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] No loading spinner stuck
- [ ] Cards render quickly

### Interaction
- [ ] Complete task response < 1 second
- [ ] Notification appears immediately after API response
- [ ] No lag when clicking buttons

### Memory
- [ ] Open DevTools → Performance tab
- [ ] Record for 10 seconds while using app
- [ ] Stop recording
- [ ] Check no memory leaks
- [ ] FPS should stay ~60

---

## 📚 Documentation Review

### Read Documentation
- [ ] Read `README_GAMIFICATION.md` (overview)
- [ ] Read `QUICK_START.md` (setup guide)
- [ ] Skim `GAMIFICATION_FEATURES.md` (features)
- [ ] Keep `MIGRATION_GUIDE.md` handy (troubleshooting)

### Understand Architecture
- [ ] Review `FILE_STRUCTURE.md`
- [ ] Understand data flow
- [ ] Know where to find each component

---

## ✅ Final Checklist

### Must Have
- [x] Database migration completed
- [x] All files created and in correct location
- [x] No TypeScript errors
- [x] Build successful
- [x] Dev server runs without errors
- [x] Can login to app
- [x] Dashboard shows gamification cards
- [x] Can complete task and get points
- [x] Notification appears and works
- [x] Streak increments correctly

### Nice to Have
- [ ] Tested on multiple browsers
- [ ] Tested on mobile device
- [ ] Tested all point scenarios
- [ ] Tested streak logic thoroughly
- [ ] Customized colors/values (optional)
- [ ] Added custom features (optional)

---

## 🎉 Success Criteria

**You're done when:**

✅ All items in "Must Have" are checked  
✅ Complete a task → Get notification with points  
✅ Dashboard shows updated streak and points  
✅ Database has correct values  
✅ No console errors  
✅ App works on mobile and desktop  

---

## 🚨 If Something Fails

### Quick Fixes

**Error: Column does not exist**
→ Re-run migration SQL script

**Error: Cannot find module**
→ Restart dev server (`npm run dev`)

**No notification showing**
→ Check browser console for errors
→ Verify API response has `gamification` object

**Points not updating**
→ Check Supabase database directly
→ Verify user_id matches

**Detailed Troubleshooting:**
→ See `MIGRATION_GUIDE.md` section "Troubleshooting"
→ See `QUICK_START.md` section "Troubleshooting Cepat"

---

## 📞 Need Help?

1. Check browser console for errors
2. Check `MIGRATION_GUIDE.md` troubleshooting section
3. Verify all steps in this checklist completed
4. Review API responses in Network tab
5. Check database values directly in Supabase

---

## 🎯 Next Steps After Setup

1. **Customize** - Adjust colors, points formula
2. **Extend** - Add leaderboard, achievements
3. **Monitor** - Track user engagement with gamification
4. **Iterate** - Get user feedback and improve

---

**🎊 Congratulations!**

Jika semua checklist sudah ✅, maka fitur gamification sudah berhasil diimplementasikan dan siap digunakan!

**Happy coding! 🚀**
