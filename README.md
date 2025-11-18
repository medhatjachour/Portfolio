# Professional Portfolio Website

A modern, responsive portfolio website built with React, featuring interactive 3D elements, smooth animations, and a clean design following the Atomic Design pattern.

## 🚀 Features

- **React 18** - Modern React with hooks and functional components
- **Atomic Design** - Well-organized component structure (atoms, molecules, organisms)
- **React Three Fiber** - Interactive 3D scenes and animations
- **Framer Motion** - Smooth, performant animations
- **Zustand** - Lightweight state management for theme and form
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing
- **Formik & Yup** - Form handling and validation
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

- Primary: #007BFF (Blue)
- Secondary: #6C757D (Gray)
- Success: #28A745 (Green)
- Warning: #FFC107 (Yellow)

---

Made with ❤️ using React, Three.js, Framer Motion, and Tailwind CSS
