# Portfolio Customization Guide

This guide will help you customize the portfolio with your own information.

## Quick Start Checklist

- [ ] Update personal information (name, title, bio)
- [ ] Add your profile photo
- [ ] Update projects with your work
- [ ] Add your work experience
- [ ] Update skills and proficiency levels
- [ ] Update contact information
- [ ] Add your social media links
- [ ] Customize color theme (optional)

---

## 1. Personal Information

### File: `src/pages/Home.jsx`

**Update Hero Section:**
```jsx
<Hero 
  name="John Doe"                    // Your name
  tagline="Full-Stack Developer"     // Your title/role
  description="Your brief bio here"  // Short description
/>
```

**Update Footer:**
```jsx
<Footer name="John Doe" />  // Your name for copyright
```

---

## 2. Profile Photo

### File: `src/components/organisms/About.jsx`

**Option A: Use a URL:**
```jsx
const About = ({ 
  profileImage = 'https://your-image-url.com/profile.jpg',
  // ...
})
```

**Option B: Use a local image:**
1. Add your image to `src/assets/` folder (e.g., `profile.jpg`)
2. Import and use it:
```jsx
import profileImg from '../../assets/profile.jpg';

const About = ({ 
  profileImage = profileImg,
  // ...
})
```

---

## 3. Projects

### File: `src/components/organisms/Projects.jsx`

Replace the default projects array with your own:

```jsx
const Projects = ({ 
  projects = [
    {
      title: 'Your Project Name',
      description: 'Detailed description of your project and what problem it solves.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      image: 'https://your-image-url.com/project1.jpg',  // Project thumbnail
      liveUrl: 'https://your-live-demo.com',
      githubUrl: 'https://github.com/yourusername/project-repo'
    },
    // Add more projects...
  ]
})
```

**Tips for project images:**
- Recommended size: 600x360px
- Use free images from Unsplash, Pexels if you don't have screenshots
- Or use placeholder services: `https://via.placeholder.com/600x360`

---

## 4. Work Experience

### File: `src/components/organisms/Experience.jsx`

Update the experiences array:

```jsx
const Experience = ({ 
  experiences = [
    {
      date: '2022 - Present',
      title: 'Senior Developer',
      company: 'Your Company Name',
      achievements: [
        'Led a team of 5 developers',
        'Improved performance by 40%',
        'Implemented CI/CD pipelines'
      ]
    },
    // Add more experiences...
  ]
})
```

---

## 5. Skills

### File: `src/components/organisms/About.jsx`

Update the skills array:

```jsx
skills = [
  { name: 'JavaScript', level: 90, icon: <FaJs /> },
  { name: 'React', level: 85, icon: <FaReact /> },
  { name: 'Node.js', level: 80, icon: <FaNodeJs /> },
  // Add more skills...
]
```

**Available icons:** Import from `react-icons`:
```jsx
import { FaReact, FaNodeJs, FaPython, FaJs } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiMongodb } from 'react-icons/si';
```

Browse all icons: https://react-icons.github.io/react-icons/

---

## 6. Contact Information

### File: `src/pages/Home.jsx`

Update the Contact component props:

```jsx
<Contact 
  contactInfo={{
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Your City, Country'
  }}
  socialLinks={{
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername'
  }}
/>
```

---

## 7. Bio & Stats

### File: `src/components/organisms/About.jsx`

Update your biography:

```jsx
const About = ({ 
  bio = "Your detailed bio here. Talk about your experience, specializations, and what drives you as a developer.",
  // ...
})
```

Update the stats (years experience, projects, clients):

```jsx
<div className="mt-6 grid grid-cols-3 gap-4 text-center">
  <div>
    <p className="text-3xl font-bold text-primary">5+</p>
    <p className="text-sm text-[var(--color-text-muted)]">Years Experience</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-success">50+</p>
    <p className="text-sm text-[var(--color-text-muted)]">Projects Done</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-warning">20+</p>
    <p className="text-sm text-[var(--color-text-muted)]">Happy Clients</p>
  </div>
</div>
```

---

## 8. Color Theme (Optional)

### File: `tailwind.config.js`

Change the primary colors:

```js
colors: {
  primary: '#007BFF',    // Main accent color
  secondary: '#6C757D',  // Text color
  success: '#28A745',    // Success/green accents
  warning: '#FFC107',    // Warning/yellow accents
}
```

### File: `src/index.css`

Update CSS variables for both themes:

```css
:root {
  --color-primary: #007BFF;      /* Light theme primary */
  --color-bg: #FFFFFF;           /* Light theme background */
  /* ... */
}

.dark {
  --color-primary: #007BFF;      /* Dark theme primary */
  --color-bg: #121212;           /* Dark theme background */
  /* ... */
}
```

---

## 9. Favicon & Title

### File: `index.html`

Update page title:

```html
<title>Your Name - Portfolio</title>
```

Replace favicon:
1. Add your favicon to `public/` folder
2. Update the link tag:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

---

## 10. Resume/CV Download (Optional)

Add a download link in the About section:

1. Add your resume PDF to `public/resume.pdf`
2. In `src/components/organisms/About.jsx`, add a button:

```jsx
<a 
  href="/resume.pdf" 
  download="Your-Name-Resume.pdf"
  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
>
  <FaDownload />
  Download Resume
</a>
```

---

## Testing Your Changes

After making changes:

1. Save the files
2. The dev server will auto-reload
3. Check `http://localhost:3000` in your browser

---

## Deployment

Once customized, build and deploy:

```bash
npm run build
```

Deploy to:
- **Netlify**: Connect GitHub repo, build command: `npm run build`, publish dir: `dist`
- **Vercel**: `npm i -g vercel && vercel`
- **GitHub Pages**: See README for instructions

---

## Need Help?

- Check the README.md for setup instructions
- Review component files - they have detailed JSDoc comments
- React Icons: https://react-icons.github.io/react-icons/
- Tailwind CSS docs: https://tailwindcss.com/docs
