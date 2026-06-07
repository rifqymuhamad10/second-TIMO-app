# 📁 File Structure - Gamification Features

## 🗂️ Complete Project Structure

```
second-TIMO-app/
│
├── 📚 Documentation Files (Root Level)
│   ├── QUICK_START.md                    ⚡ Setup guide 5 menit
│   ├── IMPLEMENTATION_SUMMARY.md         📋 Summary lengkap
│   ├── GAMIFICATION_FEATURES.md          ✨ Detail fitur & konsep
│   ├── MIGRATION_GUIDE.md                🗃️ Database migration guide
│   ├── VISUAL_GUIDE.md                   🎨 UI/UX design guide
│   ├── FILE_STRUCTURE.md                 📁 File ini
│   └── supabase_migration_gamification.sql 💾 SQL script
│
├── src/
│   ├── 🔧 Services (Business Logic)
│   │   ├── gamification-service.ts      ⭐ NEW: Gamification logic
│   │   ├── tasks-service.ts             🔄 MODIFIED: Integrate gamification
│   │   └── users-service.ts             (Existing)
│   │
│   ├── 💾 Models (Database Operations)
│   │   ├── users-model.ts               🔄 MODIFIED: Add updateUserStats()
│   │   ├── tasks-model.ts               (Existing)
│   │   └── sessions-model.ts            (Existing)
│   │
│   ├── 🎨 Components
│   │   ├── gamification/                ⭐ NEW FOLDER
│   │   │   ├── StreakCard.tsx          🔥 Streak display
│   │   │   ├── PointsCard.tsx          ⭐ Points & level display
│   │   │   └── RewardNotification.tsx  🎉 Popup notification
│   │   │
│   │   ├── tasks/                       (Existing components)
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskGrid.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── layout/                      (Existing components)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   └── ui/                          (Existing components)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       └── Skeleton.tsx
│   │
│   ├── 📄 Pages
│   │   └── app/
│   │       ├── dashboard/
│   │       │   └── page.tsx             🔄 MODIFIED: Add gamification UI
│   │       ├── login/
│   │       │   └── page.tsx             (Existing)
│   │       ├── register/
│   │       │   └── page.tsx             (Existing)
│   │       ├── profile/
│   │       │   └── page.tsx             (Existing)
│   │       │
│   │       ├── api/                     (API Routes)
│   │       │   ├── tasks/
│   │       │   │   ├── route.ts         (Existing)
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts     (Existing - returns gamification data)
│   │       │   ├── users/
│   │       │   │   ├── current/
│   │       │   │   │   └── route.ts     (Existing - returns user stats)
│   │       │   │   ├── login/
│   │       │   │   │   └── route.ts     (Existing)
│   │       │   │   └── logout/
│   │       │   │       └── route.ts     (Existing)
│   │       │   └── register/
│   │       │       └── route.ts         (Existing)
│   │       │
│   │       ├── layout.tsx               (Existing)
│   │       ├── page.tsx                 (Existing - Home)
│   │       └── globals.css              (Existing)
│   │
│   ├── 🔀 Routes (API Handlers)
│   │   ├── tasks-route.ts               (Existing)
│   │   └── users-route.ts               (Existing)
│   │
│   ├── 🔐 Contexts
│   │   └── AuthContext.tsx              (Existing)
│   │
│   ├── 📚 Lib (Utilities)
│   │   ├── supabaseClient.ts            (Existing)
│   │   └── colors.ts                    (Existing)
│   │
│   └── middleware.ts                    (Existing)
│
├── 📦 Configuration Files
│   ├── package.json                     (Dependencies)
│   ├── tsconfig.json                    (TypeScript config)
│   ├── next.config.ts                   (Next.js config)
│   ├── tailwind.config.js               (Tailwind config)
│   └── eslint.config.mjs                (ESLint config)
│
└── 🎨 Assets
    └── public/                          (Static files)
        ├── *.svg
        └── ...
```

---

## 📊 File Dependencies Graph

```
Dashboard Page (page.tsx)
    │
    ├─► AuthContext ──► users-service ──► users-model ──► Supabase
    │                                      │
    ├─► StreakCard ◄───────────────────────┤
    ├─► PointsCard ◄───────────────────────┤
    ├─► RewardNotification                 │
    │                                      │
    └─► TaskGrid ──► TaskCard             │
            │                              │
            └─► API /tasks/[id] ──► tasks-service ──┐
                                            │        │
                                            ├─► tasks-model ──► Supabase
                                            │        │
                                            └─► gamification-service
                                                     │
                                                     └─► users-model ──► Supabase
```

---

## 🆕 New Files Created

### 1. Services
```typescript
src/services/gamification-service.ts
├─ calculatePoints()          // Hitung poin
├─ updateStreak()             // Update streak
├─ addPoints()                // Tambah poin
└─ processTaskCompletion()    // Main handler
```

### 2. Components
```typescript
src/components/gamification/StreakCard.tsx
├─ Props: currentStreak, longestStreak
└─ Display: Streak info + record badge

src/components/gamification/PointsCard.tsx
├─ Props: totalPoints
└─ Display: Points, level, progress bar

src/components/gamification/RewardNotification.tsx
├─ Props: pointsEarned, currentStreak, isNewRecord
└─ Display: Popup with animation + auto-close
```

### 3. Documentation
```
📚 Documentation Files:
├─ QUICK_START.md              (Setup guide)
├─ IMPLEMENTATION_SUMMARY.md   (What was built)
├─ GAMIFICATION_FEATURES.md    (Feature details)
├─ MIGRATION_GUIDE.md          (Database setup)
├─ VISUAL_GUIDE.md             (UI/UX specs)
├─ FILE_STRUCTURE.md           (This file)
└─ supabase_migration_gamification.sql (SQL script)
```

---

## 🔄 Modified Files

### 1. Models
```typescript
src/models/users-model.ts
└─ Added: updateUserStats()
   Parameters: id, { total_points, current_streak, longest_streak, last_completion_date }
   Returns: Updated user data
```

### 2. Services
```typescript
src/services/tasks-service.ts
└─ Modified: updateTaskForUser()
   ├─ Import: processTaskCompletion from gamification-service
   ├─ Logic: Detect status change to "done"
   ├─ Action: Call processTaskCompletion()
   └─ Return: { task, gamification }
```

### 3. Pages
```typescript
src/app/dashboard/page.tsx
└─ Changes:
   ├─ Import: StreakCard, PointsCard, RewardNotification
   ├─ State: userStats (totalPoints, currentStreak, longestStreak)
   ├─ State: rewardNotification
   ├─ Function: fetchUserStats()
   ├─ Handler: handleToggleStatus() - process gamification result
   └─ UI: Added gamification cards grid + notification
```

---

## 🗄️ Database Schema Changes

### Table: `users`

**New Columns:**
```sql
┌──────────────────────┬──────────┬──────────┬─────────────────┐
│ Column Name          │ Type     │ Default  │ Description     │
├──────────────────────┼──────────┼──────────┼─────────────────┤
│ total_points         │ INTEGER  │ 0        │ Total poin user │
│ current_streak       │ INTEGER  │ 0        │ Streak saat ini │
│ longest_streak       │ INTEGER  │ 0        │ Rekor streak    │
│ last_completion_date │ TIMESTAMP│ NULL     │ Tanggal terakhir│
└──────────────────────┴──────────┴──────────┴─────────────────┘
```

**New Indexes:**
```sql
idx_users_total_points    (total_points DESC)
idx_users_current_streak  (current_streak DESC)
idx_users_longest_streak  (longest_streak DESC)
```

---

## 🎯 API Endpoints

### Existing Endpoints (Used by Gamification)

```
GET /api/users/current
├─ Headers: Authorization: Bearer <token>
├─ Returns: User data (including gamification stats)
└─ Used by: Dashboard to fetch user stats

PUT /api/tasks/[id]
├─ Headers: Authorization: Bearer <token>
├─ Body: { status: "done", ... }
├─ Returns: { task, gamification }
└─ Triggers: processTaskCompletion() when status → "done"
```

### Response Example:
```json
// PUT /api/tasks/123
{
  "data": {
    "task": {
      "id": 123,
      "title": "Buat ERD",
      "status": "done",
      ...
    },
    "gamification": {
      "pointsEarned": 100,
      "totalPoints": 1250,
      "currentStreak": 7,
      "longestStreak": 10,
      "isNewRecord": false
    }
  }
}

// GET /api/users/current
{
  "data": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "total_points": 1250,
    "current_streak": 7,
    "longest_streak": 10,
    "last_completion_date": "2026-06-07T00:00:00.000Z",
    ...
  }
}
```

---

## 🔧 Configuration Files

### Package Dependencies (No new dependencies needed!)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.106.1",
    "next": "16.2.6",
    "react": "19.2.4",
    "lucide-react": "^1.16.0",  // Already installed (for icons)
    ...
  }
}
```

### TypeScript Config (No changes)
```json
// tsconfig.json - Works out of the box
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Already configured
    }
  }
}
```

### Tailwind Config (No changes)
```javascript
// All classes used are from existing Tailwind + custom nb-* classes
// Already configured in globals.css
```

---

## 📦 Component Props Interface

### StreakCard
```typescript
interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}
```

### PointsCard
```typescript
interface PointsCardProps {
  totalPoints: number;
}
```

### RewardNotification
```typescript
interface RewardNotificationProps {
  pointsEarned: number;
  currentStreak: number;
  isNewRecord: boolean;
  onClose: () => void;
}
```

---

## 🔍 Function Signatures

### gamification-service.ts
```typescript
// Calculate points based on completion time vs deadline
function calculatePoints(
  completedAt: Date, 
  deadline: Date
): number

// Update user streak and return new values
async function updateStreak(
  userId: number
): Promise<{
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}>

// Add points to user total
async function addPoints(
  userId: number, 
  points: number
): Promise<number>

// Main handler: process everything when task completed
async function processTaskCompletion(
  userId: number,
  deadline: string
): Promise<{
  pointsEarned: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}>
```

### users-model.ts
```typescript
// Update user gamification stats
async function updateUserStats(
  id: number, 
  updates: {
    total_points?: number;
    current_streak?: number;
    longest_streak?: number;
    last_completion_date?: string;
  }
): Promise<User>
```

---

## 📝 Code Style Guide

### Naming Conventions
```typescript
// Components: PascalCase
StreakCard.tsx
RewardNotification.tsx

// Functions: camelCase
calculatePoints()
updateStreak()

// Files: kebab-case
gamification-service.ts
users-model.ts

// Database columns: snake_case
total_points
current_streak
```

### Import Order
```typescript
// 1. External libraries
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

// 2. Components
import StreakCard from "@/components/gamification/StreakCard";

// 3. Services/Models
import { processTaskCompletion } from "@/services/gamification-service";

// 4. Types
import { Task } from "@/components/tasks/TaskCard";

// 5. Icons
import { Star, Flame } from "lucide-react";
```

---

## 🎨 CSS Class Organization

### Tailwind Utilities Order
```typescript
// 1. Layout
className="flex flex-col"

// 2. Sizing
className="w-full h-auto"

// 3. Spacing
className="p-6 gap-4"

// 4. Typography
className="font-display font-black text-3xl"

// 5. Colors
className="bg-nb-orange text-nb-ink"

// 6. Borders & Shadows
className="border-nb border-nb-ink shadow-nb"

// 7. Interactive
className="hover:bg-nb-ink/10 transition-colors"
```

---

## 🚀 Build Output

### Production Build Includes:
```
.next/
├── static/
│   ├── chunks/
│   │   ├── gamification-service-[hash].js
│   │   ├── StreakCard-[hash].js
│   │   ├── PointsCard-[hash].js
│   │   └── RewardNotification-[hash].js
│   └── css/
│       └── app-layout-[hash].css  (includes gamification styles)
└── server/
    └── app/
        └── dashboard/
            └── page.js  (server-rendered with gamification)
```

---

## 📊 File Size Impact

### Estimated Bundle Size Addition:
```
gamification-service.ts      ~3KB (minified)
StreakCard.tsx               ~2KB (minified)
PointsCard.tsx               ~2KB (minified)
RewardNotification.tsx       ~3KB (minified)
Dashboard page updates       ~1KB (minified)
────────────────────────────────────────
Total Addition:              ~11KB (minified)
                             ~3KB (gzipped)
```

**Impact: Minimal** - Modern web apps are typically 200KB+, this adds only ~1.5%

---

## ✅ Checklist: Files to Review

When debugging or modifying gamification:

```
Core Logic:
☐ src/services/gamification-service.ts
☐ src/services/tasks-service.ts
☐ src/models/users-model.ts

UI Components:
☐ src/components/gamification/StreakCard.tsx
☐ src/components/gamification/PointsCard.tsx
☐ src/components/gamification/RewardNotification.tsx

Integration:
☐ src/app/dashboard/page.tsx
☐ src/app/api/tasks/[id]/route.ts

Database:
☐ supabase_migration_gamification.sql

Documentation:
☐ QUICK_START.md (setup guide)
☐ GAMIFICATION_FEATURES.md (feature details)
```

---

**Last Updated: June 7, 2026**  
**Version: 1.0.0**  
**Author: Kiro AI Assistant**
