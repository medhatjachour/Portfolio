import React from 'react';

/**
 * Input Atom
 * Reusable input component with consistent styling
 * @param {string} type - Input type
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} name - Input name
 * @param {string} className - Additional CSS classes
 * @param {boolean} required - Required field
 * @param {string} error - Error message
 */
const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  className = '',
  required = false,
  error,
  valid = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 
            bg-[var(--color-surface)] 
            border-2 border-[var(--color-border)]
            rounded-lg
            text-[var(--color-text)]
            placeholder-[var(--color-text-muted)]
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all duration-300
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 pr-10' : ''}
            ${valid && !error ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {valid && !error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold pointer-events-none">✓</span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
