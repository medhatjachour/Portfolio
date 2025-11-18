// Zustand store for theme management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store
 * Manages dark/light theme state globally
 * Persists theme preference to localStorage
 */
export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true, // Default to dark theme
      
      /**
       * Toggle between dark and light theme
       */
      toggleTheme: () => set((state) => {
        const newTheme = !state.isDark;
        // Update document class for Tailwind dark mode
        if (newTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: newTheme };
      }),
      
      /**
       * Set theme explicitly
       * @param {boolean} isDark - Whether to use dark theme
       */
      setTheme: (isDark) => set(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark };
      }),
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);
