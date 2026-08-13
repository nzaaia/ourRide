# OurRide

Campus peer-to-peer motorcycle/scooter rental & ride-sharing platform.
Rent a bike by the hour, catch a ride, or earn from your own bike.

## Architecture

- **Frontend:** React + Vite PWA (all UI in `frontend/`), deployed to Netlify
  with continuous deployment from this GitHub repo.
- **Data:** Supabase (hosted Postgres + REST + realtime) — no backend server
  to deploy, no auth to configure.
- **Demo identities:** one persona per role (`owner`, `renter`, `passenger`).
  Every browser shares the same marketplace, so a two-device demo works live.

## Setup (one time)

Follow **[SETUP.md](SETUP.md)** — it covers creating the Supabase project,
pasting `supabase/setup.sql`, pushing to GitHub, and deploying on Netlify.

## Local development

```bash
cd frontend
npm install
# create frontend/.env.local (see .env.example) with your Supabase URL + anon key
npm run dev
```

## How the pieces fit

| Concern | Where |
|---|---|
| Data model + seed | `supabase/setup.sql` |
| Supabase client + realtime | `frontend/src/lib/supabaseClient.js` |
| API mapping + snapshot | `frontend/src/lib/api.js` |
| State + optimistic sync | `frontend/src/context/AuthContext.jsx` |
| Netlify build config | `netlify.toml` |

All page components read from `AuthContext` (unchanged API), so the UI screens
work identically whether data comes from memory or Supabase.
