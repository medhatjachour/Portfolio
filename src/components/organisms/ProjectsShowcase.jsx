import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket } from 'react-icons/fa';
import {
  SiReact, SiTypescript, SiNextdotjs, SiMongodb, SiTailwindcss,
  SiNodedotjs, SiPython, SiPostgresql, SiJavascript, SiFastapi
} from 'react-icons/si';
import ProjectFilter from '../molecules/ProjectFilter';
import GitHubStats from '../molecules/GitHubStats';

/**
 * Floating Stars and Circles - representing different project types
 */
const FloatingStarsAndCircles = () => {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Star shapes */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-3, 2, -2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#10B981"
            transparent
            opacity={0.6}
            emissive="#10B981"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[3, -1, -3]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#3B82F6"
            transparent
            opacity={0.6}
            emissive="#3B82F6"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh position={[-2, -2, -4]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color="#8B5CF6"
            transparent
            opacity={0.6}
            emissive="#8B5CF6"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={1.5} floatIntensity={2.5}>
        <mesh position={[2, 2, -2]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color="#06B6D4"
            transparent
            opacity={0.6}
            emissive="#06B6D4"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Additional glowing circles */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 3, -3]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#EC4899"
            transparent
            opacity={0.7}
            emissive="#EC4899"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      <Float speed={1.7} rotationIntensity={0.6} floatIntensity={1.3}>
        <mesh position={[-4, 0, -5]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.7}
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
};

/**
 * Floating project orbs in the background - blend naturally, no boxes
 */
const ProjectOrbs = () => {
  const group = useRef();
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const orbPositions = [
    [-4, 2, -3], [4, -1, -4], [-3, -2, -2], 
    [3, 2, -5], [0, 3, -3], [-2, 0, -4]
  ];

  return (
    <group ref={group}>
      {orbPositions.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={pos} scale={0.4 + (i % 3) * 0.1}>
            <sphereGeometry args={[1, 16, 16]} />
            <MeshDistortMaterial
              color={['#10B981', '#6366F1', '#EC4899', '#F59E0B'][i % 4]}
              attach="material"
              distort={0.3}
              speed={1.5}
              roughness={0.3}
              metalness={0.8}
              emissive={['#10B981', '#6366F1', '#EC4899', '#F59E0B'][i % 4]}
              emissiveIntensity={0.2}
              transparent
              opacity={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

/**
 * Medhat's Real Projects - From his resume and GitHub
 */
const ProjectsShowcase = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeFilter, setActiveFilter] = useState('all');

  // Technology filters
  const techFilters = [
    { name: 'React', icon: SiReact },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Python', icon: SiPython },
    { name: 'Node.js', icon: SiNodedotjs }
  ];

  // Real projects from Medhat's work
  const allProjects = [
    {
      title: 'Mega Courses',
      description: 'A comprehensive Learning Management System where teachers can upload courses and students can enroll. Built with Next.js and AWS services for scalability and performance. Features include course management, student enrollment, and progress tracking.',
      techStack: ['Next.js', 'React', 'TypeScript', 'AWS', 'MongoDB'],
      icons: [<SiNextdotjs />, <SiReact />, <SiTypescript />, <SiMongodb />],
      githubUrl: 'https://github.com/medhatjachour/Mega-courses',
      category: 'Full Stack',
      gradient: 'from-emerald-500 to-blue-600'
    },
    {
      title: 'LeadBull Platform',
      description: 'Developed comprehensive user and admin dashboards with real-time data visualization, secure authentication, and advanced analytics tools. Improved platform efficiency significantly with React, Redux, and Tailwind CSS.',
      techStack: ['React', 'Redux', 'Tailwind CSS', 'TypeScript'],
      icons: [<SiReact />, <SiTailwindcss />, <SiTypescript />],
      category: 'Frontend',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'DoctorApp',
      description: 'Full-stack web application for appointment booking and management. Features user authentication, admin dashboard, doctor availability management, and integrated Cloudinary for image storage.',
      techStack: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      icons: [<SiReact />, <SiNodedotjs />, <SiMongodb />, <SiTypescript />],
      githubUrl: 'https://github.com/medhatjachour/doctorApp',
      category: 'Full Stack',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'MegaCare',
      description: 'Patient management system designed to streamline healthcare workflows. Built with modern technologies for efficient data handling and patient record management.',
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      icons: [<SiTypescript />, <SiReact />, <SiNodedotjs />, <SiPostgresql />],
      githubUrl: 'https://github.com/medhatjachour/MegaCare',
      category: 'Healthcare',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Car E-commerce',
      description: 'Full-stack car e-commerce platform with comprehensive features for browsing, searching, and purchasing vehicles. Includes admin panel for inventory management.',
      techStack: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      icons: [<SiJavascript />, <SiReact />, <SiNodedotjs />, <SiMongodb />],
      githubUrl: 'https://github.com/medhatjachour/car-eco',
      category: 'E-commerce',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Blackhorse System',
      description: 'Comprehensive software solution for small businesses focusing on sales management and inventory tracking. Improved efficiency by 30% and reduced manual errors by 25%. Built with Python and modern desktop technologies.',
      techStack: ['Python', 'PyQt', 'SQLite'],
      icons: [<SiPython />],
      category: 'Desktop',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'MERN Chat App',
      description: 'Real-time chat application built with MERN stack and Socket.io. Features include real-time messaging, user authentication, and online status indicators.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      icons: [<SiReact />, <SiNodedotjs />, <SiMongodb />],
      githubUrl: 'https://github.com/medhatjachour/mern-chat-app',
      category: 'Real-time',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Mazboot 3D E-commerce',
      description: 'Innovative graduation project: 3D e-commerce platform combining human body models and product models for immersive shopping. Increased user engagement by 40% with an innovative 3D interface.',
      techStack: ['Three.js', 'React', 'WebGL'],
      icons: [<SiReact />, <SiJavascript />],
      category: 'Graduation Project',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      title: 'Financial Tracker',
      description: 'Financial tracking application built with MERN stack. Features expense tracking, budget management, and financial analytics.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
      icons: [<SiReact />, <SiNodedotjs />, <SiMongodb />],
      githubUrl: 'https://github.com/medhatjachour/treacker-with-mern',
      category: 'Finance',
      gradient: 'from-indigo-500 to-blue-600'
    }
  ];

  // Filter projects based on selected technology
  const filteredProjects = activeFilter === 'all' 
    ? allProjects 
    : allProjects.filter(project => 
        project.techStack.some(tech => tech.toLowerCase().includes(activeFilter.toLowerCase()))
      );

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Projects section"
    >
      {/* Flowing 3D background - seamlessly integrated */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#10B981" />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#EC4899" />
          
          <FloatingStarsAndCircles />
          <ProjectOrbs />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 font-semibold text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <FaRocket className="animate-bounce" />
            Building Dreams Into Reality
          </motion.span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-[var(--color-text-muted)] max-w-3xl mx-auto mb-12">
            From learning platforms to healthcare systems, each project tells a story of problem-solving and innovation
          </p>
          
          {/* GitHub Stats */}
          <GitHubStats username="medhatjachour" />
        </motion.div>
        
        {/* Project Filter */}
        <ProjectFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          technologies={techFilters}
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all h-full flex flex-col">
                {/* Category badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-20 text-xs font-bold text-white`}>
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech icons */}
                <div className="flex items-center gap-3 mb-4">
                  {project.icons.map((Icon, i) => (
                    <div 
                      key={i}
                      className="text-2xl text-emerald-400 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {Icon}
                    </div>
                  ))}
                </div>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[var(--color-text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${project.gradient} text-white font-semibold hover:shadow-lg transition-all`}
                  >
                    <FaGithub />
                    View Code
                    <FaExternalLinkAlt className="text-sm" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* More projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-400/30 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              <FaCode className="inline mr-2" />
              Want to see more?
            </h3>
            <p className="text-lg text-[var(--color-text-muted)] mb-6">
              Explore 40+ repositories on GitHub, from full-stack applications to Python desktop tools
            </p>
            <motion.a
              href="https://github.com/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <FaGithub className="text-2xl" />
              Visit GitHub Profile
              <FaExternalLinkAlt />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
