import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text3D, Center } from '@react-three/drei';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import {
  FaReact, FaNodeJs, FaPython, FaGitAlt, FaDocker,
  FaAws, FaDatabase, FaCode, FaRocket, FaBolt, FaMicrosoft
} from 'react-icons/fa';
import {
  SiTypescript, SiJavascript, SiMongodb, SiPostgresql,
  SiRedux, SiTailwindcss, SiNextdotjs, SiFastapi, SiReact
} from 'react-icons/si';

/**
 * Animated DNA Helix - representing growth and evolution
 */
const DNAHelix = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const helixPoints = React.useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 4;
      points.push({
        x: Math.cos(t) * 2,
        y: (i / 100) * 8 - 4,
        z: Math.sin(t) * 2,
        color: i < 25 ? '#10B981' : i < 50 ? '#06B6D4' : i < 75 ? '#3B82F6' : '#8B5CF6'
      });
    }
    return points;
  }, []);

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color={point.color} 
            emissive={point.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Flowing skill particles that blend with the page
 * Representing the continuous learning journey
 */
const SkillParticles = ({ skills }) => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const positions = React.useMemo(() => {
    const pos = new Float32Array(skills.length * 50 * 3);
    skills.forEach((skill, skillIndex) => {
      for (let i = 0; i < 50; i++) {
        const angle = (skillIndex / skills.length) * Math.PI * 2;
        const radius = 3 + (i / 50) * 2;
        const offset = (i / 50) * Math.PI * 2;
        
        const index = (skillIndex * 50 + i) * 3;
        pos[index] = Math.cos(angle + offset) * radius;
        pos[index + 1] = (i / 50) * 4 - 2;
        pos[index + 2] = Math.sin(angle + offset) * radius;
      }
    });
    return pos;
  }, [skills]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#10B981"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Organic floating tech orb - no rigid boxes
 */
const TechOrb = ({ position, color, scale = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

/**
 * The Journey - Story-Driven Skills Component
 * Shows Medhat's evolution from EE student to Microsoft SRE
 */
const SkillsJourney = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // The story: organized by career milestones
  const journey = [
    {
      phase: "The Foundation",
      period: "2017-2022 | University Days",
      story: "Started with Arduino & Raspberry Pi, fell in love with code",
      skills: [
        { name: 'Python', icon: <FaPython />, level: 95, color: '#3776AB' },
        { name: 'PyQt/PySide', icon: <FaCode />, level: 90, color: '#41CD52' },
        { name: 'SQL', icon: <FaDatabase />, level: 85, color: '#336791' }
      ]
    },
    {
      phase: "The Breakthrough",
      period: "2022-2024 | Ronan Medical & Growth",
      story: "Built real-time brain activity software, discovered frontend magic",
      skills: [
        { name: 'JavaScript', icon: <SiJavascript />, level: 95, color: '#F7DF1E' },
        { name: 'React', icon: <FaReact />, level: 95, color: '#61DAFB' },
        { name: 'TypeScript', icon: <SiTypescript />, level: 90, color: '#3178C6' },
        { name: 'Redux', icon: <SiRedux />, level: 88, color: '#764ABC' }
      ]
    },
    {
      phase: "The Acceleration",
      period: "2024-2025 | Full Stack Mastery",
      story: "From frontend specialist to full-stack engineer at LeadBull",
      skills: [
        { name: 'Node.js', icon: <FaNodeJs />, level: 88, color: '#339933' },
        { name: 'Next.js', icon: <SiNextdotjs />, level: 90, color: '#000000' },
        { name: 'MongoDB', icon: <SiMongodb />, level: 85, color: '#47A248' },
        { name: 'PostgreSQL', icon: <SiPostgresql />, level: 82, color: '#4169E1' },
        { name: 'Tailwind', icon: <SiTailwindcss />, level: 92, color: '#06B6D4' },
        { name: 'FastAPI', icon: <SiFastapi />, level: 85, color: '#009688' }
      ]
    },
    {
      phase: "The Achievement",
      period: "2025-Present | Microsoft SRE",
      story: "CI/CD pipelines for Copilot Chat, scaling at Microsoft",
      skills: [
        { name: 'Git/GitHub', icon: <FaGitAlt />, level: 90, color: '#F05032' },
        { name: 'Docker', icon: <FaDocker />, level: 80, color: '#2496ED' },
        { name: 'AWS', icon: <FaAws />, level: 78, color: '#FF9900' },
        { name: 'CI/CD', icon: <FaRocket />, level: 85, color: '#10B981' }
      ]
    }
  ];

  const allSkills = journey.flatMap(j => j.skills);

  return (
    <section 
      ref={sectionRef}
      id="skills"
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Skills and Journey"
    >
      {/* Flowing 3D background - no boxes, blends naturally */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#10B981" />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#6366F1" />
          
          <DNAHelix />
          <SkillParticles skills={allSkills} />
          
          {/* Floating tech orbs representing different skill areas */}
          <TechOrb position={[-3, 2, -2]} color="#61DAFB" scale={0.7} />
          <TechOrb position={[3, -1, -3]} color="#3178C6" scale={0.6} />
          <TechOrb position={[-2, -2, -1]} color="#47A248" scale={0.5} />
          <TechOrb position={[2, 1, -4]} color="#F7DF1E" scale={0.6} />
        </Canvas>
      </div>

      {/* Gradient overlays for seamless blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-purple-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <FaBolt className="animate-pulse" />
            The Journey
          </motion.span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
              From Student to SRE
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-[var(--color-text-muted)] max-w-3xl mx-auto">
            Every skill tells a story. Here's mine.
          </p>
        </motion.div>

        {/* The Journey Timeline */}
        <div className="space-y-24">
          {journey.map((milestone, index) => (
            <motion.div
              key={milestone.phase}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {/* Timeline connector */}
              {index < journey.length - 1 && (
                <div className="absolute left-1/2 top-full h-24 w-0.5 bg-gradient-to-b from-emerald-400/50 to-transparent transform -translate-x-1/2 hidden lg:block" />
              )}

              <div className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Story side */}
                <div className={`mb-8 lg:mb-0 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border border-white/10"
                  >
                    <span className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-emerald-500/30 to-blue-500/30 text-emerald-400 text-sm font-bold">
                      {milestone.period}
                    </span>
                    <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                      {milestone.phase}
                    </h3>
                    <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
                      {milestone.story}
                    </p>

                    {/* Phase icon */}
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 flex items-center justify-center">
                        {index === 0 && <FaCode className="text-3xl text-emerald-400" />}
                        {index === 1 && <FaReact className="text-3xl text-blue-400 animate-spin-slow" />}
                        {index === 2 && <FaBolt className="text-3xl text-purple-400" />}
                        {index === 3 && <FaMicrosoft className="text-3xl text-blue-500" />}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Skills side */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {milestone.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.2 + skillIndex * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/50 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="text-3xl p-2 rounded-lg"
                            style={{ color: skill.color, backgroundColor: `${skill.color}20` }}
                          >
                            {skill.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{skill.name}</h4>
                            <div className="text-xs text-emerald-400 font-semibold">{skill.level}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : {}}
                            transition={{ duration: 1, delay: index * 0.2 + skillIndex * 0.1 + 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Focus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-24 text-center"
        >
          <div className="backdrop-blur-md bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-3xl p-8 border border-emerald-400/30 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500">
              🚀 Currently Exploring
            </h3>
            <p className="text-lg text-[var(--color-text-muted)]">
              Web3, AI Integration, Advanced 3D Experiences & Scalable Cloud Architecture
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsJourney;
