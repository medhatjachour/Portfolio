import React from 'react';
import { motion } from 'framer-motion';

/**
 * TimelineItem Molecule
 * Timeline entry component for experience/education
 * @param {string} date - Date or date range
 * @param {string} title - Job title or degree
 * @param {string} company - Company or institution name
 * @param {array} achievements - List of achievements/responsibilities
 * @param {number} index - Item index for stagger animation
 * @param {boolean} isLast - Whether this is the last item
 */
const TimelineItem = ({ 
  date, 
  title, 
  company, 
  achievements = [], 
  index = 0,
  isLast = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative pl-8 pb-8"
    >
      {/* Timeline Line and Dot */}
      <div className="absolute left-0 top-0 h-full">
        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary border-4 border-[var(--color-bg)] z-10" />
        {!isLast && (
          <div className="absolute left-[7px] top-6 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
        )}
      </div>
      
      {/* Content */}
      <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)] hover:border-primary transition-colors duration-300">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">
              {title}
            </h3>
            <p className="text-primary font-semibold">{company}</p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap">
            {date}
          </span>
        </div>
        
        {/* Achievements List */}
        {achievements.length > 0 && (
          <ul className="space-y-2 text-[var(--color-text-muted)]">
            {achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
