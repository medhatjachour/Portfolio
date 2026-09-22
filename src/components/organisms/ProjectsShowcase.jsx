import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import AdaptiveCanvas from '../atoms/AdaptiveCanvas';
import { Float, MeshDistortMaterial } from '@react-three/drei';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket, FaCheckCircle } from 'react-icons/fa';
import {
  SiReact, SiTypescript, SiNextdotjs, SiMongodb, SiTailwindcss,
  SiNodedotjs, SiPython, SiPostgresql, SiJavascript,
  SiElectron, SiPrisma, SiSqlite, SiThreedotjs
} from 'react-icons/si';
import ProjectFilter from '../molecules/ProjectFilter';
import GitHubStats from '../molecules/GitHubStats';
import TiltCard from '../atoms/TiltCard';

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
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'Electron', icon: SiElectron },
    { name: 'Python', icon: SiPython }
  ];

  // Selected work — scope, architecture decisions and measurable outcomes.
  const allProjects = [
    {
      title: 'BizFlow',
      description: 'Plugin-based business platform spanning point of sale, inventory, finance and operations. Architected the module system, RBAC permission model and reporting layer across desktop and web builds, modelling real workflows from nine different business domains.',
      highlights: ['9 business domains modelled', 'Plugin module architecture', 'Device-bound desktop licensing'],
      techStack: ['Electron', 'React 18', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS'],
      icons: [<SiElectron />, <SiReact />, <SiTypescript />, <SiPrisma />, <SiSqlite />],
      githubUrl: 'https://github.com/medhatjachour/BizFlow',
      liveUrl: 'https://www.bizflow.medhatjachour.tech/',
      category: 'Platform',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'TransHub',
      description: 'Logistics workspace for tracking shipments and coordinating dispatch. Role-aware React and TypeScript client over a Node/PostgreSQL API, with live status updates and audit-friendly record history.',
      highlights: ['Role-aware operational views', 'Live shipment status', 'Node + PostgreSQL API'],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      icons: [<SiReact />, <SiTypescript />, <SiNodedotjs />, <SiPostgresql />],
      liveUrl: 'https://www.transhub.medhatjachour.tech/',
      category: 'Full Stack',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: '1stIQARI',
      description: 'Multilingual real-estate platform and executive dashboard. Built map-driven search and analytics views, then cut time-to-interactive with route-level code-splitting, caching and a tightened image strategy.',
      highlights: ['Map-driven search + analytics', 'Multilingual (i18n)', 'Code-split, cached routes'],
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      icons: [<SiNextdotjs />, <SiTypescript />, <SiTailwindcss />],
      category: 'Web Platform',
      gradient: 'from-emerald-500 to-cyan-600'
    },
    {
      title: 'Digital IA',
      description: 'Cross-platform React Native app paired with a Next.js operations dashboard. Owned the shared domain types, Zustand state and resilient data flow so mobile and web never drifted apart.',
      highlights: ['One domain model, two clients', 'Offline-tolerant data flow', 'Secure auth + refresh'],
      techStack: ['React Native', 'Next.js', 'TypeScript', 'Zustand'],
      icons: [<SiReact />, <SiNextdotjs />, <SiTypescript />],
      category: 'Mobile + Web',
      gradient: 'from-violet-500 to-indigo-600'
    },
    {
      title: 'Mega Courses',
      description: 'Learning platform where instructors publish courses and students enrol and track progress. Built the course and enrolment domains plus an AWS-backed media pipeline designed for horizontal scale.',
      highlights: ['Course + enrolment domains', 'AWS media pipeline', 'Progress + completion tracking'],
      techStack: ['Next.js', 'React', 'TypeScript', 'AWS', 'MongoDB'],
      icons: [<SiNextdotjs />, <SiReact />, <SiTypescript />, <SiMongodb />],
      githubUrl: 'https://github.com/medhatjachour/Mega-courses',
      category: 'Full Stack',
      gradient: 'from-emerald-500 to-blue-600'
    },
    {
      title: 'LeadBull Platform',
      description: 'Analytics-heavy user and admin dashboards for a lead-generation product. Built reusable chart and table primitives, token-refresh session handling and RBAC-aware navigation, and reviewed the team’s frontend work.',
      highlights: ['Reusable dashboard primitives', 'Token refresh + secure sessions', 'RBAC route guards'],
      techStack: ['React', 'Redux', 'TypeScript', 'Tailwind CSS'],
      icons: [<SiReact />, <SiTailwindcss />, <SiTypescript />],
      category: 'Frontend',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Mazboot 3D E-commerce',
      description: 'Graduation project: a 3D storefront that renders parametric body and product models so shoppers can visualise fit. Rebuilt the render loop with instancing and geometry reuse to hold a steady 60fps on mid-range hardware.',
      highlights: ['Three.js + WebGL rendering', '60fps on mid-range devices', 'Parametric body models'],
      techStack: ['Three.js', 'React', 'WebGL'],
      icons: [<SiThreedotjs />, <SiReact />, <SiJavascript />],
      category: '3D / Creative',
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      title: 'DoctorApp',
      description: 'Appointment booking platform with doctor availability, an admin dashboard and Cloudinary-backed media. Designed the availability model so concurrent bookings cannot double-book a slot.',
      highlights: ['Conflict-safe availability model', 'Patient + admin portals', 'Cloud media storage'],
      techStack: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      icons: [<SiReact />, <SiNodedotjs />, <SiMongodb />, <SiTypescript />],
      githubUrl: 'https://github.com/medhatjachour/doctorApp',
      category: 'Full Stack',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Blackhorse Suite',
      description: 'Desktop sales and inventory suite for small businesses. Shipped reporting, stock tracking and shift close-out flows that cut manual entry errors by roughly 25% and shortened end-of-day reconciliation.',
      highlights: ['~25% fewer manual entry errors', 'Faster end-of-day close-out', 'Offline-first desktop app'],
      techStack: ['Python', 'PyQt', 'SQLite'],
      icons: [<SiPython />, <SiSqlite />],
      category: 'Desktop',
      gradient: 'from-yellow-500 to-orange-600'
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
        <AdaptiveCanvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#10B981" />
          <pointLight position={[-5, -5, -5]} intensity={0.4} color="#EC4899" />
          
          <FloatingStarsAndCircles />
          <ProjectOrbs />
        </AdaptiveCanvas>
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
            Selected Work
          </motion.span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-[var(--color-text-muted)] max-w-3xl mx-auto mb-12">
            Platform architecture, product surfaces and performance work — with the decisions and outcomes behind each build
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
              <TiltCard className="h-full">
              <div className="relative backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all h-full flex flex-col">
                {/* Category badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-20 text-xs font-bold text-white`}>
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--color-text-muted)] mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Impact highlights */}
                <ul className="space-y-2 mb-5 flex-grow">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]"
                    >
                      <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

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
                <div className="flex flex-wrap gap-3">
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

                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-semibold hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all"
                    >
                      Open Live
                      <FaExternalLinkAlt className="text-sm" />
                    </motion.a>
                  )}
                </div>
              </div>
              </TiltCard>
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
