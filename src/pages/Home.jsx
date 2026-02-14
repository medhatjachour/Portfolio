import React, { useEffect, lazy, Suspense } from 'react';
import HeroNew from '../components/organisms/HeroNew';

// Lazy load below-the-fold content for better initial load
const ProjectsShowcase = lazy(() => import('../components/organisms/ProjectsShowcase'));
const Experience = lazy(() => import('../components/organisms/Experience'));
const SkillsJourney = lazy(() => import('../components/organisms/SkillsJourney'));
const Contact = lazy(() => import('../components/organisms/Contact'));
const Footer = lazy(() => import('../components/organisms/Footer'));

/**
 * Home Page
 * Main landing page assembling all sections
 */
const Home = () => {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Above-the-fold: Load immediately */}
      <HeroNew />
      
      {/* Below-the-fold: Lazy load with Suspense */}
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <SkillsJourney />
      </Suspense>
      
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <ProjectsShowcase />
      </Suspense>
      
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <Contact />
      </Suspense>
      
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
