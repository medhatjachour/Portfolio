import React from 'react';
import { motion } from 'framer-motion';

/**
 * Project Filter Component
 * Allows filtering projects by technology
 */
const ProjectFilter = ({ activeFilter, onFilterChange, technologies }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <motion.button
        onClick={() => onFilterChange('all')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          activeFilter === 'all'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'backdrop-blur-md bg-white/5 border border-white/10 text-gray-300 hover:border-white/20'
        }`}
      >
        All Projects
      </motion.button>
      
      {technologies.map((tech) => (
        <motion.button
          key={tech.name}
          onClick={() => onFilterChange(tech.name)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeFilter === tech.name
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'backdrop-blur-md bg-white/5 border border-white/10 text-gray-300 hover:border-white/20'
          }`}
        >
          <tech.icon className="text-lg" />
          {tech.name}
        </motion.button>
      ))}
    </div>
  );
};

export default ProjectFilter;
