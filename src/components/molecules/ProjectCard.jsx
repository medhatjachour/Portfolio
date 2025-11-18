import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * ProjectCard Molecule
 * Card component for displaying project information
 * @param {string} title - Project title
 * @param {string} description - Project description
 * @param {array} techStack - Array of technologies used
 * @param {string} image - Project thumbnail URL
 * @param {string} liveUrl - Live demo URL
 * @param {string} githubUrl - GitHub repository URL
 * @param {number} index - Card index for stagger animation
 */
const ProjectCard = ({ 
  title, 
  description, 
  techStack = [], 
  image, 
  liveUrl, 
  githubUrl,
  index = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -12, rotateY: 5 }}
      className="group glass rounded-2xl overflow-hidden border border-primary/20 card-3d hover:neon-glow"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Project Image with Overlay */}
      <div className="relative h-52 overflow-hidden">
        {image ? (
          <>
            <motion.img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6 }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            {/* Tech stack preview on image */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
              {techStack.slice(0, 3).map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 glass text-white rounded-lg text-xs font-medium backdrop-blur-md"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="px-2 py-1 glass text-white rounded-lg text-xs font-medium backdrop-blur-md">
                  +{techStack.length - 3}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
            <span className="text-6xl font-bold text-white opacity-50">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 gradient-text">
          {title}
        </h3>
        <p className="text-[var(--color-text-muted)] mb-5 line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        {/* Links */}
        <div className="flex gap-3">
          {liveUrl && (
            <motion.a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all text-sm font-bold flex-1 justify-center"
              aria-label={`View live demo of ${title}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt size={14} />
              Live Demo
            </motion.a>
          )}
          {githubUrl && (
            <motion.a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 glass border border-primary/30 text-primary rounded-xl hover:border-primary transition-all text-sm font-bold"
              aria-label={`View GitHub repository for ${title}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
