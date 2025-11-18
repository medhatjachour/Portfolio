import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { FaMicrosoft, FaBriefcase, FaLaptopCode, FaMedkit } from 'react-icons/fa';

/**
 * Floating particles for experience section
 */
const ExperienceParticles = () => {
  const particlesRef = useRef();
  const particleCount = 800;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#6366F1"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

/**
 * Floating orb for visual enhancement
 */
const ExperienceOrb = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={0.8}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

/**
 * Experience Organism - Real Work History
 */
const Experience = ({ 
  experiences = [
    {
      date: 'May 2025 - Present',
      title: 'Outsource Software Engineer (SRE)',
      company: 'Microsoft',
      location: 'Remote',
      icon: FaMicrosoft,
      color: 'from-blue-500 to-cyan-400',
      achievements: [
        'Overhauled and maintained the CI/CD pipeline for Copilot Chat, supporting structured patch deployment, automated rollout strategies, and safe rollback mechanisms',
        'Built scalable YAML workflows and automated tasks with PowerShell and TypeScript to streamline deployments and boost team efficiency',
        'Designed and executed unit tests to benchmark system performance, helping identify bottlenecks and optimize release quality',
        'Specialized in Continuous Integration and Continuous Delivery (CI/CD) methodologies, contributing to high reliability across environments'
      ]
    },
    {
      date: 'April 2025 - July 2025',
      title: 'Full Stack Engineer',
      company: 'Eng Techno',
      location: 'Kafr El-Shaikh, Egypt',
      icon: FaLaptopCode,
      color: 'from-purple-500 to-pink-400',
      achievements: [
        'Developed and maintained mobile applications using React Native and React Hook Form',
        'Built responsive web applications using React, Redux, and Tailwind CSS',
        'Integrated APIs with Axios for efficient data fetching, improving data retrieval speed by 40%'
      ]
    },
    {
      date: 'August 2024 - December 2024',
      title: 'Frontend Developer',
      company: 'LeadBull',
      location: 'Cairo, Egypt',
      icon: FaBriefcase,
      color: 'from-emerald-500 to-teal-400',
      achievements: [
        'Developed and maintained web applications using React, Redux, and Tailwind CSS',
        'Integrated APIs with Axios for efficient data fetching, improving data retrieval speed by 40%',
        'Collaborated with UX/UI designers to bring designs to life, enhancing user satisfaction scores by 25%',
        'Implemented secure authentication and token refresh mechanisms to enhance protection, achieving 100% compliance with security standards',
        'Conducted code reviews and provided mentorship to junior developers'
      ]
    },
    {
      date: 'May 2022 - January 2024',
      title: 'Software Engineer',
      company: 'Ronan Medical',
      location: 'Remote',
      icon: FaMedkit,
      color: 'from-indigo-500 to-blue-400',
      achievements: [
        'Created an intuitive and modern GUI for brain activity measurement software, enhancing the user experience',
        'Designed and implemented a local database to store critical data efficiently',
        'Designed and managed data flow using OOP principles, improving system reliability by 30%',
        'Enhanced performance of data plotting using PyQtGraph, optimizing real-time visualization and reducing processing time by 15%'
      ]
    }
  ]
}) => {
  return (
    <section 
      id="experience"
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.3 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <ExperienceParticles />
          <ExperienceOrb position={[-3, 2, 0]} color="#6366F1" />
          <ExperienceOrb position={[3, -1, 1]} color="#8B5CF6" />
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Work <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Building the future, one line of code at a time
          </p>
        </motion.div>
        
        {/* Experience Timeline */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon & Date */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exp.color} p-0.5 mb-4`}>
                        <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                          <Icon className="text-3xl text-white" />
                        </div>
                      </div>
                      <div className="text-emerald-400 font-semibold text-sm">
                        {exp.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {exp.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className={`px-4 py-1 rounded-full bg-gradient-to-r ${exp.color} text-white font-semibold text-sm`}>
                          {exp.company}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                          {exp.location}
                        </span>
                      </div>
                      
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="flex items-start gap-3 text-gray-300"
                          >
                            <span className="text-emerald-400 mt-1">▸</span>
                            <span>{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {index < experiences.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-full w-0.5 h-12 bg-gradient-to-b from-purple-500/50 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
