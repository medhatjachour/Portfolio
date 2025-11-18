import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Button from '../atoms/Button';
import { FaArrowDown, FaDownload } from 'react-icons/fa';

/**
 * Particle Field - Floating particles around the scene
 */
const ParticleField = () => {
  const particlesRef = useRef();
  const count = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#818CF8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

/**
 * Animated 3D Sphere with distortion and glow
 */
const AnimatedSphere = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#6366F1"
          attach="material"
          distort={0.6}
          speed={2}
          roughness={0}
          metalness={0.8}
          emissive="#8B5CF6"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
};

/**
 * Floating geometric shapes around the sphere
 */
const FloatingShapes = () => {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <group ref={group}>
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[3, 1, 0]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#EC4899" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-3, -1, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#06B6D4" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      
      <Float speed={3.5} rotationIntensity={2.5} floatIntensity={2}>
        <mesh position={[0, 2.5, -2]}>
          <icosahedronGeometry args={[0.35]} />
          <meshStandardMaterial color="#10B981" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

/**
 * Hero Organism
 * Full-screen hero section with 3D element and CTA
 * @param {string} name - Your name
 * @param {string} tagline - Your tagline/title
 * @param {string} description - Brief description
 * @param {function} onCTAClick - CTA button click handler
 */
const Hero = ({ 
  name = 'Your Name',
  tagline = 'Full-Stack Developer & Designer',
  description = 'Building fast, accessible, and delightful web applications with modern technologies.',
  onCTAClick
}) => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (onCTAClick) onCTAClick();
  };
  
  return (
    <section 
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Hero section"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6 px-6 py-3 glass rounded-full text-sm font-bold uppercase tracking-wider neon-text"
            >
              ✨ Welcome to my portfolio
            </motion.div>
            
            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 text-[var(--color-text)] leading-tight"
            >
              {name}
            </motion.h1>
            
            {/* Tagline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-8 gradient-text"
            >
              {tagline}
            </motion.h2>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {description}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={scrollToProjects}
                className="group gradient-primary border-0 neon-glow"
              >
                View Projects
                <FaArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
              </Button>
              
              <a
                href="/resume.pdf"
                download="Your-Name-Resume.pdf"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-lg font-semibold rounded-lg glass hover:bg-white/20 transition-all duration-300 group"
              >
                <FaDownload className="group-hover:animate-bounce" />
                Download Resume
              </a>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-current hover:scale-105"
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Enhanced 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-[400px] lg:h-[700px] relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 glass rounded-3xl" />
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              {/* Enhanced Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={1} color="#6366F1" />
              <pointLight position={[-10, -10, -5]} intensity={0.8} color="#EC4899" />
              <pointLight position={[0, 10, 0]} intensity={0.5} color="#06B6D4" />
              <spotLight position={[5, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} color="#8B5CF6" />
              
              {/* 3D Elements */}
              <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
              <ParticleField />
              <AnimatedSphere />
              <FloatingShapes />
              
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.8}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Canvas>
            
            {/* Floating tech badges */}
            <div className="absolute top-6 left-6 glass px-4 py-3 rounded-xl shadow-2xl animate-float">
              <p className="text-xs text-[var(--color-text-muted)] font-semibold">Powered by</p>
              <p className="text-sm font-black gradient-text">React Three Fiber</p>
            </div>
            
            <div className="absolute bottom-6 right-6 glass px-4 py-3 rounded-xl shadow-2xl" style={{ animationDelay: '2s' }}>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold">Interactive</p>
              <p className="text-sm font-black gradient-text">Drag to Explore</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[var(--color-text-muted)] text-sm flex flex-col items-center gap-2"
        >
          <span>Scroll to explore</span>
          <FaArrowDown />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
