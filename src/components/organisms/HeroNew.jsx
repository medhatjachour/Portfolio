import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, MeshDistortMaterial, Float, useScroll } from '@react-three/drei';
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import Button from '../atoms/Button';
import { FaGithub, FaLinkedin, FaDownload, FaCode, FaMicrosoft } from 'react-icons/fa';
import { SiReact, SiPython, SiTypescript, SiJavascript } from 'react-icons/si';

/**
 * Starry Sky - thousands of twinkling stars
 */
const StarrySky = () => {
  const starsRef = useRef();
  const starCount = 5000;
  
  const { positions, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const size = new Float32Array(starCount);
    const cols = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Distribute stars across the sky
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      
      // Varying star sizes
      size[i] = Math.random() * 0.5 + 0.1;
      
      // White to blue-white stars
      const brightness = 0.8 + Math.random() * 0.2;
      cols[i * 3] = brightness;
      cols[i * 3 + 1] = brightness;
      cols[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }
    
    return { positions: pos, sizes: size, colors: cols };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      // Subtle rotation to simulate sky movement
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Floating Code Snippets - code fragments floating in the sky
 */
const FloatingCode = () => {
  const groupRef = useRef();
  
  const codeSnippets = useMemo(() => {
    const snippets = [
      // Essential Keywords
      'const', 'function', 'async', 'await', 'class',
      
      // Popular Frameworks
      'React', 'Node.js', 'TypeScript', 'Next.js',
      
      // Key Concepts
      'API', 'Docker', 'Git', 'AWS',
      
      // Common Operators
      '=>', '{}', '[]', '()'
    ];
    
    // Seeded random using index
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
      fontSize: 0.2 + pseudoRandom(i * 13) * 0.3,
      color: ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'][i % 7]
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = codeSnippets[i].position[1] + Math.sin(state.clock.elapsedTime * codeSnippets[i].speed + i) * 0.5;
        child.rotation.y = state.clock.elapsedTime * 0.15 + codeSnippets[i].rotation;
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
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {snippet.text}
        </Text>
      ))}
    </group>
  );
};

/**
 * Shooting Stars - occasional streaks across the sky
 */
const ShootingStar = ({ delay = 0, startPos = [10, 5, -5] }) => {
  const starRef = useRef();
  const [isVisible, setIsVisible] = React.useState(false);
  const [startPosition] = React.useState(startPos);
  
  React.useEffect(() => {
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
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Trail effect */}
      <mesh position={[startPosition[0] + 0.3, startPosition[1] + 0.15, startPosition[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

/**
 * Extra Floating Stars - additional twinkling stars in various sizes
 */
const FloatingStars = () => {
  const starsRef = useRef();
  
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 100; i++) {
      const pseudoRandom = (seed) => {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      
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
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Constellation Lines - connecting stars to form patterns
 */
const Constellations = () => {
  const linesRef = useRef();
  
  const { positions } = useMemo(() => {
    const pos = [];
    const constellations = [
      // Big Dipper
      [[-8, 5, -10], [-6, 6, -10], [-4, 5.5, -10], [-2, 5, -10]],
      // Orion's Belt
      [[2, 0, -12], [4, -0.5, -12], [6, -1, -12]],
      // Random constellation
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
};

/**
 * Moon - glowing moon in the background
 */
const Moon = () => {
  const moonRef = useRef();
  
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={moonRef} position={[8, 6, -20]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          emissive="#C9C9C9"
          emissiveIntensity={0.5}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
};

/**
 * Hero Organism - Telling Medhat's Story
 * "A passionate software engineer who turned imagination into reality"
 */
const HeroNew = () => {
  const canvasRef = useRef();
  const { scrollYProgress } = useFramerScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  // Tech badges to display
  const techBadges = [
    { Icon: SiReact, label: 'React', color: 'text-[#61DAFB]' },
    { Icon: SiTypescript, label: 'TypeScript', color: 'text-[#3178C6]' },
    { Icon: SiPython, label: 'Python', color: 'text-[#3776AB]' },
    { Icon: SiJavascript, label: 'JavaScript', color: 'text-[#F7DF1E]' },
    { Icon: FaMicrosoft, label: 'Microsoft', color: 'text-[#00A4EF]' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#0f1729] dark:to-[#050810] from-[#1a1f3a] via-[#151b2e] to-[#0a0e1f]">
      {/* Starry Sky Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color="#4FB3D4" />
          
          {/* Starry Sky - Main background stars */}
          <StarrySky />
          
          {/* Extra Floating Stars - Larger twinkling stars */}
          <FloatingStars />
          
          {/* Floating Code - Software terms and syntax */}
          <FloatingCode />
          
          {/* Constellations */}
          <Constellations />
          
          {/* Moon */}
          <Moon />
          
          {/* Shooting Stars */}
          <ShootingStar delay={0} startPos={[12, 8, -8]} />
          <ShootingStar delay={2500} startPos={[-10, 6, -6]} />
          <ShootingStar delay={5000} startPos={[8, -5, -10]} />
          <ShootingStar delay={7500} startPos={[-8, 4, -7]} />
        </Canvas>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b dark:from-transparent dark:via-black/30 dark:to-black/60 from-transparent via-[#0a0e27]/40 to-[#050810]/80 pointer-events-none" />
      </div>

      {/* Content Layer */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center"
      >
        <div className="space-y-8">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <img 
                src="/profile.png" 
                alt="Medhat Ashour" 
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Animated Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-emerald-400 text-lg font-semibold tracking-wide"
            >
              💭 everything in my imagination is possible
            </motion.p>

            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                Medhat Ashour
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                Software Engineer
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Software Engineer @ <span className="text-cyan-400 font-semibold">Microsoft</span> | 
              Building the future with <span className="text-emerald-400">4+ years</span> of crafting scalable solutions
            </motion.p>
          </motion.div>

          {/* Tech Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {techBadges.map(({ Icon, label, color }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all"
              >
                <Icon className={`text-2xl ${color}`} />
                <span className="text-white font-medium">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.a
              href="/medhat frontend engineer.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all"
            >
              <FaDownload />
              Download Resume
            </motion.a>

            <motion.a
              href="https://github.com/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-md bg-white/10 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:border-cyan-400 hover:bg-white/20 transition-all shadow-lg"
            >
              <FaGithub />
              View My Work
            </motion.a>

            <motion.a
              href="https://linkedin.com/in/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-md bg-white/10 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:border-blue-400 hover:bg-white/20 transition-all shadow-lg"
            >
              <FaLinkedin />
              Connect
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
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
