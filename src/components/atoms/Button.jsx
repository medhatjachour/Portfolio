import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button Atom
 * Reusable button component with variants and animations
 * @param {string} variant - Button style variant: primary, secondary, outline
 * @param {string} size - Button size: sm, md, lg
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {string} type - Button type attribute
 * @param {boolean} disabled - Disabled state
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  children, 
  className = '',
  type = 'button',
  disabled = false,
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles using color palette
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-success',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
