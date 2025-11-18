import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { useThemeStore } from '../../store/themeStore';

/**
 * Theme Switcher Component
 * Matches Medhat's story: From learning (light) to mastery (dark)
 */
const ThemeSwitcher = () => {
  const { isDark, setTheme } = useThemeStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <div className="fixed top-8 right-8 z-[9999] pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="relative pointer-events-auto"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          className="relative w-14 h-14 rounded-full backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 flex items-center justify-center overflow-hidden group cursor-pointer z-50"
        >
          {/* Animated background */}
          <motion.div
            animate={{
              background: isDark 
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            }}
            className="absolute inset-0"
          />

          {/* Icon container */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaMoon className="text-2xl text-blue-200" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -90, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaSun className="text-2xl text-yellow-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Glow effect */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-xl pointer-events-none"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, #6366F1 0%, transparent 70%)'
                : 'radial-gradient(circle, #fbbf24 0%, transparent 70%)'
            }}
          />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 right-16 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2 whitespace-nowrap"
            >
              <div className="flex items-center gap-2">
                <FaPalette className="text-purple-400" />
                <span className="text-white text-sm font-semibold">
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {isDark ? '☀️ Early Journey' : '🌙 Mastery Path'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              transformOrigin: 'center'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: i === 0 ? '-8px' : i === 1 ? 'calc(100% + 8px)' : '50%',
                right: i === 2 ? '-8px' : 'auto',
                backgroundColor: isDark ? '#8B5CF6' : '#fbbf24',
                boxShadow: `0 0 10px ${isDark ? '#8B5CF6' : '#fbbf24'}`
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ThemeSwitcher;
