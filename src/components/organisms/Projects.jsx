import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProjectCard from '../molecules/ProjectCard';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * 3D Rotating Project Display
 */
const ProjectCube = ({ project, position }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={hovered ? '#EC4899' : '#6366F1'}
          emissive={hovered ? '#EC4899' : '#6366F1'}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {project.title.split(' ')[0]}
        </Text>
      </mesh>
    </Float>
  );
};

/**
 * 3D Projects Scene
 */
const Projects3DScene = ({ projects }) => {
  const displayProjects = projects.slice(0, 6);
  
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />
      <spotLight position={[0, 10, 0]} intensity={0.8} color="#8B5CF6" angle={0.6} penumbra={0.5} />
      
      {displayProjects.map((project, index) => {
        const angle = (index / displayProjects.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return <ProjectCube key={index} project={project} position={[x, 0, z]} />;
      })}
      
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

/**
 * Projects Organism
 * Projects grid section showcasing portfolio work
 * @param {array} projects - Array of project objects
 */
const Projects = ({ 
  projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with cart, checkout, payment integration, and admin dashboard. Built with modern tech stack for optimal performance.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project1'
    },
    {
      title: 'Task Management App',
      description: 'Real-time collaborative task management application with drag-and-drop, team chat, and progress tracking features.',
      techStack: ['React', 'Firebase', 'Tailwind CSS', 'Socket.io'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project2'
    },
    {
      title: 'Weather Dashboard',
      description: 'Beautiful weather dashboard with real-time data, forecasts, and location-based weather alerts using multiple APIs.',
      techStack: ['React', 'OpenWeather API', 'Chart.js', 'CSS3'],
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project3'
    },
    {
      title: 'Portfolio CMS',
      description: 'Content management system for portfolio websites with drag-and-drop builder, theme customization, and SEO optimization.',
      techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'TailwindCSS'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project4'
    },
    {
      title: 'Fitness Tracker',
      description: 'Mobile-first fitness tracking app with workout plans, progress charts, and social sharing features.',
      techStack: ['React Native', 'Express', 'MongoDB', 'Redux'],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project5'
    },
    {
      title: 'Blog Platform',
      description: 'Modern blog platform with markdown support, comments, likes, and author profiles with analytics.',
      techStack: ['Gatsby', 'GraphQL', 'Contentful', 'Netlify'],
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/yourusername/project6'
    }
  ]
}) => {
  return (
    <section 
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Projects section"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
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
            className="inline-block px-4 py-2 mb-4 glass text-primary font-semibold rounded-full text-sm"
            whileHover={{ scale: 1.05 }}
          >
            💼 Portfolio
          </motion.span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto">
            A collection of projects showcasing my expertise in modern web development,
            <br className="hidden sm:block" />
            creative problem-solving, and cutting-edge technologies.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-info mx-auto mt-6 rounded-full neon-glow" />
        </motion.div>
        
        {/* 3D Project Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 glass rounded-3xl p-8 border border-primary/20"
          style={{ height: '500px' }}
        >
          <Projects3DScene projects={projects} />
        </motion.div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              {...project}
              index={index}
            />
          ))}
        </div>
        
        {/* More Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-primary/20">
            <p className="text-[var(--color-text-muted)] mb-6 text-lg">
              Want to see more? Explore my complete portfolio and contributions on GitHub.
            </p>
            <motion.a 
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-xl font-bold text-lg neon-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub className="text-2xl" />
              View All Projects
              <FaExternalLinkAlt className="text-sm" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
