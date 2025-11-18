import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, 
  FaJs, FaGitAlt, FaDocker, FaAws, FaFigma 
} from 'react-icons/fa';
import { 
  SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql,
  SiGraphql, SiRedux 
} from 'react-icons/si';

/**
 * Rotating Icon Component for 3D effect
 */
const RotatingIcon = ({ position, Icon, color }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

/**
 * Skills Organism
 * Skills showcase section with 3D elements
 * @param {array} skillCategories - Array of skill category objects
 */
const Skills = ({ 
  skillCategories = [
    {
      category: 'Frontend',
      skills: [
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
        { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
        { name: 'HTML5', icon: FaHtml5, color: '#E34F26' },
        { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
        { name: 'Redux', icon: SiRedux, color: '#764ABC' }
      ]
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' }
      ]
    },
    {
      category: 'Tools & Others',
      skills: [
        { name: 'Git', icon: FaGitAlt, color: '#F05032' },
        { name: 'Docker', icon: FaDocker, color: '#2496ED' },
        { name: 'AWS', icon: FaAws, color: '#FF9900' },
        { name: 'Figma', icon: FaFigma, color: '#F24E1E' }
      ]
    }
  ]
}) => {
  return (
    <section 
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8"
      aria-label="Skills section"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-success mx-auto mt-4" />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-[400px] bg-gradient-to-br from-primary/5 to-success/5 rounded-2xl overflow-hidden"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <RotatingIcon position={[-1.5, 1, 0]} color="#007BFF" />
              <RotatingIcon position={[1.5, 1, 0]} color="#28A745" />
              <RotatingIcon position={[-1.5, -1, 0]} color="#FFC107" />
              <RotatingIcon position={[1.5, -1, 0]} color="#007BFF" />
              <RotatingIcon position={[0, 0, 0]} color="#6C757D" />
            </Canvas>
          </motion.div>
          
          {/* Right: Skill Categories */}
          <div className="space-y-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border)]"
              >
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
                  {category.category}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {category.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex flex-col items-center gap-2 p-3 bg-[var(--color-bg)] rounded-lg hover:border-2 hover:border-primary transition-all group cursor-pointer"
                      title={skill.name}
                    >
                      <skill.icon 
                        size={32} 
                        style={{ color: skill.color }}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-xs text-center text-[var(--color-text-muted)] group-hover:text-primary font-medium">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
