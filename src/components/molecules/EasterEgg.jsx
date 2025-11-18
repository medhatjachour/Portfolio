import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { FaRocket, FaCode, FaHeart, FaMicrosoft } from 'react-icons/fa';
import * as THREE from 'three';

/**
 * MEGA Easter Egg - 3D Scene
 */
const MegaScene = () => {
  const particleCount = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10B981" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#EC4899" />
      
      {/* Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#6366F1"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating orbs */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[0, 0, 0]} scale={1.5}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#10B981"
            distort={0.6}
            speed={3}
            metalness={0.9}
            emissive="#10B981"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
      
      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[3, 2, -2]} scale={0.8}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#EC4899"
            distort={0.5}
            speed={2.5}
            metalness={0.8}
            emissive="#EC4899"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>
    </>
  );
};

/**
 * Easter Egg Component - MEGA+ VERSION
 * Activates by typing: mga+
 */
const EasterEgg = () => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [keys, setKeys] = useState([]);
  const konamiCode = ['m', 'g', 'a', '+'];

  useEffect(() => {
    const handleKeyPress = (e) => {
      const newKeys = [...keys, e.key].slice(-4);
      setKeys(newKeys);

      // Check if "mga+" is entered
      if (newKeys.join(',') === konamiCode.join(',')) {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 5000);
        setKeys([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keys]);

  return (
    <AnimatePresence>
      {showEasterEgg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-hidden"
          onClick={() => setShowEasterEgg(false)}
        >
          {/* 3D Background */}
          <div className="absolute inset-0 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
              <MegaScene />
            </Canvas>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="text-center p-12 max-w-4xl"
            >
              {/* MEGA Title */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotateZ: [0, 2, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <h1 className="text-8xl md:text-9xl font-black mb-4">
                  <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                    MEGA+
                  </span>
                </h1>
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  🎮 Konami Code Unlocked!
                </p>
              </motion.div>

              {/* Achievement Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: FaCode, label: 'Code Master', color: 'from-emerald-500 to-teal-400' },
                  { icon: FaRocket, label: 'Innovation', color: 'from-blue-500 to-cyan-400' },
                  { icon: FaMicrosoft, label: 'SRE Expert', color: 'from-purple-500 to-pink-400' },
                  { icon: FaHeart, label: 'Passion', color: 'from-pink-500 to-rose-400' }
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4"
                  >
                    <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mb-2`}>
                      <item.icon className="text-2xl text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="backdrop-blur-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-400 rounded-2xl p-8 mb-8"
              >
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4">
                  💭 "Everything in my imagination is possible"
                </p>
                <p className="text-xl text-gray-300">
                  From Electrical Engineering student to Microsoft SRE
                </p>
                <p className="text-lg text-gray-400 mt-2">
                  Built with ❤️ using React, Three.js & Imagination
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '4+', label: 'Years Experience' },
                  { value: '9+', label: 'Major Projects' },
                  { value: '∞', label: 'Possibilities' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Close hint */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gray-400"
              >
                Click anywhere to return • Press ESC to close
              </motion.p>
            </motion.div>
          </div>

          {/* Floating emojis */}
          {['🚀', '⚡', '💻', '🎯', '🌟', '💡', '🔥', '✨'].map((emoji, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50
              }}
              animate={{ 
                y: -50,
                x: Math.random() * window.innerWidth
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute text-6xl opacity-20 pointer-events-none"
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EasterEgg;
