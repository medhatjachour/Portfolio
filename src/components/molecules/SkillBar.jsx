import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * SkillBar Molecule
 * Animated skill progress bar component
 * @param {string} skill - Skill name
 * @param {number} level - Skill level (0-100)
 * @param {string} icon - Optional icon component
 * @param {number} index - Bar index for stagger animation
 */
const SkillBar = ({ skill, level, icon, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    
    if (barRef.current) {
      observer.observe(barRef.current);
    }
    
    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current);
      }
    };
  }, []);
  
  return (
    <motion.div
      ref={barRef}
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      {/* Skill Name and Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="font-semibold text-[var(--color-text)]">{skill}</span>
        </div>
        <span className="text-sm font-medium text-[var(--color-text-muted)]">
          {level}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-success rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default SkillBar;
