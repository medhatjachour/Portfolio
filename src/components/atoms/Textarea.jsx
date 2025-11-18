import React from 'react';

/**
 * Textarea Atom
 * Reusable textarea component with consistent styling
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Textarea value
 * @param {function} onChange - Change handler
 * @param {string} name - Textarea name
 * @param {number} rows - Number of rows
 * @param {string} className - Additional CSS classes
 * @param {boolean} required - Required field
 * @param {string} error - Error message
 */
const Textarea = ({ 
  placeholder, 
  value, 
  onChange, 
  name,
  rows = 4,
  className = '',
  required = false,
  error,
  ...props 
}) => {
  return (
    <div className="w-full">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
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
          resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
