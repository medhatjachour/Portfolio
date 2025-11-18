import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaHeart } from 'react-icons/fa';
import { useThemeStore } from '../../store/themeStore';
import { FaSun, FaMoon } from 'react-icons/fa';

/**
 * Footer Organism
 * Footer with copyright, theme toggle, and back-to-top button
 * @param {string} name - Your name for copyright
 */
const Footer = ({ name = 'Your Name' }) => {
  const { isDark, toggleTheme } = useThemeStore();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-[var(--color-surface)] py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-text-muted)] text-sm flex items-center gap-2"
          >
            © {new Date().getFullYear()} {name}. Made with 
            <FaHeart className="text-red-500 animate-pulse" /> 
            using React & Tailwind CSS
          </motion.p>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FaSun size={18} className="text-warning" />
              ) : (
                <FaMoon size={18} className="text-primary" />
              )}
            </motion.button>
            
            {/* Back to Top Button */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
              aria-label="Scroll to top"
              title="Back to top"
            >
              <FaArrowUp size={18} />
            </motion.button>
          </div>
        </div>
        
        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-[var(--color-border)] text-center"
        >
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with React, Three.js, Framer Motion, Zustand & Tailwind CSS
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
