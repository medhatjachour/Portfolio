# Professional Portfolio Website

A modern, responsive portfolio website built with React, featuring interactive 3D elements, smooth animations, and a clean design following the Atomic Design pattern.

## 🌟 Live Demo

**[medhatjachour.tech](https://medhatjachour.tech)**

Experience the starry night sky theme with floating code snippets, dynamic animations, and
interactive 3D elements — including a ray-traced black hole that roams the hero and drags the
surrounding UI into its accretion disk.

## 🚀 Features

### 🎨 Visual Experience
- **Ray-Traced Black Hole** - Physically-based Schwarzschild lensing with an accretion disk,
  photon ring, relativistic jets, Doppler beaming and gravitational redshift
- **Roaming Gravity** - The hole hunts DOM elements and floating scenery, spaghettifies
  captured matter, and throws it back out along its jets
- **Starry Night Sky Hero** - GPU-instanced starfield that bends light, spirals into the hole
  and tidally stretches as it falls
- **Floating Code Snippets** - 60+ software terms floating through the sky
- **Shooting Stars** - Occasional streaks across the background
- **Constellations** - Big Dipper and Orion's Belt patterns
- **Glowing Moon** - Ambient celestial body with realistic glow
- **Typing Effect** - Loading screen with animated typing text
- **Music Player** - Background music with volume controls

### 💻 Technical Stack
- **React 18** - Modern React with hooks and functional components
- **Atomic Design** - Well-organized component structure (atoms, molecules, organisms)
- **React Three Fiber** - Interactive 3D scenes and animations with Three.js
- **@react-three/drei** - Useful helpers for R3F (Float, Text, MeshDistortMaterial)
- **Framer Motion** - Smooth, performant animations and transitions
- **Zustand** - Lightweight state management for theme and form
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **React Icons** - Beautiful icon library integration
- **Dark/Light Theme** - Toggle between themes with persistent storage
- **Responsive Design** - Mobile-first approach, works on all devices
- **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## 📝 Customization Guide

### Personal Information
Update your info in the hero and contact sections:
- Name, tagline, description in `src/components/organisms/HeroNew.jsx`
- Email, phone, location and social links in `src/components/organisms/Contact.jsx`

### Projects
Edit the projects array in `src/components/organisms/ProjectsShowcase.jsx`

### Experience
Update your work history in `src/components/organisms/Experience.jsx`

### Skills
Modify skills in `src/components/organisms/SkillsJourney.jsx`

### Colors
Change theme colors in `tailwind.config.js` and `src/index.css`

## 🏗️ Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

> **Build-time env keys.** Vite inlines `VITE_*` values into the bundle, so they must be in
> `.env` *before* the build. A missing key yields a silently degraded build rather than an
> error — `VITE_GEMINI_API_KEY` falls back to the offline personality in
> `src/data/agentPersonality.js`, and `VITE_WEB3FORMS_KEY` falls back to a hard-coded key in
> `Contact.jsx`. See `.env.example`.

## 🚀 Deployment

### Production: the shared VPS

The live site is **not** its own container. It is served as **static files** by the shared
reverse proxy that fronts every site on the VPS:

| Host | Serves | Backed by |
| --- | --- | --- |
| `medhatjachour.tech`, `www.medhatjachour.tech` | **this portfolio** | nginx static from `portfolio-dist` |
| `www.bizflow.medhatjachour.tech` | BizFlow | `bizflow-app:3000` |
| `www.bizflow.medhatjachour.tech/demo/` | BizFlow web UI | `bizflow-app:5180` |
| `www.transhub.medhatjachour.tech` | TransHub | `transhub-web:80` |
| `api.transhub.medhatjachour.tech` | TransHub API | `transhub-api:4000` |

The proxy config, the TLS certificates and the `docker-compose.yml` that runs the other sites
all live in the **BizFlow repo**. The authoritative procedure is
`BizFlow/docs/PRODUCTION_SERVER_RUNBOOK.md` §15, *Deploying the portfolio*.

**Updating the portfolio is portfolio-only by construction.** It is nothing but a directory of
files bind-mounted read-only into an already-running nginx, so a deploy:

- does **not** rebuild or restart BizFlow or TransHub,
- does **not** touch the proxy config, TLS certs or DNS,
- needs no `docker compose up` unless `portfolio-dist` does not exist yet.

From this repo:

```bash
./deploy-vps.sh          # after: chmod +x deploy-vps.sh
bash deploy-vps.sh       # Windows / Git Bash, which cannot store the exec bit
```

The script builds, ships `dist/` to `/home/medhat/bizflow/portfolio-dist`, and smoke-tests the
result. It exists as a script because the extraction step is not obvious: Docker created that
host directory as `root:root` and `medhat` has no passwordless `sudo`, so the files have to be
unpacked through a throwaway root container.

`portfolio-dist/` is deliberately git-ignored in the BizFlow repo. A bind mount whose source
directory is missing is silently created as an *empty* directory rather than failing, which
then answers 403 on `/` and 500 on every other path. Do not create or commit that path by hand.

### Standalone / self-hosting

The bundled `Dockerfile` and `docker-compose.yml` are a portable option for running the
portfolio on a machine of its own — they are **not** used on the shared VPS. They bind to
loopback on purpose, so put a proxy in front:

```bash
docker compose up -d --build     # serves http://127.0.0.1:8080
```

Point your proxy's `server_name` at `http://127.0.0.1:8080`. Production DNS
(`medhatjachour.tech` -> `168.231.107.207`) already belongs to the shared VPS, so a standalone
host needs its own record.

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`

### Vercel
```bash
npm install -g vercel
vercel
```

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Button, Input, Textarea, Magnetic, TiltCard,
│   │                   # AdaptiveCanvas, Starfield, GravityTarget
│   ├── molecules/      # AIAgent, MusicPlayer, GitHubStats, ThemeSwitcher,
│   │                   # LoadingScreen, ScrollProgress, ProjectFilter
│   └── organisms/      # HeroNew, SkillsJourney, ProjectsShowcase, Experience,
│                       # Contact, Footer, BlackHole
├── data/               # agentPersonality
├── pages/              # Home
├── store/              # themeStore, formStore, agentStore (Zustand)
├── utils/              # gravity, roaming, tidal, viewport
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## 🎨 Color Palette

### Night Sky Theme
- **Deep Navy**: #0a0e27, #0f1729, #050810 (Background layers)
- **Cyan**: #06b6d4 (Accent & interactive elements)
- **Blue**: #3b82f6, #60a5fa (Highlights)
- **Emerald**: #10b981 (Success & accents)
- **Purple/Pink**: Gradient accents for depth

### Original Theme
- Primary: #007BFF (Blue)
- Secondary: #6C757D (Gray)
- Success: #28A745 (Green)
- Warning: #FFC107 (Yellow)

## 🌙 Sky Branch Features

The current `sky` branch includes:
- Immersive starry night sky with thousands of animated stars
- Floating code terms representing various technologies
- Constellations connecting stars in patterns
- Shooting stars with trail effects
- Glowing moon with realistic lighting
- Typing animation on loading screen
- Smooth scroll-based parallax effects

## 📦 Dependencies Highlights

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.9.6",
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0",
  "three": "^0.181.1",
  "framer-motion": "^12.23.24",
  "zustand": "^5.0.8",
  "react-icons": "^5.5.0",
  "formik": "^2.4.9",
  "yup": "^1.7.1",
  "tailwindcss": "^4.1.17"
}
```

Tailwind is v4 via `@tailwindcss/postcss` — there is no `content` array to configure; theme
tokens and the design system live in `tailwind.config.js` and `src/index.css`.

---

Made with ❤️ using React, Three.js, Framer Motion, and Tailwind CSS

**Deployed on a self-hosted VPS** | [medhatjachour.tech](https://medhatjachour.tech)
