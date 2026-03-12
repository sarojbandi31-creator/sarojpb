# Personal Project (Vite + React + TypeScript)

This project uses Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Deploy to Vercel (Step-by-step)

### 1) Push your code to GitHub

Vercel deploys directly from your GitHub repository.

### 2) Import project in Vercel

- Go to https://vercel.com/new
- Select your GitHub repo
- Framework preset: **Vite** (Vercel usually detects this automatically)

### 3) Configure build settings

Use these values if not auto-filled:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4) Add environment variables in Vercel

In your Vercel project settings, open **Settings → Environment Variables** and add the variables your app needs.

Minimum required for this frontend app:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

If you use Razorpay from this app, add only public keys to frontend variables. Keep secret keys in secure backend environments only.

### 5) Deploy

- Click **Deploy** in Vercel.
- Wait for build + deployment to complete.

### 6) Verify production

After deployment:

- Open the generated Vercel URL
- Test auth/login flow
- Test gallery/artwork pages
- Test checkout/payment flow (if enabled)

## Redeploy after changes

Every push to your connected Git branch triggers a new deployment automatically.

## Optional: Deploy using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Tech stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
