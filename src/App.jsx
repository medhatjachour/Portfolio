import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import LoadingScreen from './components/molecules/LoadingScreen';
import ScrollProgress from './components/molecules/ScrollProgress';
import ThemeSwitcher from './components/molecules/ThemeSwitcher';

// Lazy load heavy components for better performance
// Split bundle and load on-demand
const Home = lazy(() => import('./pages/Home'));
const MusicPlayer = lazy(() => import('./components/molecules/MusicPlayer'));
const EasterEgg = lazy(() => import('./components/molecules/EasterEgg'));

/**
 * Main App Component
 * Sets up routing and theme management
 */
function App() {
  const isDark = useThemeStore((state) => state.isDark);
  
  // Initialize theme on mount and whenever it changes
  useEffect(() => {
    // Apply the theme immediately
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  // Check for system preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Only set if user hasn't manually changed theme (first visit)
    const hasStoredPreference = localStorage.getItem('theme-storage');
    if (!hasStoredPreference && prefersDark !== isDark) {
      useThemeStore.getState().setTheme(prefersDark);
    }
  }, []);
  
  return (
    <Router>
      <LoadingScreen />
      <ScrollProgress />
      <ThemeSwitcher />
      {/* Lazy load non-critical components */}
      <Suspense fallback={null}>
        <MusicPlayer />
        <EasterEgg />
      </Suspense>
      <div className="App">
        {/* Main content with loading fallback */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="text-white text-2xl animate-pulse">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
