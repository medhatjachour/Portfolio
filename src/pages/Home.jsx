import React, { useEffect } from 'react';
import HeroNew from '../components/organisms/HeroNew';
import ProjectsShowcase from '../components/organisms/ProjectsShowcase';
import Experience from '../components/organisms/Experience';
import SkillsJourney from '../components/organisms/SkillsJourney';
import Contact from '../components/organisms/Contact';
import Footer from '../components/organisms/Footer';

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
      <HeroNew />
      <SkillsJourney />
      <Experience />
      <ProjectsShowcase />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
