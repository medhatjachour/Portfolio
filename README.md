# Professional Portfolio Website

A modern, responsive portfolio website built with React, featuring interactive 3D elements, smooth animations, and a clean design following the Atomic Design pattern.

## 🌟 Live Demo

**[View Live Portfolio]([https://portfolio-lcbiz7e2v-medhatjachours-projects.vercel.app/](https://portfolio-ashy-eight-57.vercel.app/))**

Experience the starry night sky theme with floating code snippets, dynamic animations, and interactive 3D elements!

## 🚀 Features

### 🎨 Visual Experience
- **Starry Night Sky Hero** - 5000+ twinkling stars with dynamic animations
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
Update your info in `src/pages/Home.jsx`:
- Name, tagline, description in `<Hero />`
- Email, phone, location in `<Contact />`
- Social media links

### Projects
Edit the projects array in `src/components/organisms/Projects.jsx`

### Experience
Update your work history in `src/components/organisms/Experience.jsx`

### Skills
Modify skills in `src/components/organisms/About.jsx`

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

## 🚀 Deployment

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
│   ├── atoms/          # Button, Input, Textarea, Icon
│   ├── molecules/      # ProjectCard, SkillBar, TimelineItem
│   └── organisms/      # Hero, About, Projects, Experience, Skills, Contact, Footer
├── pages/              # Home
├── store/              # themeStore, formStore (Zustand)
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
  "react-three/fiber": "^8.17.10",
  "react-three/drei": "^9.114.3",
  "framer-motion": "^11.11.11",
  "three": "^0.169.0",
  "tailwindcss": "^3.4.14"
}
```

---

Made with ❤️ using React, Three.js, Framer Motion, and Tailwind CSS

**Deployed on Vercel** | [Live Demo](https://portfolio-lcbiz7e2v-medhatjachours-projects.vercel.app/)
