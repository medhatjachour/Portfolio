import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Loading Screen Component
 * Shows while the portfolio is loading
 */
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [showShine, setShowShine] = useState(false);
  const fullText = '💭 everything in my imagination is possible';

  // Typing effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, []);

  // Shine effect after typing is complete
  useEffect(() => {
    if (typingComplete) {
      setTimeout(() => {
        setShowShine(true);
      }, 300);
    }
  }, [typingComplete]);

  useEffect(() => {
    // Simulate loading progress - slower to match typing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100 && typingComplete && showShine) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        // Slower progress to wait for typing
        return prev + Math.random() * 8;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [typingComplete, showShine]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-blue-900"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: (i * 137) % window.innerWidth,
                  y: (i * 71) % window.innerHeight,
                  scale: 0.5 + ((i * 17) % 50) / 100
                }}
                animate={{
                  y: [null, ((i * 83) % window.innerHeight)],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 2 + ((i * 23) % 300) / 100,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Logo/Name */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.h1
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent"
                style={{ backgroundSize: '200% auto' }}
              >
                MA
              </motion.h1>
              <p className="text-gray-400 text-xl mt-2">
                Medhat Ashour
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 md:w-96 mx-auto">
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
                />
                <motion.div
                  animate={{
                    x: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ width: '50%' }}
                />
              </div>

              {/* Percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-400">Loading Portfolio...</span>
                <span className="text-white font-bold">
                  {Math.min(Math.round(progress), 100)}%
                </span>
              </motion.div>
            </div>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              ))}
            </motion.div>

            {/* Tagline with typing effect */}
            <motion.div className="relative mt-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-gray-400 italic text-lg relative z-10"
              >
                {typedText}
                {!typingComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-cyan-400 ml-1"
                  />
                )}
              </motion.p>
              
              {/* Shine effect after typing completes */}
              {showShine && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut",
                    repeat: 2
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm"
                  style={{ width: '50%' }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
