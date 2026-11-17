# 🚀 EcoVerse AI — Complete Production Deployment Guide

This guide provides step-by-step instructions for deploying **EcoVerse AI** to production across all major hosting platforms.

---

## ⚡ Quick Decision Matrix

| Platform | Type | Cost | Setup Time | Best For |
| :--- | :--- | :---: | :---: | :--- |
| **Vercel** | Static SPA | Free | 2 mins | **Recommended** (Fastest, zero config, optimal global CDN) |
| **Netlify** | Static SPA | Free | 2 mins | Drag-and-drop or Git deployment with instant preview URLs |
| **Render** | Full-Stack | Free tier | 5 mins | Static frontend + Python FastAPI backend simultaneously via `render.yaml` |
| **Docker Compose** | Containerized | VPS / Local | 3 mins | Self-hosted servers (DigitalOcean, AWS, GCP, Hetzner) |
| **GitHub Pages** | Static SPA | Free | 3 mins | Hosted directly from your GitHub repository |

---

## 🟢 Option 1: Deploy to Vercel (Recommended & Instant)

EcoVerse AI includes pre-configured [`vercel.json`](file:///./vercel.json) supporting single-page application (SPA) routing, immutable asset caching, and security headers.

### Method A: Via Git & Vercel Dashboard (Zero-install)
1. Push your repository to **GitHub** or **GitLab**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your EcoVerse AI repository.
5. Vercel automatically detects Vite:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Your site will be live on a `*.vercel.app` domain in ~45 seconds!

### Method B: Via Vercel CLI (From Terminal)
```bash
# Install Vercel CLI globally (or run with npx)
npx vercel

# For production deployment:
npx vercel --prod
```

---

## 🔷 Option 2: Deploy to Netlify

EcoVerse AI includes [`netlify.toml`](file:///./netlify.toml) and [`public/_redirects`](file:///./public/_redirects) for seamless deep-link handling.

### Method A: Netlify Drop (Instant Drag-and-Drop — No Git Required)
1. Run a fresh build in your project:
   ```bash
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder into the browser window.
4. Your application will be deployed instantly with a live HTTPS link!

### Method B: Via Netlify Git Integration
1. Push your project to GitHub.
2. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**.
3. Select your repository. Netlify reads `netlify.toml` automatically:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **"Deploy site"**.

---

## 🟣 Option 3: Full-Stack Deploy on Render (Frontend + FastAPI Backend)

EcoVerse AI comes equipped with a Render Infrastructure-as-Code blueprint in [`render.yaml`](file:///./render.yaml).

1. Push your code to a GitHub repository.
2. Sign in to [render.com](https://render.com).
3. Click **"Blueprints"** → **"New Blueprint Instance"**.
4. Connect your GitHub repository.
5. Render reads `render.yaml` and spins up both:
   - **`ecoverse-frontend`:** High-speed static web service hosting the React SPA.
   - **`ecoverse-backend`:** Free Python 3.11 web service running FastAPI with Uvicorn.
6. Copy your backend URL (e.g. `https://ecoverse-backend.onrender.com`) and add it to the frontend environment variable:
   - `VITE_API_BASE_URL=https://ecoverse-backend.onrender.com`

---

## 🐳 Option 4: Deploy with Docker & Docker Compose

For containerized cloud environments (AWS ECS, Google Cloud Run, DigitalOcean Droplet):

### Running Both Frontend & Backend Locally with Docker Compose:
```bash
# Build and start all services
docker compose up --build -d

# Check status
docker compose ps
```
- Frontend will be available at `http://localhost:3000`
- FastAPI docs will be available at `http://localhost:8000/api/docs`

### Building & Running Just the Frontend Container:
```bash
docker build -t ecoverse-frontend .
docker run -p 80:80 ecoverse-frontend
```

---

## 🔄 Option 5: GitHub Pages

1. In `vite.config.ts`, if deploying to `https://<username>.github.io/<repo>/`, set:
   ```ts
   export default defineConfig({
     base: '/<repo-name>/',
     // ...
   });
   ```
2. Go to your repository on GitHub → **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Push your changes; the CI pipeline will automatically build and publish your site.

---

## 🛡️ Production Verification Checklist

Before sharing your link with evaluators or users, verify:
- [x] Production build passes cleanly with zero TypeScript errors (`npm run build`).
- [x] Favicon is visible on the browser tab (`/favicon.svg`).
- [x] Refreshing on any route (e.g. `/tracks/sustainable-campus` or `/digital-twin`) doesn't return a 404.
- [x] Role switcher works (Student, Maintenance, Admin).
- [x] Incident reporting and ticket state changes persist across browser refreshes via `localStorage`.
- [x] Responsive layout displays cleanly on desktop and mobile screens.
