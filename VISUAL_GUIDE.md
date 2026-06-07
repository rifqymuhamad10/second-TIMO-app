# 🎨 Visual Guide - Fitur Gamification

## 📱 UI Components Preview

### 1. Dashboard Layout (Setelah Update)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                         [User Menu]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Halo, Username! 👋                        [+ Tambah Tugas]  │
│  Kamu memiliki 5 tugas aktif yang sedang berjalan.          │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 📋 Total     │ │ ⏳ Tugas     │ │ ✅ Tugas     │        │
│  │    Tugas     │ │    Aktif     │ │    Selesai   │        │
│  │      12      │ │      5       │ │      7       │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  ┌───────────────────────────┐ ┌───────────────────────────┐│
│  │  🔥 STREAK CARD          │ │  ⭐ POINTS CARD          ││
│  │  ━━━━━━━━━━━━━━━━━━━━━  │ │  ━━━━━━━━━━━━━━━━━━━━━  ││
│  │  Streak Hari Ini         │ │  Total Poin              ││
│  │  7 🔥                    │ │  1,250 ⭐                ││
│  │                          │ │                          ││
│  │  🏆 Rekor: 10 hari       │ │  📈 Level 3              ││
│  │                          │ │  ▓▓▓▓▓▓░░░░ 250/500      ││
│  └───────────────────────────┘ └───────────────────────────┘│
│                                                               │
│  [Filter & Search Bar]                                       │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Task Card 1  │ │ Task Card 2  │ │ Task Card 3  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Streak Card (Detail)

```
┌─────────────────────────────────────────────┐
│  🔥                               [flame bg] │
│  ┌───┐                                      │
│  │🔥│  Streak Hari Ini                     │
│  └───┘  7 🔥                                │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  🏆 Rekor Terbaik: 10 hari                  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  🎉 Rekor Baru!                      │   │
│  └──────────────────────────────────────┘   │
│  (Muncul jika pecahkan rekor)               │
└─────────────────────────────────────────────┘
Orange Background (#FF8C42 atau nb-orange)
Black 3px Border (Neubrutalism)
```

---

### 3. Points Card (Detail)

```
┌─────────────────────────────────────────────┐
│  ⭐                              [star bg]   │
│  ┌───┐                                      │
│  │⭐│  Total Poin                           │
│  └───┘  1,250 ⭐                            │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                              │
│  📈 Level 3              250/500            │
│  ▓▓▓▓▓▓░░░░░░░░░░░░  (Progress Bar)        │
│  250 poin lagi ke Level 4                   │
│                                              │
└─────────────────────────────────────────────┘
Yellow Background (#FFD643 atau nb-yellow)
Black 3px Border (Neubrutalism)
Progress Bar: Black fill with animation
```

---

### 4. Reward Notification (Popup)

```
                                    ┌───────────────────────────┐
                                    │ 🌟  Tugas Selesai! 🎉 [X]│
                                    ├───────────────────────────┤
                                    │                           │
                                    │  ┌─────────────────────┐ │
                                    │  │ Poin Didapat        │ │
                                    │  │          +100 ⭐    │ │
                                    │  └─────────────────────┘ │
                                    │                           │
                                    │  ┌─────────────────────┐ │
                                    │  │ 🔥 Streak           │ │
                                    │  │              7 🔥   │ │
                                    │  └─────────────────────┘ │
                                    │                           │
                                    │  ┌─────────────────────┐ │
                                    │  │ 🏆 Rekor Baru!      │ │
                                    │  │ Streak Terpanjang!  │ │
                                    │  └─────────────────────┘ │
                                    │  (Jika pecahkan rekor)  │
                                    │                           │
                                    │  Luar biasa! Kamu        │
                                    │  menyelesaikan tugas     │
                                    │  jauh sebelum deadline!🚀│
                                    │                           │
                                    └───────────────────────────┘
                                    Green Background (nb-green)
                                    Slide-in animation dari kanan
                                    Auto-close 5 detik
```

---

## 🎬 User Flow (Visual)

### Scenario: User menyelesaikan tugas 3 hari sebelum deadline

```
Step 1: User klik status button pada task card
┌─────────────────────────┐
│ Task: Buat ERD          │
│ Deadline: 3 hari lagi   │
│ Status: [In Progress ▼] │ ← KLIK
└─────────────────────────┘

Step 2: Status berubah ke "Done"
┌─────────────────────────┐
│ Task: Buat ERD          │
│ Deadline: 3 hari lagi   │
│ Status: [Done ✓]        │
└─────────────────────────┘

Step 3: Backend menghitung poin
💾 Database Processing...
├─ Calculate points: 3 days before = 100 points
├─ Current streak: 6 → 7 days
├─ Check longest streak: 7 > 10? No
└─ Save to database ✓

Step 4: Notification muncul
                    ┌─────────────────┐
                    │ +100 Points! ⭐ │
                    │ 7 Day Streak! 🔥│
                    └─────────────────┘
                         ↓ (slide-in)

Step 5: Dashboard cards update
┌─────────────┐  ┌─────────────┐
│ Streak: 7🔥 │  │ 1,350 pts ⭐│
└─────────────┘  └─────────────┘
     ↑ updated        ↑ updated
```

---

## 🎨 Color Palette

### Neubrutalism Colors (dari TIMO design)

```
Background Colors:
├─ nb-surface:  #FAFAFA (Off-white)
├─ nb-bg:       #F5F5F5 (Light gray)
└─ nb-ink:      #1A1A1A (Almost black)

Feature Colors:
├─ nb-yellow:   #FFD643 (Bright yellow) → Points Card
├─ nb-orange:   #FF8C42 (Vibrant orange) → Streak Card
├─ nb-green:    #4ADE80 (Fresh green) → Reward Notification
├─ nb-blue:     #3B82F6 (Cool blue) → Active tasks
└─ nb-red:      #EF4444 (Alert red) → High priority

Border & Shadow:
├─ border-nb:   3px solid #1A1A1A
└─ shadow-nb:   4px 4px 0px #1A1A1A (offset shadow)
```

---

## 📐 Component Dimensions

### Card Sizes:
```
Streak Card:
- Width: 100% (responsive grid)
- Height: auto (min ~180px)
- Padding: 24px (p-6)
- Border: 3px solid black
- Shadow: 4px 4px 0px black

Points Card:
- Width: 100% (responsive grid)
- Height: auto (min ~180px)
- Padding: 24px (p-6)
- Border: 3px solid black
- Shadow: 4px 4px 0px black

Reward Notification:
- Width: max-w-sm (384px)
- Position: Fixed top-20 right-4
- Padding: 24px (p-6)
- Border: 3px solid black
- Shadow: Large offset shadow
```

---

## 🔤 Typography

### Font Families:
```css
/* Headers & Numbers */
font-family: 'font-display' (Bold, Black weight)
text-transform: uppercase
letter-spacing: wider

/* Body Text */
font-family: 'font-body' (Regular weight)
letter-spacing: normal

/* Examples */
Streak Number: font-display font-black text-3xl
Card Title: font-body font-bold text-sm uppercase
Body Text: font-body text-sm
```

### Font Sizes:
```
Main Numbers (Streak/Points): 3xl (30px)
Card Headers: sm (14px) + uppercase
Body Text: sm (14px)
Small Labels: xs (12px)
Notification Title: xl (20px)
```

---

## 🎭 Animation & Transitions

### Reward Notification:
```css
/* Enter Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Exit Animation */
@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

Duration: 300ms
Timing: ease-in-out
```

### Progress Bar:
```css
/* Width Animation */
transition: width 500ms ease-out

/* Example */
0% → 50% (smooth animation over 500ms)
```

### Hover Effects:
```css
/* Close Button */
hover:bg-nb-ink/10
transition-colors
border: 2px transparent → 2px black
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 640px):
├─ Stack all cards vertically
├─ Full width components
└─ Notification width: max-w-sm (fit screen)

Tablet (640px - 1024px):
├─ Gamification cards: 2 columns
├─ Stats cards: 3 columns
└─ Notification: Fixed right-4

Desktop (> 1024px):
├─ All cards in grid layout
├─ Notification: Fixed right-8
└─ Max width container: 7xl
```

---

## 🎯 Interactive States

### Buttons:
```
Default:
- bg-nb-surface
- border-nb (3px black)
- shadow-nb

Hover:
- Translate -2px -2px
- Shadow increase to 6px 6px

Active:
- Translate 0px 0px
- Shadow 2px 2px (pressed effect)

Disabled:
- opacity-50
- cursor-not-allowed
```

---

## 📊 Data Display Formats

### Numbers:
```javascript
// Points
1250 → "1,250" (with comma separator)

// Streak
7 → "7 🔥"

// Level
level: 3, progress: 250/500
Display: "Level 3" + progress bar 50%
```

### Dates:
```javascript
// Streak calculation
Today: 2026-06-07
Last completion: 2026-06-06
Result: Streak +1 (consecutive days)

// Timezone handling
Use server timezone (Supabase)
Format: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
```

---

## 🎪 Accessibility

### ARIA Labels:
```html
<!-- Close Button -->
<button aria-label="Close notification">
  <X />
</button>

<!-- Progress Bar -->
<div 
  role="progressbar" 
  aria-valuenow="50" 
  aria-valuemin="0" 
  aria-valuemax="100"
>
  <div style="width: 50%"></div>
</div>
```

### Keyboard Navigation:
- Tab through close button
- Enter/Space to close notification
- ESC to dismiss notification

### Screen Reader:
- Announce when notification appears
- Read out points earned
- Announce new record achievement

---

**Designed with ❤️ using Neubrutalism Design System**
