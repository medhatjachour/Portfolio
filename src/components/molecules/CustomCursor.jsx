import React, { useEffect, useRef, useState } from 'react';
import { , useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom Cursor with 3D Particle Trail
 * Tells Medhat's story through cursor movement
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [trail, setTrail] = useState([]);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add to trail with color progression (green → blue → purple)
      const colors = ['#10B981', '#6366F1', '#8B5CF6', '#EC4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      setTrail((prevTrail) => [
        ...prevTrail.slice(-15), // Keep last 15 particles
        {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: randomColor
        }
      ]);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         target.onclick !== null ||
                         target.style.cursor === 'pointer' ||
                         target.closest('a') ||
                         target.closest('button');
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Remove old trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prevTrail) => prevTrail.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail particles */}
      {trail.map((particle, index) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            x: particle.x,
            y: particle.y
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed pointer-events-none z-[9999] rounded-full blur-sm"
          style={{
            left: 0,
            top: 0,
            width: '12px',
            height: '12px',
            backgroundColor: particle.color,
            boxShadow: `0 0 15px ${particle.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] mix-blend-difference"
        style={{
          left: 0,
          top: 0,
          x: cursorXSpring,
          y: cursorYSpring,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Outer ring */}
        <motion.div
          animate={{
            width: isPointer ? 50 : 40,
            height: isPointer ? 50 : 40,
            opacity: isPointer ? 0.5 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Gradient ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-border opacity-80" />
          
          {/* Inner glow */}
          <motion.div
            animate={{
              scale: isPointer ? 1.2 : 1,
              rotate: 360
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Center dot */}
        <motion.div
          animate={{
            scale: isPointer ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
          style={{
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
        />

        {/* Click ripple effect */}
        {isPointer && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-blue-400"
          />
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
