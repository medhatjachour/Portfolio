# 🎨 Portfolio Customization Guide - Enhanced Version

This guide will help you customize your new vibrant, 3D-enhanced React portfolio.

## 🎨 Design System

### Color Palette
The portfolio uses a vibrant color scheme defined in `src/index.css`:

- **Primary**: #6366F1 (Indigo) - Main brand color
- **Secondary**: #8B5CF6 (Purple) - Accent color
- **Accent**: #EC4899 (Pink) - Highlights and CTAs
- **Success**: #10B981 (Emerald) - Success states
- **Info**: #06B6D4 (Cyan) - Informational elements
- **Warning**: #F59E0B (Amber) - Warnings

To change colors, edit the CSS variables in `src/index.css`:
```css
:root {
  --primary: #6366F1;
  --secondary: #8B5CF6;
  /* ... update other colors */
}
```

### Design Effects
- **Glassmorphism**: `.glass` class for frosted glass effect
- **Neon Glow**: `.neon-glow` and `.neon-text` for glowing effects
- **Gradient Text**: `.gradient-text` for colorful gradient text
- **3D Cards**: `.card-3d` for 3D transform effects

## 📝 Content Customization

### 1. Hero Section (`src/components/organisms/Hero.jsx`)

**Personal Information:**
```jsx
const Hero = () => {
  // Update these values:
  const name = "Your Name";
  const greeting = "Hi, I'm";
  const tagline = "Full-Stack Developer & Creative Technologist";
  const description = "Your description here...";
```

**Resume Link:**
- Add your resume PDF to `/public/resume.pdf`
- Or update the link in Hero.jsx: `href="/resume.pdf"` → `href="your-url"`

**3D Elements:**
- Particle count: Change `1000` in `ParticleField`
- Sphere colors: Modify `color="#6366F1"` in `AnimatedSphere`
- Floating shapes: Add/remove in `FloatingShapes` component

### 2. About Section (`src/components/organisms/About.jsx`)

**Profile Photo:**
```jsx
profileImage="https://your-image-url.com/photo.jpg"
```

**Bio:**
```jsx
bio="Your custom biography text here..."
```

**Stats:**
```jsx
<p className="text-3xl font-bold gradient-text">5+</p>
<p className="text-xs">Years</p>
// Update these numbers to match your experience
```

**Skills:**
The skills list is in the component props. Update the array:
```jsx
skills={[
  { name: 'Your Skill', level: 90, icon: <YourIcon /> },
  // ... add more skills
]}
```

### 3. Skills3D Section (`src/components/organisms/Skills3D.jsx`)

**Add/Remove Skills:**
```jsx
const skills = [
  { 
    name: 'React', 
    color: '#61DAFB', 
    icon: <FaReact />, 
    level: 95 
  },
  // Add your skills here
];
```

**3D Configuration:**
- Sphere size: `args={[0.4, 32, 32]}` - increase first number for larger spheres
- Rotation speed: `autoRotateSpeed={0.5}` - increase for faster rotation
- Radius: `const radius = 3` in SkillCloud - increase for wider spread

### 4. Projects Section (`src/components/organisms/Projects.jsx`)

**Add Your Projects:**
```jsx
projects={[
  {
    title: 'Project Name',
    description: 'Project description...',
    techStack: ['React', 'Node.js', 'MongoDB'],
    image: 'https://your-image-url.com',
    liveUrl: 'https://live-demo.com',
    githubUrl: 'https://github.com/user/repo'
  },
  // ... more projects
]}
```

**3D Project Cubes:**
- Number displayed: Change `projects.slice(0, 6)` to show more/fewer
- Cube arrangement: Modify `const radius = 3` to adjust circle size
- Cube colors: Change colors in `ProjectCube` component

### 5. Experience Section (`src/components/organisms/Experience.jsx`)

**Add Work Experience:**
```jsx
experiences={[
  {
    title: 'Job Title',
    company: 'Company Name',
    location: 'City, Country',
    period: 'Jan 2020 - Present',
    description: 'Job description...',
    achievements: [
      'Achievement 1',
      'Achievement 2'
    ]
  }
]}
```

### 6. Contact Section (`src/components/organisms/Contact.jsx`)

**Contact Information:**
```jsx
contactInfo={{
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Your City, Country'
}}
```

**Social Links:**
```jsx
socialLinks={{
  linkedin: 'https://linkedin.com/in/yourprofile',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourhandle'
}}
```

**Form Submission:**
Currently simulated. To connect to a real backend:
1. Open `Contact.jsx`
2. Find the `handleSubmit` function
3. Replace the simulated API call with your endpoint:
```jsx
const response = await fetch('https://your-api.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(values)
});
```

## 🎭 Theme Customization

### Dark/Light Theme
The theme is managed by Zustand in `src/store/themeStore.js`.

**Change Default Theme:**
```jsx
const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true, // Change to false for light mode default
      // ...
    })
  )
);
```

**Custom Theme Colors:**
Edit `src/index.css` for both light and dark modes:
```css
/* Dark theme */
.dark {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  /* ... */
}

/* Light theme */
:root {
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  /* ... */
}
```

## 🎬 Animation Customization

### Framer Motion Settings

**Scroll Animations:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

- `initial`: Starting state
- `whileInView`: End state when scrolling into view
- `duration`: Animation speed (seconds)
- `delay`: Start delay

**Hover Animations:**
```jsx
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.95 }}
```

### 3D Animations (React Three Fiber)

**Rotation Speed:**
```jsx
useFrame((state) => {
  meshRef.current.rotation.y += 0.01; // Increase for faster rotation
});
```

**Auto-Rotate Speed:**
```jsx
<OrbitControls autoRotate autoRotateSpeed={0.5} />
// Increase autoRotateSpeed for faster rotation
```

## 🖼️ Images & Assets

### Placeholder Images
Replace Unsplash placeholders with your own:

1. **Profile Photo**: Update `profileImage` prop in About component
2. **Project Images**: Update `image` URLs in projects array
3. **Favicons**: Replace files in `/public` folder

### Optimize Images
- Use WebP format for better compression
- Recommended sizes:
  - Profile photo: 400x400px
  - Project thumbnails: 800x600px
  - Background images: 1920x1080px

## 🚀 Performance Optimization

### 3D Performance

If 3D scenes are slow:

1. **Reduce particle count:**
```jsx
const count = 500; // Instead of 1000
```

2. **Lower geometry detail:**
```jsx
<sphereGeometry args={[0.4, 16, 16]} /> // Instead of [0.4, 32, 32]
```

3. **Disable auto-rotate on mobile:**
```jsx
<OrbitControls 
  autoRotate={window.innerWidth > 768} 
  autoRotateSpeed={0.5}
/>
```

### Lazy Loading
Components are already optimized, but you can add:
```jsx
const Skills3D = React.lazy(() => import('./components/organisms/Skills3D'));
```

## 📱 Responsive Design

### Breakpoints
Tailwind breakpoints used:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Hide 3D on Mobile
```jsx
<div className="hidden md:block">
  {/* 3D Canvas here */}
</div>
```

## 🎯 SEO Optimization

### Meta Tags
Update in `/index.html`:
```html
<title>Your Name - Portfolio</title>
<meta name="description" content="Your description" />
<meta property="og:title" content="Your Name" />
```

### Structured Data
Add to `index.html` for better SEO:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "url": "https://yourwebsite.com",
  "sameAs": [
    "https://linkedin.com/in/yourprofile",
    "https://github.com/yourusername"
  ]
}
</script>
```

## 🔧 Advanced Customization

### Add New Sections
1. Create component in `src/components/organisms/`
2. Import in `src/pages/Home.jsx`
3. Add to page:
```jsx
import YourSection from '../components/organisms/YourSection';

<YourSection />
```

### Custom 3D Scenes
Study existing 3D components and React Three Fiber docs:
- Hero.jsx - Complex scene example
- Skills3D.jsx - Interactive 3D layout
- About.jsx - Simple 3D background

### Custom Animations
Explore Framer Motion variants:
```jsx
const variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

<motion.div variants={variants} initial="hidden" animate="visible">
```

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei Docs](https://github.com/pmndrs/drei)

## 🆘 Troubleshooting

**White screen after changes:**
- Check browser console for errors
- Ensure all imports are correct
- Restart dev server: `npm run dev`

**3D scenes not rendering:**
- Check if React Three Fiber versions are compatible
- Ensure Canvas component has valid camera settings
- Try simplifying the 3D scene

**Performance issues:**
- Reduce particle counts
- Lower 3D geometry detail
- Disable auto-rotate
- Use Chrome DevTools Performance tab

---

Need help? Check the original component files for reference implementations!
