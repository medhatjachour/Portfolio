import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Home from './pages/Home';
import LoadingScreen from './components/molecules/LoadingScreen';
import ScrollProgress from './components/molecules/ScrollProgress';
import MusicPlayer from './components/molecules/MusicPlayer';
import EasterEgg from './components/molecules/EasterEgg';
import ThemeSwitcher from './components/molecules/ThemeSwitcher';

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
      <MusicPlayer />
      <EasterEgg />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
