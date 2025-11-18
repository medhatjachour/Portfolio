import React from 'react';
import { motion } from 'framer-motion';

/**
 * Icon Atom
 * Wrapper for react-icons with consistent sizing and animations
 * @param {React.Component} icon - Icon component from react-icons
 * @param {string} size - Icon size: sm, md, lg, xl
 * @param {string} color - Icon color (Tailwind class or CSS variable)
 * @param {string} className - Additional CSS classes
 * @param {boolean} animate - Whether to animate on hover
 */
const Icon = ({ 
  icon: IconComponent, 
  size = 'md', 
  color = 'currentColor',
  className = '',
  animate = false,
  ...props 
}) => {
  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };
  
  const iconSize = sizeMap[size] || 24;
  
  const iconElement = (
    <IconComponent 
      size={iconSize} 
      color={color}
      className={className}
      {...props}
    />
  );
  
  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {iconElement}
      </motion.div>
    );
  }
  
  return iconElement;
};

export default Icon;
