# OurRide — Setup & Deployment Guide

Everything below is a **one-time** setup (~5–10 minutes). The app is a React
(Vite) PWA on Netlify backed by Supabase (hosted Postgres + REST + realtime).
There is **no backend server** to deploy and **no auth to configure**.

You can do steps 1 and 2 while the code is being built.

---

## Step 1 — Create the Supabase project (~3 min)

1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. Pick an org + a project name (e.g. `ourride`), set a strong DB password, pick
   a region close to you (e.g. `Singapore` or `ap-southeast-1`), press **Create
   new project**. Wait ~2 minutes for it to finish provisioning.

> Already done: the project URL and publishable key are **embedded in the app**
> (`frontend/src/lib/supabaseClient.js`), so no key wiring is needed.

## Step 2 — Create the tables + demo data (one paste, ~30 sec)

1. In the Supabase dashboard sidebar click **SQL Editor** → **New query**.
2. Copy the entire contents of **`supabase/setup.sql`** (in this repo) into the
   editor.
3. Press **Run** (or Ctrl/Cmd+Enter). You should see `Success. No rows returned`
   (or similar). This creates all tables, security rules, and the demo data.

> You can safely re-run this file anytime to **reset the demo data**.

## Step 3 — Push to GitHub

The repo is already connected to GitHub. From this project root:

```bash
git push origin main
```

Netlify will pick it up automatically (step 5). If you are making the push
yourself, make sure the working tree contains the finished build (see README).

## Step 4 — Deploy on Netlify (continuous deployment)

1. Go to <https://app.netlify.com> → **Add new site** → **Import an existing
   project** → pick **GitHub** and authorize Netlify.
2. Select the **ourRide** repository.
3. Netlify reads `netlify.toml` automatically (build command, publish folder,
   SPA redirects) — **no further settings needed**. Click **Deploy site**.
4. Within a minute the site is live at `https://<your-site>.netlify.app`.
   Every future `git push` to `main` auto-deploys a new build.

Optional (not required): Site configuration → Environment variables →
add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The app already has the
demo keys embedded for this POC; the env vars simply override them if set.

## Step 5 — Local development (optional)

```bash
cd frontend
npm install
# create frontend/.env.local with:
#   VITE_SUPABASE_URL=https://xxxx.supabase.co
#   VITE_SUPABASE_ANON_KEY=eyJ...
npm run dev
```

## Demo tips

- The app uses fixed demo identities — every browser shares one marketplace,
  which is what makes the live demo work. Book a bike on your phone and watch
  it appear on the laptop in real time.
- To reset data during a demo, re-run `supabase/setup.sql` in the SQL Editor.
- Re-running `setup.sql` wipes demo data, so do it *before* a demo, not during.
