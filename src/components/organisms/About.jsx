import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SkillBar from '../molecules/SkillBar';
import { 
  FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, 
  FaJs, FaGitAlt, FaDocker, FaAward, FaCode, FaUsers 
} from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql } from 'react-icons/si';

/**
 * 3D Rotating Icon Sphere
 */
const IconSphere = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

/**
 * 3D Background Scene for Profile
 */
const Profile3DScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366F1" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#EC4899" />
      
      <IconSphere position={[-1.5, 1, 0]} color="#6366F1" />
      <IconSphere position={[1.5, -1, 0]} color="#EC4899" />
      <IconSphere position={[0, 1.5, -1]} color="#10B981" />
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

/**
 * About Organism
 * About section with bio, profile image, and skills
 * @param {string} bio - Your biography text
 * @param {string} profileImage - Profile photo URL
 * @param {array} skills - Array of skill objects {name, level, icon}
 */
const About = ({ 
  bio = "I'm a Full-Stack Developer with 5+ years of experience building web applications for startups and mid-size companies. I specialize in React, Node.js, and modern web technologies, focusing on performance, accessibility, and delightful user experiences.",
  profileImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&crop=faces',
  skills = [
    { name: 'JavaScript', level: 90, icon: <FaJs /> },
    { name: 'TypeScript', level: 85, icon: <SiTypescript /> },
    { name: 'React', level: 90, icon: <FaReact /> },
    { name: 'Node.js', level: 85, icon: <FaNodeJs /> },
    { name: 'Python', level: 75, icon: <FaPython /> },
    { name: 'HTML5', level: 95, icon: <FaHtml5 /> },
    { name: 'CSS3/Tailwind', level: 90, icon: <FaCss3Alt /> },
    { name: 'Git', level: 85, icon: <FaGitAlt /> },
    { name: 'MongoDB', level: 80, icon: <SiMongodb /> },
    { name: 'PostgreSQL', level: 75, icon: <SiPostgresql /> },
    { name: 'Docker', level: 70, icon: <FaDocker /> },
    { name: 'Tailwind CSS', level: 90, icon: <SiTailwindcss /> },
  ]
}) => {
  return (
    <section 
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="About section"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 mb-4 glass text-secondary font-semibold rounded-full text-sm"
            whileHover={{ scale: 1.05 }}
          >
            👨‍💻 Get to Know Me
          </motion.span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary via-primary to-accent mx-auto rounded-full neon-glow" />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Bio and Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Profile Image with 3D Background */}
            <div className="relative">
              {/* 3D Background Scene */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-30">
                <Profile3DScene />
              </div>
              
              <div className="relative w-72 h-72 mx-auto lg:mx-0 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 neon-glow" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent via-info to-success rounded-3xl transform -rotate-6 group-hover:-rotate-12 transition-transform duration-500 opacity-50" />
                <img 
                  src={profileImage}
                  alt="Profile"
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 border-4 border-white/10"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Bio Text */}
            <div className="glass p-8 rounded-2xl border border-primary/20">
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
                {bio}
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="glass p-4 rounded-xl border border-primary/20 text-center hover:neon-glow"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <FaAward className="text-3xl text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold gradient-text">5+</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Years</p>
                </motion.div>
                <motion.div 
                  className="glass p-4 rounded-xl border border-success/20 text-center hover:neon-glow"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <FaCode className="text-3xl text-success mx-auto mb-2" />
                  <p className="text-3xl font-bold gradient-text">50+</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Projects</p>
                </motion.div>
                <motion.div 
                  className="glass p-4 rounded-xl border border-accent/20 text-center hover:neon-glow"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <FaUsers className="text-3xl text-accent mx-auto mb-2" />
                  <p className="text-3xl font-bold gradient-text">20+</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Clients</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-8 rounded-2xl border border-secondary/20"
          >
            <h3 className="text-3xl font-bold mb-8">
              <span className="gradient-text">Technical Skills</span>
            </h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <SkillBar 
                  key={skill.name}
                  skill={skill.name}
                  level={skill.level}
                  icon={skill.icon}
                  index={index}
                />
              ))}
            </div>
            
            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <h4 className="text-lg font-bold text-[var(--color-text)] mb-3">
                🚀 Always Learning
              </h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                I'm constantly exploring new technologies and best practices to stay at the 
                forefront of web development. Currently diving deep into Web3, AI integration, 
                and advanced 3D experiences.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
