/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',      // Indigo
        secondary: '#8B5CF6',    // Purple
        accent: '#EC4899',       // Pink
        success: '#10B981',      // Emerald
        warning: '#F59E0B',      // Amber
        info: '#06B6D4',         // Cyan
        bgLight: '#F9FAFB',
        bgDark: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
