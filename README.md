# 5 LP Business - Global Business Directory & Verified Network

A complete, professional global business directory application featuring a responsive **Next.js Web Application**, cross-platform **Flutter Mobile Application (Android & iOS)**, and a **Supabase PostgreSQL backend** with strict Row Level Security (RLS).

---

## 🎨 Color Palette & Branding
- **Navy Blue**: `#0A192F` / `#0F172A` / `#1E293B`
- **Professional Blue**: `#2563EB` / `#1D4ED8` / `#3B82F6`
- **Clean White**: `#FFFFFF` / Slate `#F8FAFC`
- **Accents**: Emerald Green `#10B981` (Verified badge) & Amber `#F59E0B` (Featured badge)

---

## 🌐 Supported Languages
- **English (EN)**
- **Gujarati (ગુજરાતી - GU)**
- **Hindi (हिंदी - HI)**

All pages, navigation menus, filters, industry categories, contact triggers, registration wizards, and admin queues support real-time one-click language switching with persistence.

---

## 📁 Project Architecture

```
5LP-Business/
├── web/                                 # Responsive Next.js 14+ Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Modern Home Page with Hero, Stats, Categories, Featured
│   │   │   ├── directory/page.tsx       # Global Search, Filters (Category, Country, State, City, Sort)
│   │   │   ├── business/[slug]/page.tsx # Profile with Logo, Photos, WhatsApp, Call, Email, Web, Share
│   │   │   ├── register/page.tsx        # Free 4-Step Business Registration Wizard
│   │   │   ├── admin/page.tsx           # Admin Approval/Rejection & Fake Business Reports Audit
│   │   │   ├── favorites/page.tsx       # User Saved Favorites
│   │   │   └── login/page.tsx           # Owner & Consumer Auth with 1-Click Role Switcher
│   │   ├── components/                  # Navbar, Footer, BusinessCard, SearchBar, ShareModal, ReportModal
│   │   ├── context/                     # LanguageContext (EN/GU/HI), AuthContext, FavoritesContext
│   │   ├── lib/                         # Supabase SDK client & Offline Demo Data fallback
│   │   ├── translations/                # Complete EN, GU, HI Dictionaries
│   │   └── types/                       # TypeScript interfaces
│   ├── tests/                           # Automated Test Suite (npx tsx --test tests/app.test.js)
│   └── package.json
├── mobile/                              # Cross-Platform Flutter Mobile App (Android & iOS)
│   ├── lib/
│   │   ├── main.dart                    # App Entry Point & Brand Theme
│   │   ├── l10n/app_translations.dart   # EN, GU, HI Multilingual Localization
│   │   ├── models/                      # Business, Category, Report Data Models
│   │   ├── providers/                   # LocaleProvider, AuthProvider, BusinessProvider
│   │   ├── screens/                     # Home, Explore, Detail, Register, Admin, Favorites, Login
│   │   ├── widgets/                     # BusinessCardWidget, ReportDialogWidget
│   │   └── services/                    # Supabase Flutter Integration & Cache Fallback
│   ├── android/app/src/main/AndroidManifest.xml # Direct Phone, WhatsApp & Web Intent Queries
│   ├── ios/Runner/Info.plist            # LSApplicationQueriesSchemes for tel, whatsapp, mailto
│   ├── pubspec.yaml                     # Dependencies (supabase_flutter, url_launcher, share_plus)
│   └── test/                            # Unit & Model Tests
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql       # Tables, Enums, Foreign Keys & Full-text Search Indexes
        ├── 002_row_level_security.sql   # Secure RLS Policies for Public, Owners, and Admins
        ├── 003_storage_buckets.sql      # Storage Policies for Logos, Covers, and Gallery
        └── 004_seed_data.sql            # Verified Global Demo Businesses (Surat, Dubai, San Jose, London)
```

---

## 🚀 Simple Windows 11 Setup Instructions

### 1. Pre-Requisites
Make sure you have installed on Windows 11:
- **Node.js** (v18.0.0 or higher - v24.21.0 tested & verified)
- **Git for Windows**
- *(Optional for Mobile)*: **Flutter SDK** (v3.0.0+) and Android Studio / VS Code.

---

### 2. Running the Web Application (Next.js)

1. Open PowerShell or Terminal in Windows 11:
   ```powershell
   cd c:\Users\Siya\Downloads\5LP-Business\web
   ```

2. Install dependencies (already audited and pre-configured):
   ```powershell
   npm install
   ```

3. Start the local development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Run the automated test suite:
   ```powershell
   npm test
   ```

6. Build for production:
   ```powershell
   npm run build
   ```

---

### 3. Setting Up Supabase (Backend & PostgreSQL Database)

The application works **immediately out-of-the-box** using built-in realistic demo data fallback. To connect your live Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, go to **SQL Editor** -> **New Query**.
3. Run the SQL migrations in order from `supabase/migrations/`:
   - `001_initial_schema.sql`
   - `002_row_level_security.sql`
   - `003_storage_buckets.sql`
   - `004_seed_data.sql`
4. Copy your project credentials from **Project Settings** -> **API**:
   - `Project URL`
   - `anon public key`
5. In `web/.env.local`, update:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
   NEXT_PUBLIC_DEMO_MODE=false
   ```
6. In `mobile/lib/services/supabase_service.dart`, update `supabaseUrl` and `supabaseAnonKey`.

---

### 4. Running the Flutter Mobile Application (Android & iOS)

> *Note: Environment inspection confirmed Flutter SDK is not currently in system PATH on this PC. Follow these steps when you install Flutter:*

1. Download and extract the Flutter SDK from [flutter.dev](https://docs.flutter.dev/get-started/install/windows) to `C:\src\flutter`.
2. Add `C:\src\flutter\bin` to your Windows 11 `PATH` environment variable.
3. Open PowerShell and navigate to the mobile directory:
   ```powershell
   cd c:\Users\Siya\Downloads\5LP-Business\mobile
   ```
4. Fetch dependencies:
   ```powershell
   flutter pub get
   ```
5. Launch on Android Emulator, Physical Phone, or Windows Desktop:
   ```powershell
   flutter run
   ```
6. Run mobile unit tests:
   ```powershell
   flutter test
   ```

---

## 🛡️ Key Features Overview

| Feature | Description |
|---|---|
| **Modern Home Page** | Navy blue & white corporate branding, animated stats, industry category cards, and handpicked featured global leaders. |
| **Global Directory Search** | Instant multi-faceted filtering by keyword, industry category, subcategory, country (India, US, UK, UAE, etc.), and city. |
| **Business Profiles** | High-res cover banner, company logo, verified badge, full description, operating address, GPS coordinates, and photo gallery. |
| **Direct Contact Launchers** | Single-tap **Phone Call** (`tel:`), **WhatsApp Business** (`wa.me`), **Email** (`mailto:`), and official **Website**. |
| **Free Registration Wizard** | 4-step guided registration workflow for business owners to submit identity, locations, contacts, and images at zero cost. |
| **Admin Dashboard** | Moderation queue to **Approve** or **Reject** pending listings with reason, toggle verified badges, and investigate reports. |
| **Fake Business Reporting** | Community fraud prevention modal allowing users to report suspicious, closed, or impersonating companies directly to admin. |
| **Favorites & Sharing** | Save favorite businesses locally/in database, and share profiles via WhatsApp, Twitter/X, LinkedIn, or native Web Share API. |
| **Row Level Security (RLS)** | Full PostgreSQL RLS policies ensuring only owners can edit their businesses and only verified admins can approve listings. |
| **Multilingual i18n** | Full native support for **English**, **Gujarati (ગુજરાતી)**, and **Hindi (हिंदी)** across both web and mobile platforms. |

---

## 🧪 Verification & Test Results
- **Next.js Production Build**: `npm run build` completed with `9/9` static and dynamic pages generated with zero errors.
- **Multilingual Integrity Test**: `npm test` verified 100% key parity across English, Gujarati, and Hindi dictionaries.
- **Demo Data Verification**: Clearly marked pending listings (`[DEMO] Metro Precision Machining Tools`) and reports for admin workflow testing.
