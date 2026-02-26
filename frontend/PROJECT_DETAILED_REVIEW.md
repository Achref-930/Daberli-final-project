# Daberli — Project Detailed Review
> Last reviewed: February 23, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Page-by-Page Breakdown](#4-page-by-page-breakdown)
5. [Component Breakdown](#5-component-breakdown)
6. [Data & State Architecture](#6-data--state-architecture)
7. [Routing](#7-routing)
8. [Styling System](#8-styling-system)
9. [Critical Issues](#9-critical-issues)
10. [High Severity Issues](#10-high-severity-issues)
11. [Medium Severity Issues](#11-medium-severity-issues)
12. [Low Severity Issues](#12-low-severity-issues)
13. [Dead Code](#13-dead-code)
14. [Issue Summary Table](#14-issue-summary-table)
15. [Recommended Action Plan](#15-recommended-action-plan)

---

## 1. Project Overview

**Daberli** is an Algerian classifieds / marketplace web application. It allows users to browse, search, and post ads across four categories:

| Category | Route | Description |
|---|---|---|
| Vehicle (Auto) | `/auto` | Cars, trucks, and transport rentals |
| Real Estate | `/real-estate` | Apartments, villas, studios |
| Jobs | `/jobs` | Career opportunities across 58 wilayas |
| Services | `/services` | Verified professionals (plumbers, electricians, etc.) |

The platform includes:
- A **Wilaya-based** (Algerian province) location filter covering all 58 wilayas
- **Admin moderation** — admins approve or reject submitted ads before they are visible
- **Boosted / Featured listings** — admin-promoted ads shown on the home page
- **Messaging system** — buyers can message ad owners; owners can reply in-thread
- **User profiles** with ad stats and mock reviews
- **Settings page** with notification, appearance, language, security, and account management sections

---

## 2. Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | ^19.2.4 | UI framework |
| TypeScript | ~5.8.2 | Static typing |
| Vite | ^6.2.0 | Build tool & dev server |
| React Router DOM | ^7.13.0 | Client-side routing |
| Tailwind CSS | ^4.2.0 | Utility-first styling |
| @tailwindcss/vite | ^4.2.0 | Tailwind v4 Vite plugin |
| Lucide React | ^0.572.0 | Icon library |
| @vitejs/plugin-react | ^5.0.0 | React fast refresh |

**No backend.** All data is in-memory (React state + `MOCK_ADS` constant). No database, no API calls, no authentication backend.

---

## 3. Project Structure

```
daberli-1.6-main/
├── App.tsx                     # Root app, all global state, routing
├── constants.ts                # WILAYAS array (58), MOCK_ADS seed data
├── types.ts                    # TypeScript interfaces (User, Ad, AdMessage, Wilaya, etc.)
├── index.css                   # Tailwind import + custom theme tokens + utility classes
├── index.tsx                   # React DOM entry point
├── index.html                  # HTML shell
├── vite.config.ts              # Vite config (port 3000, Tailwind, path alias)
├── tsconfig.json               # TypeScript config
├── metadata.json               # Project metadata
├── package.json                # Dependencies & scripts
│
├── components/
│   ├── AuthModal.tsx           # Sign-in modal (email + password, mock auth)
│   ├── PostAdModal.tsx         # Post new ad modal (multi-field form)
│   ├── Navbar.tsx              # Sticky top nav, multi-variant (default/auto/real-estate/jobs/services)
│   ├── Hero.tsx                # Home hero section with animated text + category links
│   ├── Footer.tsx              # Site footer
│   ├── FloatingActionBar.tsx   # Mobile bottom bar (Home, Saved, Post, Search, Profile)
│   ├── ServiceCard.tsx         # Generic ad card used on Home page
│   ├── ServiceGrid.tsx         # ⚠️ DEAD — Category grid, never used
│   └── cards/
│       ├── AutoCard.tsx        # Ad card for Vehicle listings
│       ├── JobCard.tsx         # Ad card for Job listings
│       ├── RealEstateCard.tsx  # Ad card for Real Estate listings
│       └── ServiceCard.tsx     # Ad card for Services listings (note: duplicate name vs parent)
│
└── pages/
    ├── HomePage.tsx            # Home: featured/boosted ads + trust sections
    ├── AutoPage.tsx            # Vehicle listings with search bar + Navbar variant
    ├── RealEstatePage.tsx      # Real Estate listings
    ├── JobsPage.tsx            # Job listings
    ├── ServicesPage.tsx        # Services listings
    ├── AdminPage.tsx           # ⚠️ CORRUPTED FILE — Admin moderation panel
    ├── MyAdsPage.tsx           # Authenticated: user's own ads + reply to messages
    ├── MessagesPage.tsx        # Authenticated: inbox of all buyer conversations
    ├── ProfilePage.tsx         # Authenticated: profile card, ad stats, mock reviews
    ├── SettingsPage.tsx        # Authenticated: notifications, appearance, security, account
    └── CategoryPage.tsx        # ⚠️ DEAD — Generic category page, never routed
```

---

## 4. Page-by-Page Breakdown

### 4.1 HomePage (`/`)
- Renders `<Navbar>` (default white variant) + `<Hero>` + Featured Listings + Trust Bar + Trust Cards + `<Footer>` + `<FloatingActionBar>`
- **Featured Listings**: filters `ads` by `isBoosted === true` and renders them in a 4-column grid using `<ServiceCard>`
- If no boosted ads, shows an empty state with a Zap icon
- `<Hero>` has an animated rotating text effect every 2.5s cycling through: `"what you need"`, `"Vehicle"`, `"Real Estate"`, `"Jobs"`, `"Services"`
- **Issue**: `onPostAdSubmit` is in `sharedProps` but not declared in `HomePageProps` — silently dropped

### 4.2 AutoPage (`/auto`)
- Dark `bg-slate-900` hero with dot-pattern SVG background
- Uncontrolled search bar (no state, no filtering) — **non-functional**
- Filters `ads` by `category === 'auto'` and selected wilaya
- Renders `<AutoCard>` for each result
- Uses Navbar `variant="auto"` (dark slate theme with red accent)

### 4.3 RealEstatePage (`/real-estate`)
- Emerald-themed Navbar variant
- Filters ads by `category === 'real-estate'`
- Renders `<RealEstateCard>` for each result

### 4.4 JobsPage (`/jobs`)
- Blue-themed Navbar variant
- Filters ads by `category === 'jobs'`
- Renders `<JobCard>` for each result

### 4.5 ServicesPage (`/services`)
- Violet-themed Navbar variant
- Filters ads by `category === 'services'`
- Renders `cards/ServiceCard` for each result

### 4.6 AdminPage (`/admin`)
- Accessible only to users whose email is in `ADMIN_EMAILS = ['admin@daberli.dz']`
- Non-admin users see an "Admin Access Required" block with a `ShieldAlert` icon
- Shows count of `pending` ads in an amber pill badge
- Each pending ad card has Approve (`onApproveAd`) and Reject (`onRejectAd`) buttons
- **No way to boost/unboost ads** — the core `isBoosted` feature is admin-only but missing from the admin UI
- **File is corrupted** — top of file contains orphaned SettingsPage code stubs

### 4.7 MyAdsPage (`/my-ads`)
- Requires authentication (shows guard ui if `!user`)
- Filters `ads` where `ad.postedByUserId === user.id`
- Shows each ad's approval status badge (approved / pending / rejected)
- Displays buyer messages per ad with a reply input
- `handleReplySubmit` delegates to `onSendReply` from App state

### 4.8 MessagesPage (`/messages`)
- Requires authentication
- Computes threads by finding all user's ads that have messages
- Sorts threads by last message ID (semantically wrong — should use timestamp)
- Shows the full conversation UI with same reply mechanism as MyAdsPage
- Uses `useMemo` for thread derivation — good performance practice

### 4.9 ProfilePage (`/profile`)
- Requires authentication
- Shows avatar, name, email, ad stats (approved / pending / rejected counts)
- Inline name editing: pencil button → text input → Save / Cancel
- **Mock reviews** (`MOCK_REVIEWS`) are hardcoded and always shown for any logged-in user — not tied to real ad data
- Links to `/my-ads` and `/settings`

### 4.10 SettingsPage (`/settings`)
- Largest file in the project (826 lines)
- Requires authentication
- Well-structured with reusable `<Section>`, `<Row>`, `<Toggle>`, `<ComingSoonBadge>` helper components defined inline
- Contains: `<ConfirmModal>` and `<ChangePasswordModal>` as internal sub-components
- Sections:
  - **Account** — email display, change password (mini modal), phone (coming soon)
  - **Notifications** — push, email, SMS toggles (all local state, not persisted)
  - **Appearance** — light/dark/system theme toggle (local state only, no actual theme switching)
  - **Language & Region** — language select (local state), Wilaya select (writes to parent via `onWilayaChange`)
  - **Privacy & Security** — profile visibility, 2FA (coming soon), data export (coming soon)
  - **Danger Zone** — Deactivate Account (confirm modal) and Delete Account (confirm modal), both are no-ops

---

## 5. Component Breakdown

### 5.1 Navbar (`components/Navbar.tsx`) — 430 lines
- **Multi-variant**: `default` (white), `auto` (dark slate), `real-estate` (dark emerald), `jobs` (dark blue), `services` (dark violet)
- Static `THEMES` map defined at module level — no re-creation on render ✅
- Memoized `navLinks` array (includes Admin Panel link if `user.isAdmin`) ✅
- Memoized `filteredWilayas` list with text search ✅
- `useClickOutside` custom hook for wilaya dropdown and user dropdown ✅
- Features: Wilaya selector pill, search toggle (navigates to `/?q=...`), user avatar dropdown, mobile hamburger menu
- Back arrow shown on dark variants and when `showBackButton` is true
- **Issue**: search navigates with `q` param but no page reads it

### 5.2 AuthModal (`components/AuthModal.tsx`) — 149 lines
- Email + password form with 1.5s simulated API delay
- Calls `onSignIn(email)` — password is never validated (it's all mock)
- **Pre-filled credentials**: `user@daberli.dz` / `password` — visible in source

### 5.3 PostAdModal (`components/PostAdModal.tsx`) — 301 lines
- Fields: Title, Category, Wilaya, Price, Currency (DZD / EUR / USD), Description, Image upload
- Image upload creates a blob URL with `URL.createObjectURL()`
- 1.5s simulated submission delay with loading spinner
- **`useEffect` cleanup bug**: revokes blob URL on every image change, not just unmount
- `onSubmit` typed as `(adData: any)` — lacks proper type

### 5.4 Hero (`components/Hero.tsx`)
- Animated rotating text built with `setInterval` in `useEffect`
- Category quick-links using `<Link>` to each route
- **Duplicate subtitle** on Vehicle card (`"Vehicle"` shown twice)
- Background uses `hero-dot-pattern` CSS class (Tailwind `@theme` in `index.css`)

### 5.5 FloatingActionBar (`components/FloatingActionBar.tsx`)
- Mobile-only (`md:hidden`) bottom navigation bar
- 5 buttons: Home, Saved, Post (prominent green pill), Search, Profile
- **"Saved" and "Search" buttons have no `onClick` handler** — completely non-functional

### 5.6 ServiceCard (`components/ServiceCard.tsx`)
- Generic card used on the home page for boosted ads
- Renders ad image, title, location, price, verified badge, boosted badge

### 5.7 Cards (`components/cards/`)
- **AutoCard**: Shows mileage, fuel type, transmission, year — reads `ad.details.mileage`, `ad.details.fuelType`, etc., but mock data uses keys `Year` and `Fuel` (different casing) — always shows fallback values
- **JobCard**: Job-specific card design
- **RealEstateCard**: Real estate card with area/floor details
- **cards/ServiceCard**: Service-specific card (distinct from `components/ServiceCard.tsx` — naming collision)

---

## 6. Data & State Architecture

### 6.1 Global State (App.tsx)
All state lives in `AppContent` component:

```
ads: Ad[]                          — all ads (mock + user-submitted)
adMessages: Record<string, AdMessage[]>  — messages keyed by ad ID
user: User | null                  — authenticated user
isAuthModalOpen: boolean
isPostAdModalOpen: boolean
selectedWilaya: string             — global wilaya filter
activeCategory: Category | 'all'   — home category filter (currently unused)
```

### 6.2 Data Flow
```
App (state owner)
  ↓ props drilling
  Pages → Components
```
No context, no Redux, no Zustand. Pure prop drilling throughout. Acceptable at current scale, but will become painful when the component tree deepens.

### 6.3 Ad Visibility Logic
```typescript
const visibleAds = ads.filter((ad) => {
  if (ad.approvalStatus === 'approved') return true;
  if (!user) return false;
  return ad.postedByUserId === user.id; // owners see their own pending/rejected ads
});
```
The admin page always receives the full `ads` array (not `visibleAds`), so it can moderate pending items.

### 6.4 Types (`types.ts`)

| Type | Description |
|---|---|
| `Category` | `'auto' \| 'real-estate' \| 'jobs' \| 'services'` |
| `ApprovalStatus` | `'pending' \| 'approved' \| 'rejected'` |
| `User` | `id, name, email, avatar?, isAdmin?` |
| `Ad` | Full ad model with `details: Record<string, string \| number>` |
| `AdMessage` | Message with `senderRole: 'buyer' \| 'owner'` |
| `Wilaya` | `code, name, ar_name?` |
| `NavItem` | `label, href` — declared but not used anywhere |

---

## 7. Routing

Configured in `App.tsx` with `<BrowserRouter>`:

| Route | Component | Auth Required |
|---|---|---|
| `/` | HomePage | No |
| `/auto` | AutoPage | No |
| `/real-estate` | RealEstatePage | No |
| `/jobs` | JobsPage | No |
| `/services` | ServicesPage | No |
| `/admin` | AdminPage | Admin only (guarded by UI, not redirect) |
| `/my-ads` | MyAdsPage | Yes (guarded by UI) |
| `/messages` | MessagesPage | Yes (guarded by UI) |
| `/profile` | ProfilePage | Yes (guarded by UI) |
| `/settings` | SettingsPage | Yes (guarded by UI) |
| `*` (any other) | **Nothing — no 404 route** | — |

`<ScrollToTop>` component inside `BrowserRouter` scrolls to top on every route change using `useLocation`. ✅

All auth guards are UI-only (show a locked state screen) — there is no actual redirect or route protection.

---

## 8. Styling System

### 8.1 Tailwind v4 Configuration
Tailwind v4 uses `@theme` in CSS instead of `tailwind.config.js`. Custom tokens defined in `index.css`:

```css
@theme {
  --color-daberli-blue: #1E3A8A;    /* Deep blue — primary brand color */
  --color-daberli-green: #10B981;   /* Emerald green — CTA / verified badges */
  --color-daberli-light: #F3F4F6;   /* Light gray background */
  --spacing-safe-pb: env(safe-area-inset-bottom);
}
```

### 8.2 Custom Classes
| Class | Purpose |
|---|---|
| `.safe-area-pb` | iOS-safe bottom padding for FloatingActionBar |
| `.hero-dot-pattern` | Radial dot background on the Hero section |

### 8.3 Navbar Theme System
The Navbar uses a static `THEMES` map (5 variants) — enables category pages to have distinct color identities (auto = dark red, real-estate = dark green, jobs = dark blue, services = dark violet) without any runtime computation.

---

## 9. Critical Issues

### 🔴 C1 — AdminPage.tsx is corrupted
**File:** `pages/AdminPage.tsx`

The file begins with orphaned, incomplete `SettingsPage` code fragments containing `// ...existing code...` placeholder comments — residue from a failed automated edit. This is followed by the actual `AdminPage` implementation. The file likely causes TypeScript parse errors or runtime import issues.

**Fix:** Remove all code before the `import { CheckCircle2, Clock3...` line (around line 55). The AdminPage logic itself appears intact from that point.

---

### 🔴 C2 — No 404 fallback route
**File:** `App.tsx`

Any unrecognized URL renders a completely blank page with no navigation or feedback to the user.

**Fix:**
```tsx
// Add inside <Routes> in App.tsx
<Route path="*" element={<NotFoundPage />} />
```

---

## 10. High Severity Issues

### 🟠 H1 — Search is non-functional end-to-end

**Files:** `App.tsx`, `pages/AutoPage.tsx`, `components/Navbar.tsx`

- The Navbar search fires `navigate('/?q=...')` but no page reads the `q` query param
- `AutoPage` (and other category pages) have a visible search `<input>` with no `value`, no `onChange`, and no filtering logic — it accepts typing but does nothing
- `handleSearch` in App navigates to a category route but ignores the query string entirely

**Fix:** Read `useSearchParams()` in each category page, apply the `q` param as a filter on `ads`.

---

### 🟠 H2 — No admin UI to boost ads

**File:** `pages/AdminPage.tsx`

The Featured Listings section on the home page is entirely driven by `ad.isBoosted`, which is only set on 2 hardcoded mock ads. An admin has no way to boost or unboost any listing through the UI. The admin panel only exposes Approve / Reject.

**Fix:** Add a "Boost" toggle button in each ad card on the AdminPage, and wire an `onBoostAd(adId, boolean)` handler through App state.

---

### 🟠 H3 — FloatingActionBar has 2 dead buttons

**File:** `components/FloatingActionBar.tsx`

"Saved" and "Search" buttons render correctly but have no `onClick` handlers. Tapping them does nothing.

**Fix:** Either implement the features (a Saved/Favorites system, a search drawer) or add `onSearch` / `onSaved` props and handle them, or visually mark them as coming soon.

---

## 11. Medium Severity Issues

### 🟡 M1 — `adData: any` — weak type safety

**Files:** `App.tsx` (`handlePostAdSubmit`), `components/PostAdModal.tsx` (`onSubmit`)

Using `any` bypasses TypeScript and makes refactoring risky.

**Fix:** Define a `PostAdFormData` interface in `types.ts` and use it:
```typescript
export interface PostAdFormData {
  title: string;
  category: Category;
  price: number;
  currency: string;
  location: string;
  image: string;
  description: string;
}
```

---

### 🟡 M2 — PostAdModal blob URL cleanup fires on every image change

**File:** `components/PostAdModal.tsx` (lines 24–28)

```typescript
// Current — WRONG: cleanup fires every time formData.image changes
useEffect(() => {
  return () => {
    if (formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
  };
}, [formData.image]);
```

The cleanup returned from `useEffect` runs before the next effect — meaning every time the user changes the image, the *current* blob URL is revoked before the new one is set, potentially breaking the preview.

**Fix:** Use a `useRef` to track the previous URL and only revoke it when replaced, or revoke only on unmount.

---

### 🟡 M3 — Pre-filled auth credentials visible in source

**File:** `components/AuthModal.tsx`

```typescript
const [email, setEmail] = useState('user@daberli.dz');
const [password, setPassword] = useState('password');
```

While the app is a frontend mock, these credentials are hardcoded in source. In any accidental build deployment, these are exposed.

**Fix:** Initialize both fields with empty strings: `useState('')`.

---

### 🟡 M4 — User ID always hardcoded as `'u123'`

**File:** `App.tsx` (`handleSignIn`)

Every user who signs in receives `id: 'u123'`. If the app ever gains real multi-user support, all users' ads would be mixed together.

---

### 🟡 M5 — Messages sorted by ID string, not by timestamp

**File:** `pages/MessagesPage.tsx` (line ~68)

```typescript
// Sorts by ID string — coincidentally may work for sequential IDs but semantically wrong
return bLast.localeCompare(aLast);
```

**Fix:** Add a proper `timestamp` field to `AdMessage` and sort by it.

---

### 🟡 M6 — AutoCard detail key mismatch with mock data

**File:** `components/cards/AutoCard.tsx`

The card reads: `ad.details?.mileage`, `ad.details?.fuelType`, `ad.details?.transmission`, `ad.details?.year`

The mock auto ad in `constants.ts` provides: `{ Year: 2019, Fuel: 'Essence' }`

Keys are different casings and names. AutoCard always falls through to hardcoded defaults (`'N/A'`, `'Gas'`, `'Manual'`, `'2020'`).

**Fix:** Standardize detail keys between mock data and card components. Either use consistent camelCase keys or use a typed `details` schema per category.

---

### 🟡 M7 — Mock reviews always shown regardless of user

**File:** `pages/ProfilePage.tsx`

`MOCK_REVIEWS` (3 hardcoded review objects) are rendered for every logged-in user, not just the specific mock user `u123`. Makes the profile feel fake for any real user scenario.

---

### 🟡 M8 — Settings changes are not persisted

**File:** `pages/SettingsPage.tsx`

All settings toggles (dark mode, notifications, language, etc.) are local component state. They reset on navigation or page refresh. No connection to `onUpdateUser` for persistence, no `localStorage`.

---

## 12. Low Severity Issues

### 🟢 L1 — `onPostAdSubmit` silently dropped in HomePage

**Files:** `App.tsx`, `pages/HomePage.tsx`

`sharedProps` in App includes `onPostAdSubmit: handlePostAdSubmit`, which is spread into `<HomePage>`. But `HomePageProps` doesn't declare this prop, so TypeScript would warn (depending on strict settings) and the prop is never accessible inside the component.

---

### 🟢 L2 — Hero Vehicle card has duplicate subtitle

**File:** `components/Hero.tsx`

```tsx
<p className="text-sm font-semibold text-gray-900 truncate">Vehicle</p>
<p className="text-xs text-gray-400 truncate">Vehicle</p>  {/* Should be descriptive */}
```

**Fix:** Change the subtitle to something like `"Cars & trucks"`.

---

### 🟢 L3 — Admin route should redirect, not just show gated UI

**File:** `pages/AdminPage.tsx`

Non-admin users see a "Admin Access Required" screen. Best practice is to redirect non-admins:
```tsx
if (!user?.isAdmin) return <Navigate to="/" replace />;
```

---

### 🟢 L4 — `GEMINI_API_KEY` wired in vite.config.ts with no AI feature

**File:** `vite.config.ts`

```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
},
```

No AI/Gemini feature exists anywhere in the codebase. This exposes an API key in the client bundle if the `.env` file is present.

**Fix:** Remove these `define` entries unless AI features are being added.

---

### 🟢 L5 — `NavItem` type declared but never used

**File:** `types.ts`

```typescript
export interface NavItem {
  label: string;
  href: string;
}
```

This interface is exported but imported nowhere.

---

### 🟢 L6 — `activeCategory` state declared in App but never written after init

**File:** `App.tsx`

`setActiveCategory` is passed to `HomePage` but HomePage never calls it — the category selector in the Hero is a `<Link>` that navigates away, not a state setter. The `activeCategory` state is effectively always `'all'`.

---

### 🟢 L7 — `onPostAdSubmit` prop passed to HomePage but not in HomePageProps interface

**Files:** `App.tsx`, `pages/HomePage.tsx`

`sharedProps` spreads `onPostAdSubmit` which HomePage doesn't declare in its interface, making the spread either harmless (if TypeScript is lenient) or a type error in strict mode.

---

## 13. Dead Code

| File | Lines | Why Dead |
|---|---|---|
| `pages/CategoryPage.tsx` | 137 | Fully implemented but never imported or routed. Superseded by individual `AutoPage`, `RealEstatePage`, etc. |
| `components/ServiceGrid.tsx` | 77 | Complete component, never imported by any page or component. Superseded by the Hero category links. |
| `types.ts` — `NavItem` | 4 | Interface declared, never imported or used. |
| `vite.config.ts` — `GEMINI_API_KEY` | 2 | API key config for AI feature that doesn't exist in this codebase. |

---

## 14. Issue Summary Table

| # | File | Issue | Severity |
|---|---|---|---|
| C1 | `pages/AdminPage.tsx` | File corrupted with orphaned SettingsPage code stubs at top | 🔴 Critical |
| C2 | `App.tsx` | No 404 fallback route — blank page on unknown URLs | 🔴 Critical |
| H1 | `App.tsx`, `AutoPage.tsx`, `Navbar.tsx` | Search completely non-functional end-to-end | 🟠 High |
| H2 | `pages/AdminPage.tsx` | No admin UI to boost/unboost ads | 🟠 High |
| H3 | `components/FloatingActionBar.tsx` | "Saved" and "Search" buttons have no onClick handler | 🟠 High |
| M1 | `App.tsx`, `PostAdModal.tsx` | `adData: any` bypasses type safety | 🟡 Medium |
| M2 | `components/PostAdModal.tsx` | useEffect blob URL cleanup fires on every image change | 🟡 Medium |
| M3 | `components/AuthModal.tsx` | Pre-filled credentials (`user@daberli.dz` / `password`) in source | 🟡 Medium |
| M4 | `App.tsx` | User ID hardcoded as `'u123'` for all users | 🟡 Medium |
| M5 | `pages/MessagesPage.tsx` | Threads sorted by ID string instead of real timestamp | 🟡 Medium |
| M6 | `components/cards/AutoCard.tsx` | Detail key mismatch with mock data — always shows defaults | 🟡 Medium |
| M7 | `pages/ProfilePage.tsx` | Mock reviews shown for all users, not tied to real data | 🟡 Medium |
| M8 | `pages/SettingsPage.tsx` | Settings not persisted — reset on navigation/refresh | 🟡 Medium |
| L1 | `App.tsx`, `HomePage.tsx` | `onPostAdSubmit` in sharedProps but missing from HomePageProps | 🟢 Low |
| L2 | `components/Hero.tsx` | Vehicle card subtitle duplicates title text | 🟢 Low |
| L3 | `pages/AdminPage.tsx` | Non-admin should get `<Navigate>` redirect, not just a gated screen | 🟢 Low |
| L4 | `vite.config.ts` | GEMINI_API_KEY exposed in build with no AI feature in codebase | 🟢 Low |
| L5 | `types.ts` | `NavItem` interface declared but never used | 🟢 Low |
| L6 | `App.tsx` | `activeCategory` state declared but never meaningfully updated | 🟢 Low |
| Dead | `pages/CategoryPage.tsx` | 137-line file, never routed or imported | Dead Code |
| Dead | `components/ServiceGrid.tsx` | 77-line component, never imported anywhere | Dead Code |

---

## 15. Recommended Action Plan

### Phase 1 — Fix Blockers (do first)
1. **Fix `AdminPage.tsx`** — Remove the orphaned SettingsPage stub code from the top of the file
2. **Add a 404 route** — Create a simple `NotFoundPage` and add `<Route path="*" element={<NotFoundPage />} />`
3. **Clear pre-filled auth credentials** — Change `useState('user@daberli.dz')` and `useState('password')` to `useState('')`

### Phase 2 — Core Functionality
4. **Make search functional** — Read `useSearchParams()` in each category page and apply the `q` filter
5. **Add admin boost toggle** — Add Boost/Unboost button to AdminPage and `onBoostAd` handler in App
6. **Fix FloatingActionBar** — Add handlers or mark Saved/Search as coming soon

### Phase 3 — Code Quality
7. **Remove dead files** — Delete `CategoryPage.tsx` and `ServiceGrid.tsx`
8. **Type `adData`** — Create `PostAdFormData` interface and replace all `any`
9. **Fix AutoCard detail keys** — Align mock data keys with card expectations (`Year` → `year`, `Fuel` → `fuelType`)
10. **Fix PostAdModal useEffect** — Use a ref to track previous blob URL for proper cleanup

### Phase 4 — UX Polish
11. **Persist settings** — Use `localStorage` or lift settings into App state
12. **Fix Hero subtitle** — Change Vehicle card subtitle from `"Vehicle"` to `"Cars & trucks"`
13. **Redirect non-admins** — Replace admin gated UI with `<Navigate to="/" replace />`
14. **Remove unused Gemini config** — Clean up `vite.config.ts`
15. **Remove unused `NavItem` type** from `types.ts`

---

*End of review.*
