import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, MeshDistortMaterial, Float, useScroll } from '@react-three/drei';
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import Button from '../atoms/Button';
import { FaGithub, FaLinkedin, FaDownload, FaCode, FaMicrosoft } from 'react-icons/fa';
import { SiReact, SiPython, SiTypescript, SiJavascript } from 'react-icons/si';

/**
 * Flowing Code Stream - represents the journey of a software engineer
 * Code flows naturally through the scene, not confined to boxes
 */
const FlowingCodeStream = () => {
  const streamRef = useRef();
  const particlesCount = 3000;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const cols = new Float32Array(particlesCount * 3);
    
    // Create flowing streams that represent code/data flow
    for (let i = 0; i < particlesCount; i++) {
      const t = i / particlesCount;
      const stream = Math.floor(t * 8);  // 8 parallel streams
      
      // Flowing from left to right like code execution
      pos[i * 3] = (t * 20) - 10 + (Math.random() - 0.5);
      pos[i * 3 + 1] = Math.sin(t * 10 + stream) * 3 + (stream - 4) * 0.8;
      pos[i * 3 + 2] = -Math.cos(t * 8 + stream) * 4 + (Math.random() - 0.5) * 2;
      
      // Color gradient from green (start) to blue (experienced) to purple (advanced)
      const colorPhase = t * 3;
      if (colorPhase < 1) {
        // Green (early career)
        cols[i * 3] = 0.1;
        cols[i * 3 + 1] = 0.8;
        cols[i * 3 + 2] = 0.5;
      } else if (colorPhase < 2) {
        // Blue (growth)
        cols[i * 3] = 0.4;
        cols[i * 3 + 1] = 0.6;
        cols[i * 3 + 2] = 1.0;
      } else {
        // Purple (mastery - Microsoft SRE)
        cols[i * 3] = 0.7;
        cols[i * 3 + 1] = 0.3;
        cols[i * 3 + 2] = 0.9;
      }
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (streamRef.current) {
      // Continuous flow animation
      streamRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
      streamRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    }
  });

  return (
    <points ref={streamRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Floating Tech Symbols - representing the technologies in Medhat's journey
 * No boxes, just floating naturally in the space
 */
const FloatingTechOrb = ({ position, color, scale = 1, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.001;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[0.5, 0]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

/**
 * Journey Timeline Visualization - subtle 3D elements showing career progression
 */
const JourneyPath = () => {
  const pathRef = useRef();
  
  const pathPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      // Create a rising path (career growth)
      points.push(new THREE.Vector3(
        (t - 0.5) * 12,
        t * 3 - 1,
        Math.sin(t * Math.PI * 2) * 2
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <mesh ref={pathRef}>
      <tubeGeometry args={[pathPoints, 50, 0.02, 8, false]} />
      <meshBasicMaterial color="#10B981" transparent opacity={0.15} />
    </mesh>
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 from-white via-slate-50 to-blue-50">
      {/* Flowing 3D Background - transparent and blended */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.4 }}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <FlowingCodeStream />
          <JourneyPath />
          <FloatingTechOrb position={[-4, 2, 0]} color="#61DAFB" icon="react" />
          <FloatingTechOrb position={[4, -1, 2]} color="#3178C6" icon="typescript" />
          <FloatingTechOrb position={[-3, -2, 1]} color="#F7DF1E" icon="javascript" />
          <FloatingTechOrb position={[3, 2, -1]} color="#3776AB" icon="python" />
          <FloatingTechOrb position={[0, -3, 2]} color="#68A063" icon="nodejs" />
        </Canvas>
        
        {/* Gradient overlay to blend 3D with content */}
        <div className="absolute inset-0 bg-gradient-to-b dark:from-transparent dark:via-black/20 dark:to-slate-900/80 from-transparent via-white/10 to-white/30 pointer-events-none" />
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

            <h1 className="text-6xl md:text-8xl font-bold dark:text-white text-gray-900 leading-tight">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block"
              >
                Medhat Ashour
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              >
                Software Engineer
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl md:text-2xl dark:text-gray-300 text-gray-700 max-w-3xl mx-auto"
            >
              Software Engineer @ <span className="dark:text-blue-400 text-blue-600 font-semibold">Microsoft</span> | 
              Building the future with <span className="dark:text-emerald-400 text-emerald-600">4+ years</span> of crafting scalable solutions
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
                className="flex items-center gap-2 px-4 py-2 backdrop-blur-md dark:bg-white/5 bg-white dark:border-white/10 border-slate-200 rounded-full shadow-lg"
              >
                <Icon className={`text-2xl ${color}`} />
                <span className="dark:text-white text-slate-900 font-medium">{label}</span>
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
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
              className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-md dark:bg-white/5 bg-white border-2 dark:border-white/20 border-slate-300 dark:text-white text-slate-900 rounded-xl font-bold text-lg hover:border-emerald-500 dark:hover:bg-white/10 hover:bg-emerald-50 transition-all shadow-lg"
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
              className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-md dark:bg-white/5 bg-white border-2 dark:border-white/20 border-slate-300 dark:text-white text-slate-900 rounded-xl font-bold text-lg hover:border-blue-500 dark:hover:bg-white/10 hover:bg-blue-50 transition-all shadow-lg"
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
