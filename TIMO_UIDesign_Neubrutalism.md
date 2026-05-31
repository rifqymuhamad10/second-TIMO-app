# TIMO — UI/UX Design Document
### Task & Interaction Management Organizer · Neubrutalism Edition · Senior Developer Perspective
> Disusun sebagai panduan desain teknis untuk pengembangan aplikasi web TIMO (Next.js 14 + Tailwind CSS + Supabase)

---

## 0. Design Rationale — Kenapa Neubrutalism?

Sebagai senior developer, pilihan Neubrutalism bukan sekadar estetika. Ini keputusan strategis:

- **Mudah diimplementasi** — tidak ada gradien kompleks, tidak ada blur, semua flat. Junior dev bisa execute dengan Tailwind.
- **Performa tinggi** — CSS minimal, tidak ada heavy animations.
- **Memorable** — mahasiswa akan ingat aplikasi ini karena berani, bukan karena "cantik seperti semua SaaS lainnya."
- **Konsisten dengan KAK** — antarmuka yang *intuitif, estetis, dan konsisten* sesuai BAB I, dan Neubrutalism justru sangat konsisten karena aturan visualnya ketat.

---

## 1. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-yellow:   #FFEB3B;
  --color-red:      #FF5252;
  --color-blue:     #2196F3;
  --color-green:    #69F0AE;
  --color-bg:       #FFFDF0;   /* Off-white, bukan pure white */
  --color-surface:  #FFFFFF;
  --color-ink:      #1A1A1A;   /* Off-black, bukan pure #000 */
  --color-border:   #1A1A1A;

  /* Priority Colors */
  --priority-high:   #FF5252;  /* Red */
  --priority-medium: #FFEB3B;  /* Yellow */
  --priority-low:    #69F0AE;  /* Green */

  /* Status Colors */
  --status-todo:       #E0E0E0;
  --status-inprogress: #2196F3;
  --status-done:       #69F0AE;

  /* Border & Shadow */
  --border:         3px solid #1A1A1A;
  --shadow:         4px 4px 0px #1A1A1A;
  --shadow-lg:      6px 6px 0px #1A1A1A;
  --shadow-hover:   6px 6px 0px #1A1A1A;
  --radius:         0px;   /* Sharp corners — ciri khas Neubrutalism */

  /* Typography */
  --font-display:   'Space Grotesk', sans-serif;
  --font-body:      'DM Sans', sans-serif;
  --font-mono:      'JetBrains Mono', monospace;

  /* Spacing Base Unit */
  --space:          8px;
}
```

---

## 2. Tipografi

| Level | Font | Weight | Size | Digunakan Untuk |
|---|---|---|---|---|
| Hero | Space Grotesk | 800 | clamp(2.5rem, 5vw, 4rem) | Headline utama halaman |
| H1 | Space Grotesk | 700 | 2rem | Judul halaman |
| H2 | Space Grotesk | 700 | 1.5rem | Section heading |
| H3 | DM Sans | 600 | 1.125rem | Sub-heading / card title |
| Body | DM Sans | 400 | 1rem | Paragraf, deskripsi |
| Label | DM Sans | 600 | 0.875rem | Tag, badge, form label |
| Mono | JetBrains Mono | 400 | 0.875rem | Tanggal, ID, kode |

---

## 3. Komponen UI

### 3.1 Button

```
┌─────────────────────────────┐
│  [ + Tambah Tugas ]         │  ← border 3px, shadow 4px 4px
└─────────────────────────────┘
```

| Variant | Background | Border | Shadow | Use Case |
|---|---|---|---|---|
| **Primary** | `--color-yellow` | 3px ink | 4px 4px ink | Aksi utama (Simpan, Tambah) |
| **Secondary** | `--color-surface` | 3px ink | 4px 4px ink | Aksi sekunder (Batal, Edit) |
| **Danger** | `--color-red` | 3px ink | 4px 4px ink | Hapus, Logout |
| **Ghost** | transparent | 3px ink | none | Navigasi, toggle |

**Behavior:**
- Hover → `translateY(-2px)`, shadow menjadi `6px 6px 0 #1A1A1A`
- Active → `translateY(2px)`, shadow menjadi `2px 2px 0 #1A1A1A` (efek ditekan)
- Transition: `all 150ms ease-out`

---

### 3.2 Task Card

```
┌─────────────────────────────────────────────┐  ← border 3px, shadow 4px 4px
│  [🔴 HIGH]  Basis Data            [● Aktif] │
│                                             │
│  Buat ERD untuk sistem retail               │
│                                             │
│  📚 Basis Data  |  📅 30 Mei 2026           │
│                                             │
│  [✏️ Edit]              [🗑️ Hapus]          │
└─────────────────────────────────────────────┘
```

**Warna background card berdasarkan status:**
- `Belum Dimulai` → `--color-bg` (off-white)
- `Sedang Dikerjakan` → `#E3F2FD` (light blue tint)
- `Selesai` → `#F1F8E9` (light green tint)

**Priority badge:**
- HIGH → background `--color-red`, teks putih, border 2px ink
- MEDIUM → background `--color-yellow`, teks ink, border 2px ink
- LOW → background `--color-green`, teks ink, border 2px ink

**Hover state:** card geser `translateY(-4px)`, shadow menjadi `8px 8px 0 #1A1A1A`

---

### 3.3 Form Input

```
  Judul Tugas *
  ┌──────────────────────────────────────────┐
  │  Tulis judul tugas di sini...            │  ← border 3px
  └──────────────────────────────────────────┘
  
  Focus state → border jadi 3px --color-blue, 
                shadow inner 0 0 0 2px --color-blue
  Error state → border 3px --color-red, 
                teks error di bawah, warna red
```

**Aturan:**
- Label selalu **di atas** input, tidak floating
- Placeholder teks menggunakan warna `#9E9E9E`
- Error message muncul di bawah input dengan ikon ⚠️

---

### 3.4 Badge / Tag Status

```
  [● Belum Dimulai]   [● Sedang Dikerjakan]   [✓ Selesai]
   bg: #E0E0E0          bg: #2196F3 + teks        bg: #69F0AE
                         putih
```

Semua badge: border 2px ink, `font-weight: 600`, `font-size: 0.75rem`, padding `4px 10px`

---

### 3.5 Modal (Add/Edit Task)

```
┌─────────────────────────────────────────────────┐  ← border 3px, shadow 8px 8px
│  TAMBAH TUGAS BARU              [✕]             │  ← header bg: --color-yellow
├─────────────────────────────────────────────────┤
│                                                 │
│  Judul *                                        │
│  ┌─────────────────────────────────────┐        │
│  │                                     │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  Deskripsi                                      │
│  ┌─────────────────────────────────────┐        │
│  │                                     │        │
│  │                                     │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  Mata Kuliah *          Prioritas *             │
│  ┌──────────────┐       ┌──────────────┐        │
│  │ Pilih MK ▾   │       │ MEDIUM ▾    │        │
│  └──────────────┘       └──────────────┘        │
│                                                 │
│  Tenggat Waktu *                                │
│  ┌─────────────────────────────────────┐        │
│  │ 📅 DD / MM / YYYY                   │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│         [Batal]              [Simpan Tugas]     │
└─────────────────────────────────────────────────┘
```

- Backdrop: `rgba(0,0,0,0.5)`, klik backdrop = tutup modal
- Modal muncul dengan animasi `translateY(-20px) → translateY(0)` + `opacity 0 → 1`, 250ms ease-out
- Header modal diberi background `--color-yellow` untuk kejelasan konteks

---

### 3.6 Navbar

```
┌──────────────────────────────────────────────────────────────┐
│  [TI] TIMO        Beranda  |  Tugas  |  Profil     [▼ Rifqy] │
└──────────────────────────────────────────────────────────────┘
```

- Background: `--color-yellow`
- Border bawah: `3px solid #1A1A1A`
- Logo "TI" di dalam kotak dengan border 3px + shadow 3px 3px
- Active nav item: underline tebal 3px bawah warna ink
- User menu: dropdown dengan border 3px + shadow

---

### 3.7 Empty State

```
          ┌─────────────────────────────────┐
          │                                 │
          │    [ ilustrasi clipboard ]      │
          │                                 │
          │   Belum ada tugas nih!          │
          │   Yuk, tambahkan tugas          │
          │   pertamamu sekarang.           │
          │                                 │
          │   [ + Tambah Tugas Pertama ]    │
          │                                 │
          └─────────────────────────────────┘
```

Ilustrasi menggunakan inline SVG bergaya flat & bold, bukan gambar eksternal.

---

### 3.8 Skeleton Loading

```
  ┌──────────────────────────┐
  │  ████████░░░░░   ░░░░░  │  ← shimmer animation (CSS only)
  │                          │
  │  ░░░░░░░░░░░░░░░░░░░░░  │
  │  ░░░░░░░░░░░░            │
  │                          │
  │  ░░░░░░  |  ░░░░░░░░░   │
  └──────────────────────────┘
```

Tidak ada spinner. Skeleton menyesuaikan dimensi card aktual.

---

## 4. Halaman-Halaman

### 4.1 Landing Page / Halaman Login

**Layout: Split-screen (Desktop)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ NAVBAR: [TI] TIMO                                               │
├────────────────────────────────┬────────────────────────────────────┤
│                                │                                    │
│  SELAMAT DATANG                │   ┌──────────────────────────┐    │
│  DI TASKMATE.                  │   │  MASUK KE AKUNMU         │    │  ← form box
│                                │   │                          │    │  border 3px
│  Atur tugas kuliah             │   │  Email *                 │    │  shadow 6px 6px
│  kamu dalam satu               │   │  ┌────────────────────┐  │    │  bg: white
│  tempat yang rapi              │   │  │                    │  │    │
│  dan terstruktur.              │   │  └────────────────────┘  │    │
│                                │   │                          │    │
│  [Daftar Sekarang]             │   │  Password *              │    │
│                                │   │  ┌────────────────────┐  │    │
│                                │   │  │                    │  │    │
│  ──────────────────            │   │  └────────────────────┘  │    │
│                                │   │                          │    │
│  ✓ Gratis untuk mahasiswa      │   │  [Masuk]                 │    │
│  ✓ Data tersimpan di cloud     │   │                          │    │
│  ✓ Akses dari mana saja        │   │  Belum punya akun?       │    │
│                                │   │  [Daftar di sini]        │    │
│                                │   └──────────────────────────┘    │
│                                │                                    │
└────────────────────────────────┴────────────────────────────────────┘
```

**Background kiri:** `--color-yellow` dengan pola dot grid subtle menggunakan SVG pattern.

---

### 4.2 Halaman Register

Sama dengan Login, bedanya form memiliki field: Nama, Email, Password, Konfirmasi Password.

Tambahan: tombol **"Daftar dengan Google"** menggunakan Supabase OAuth → styling dengan border 3px, icon Google SVG inline.

---

### 4.3 Dashboard Utama (Setelah Login)

**Layout: Sidebar + Main Content**

```
┌──────────────────────────────────────────────────────────────────────┐
│ NAVBAR (kuning, border bawah 3px)                                    │
├──────────────────┬───────────────────────────────────────────────────┤
│                  │                                                   │
│  SIDEBAR         │  MAIN CONTENT                                     │
│  ──────────      │                                                   │
│  [📋] Semua      │  Halo, Rifqy! 👋                                  │
│  [⏳] Aktif      │  Kamu punya 3 tugas yang deadline minggu ini.     │
│  [✓] Selesai     │                                                   │
│  [🔥] Prioritas  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│                  │  │ Total    │ │ Aktif    │ │ Selesai          │  │
│  ──────────      │  │  12      │ │   5      │ │   7              │  │
│                  │  │ Tugas    │ │ Tugas    │ │ Tugas            │  │
│  FILTER          │  └──────────┘ └──────────┘ └──────────────────┘  │
│  ──────────      │              ↑ stat cards, border 3px             │
│  Status:         │                                                   │
│  ○ Semua         │  ┌─────────────────────────────────────────────┐  │
│  ○ Aktif         │  │ FILTER BAR                                  │  │
│  ○ Selesai       │  │  [Semua] [Belum Dimulai] [Aktif] [Selesai]  │  │
│                  │  │  Mata Kuliah: [Semua ▾]  Sort: [Deadline ▾] │  │
│  Prioritas:      │  └─────────────────────────────────────────────┘  │
│  ○ Semua         │                                                   │
│  ○ Tinggi        │  ┌─────────────────────┐  ┌─────────────────┐    │
│  ○ Sedang        │  │ TASK CARD           │  │ TASK CARD       │    │
│  ○ Rendah        │  │ [🔴 HIGH]  RPL      │  │ [🟡 MED]  BD    │    │
│                  │  │ Buat Use Case...    │  │ ERD Retail      │    │
│  Mata Kuliah:    │  │ 📅 28 Mei 2026      │  │ 📅 30 Mei 2026  │    │
│  □ RPL           │  │ [Edit] [Hapus]      │  │ [Edit] [Hapus]  │    │
│  □ Basis Data    │  └─────────────────────┘  └─────────────────┘    │
│  □ PBO           │                                                   │
│  □ ...           │             [ + Tambah Tugas Baru ]               │
│                  │                                                   │
└──────────────────┴───────────────────────────────────────────────────┘
```

**Stat cards:** tiga kotak dengan border 3px + shadow 4px 4px, masing-masing berwarna berbeda (kuning, biru, hijau).

---

### 4.4 Halaman Profil

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │  PROFIL SAYA                                      │    │  ← border 3px
│   │                                                   │    │  shadow 6px 6px
│   │    [  R  ]   ← avatar kotak inisial, bg kuning    │    │
│   │                                                   │    │
│   │    Rifqy Muhammad I                               │    │
│   │    rifqy@example.com                              │    │
│   │    Mahasiswa · UIN SGD Bandung                    │    │
│   │                                                   │    │
│   │    [ Edit Profil ]                                │    │
│   └───────────────────────────────────────────────────┘    │
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │  STATISTIK TUGAS                                  │    │
│   │                                                   │    │
│   │  Total: 24    Selesai: 17    Completion: 70%      │    │
│   │                                                   │    │
│   │  ████████████████░░░░░░░░  70%  ← progress bar   │    │
│   └───────────────────────────────────────────────────┘    │
│                                                             │
│                        [ Keluar ]   ← btn danger (merah)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Layout & Grid System

### Desktop (≥ 1024px)
- Navbar: full width, `height: 64px`
- Sidebar: `width: 240px`, fixed, border kanan 3px
- Main content: `flex: 1`, padding `24px 32px`
- Task grid: CSS Grid, `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`, gap `16px`
- Max-width container: `1280px`, centered

### Tablet (768px – 1023px)
- Sidebar collapse menjadi toggle drawer
- Task grid: 2 kolom
- Navbar: hamburger menu muncul

### Mobile (< 768px)
- Sidebar: drawer dari kiri, overlay backdrop
- Task grid: 1 kolom, full width
- FAB (Floating Action Button): `[ + ]` di kanan bawah, posisi fixed
- Bottom navigation bar menggantikan sidebar

---

## 6. Micro-interactions & Motion

| Elemen | Interaksi | Animasi | Durasi |
|---|---|---|---|
| Button | Hover | translateY(-2px), shadow grow | 150ms ease-out |
| Button | Active/Click | translateY(2px), shadow shrink | 100ms ease-out |
| Task Card | Hover | translateY(-4px), shadow grow | 200ms ease-out |
| Modal | Open | translateY(-20px)→0, opacity 0→1 | 250ms ease-out |
| Modal | Close | opacity 1→0, scale 1→0.95 | 200ms ease-in |
| Sidebar Link | Active | left border 4px kuning muncul | instant |
| Input | Focus | border color berubah ke biru | 150ms |
| Filter Button | Active | background berubah ke kuning | instant |
| Task status | Toggle | card bg berubah warna | 300ms ease |
| Page entry | Load | stagger cards: fade + translateY(16px→0) | 80ms per card |

**Performance rule:** hanya animasikan `transform` dan `opacity`. Tidak ada animasi `height`, `width`, atau `margin`.

---

## 7. Warna per Konteks

| Konteks | Background Card | Badge | Aksen |
|---|---|---|---|
| Mata kuliah RPL | `#FFFDE7` (yellow tint) | kuning | `#F9A825` |
| Mata kuliah Basis Data | `#E3F2FD` (blue tint) | biru | `#1565C0` |
| Mata kuliah PBO | `#FCE4EC` (pink tint) | merah | `#C62828` |
| Mata kuliah Sistem Operasi | `#E8F5E9` (green tint) | hijau | `#2E7D32` |
| Mata kuliah lainnya | `--color-bg` | abu | `#616161` |

> Catatan implementasi: Warna per mata kuliah bisa di-generate secara deterministik dari nama MK menggunakan hash string → hue, sehingga konsisten tanpa hardcode.

---

## 8. Aksesibilitas (a11y)

- Semua warna memenuhi **WCAG AA** kontras minimum (4.5:1 untuk teks body)
- Semua button dan input memiliki `aria-label` yang jelas
- Modal meng-trap focus (focus trap) selama terbuka
- Keyboard navigasi penuh: Tab, Enter, Escape (tutup modal)
- Semua badge status memiliki teks + tidak hanya bergantung warna
- Skip-to-content link di paling awal markup
- Form error bersifat `role="alert"` agar screen reader mengumumkannya

---

## 9. Naming Convention (Tailwind Classes)

Karena proyek menggunakan Tailwind CSS, semua token di atas perlu dikonfigurasi di `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'nb-yellow':  '#FFEB3B',
        'nb-red':     '#FF5252',
        'nb-blue':    '#2196F3',
        'nb-green':   '#69F0AE',
        'nb-bg':      '#FFFDF0',
        'nb-ink':     '#1A1A1A',
      },
      boxShadow: {
        'nb':    '4px 4px 0px #1A1A1A',
        'nb-lg': '6px 6px 0px #1A1A1A',
        'nb-xl': '8px 8px 0px #1A1A1A',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderWidth: {
        'nb': '3px',
      }
    }
  }
}
```

---

## 10. Komponen Priority — Urutan Implementasi

Berikut urutan build yang disarankan agar anggota tim bisa paralel bekerja:

```
Sprint 1 (Pondasi)
  ├── Design tokens (tailwind.config.js)
  ├── Button (primary, secondary, danger)
  ├── Input + Label + Error text
  ├── Badge (status + priority)
  └── Navbar

Sprint 2 (Halaman Inti)
  ├── Landing + Login page
  ├── Register page
  ├── Task Card component
  └── Empty State

Sprint 3 (Dashboard)
  ├── Dashboard layout (sidebar + main)
  ├── Stat cards
  ├── Filter bar
  ├── Task grid
  └── Modal (Add/Edit)

Sprint 4 (Polish)
  ├── Profil page
  ├── Skeleton loading
  ├── Mobile responsiveness
  ├── Micro-animations
  └── a11y audit
```

---

## 11. Anti-Pattern yang WAJIB Dihindari

| ❌ Jangan | ✅ Lakukan |
|---|---|
| Menggunakan gradien apapun | Flat color sepenuhnya |
| Border-radius lebih dari 4px | `border-radius: 0` atau maks `4px` |
| Shadow dengan blur (`box-shadow: 0 4px 12px rgba...`) | Hard offset shadow `4px 4px 0 #1A1A1A` |
| Warna abu-abu muted untuk badge | Warna saturasi tinggi dengan border ink |
| Animasi yang men-trigger layout (height, margin) | Hanya `transform` dan `opacity` |
| Font Inter, Roboto, atau Arial | Space Grotesk + DM Sans |
| Pure black `#000000` | Off-black `#1A1A1A` |
| Skeleton spinner bulat | Shimmer bar/rectangle |
| Placeholder teks yang redundan | Placeholder informatif dan ringkas |
| Emoji sebagai ikon UI | Lucide React icon library |

---

## 12. File Structure yang Disarankan

```
/components
  /ui
    Button.tsx
    Badge.tsx
    Input.tsx
    Modal.tsx
    Skeleton.tsx
  /layout
    Navbar.tsx
    Sidebar.tsx
    MobileNav.tsx
  /tasks
    TaskCard.tsx
    TaskGrid.tsx
    TaskForm.tsx
    FilterBar.tsx
    StatCard.tsx
    EmptyState.tsx
/styles
  globals.css      ← CSS variables & base styles
/lib
  colors.ts        ← fungsi generate warna per MK

```

---

*Dokumen ini adalah living document — perbarui setiap sprint saat ada keputusan desain baru. Semua keputusan di sini bersifat binding untuk seluruh anggota Kelompok 02.*

---
**TIMO · Kelompok 02 · RPL · UIN Sunan Gunung Djati Bandung · 2026**
