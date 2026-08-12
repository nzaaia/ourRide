# OurRide — Mobile-First UI + Installable PWA Design

Date: 2026-08-13
Status: Approved (direction B, icons, grid, nav locked via visual companion)

## 1. Product Context & Philosophy

OurRide (renamed from OurBike) is a **campus peer-to-peer mobility marketplace** for
university students. It connects three roles around motorcycles/scooters:

- **Owner** — lists their bike for hourly rental; reviews booking requests
  (accept/reject), monitors live trip status, tracks earnings.
- **Renter** — rents bikes by the hour. Rental lifecycle:
  request → owner accepts → exact location revealed → 20-min pickup window →
  before-photo → ride (in use) → return → after-photo → pay → complete.
  Renters may also carry passengers during an active rental (micro-driver).
- **Passenger** — posts a ride request (pickup/dropoff/fare); renters accept or
  counter-offer the fare.

Trust is the core product mechanic:
- Campus ID / NID verification, two-way ratings.
- Exact bike location revealed only after the owner accepts a booking.
- Before/after damage photos protect both sides of a rental.
- Transparent pricing: hourly rate + wear & tear shown up-front; 13% platform
  fee disclosed to owners.

The frontend is a React + Vite SPA with mock in-memory data
(`src/context/AuthContext.jsx`, `src/mockData.js`). All state is client-side.

## 2. Goals

1. Run well on a **mobile browser** with an **install-to-home-screen (PWA)**
   option as the primary platform.
2. Modern, clean UI in the language used by leading ride-sharing apps, applied
   consistently across all 3 roles.
3. Nothing breaks on a phone: every existing page gets at least a responsive
   safety net; the most-used pages get a full mobile treatment.
4. Intentional UX: loading skeletons, in-button spinners, toasts, safe-area
   support, touch targets.

## 3. Scope

### In scope (this pass)
- **PWA installability**: `manifest.webmanifest`, theme color, icons
  (purpose-appropriate, incl. maskable), service worker caching static assets,
  standalone display, `vite-plugin-pwa`.
- **App shell**: sticky header (page title + back button) and fixed bottom tab
  bar with `env(safe-area-inset-*)` padding.
- **Design tokens** migrated to shadcn-style CSS variables + component utility
  classes.
- **Full mobile treatment** of key pages:
  - Renter: Dashboard (Home), Browse, BookVehicle, Requests
  - Owner: Dashboard (Home), Requests, MyBikes
  - Passenger: RideSearch
  - Shared: ProfilePage (incl. role switcher)
- **Listing grid**: min 2 columns on phones, scaling with screen width.
- **Loading/feedback primitives**: `Skeleton`, `Spinner`, `Toast`, button
  loading state.
- Brand rename OurBike → **OurRide** across UI copy and manifest.

### Out of scope (later)
- Real backend/API, real-time updates, payments, maps integration.
- Full redesign of secondary pages (CreateListing, VehicleSettings, Earnings,
  PastTrips, SavedBikes, ratings pages, Chat, TripPhotoCapture) — these get the
  responsive safety net only.
- Offline data persistence (IndexedDB); PWA covers static asset caching only.

## 4. Visual Design System (Direction B)

### 4.1 Brand colors
| Token | Value | Use |
|---|---|---|
| `--forest` | `#0c3d24` | hero gradients, dark CTAs, headers |
| `--forest-2` | `#0f5c34` | gradient mid-tone |
| `--primary` | `#00B14F` | primary actions, active states |
| `--primary-hover` | `#009E45` | hover |
| `--accent` | `#00E56A` | vivid accent in gradients / highlights |
| `--primary-light` | `#E6F9EE` | selected surfaces, badges |
| `--ink` | `#111827` | primary text |
| `--muted` | `#6B7280` | secondary text |
| `--border` | `#E5E7EB` | hairline borders |
| `--surface` | `#FFFFFF` | cards |
| `--surface-soft` | `#F5F7FA` | page background |
| `--error` / `--warning` / `--info` | red / amber / blue | status |

Existing green (`--primary: #00B14F`) is kept; `--forest` and `--accent` are new
anchors for hero moments.

### 4.2 Typography
- Keep `Pathway Extreme` (already loaded) for display + body.
- Page titles 20px/700; section micro-labels 11px uppercase, letter-spacing .8px,
  muted.
- Numerals use `font-variant-numeric: tabular-nums` for fares/countdowns.

### 4.3 Components (shadcn-flavoured)
- **Buttons**: `btn-primary` (green), `btn-dark` (forest), `btn-outline`,
  `btn-ghost`; loading = inline spinner + disabled; focus-visible ring
  `box-shadow: 0 0 0 3px rgba(0,177,79,.35)`; touch target ≥44px.
- **Cards**: white, 1px hairline border, radius 12–16px, subtle shadow.
- **Badges**: pill, tinted background + colored text (green/amber/blue/red).
- **Skeleton**: soft gray-green shimmering blocks.
- **Toast**: fixed top/bottom, icon + title + subtitle, auto-dismiss.
- **Bottom tab bar**: 4–5 items, icon + 10px label, active = forest icon +
  small indicator; inactive = muted.
- **Header**: white, hairline bottom border, back chevron + title; hero pages
  use forest gradient header instead.
- **Icons**: lucide-react exclusively; **no emojis** anywhere in UI copy.

### 4.4 Listing grid
`grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))` — guarantees ≥2
columns at 320px, 3 at tablet, 4+ on desktop. Tile: image (aspect ~4:3), price
pill + bookmark button overlaid, then name (ellipsis), location (ellipsis),
rating, wear&tear line, full-width Book button.

## 5. Navigation & App Shell

### 5.1 Bottom tab bar (per role)
- **Renter**: Home · Browse · Requests · Profile
- **Owner**: Home · Bikes · Requests · Earnings · Profile
- **Passenger**: Search · My Rides · Profile

### 5.2 Header
- Standard pages: sticky white header, back chevron (when applicable), title.
- Home pages: forest gradient header with greeting + avatar.
- Role switcher moves from TopNav into the Profile page (segmented control).
- `TopNav` is removed/replaced by the new shell (desktop keeps a simplified
  top nav via CSS `@media (min-width: 768px)`).

### 5.3 Safe areas
- `.main-content` gets `padding-bottom: calc(var(--space-10) + env(safe-area-inset-bottom))`
  so content clears the tab bar and iPhone home indicator.
- Tab bar uses `padding-bottom: env(safe-area-inset-bottom)`.

## 6. PWA

- Dependency: `vite-plugin-pwa`.
- `manifest.webmanifest`: name **OurRide**, short_name **OurRide**, start_url `/`,
  display `standalone`, background/theme color `#0c3d24`, icons (192, 512,
  maskable).
- App icon: simple green motorbike/route mark on forest background, generated
  as SVG-derived PNGs.
- Service worker: precache built assets (workbox), runtime cache for
  `images.unsplash.com` and Google Fonts (stale-while-revalidate).
- `registerType: 'autoUpdate'`.
- `index.html`: updated `<title>`, theme-color meta, apple-touch-icon,
  apple-mobile-web-app-capable, preconnect to fonts.
- Installation prompt surfaced via a small install banner component (dismissable),
  only when `beforeinstallprompt` fires and not already installed.

## 7. Loading & Feedback (intentional UX)

- **Route-level**: each key page renders skeleton placeholders on first mount
  (simulated for mock data; wired to real async later).
- **Action-level**: submit buttons show spinner while processing (e.g., booking
  request send, photo upload, payment confirm).
- **Toasts**: success (request sent, counter-offer sent, booking accepted),
  error (invalid fare, camera denied).
- Empty states use lucide icon + title + hint + CTA (no emojis).

## 8. Page Inventory

### 8.1 Full mobile treatment
| Route | Changes |
|---|---|
| `/` LandingPage | mobile hero (stacked CTAs), compact stat bar, 2-col featured grid |
| `/renter/browse` Browse | 2+ col grid, filter pills, sticky search |
| `/renter/dashboard` | forest header, quick actions, nearby bikes grid |
| `/renter/book/:id` BookVehicle | stacked sections, sticky bottom price+CTA bar |
| `/renter/requests` Requests | tabbed list, full-width cards |
| `/owner/dashboard` | stat cards 2-col, pending/active/list sections |
| `/owner/requests` | card list responsive |
| `/owner/bikes` | card list responsive |
| `/passenger/search` RideSearch | stacked form, active request cards |
| `/profile` Profile | profile card + role switcher + menu list |

### 8.2 Responsive safety net only
`CreateListing`, `VehicleSettings`, `Earnings` (both), `PastTrips`, `SavedBikes`,
`MyRatings`, `OwnerRatings`, `Chat`, `TripPhotoCapture` — collapse grids to
single column ≤640px, ensure no fixed-width breakage.

## 9. Implementation Approach

Two sub-projects, done in order:

1. **Design system + shell + PWA**
   - Extend `src/index.css` tokens + component classes; add `Skeleton`,
     `Spinner`, `Toast`, `BottomNav`, `MobileHeader` components.
   - Add `vite-plugin-pwa`, manifest, icons, service worker.
   - Rewire `App.jsx` to new shell; update `index.html`.

2. **Key pages responsive rebuild**
   - Convert the listed key pages (4.4 / 8.1), keeping existing routes and
     context logic untouched.

Rejected alternatives:
- Tailwind/UI library (shadcn actual package): would require installing Tailwind
  + restructuring every component; overkill for this codebase. We adopt the
  *patterns* (tokens, focus rings, skeletons) with plain CSS variables instead.
- Manual service worker instead of `vite-plugin-pwa`: more error-prone, no
  asset manifest integration.

## 10. Verification

- `npm run build` + `npm run preview` on a phone (or DevTools device mode):
  app installable, standalone shell, offline reload works for cached assets.
- No horizontal scroll on ≤360px width across all routes.
- Grid shows 2 columns on a phone, 4 on desktop.
- All interactive targets ≥44px; focus rings visible via keyboard.
- `npm run lint` (oxlint) passes.
