import React, { useRef, useMemo, memo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaLinkedin, FaDownload, FaMicrosoft } from 'react-icons/fa';
import { SiReact, SiPython, SiTypescript, SiJavascript } from 'react-icons/si';

/**
 * Performance hook - detect device capabilities
 */
const usePerformanceMode = () => {
  const [mode, setMode] = useState('high');

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;
    setMode(isLowEnd ? 'low' : 'high');
  }, []);

  return mode;
};

/**
 * Optimized Starry Sky - Using InstancedMesh for better performance
 * 5000 stars rendered efficiently
 */
const StarrySky = memo(() => {
  const starsRef = useRef();
  const starCount = 5000;
  const performanceMode = usePerformanceMode();
  const adjustedCount = performanceMode === 'low' ? 1000 : starCount;

  // Frame throttling - only update every 3 frames
  const frameCount = useRef(0);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, colors } = useMemo(() => {
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const pos = [];
    const cols = [];

    for (let i = 0; i < adjustedCount; i++) {
      pos.push([
        (pseudoRandom(i * 3) - 0.5) * 50,
        (pseudoRandom(i * 3 + 1) - 0.5) * 30,
        (pseudoRandom(i * 3 + 2) - 0.5) * 40 - 10
      ]);

      const brightness = 0.8 + pseudoRandom(i * 11) * 0.2;
      cols.push(new THREE.Color(brightness, brightness, 0.9 + pseudoRandom(i * 13) * 0.1));
    }

    return { positions: pos, colors: cols };
  }, [adjustedCount]);

  useFrame((state) => {
    frameCount.current++;
    // Update only every 3rd frame
    if (frameCount.current %3 !== 0) return;

    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <instancedMesh ref={starsRef} args={[null, null, adjustedCount]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial vertexColors />
      {positions.map((pos, i) => {
        dummy.position.set(...pos);
        dummy.updateMatrix();
        starsRef.current?.setMatrixAt(i, dummy.matrix);
        starsRef.current?.setColorAt(i, colors[i]);
      })}
    </instancedMesh>
  );
});

StarrySky.displayName = 'StarrySky';

/**
 * Optimized Floating Code - Reduced geometry complexity
 */
const FloatingCode = memo(() => {
  const groupRef = useRef();
  const frameCount = useRef(0);

  const codeSnippets = useMemo(() => {
    const snippets = [
      'const', 'function', 'return', 'import', 'export',
      'async', 'await', 'class', 'extends', 'interface',
      '=>', '{}', '[]', '()', '===', '!==', '&&', '||',
      '...', '?.', '??', '<>', '/>', '`${}`',
      'React', 'Node.js', 'TypeScript', 'Next.js',
      'Express', 'FastAPI', 'PYQT',
      'API', 'REST', 'GraphQL', 'DB', 'SQL', 'NoSQL',
      'Docker', 'K8s', 'CI/CD', 'Git', 'AWS', 'Azure',
      'Redux', 'State', 'Props', 'Hooks', 'JSX', 'CSS',
      'map()', 'filter()', 'reduce()', 'forEach()', 'find()',
      'push()', 'pop()', 'shift()', 'splice()', 'slice()',
      'component', 'render', 'useState', 'useEffect', 'props',
      'callback', 'promise', 'fetch', 'axios', 'query'
    ];

    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    return snippets.map((text, i) => ({
      text,
      position: [
        (pseudoRandom(i * 3) - 0.5) * 30,
        (pseudoRandom(i * 3 + 1) - 0.5) * 20,
        (pseudoRandom(i * 3 + 2) - 0.5) * 15 - 5
      ],
      rotation: pseudoRandom(i * 7) * Math.PI * 2,
      speed: 0.3 + pseudoRandom(i * 11) * 1.2,
      fontSize: 0.15 + pseudoRandom(i * 13) * 0.2,
      color: ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'][i % 7]
    }));
  }, []);

  useFrame((state) => {
    frameCount.current++;
    // Update every 2 frames
    if (frameCount.current % 2 !== 0) return;

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const snippet = codeSnippets[i];
        child.position.y = snippet.position[1] + Math.sin(state.clock.elapsedTime * snippet.speed + i) * 0.5;
        child.rotation.y = state.clock.elapsedTime * 0.15 + snippet.rotation;
        child.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {codeSnippets.map((snippet, i) => (
        <Text
          key={i}
          position={snippet.position}
          fontSize={snippet.fontSize}
          color={snippet.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {snippet.text}
        </Text>
      ))}
    </group>
  );
});

FloatingCode.displayName = 'FloatingCode';

/**
 * Optimized Shooting Star
 */
const ShootingStar = memo(({ delay = 0, startPos = [10, 5, -5] }) => {
  const starRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [startPosition] = useState(startPos);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
          if (starRef.current) {
            starRef.current.position.set(...startPosition);
          }
        }, 2000);
      }, 8000);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, startPosition]);

  useFrame(() => {
    if (starRef.current && isVisible) {
      starRef.current.position.x -= 0.15;
      starRef.current.position.y -= 0.08;
    }
  });

  if (!isVisible) return null;

  return (
    <group>
      <mesh ref={starRef} position={startPosition}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[startPosition[0] + 0.3, startPosition[1] + 0.15, startPosition[2]]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
});

ShootingStar.displayName = 'ShootingStar';

/**
 * Optimized Floating Stars - Using InstancedMesh
 */
const FloatingStars = memo(() => {
  const starsRef = useRef();
  const frameCount = useRef(0);
  const count = 100;

  const stars = useMemo(() => {
    const starArray = [];
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      starArray.push({
        position: [
          (pseudoRandom(i * 5) - 0.5) * 40,
          (pseudoRandom(i * 5 + 1) - 0.5) * 25,
          (pseudoRandom(i * 5 + 2) - 0.5) * 20 - 5
        ],
        scale: 0.5 + pseudoRandom(i * 7) * 1.5,
        speed: 0.5 + pseudoRandom(i * 9) * 2,
        delay: pseudoRandom(i * 11) * Math.PI * 2
      });
    }
    return starArray;
  }, []);

  useFrame((state) => {
    frameCount.current++;
    // Update every 3 frames
    if (frameCount.current % 3 !== 0) return;

    if (starsRef.current) {
      starsRef.current.children.forEach((star, i) => {
        const opacity = 0.3 + Math.sin(state.clock.elapsedTime * stars[i].speed + stars[i].delay) * 0.7;
        if (star.material) {
          star.material.opacity = opacity;
        }
      });
    }
  });

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position} scale={star.scale}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
});

FloatingStars.displayName = 'FloatingStars';

/**
 * Optimized Constellations
 */
const Constellations = memo(() => {
  const linesRef = useRef();
  const frameCount = useRef(0);

  const { positions } = useMemo(() => {
    const pos = [];
    const constellations = [
      [[-8, 5, -10], [-6, 6, -10], [-4, 5.5, -10], [-2, 5, -10]],
      [[2, 0, -12], [4, -0.5, -12], [6, -1, -12]],
      [[-5, -3, -8], [-3, -2, -8], [-1, -3.5, -8]]
    ];

    constellations.forEach(constellation => {
      for (let i = 0; i < constellation.length - 1; i++) {
        pos.push(...constellation[i], ...constellation[i + 1]);
      }
    });

    return { positions: new Float32Array(pos) };
  }, []);

  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 5 !== 0) return;

    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4FB3D4" transparent opacity={0.3} />
    </lineSegments>
  );
});

Constellations.displayName = 'Constellations';

/**
 * Optimized Moon
 */
const Moon = memo(() => {
  const moonRef = useRef();
  const frameCount = useRef(0);

  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;

    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={moonRef} position={[-20, 12, -20]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#E8E8E8"
          emissive="#C9C9C9"
          emissiveIntensity={0.5}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
});

Moon.displayName = 'Moon';

/**
 * Optimized 3D Scene - Memoized to prevent re-renders
 */
const ThreeScene = memo(() => {
 return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.2} color="#4FB3D4" />
      
      <StarrySky />
      <FloatingStars />
      <FloatingCode />
      <Constellations />
      <Moon />
      
      <ShootingStar delay={0} startPos={[12, 8, -8]} />
      <ShootingStar delay={2500} startPos={[-10, 6, -6]} />
      <ShootingStar delay={5000} startPos={[8, -5, -10]} />
      <ShootingStar delay={7500} startPos={[-8, 4, -7]} />
    </>
  );
});

ThreeScene.displayName = 'ThreeScene';

/**
 * Optimized Hero Component
 */
const HeroNew = () => {
  const canvasRef = useRef();
  const { scrollYProgress } = useFramerScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // Memoize tech badges
  const techBadges = useMemo(() => [
    { Icon: SiReact, label: 'React', color: 'text-[#61DAFB]' },
    { Icon: SiTypescript, label: 'TypeScript', color: 'text-[#3178C6]' },
    { Icon: SiPython, label: 'Python', color: 'text-[#3776AB]' },
    { Icon: SiJavascript, label: 'JavaScript', color: 'text-[#F7DF1E]' },
    { Icon: FaMicrosoft, label: 'Microsoft', color: 'text-[#00A4EF]' },
  ], []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#0f1729] dark:to-[#050810] from-[#1a1f3a] via-[#151b2e] to-[#0a0e1f]">
      {/* Optimized Starry Sky Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{
            alpha: true,
            antialias: false, // Disable antialiasing for performance
            powerPreference: "high-performance",
            stencil: false,
          }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          performance={{ min: 0.5 }} // Auto-adjust performance
          style={{ background: 'transparent' }}
        >
          <ThreeScene />
        </Canvas>

        <div className="absolute inset-0 bg-gradient-to-b dark:from-transparent dark:via-black/30 dark:to-black/60 from-transparent via-[#0a0e27]/40 to-[#050810]/80 pointer-events-none" />
      </div>

      {/* Content Layer - Kept exactly as original */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <img
                src="/profile.png"
                alt="Medhat Ashour"
                width="128"
                height="128"
                loading="eager"
                fetchpriority="high"
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border border-cyan-400/30 shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.3 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative space-y-3"
          >
            <div className="absolute inset-0 -z-10 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/40 rounded-full blur-[0.5px]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 2, 1],
                    y: [0, -30, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.h1
              className="text-6xl md:text-8xl font-light tracking-wide leading-tight"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.3 },
                  default: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                className="block text-white/90 drop-shadow-[0_0_50px_rgba(6,182,212,0.5)]"
              >
                Medhat Ashour
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.8, 1, 0.8],
                y: [0, -3, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.6 },
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }
              }}
              className="text-2xl md:text-3xl text-cyan-400/90 font-light tracking-wider drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              Software Engineer @ Microsoft
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                y: [0, -2, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.9 },
                y: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }
              }}
              className="text-sm md:text-base text-gray-400/70 italic font-light max-w-2xl mx-auto pt-3"
            >
              💭 everything in my imagination is possible
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 1.2 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }
            }}
            className="flex flex-wrap justify-center gap-4 pt-6"
          >
            <motion.a
              href="https://github.com/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 0 25px rgba(6,182,212,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-white/5 border border-white/20 text-white rounded-lg font-light hover:border-cyan-400/50 hover:bg-white/10 transition-all"
            >
              <FaGithub className="text-lg" />
              <span>GitHub</span>
            </motion.a>

            <motion.a
              href="https://linkedin.com/in/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 0 25px rgba(6,182,212,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-white/5 border border-white/20 text-white rounded-lg font-light hover:border-cyan-400/50 hover:bg-white/10 transition-all"
            >
              <FaLinkedin className="text-lg" />
              <span>LinkedIn</span>
            </motion.a>

            <motion.a
              href="/medhat frontend engineer.pdf"
              download
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 0 25px rgba(6,182,212,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-white/10 border border-cyan-400/30 text-white rounded-lg font-light hover:border-cyan-400 hover:bg-white/15 transition-all"
            >
              <FaDownload className="text-lg" />
              <span>Resume</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-sm font-medium">Discover My Journey</span>
              <div className="w-6 h-10 rounded-full border-2 border-emerald-400/50 flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroNew;
