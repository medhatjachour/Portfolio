import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { 
  FaReact, FaNodeJs, FaPython, FaJs, FaGitAlt, FaDocker 
} from 'react-icons/fa';
import { 
  SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql,
  SiGraphql, SiRedux, SiNextdotjs, SiExpress
} from 'react-icons/si';

/**
 * 3D Skill Sphere - Rotating sphere with skill name
 */
const SkillSphere = ({ position, skill, color, index }) => {
  const meshRef = useRef();
  const speed = 0.5 + Math.random() * 0.5;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed + index) * 0.2;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
        {/* Skill label floating above */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {skill}
        </Text>
      </mesh>
    </Float>
  );
};

/**
 * Skill Cloud - 3D arrangement of skill spheres
 */
const SkillCloud = ({ skills }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });
  
  // Arrange skills in a 3D sphere formation
  const positions = useMemo(() => {
    const pos = [];
    const radius = 3;
    const count = skills.length;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      pos.push([
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ]);
    }
    return pos;
  }, [skills.length]);
  
  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <SkillSphere
          key={skill.name}
          position={positions[index]}
          skill={skill.name}
          color={skill.color}
          index={index}
        />
      ))}
    </group>
  );
};

/**
 * Skills3D Organism
 * Advanced 3D skills visualization with floating spheres
 */
const Skills3D = ({ 
  skills = [
    { name: 'React', color: '#61DAFB', icon: FaReact, level: 95 },
    { name: 'TypeScript', color: '#3178C6', icon: SiTypescript, level: 90 },
    { name: 'Node.js', color: '#339933', icon: FaNodeJs, level: 88 },
    { name: 'Next.js', color: '#000000', icon: SiNextdotjs, level: 85 },
    { name: 'JavaScript', color: '#F7DF1E', icon: FaJs, level: 95 },
    { name: 'Python', color: '#3776AB', icon: FaPython, level: 80 },
    { name: 'Tailwind', color: '#06B6D4', icon: SiTailwindcss, level: 92 },
    { name: 'MongoDB', color: '#47A248', icon: SiMongodb, level: 85 },
    { name: 'PostgreSQL', color: '#4169E1', icon: SiPostgresql, level: 82 },
    { name: 'GraphQL', color: '#E10098', icon: SiGraphql, level: 78 },
    { name: 'Redux', color: '#764ABC', icon: SiRedux, level: 88 },
    { name: 'Express', color: '#000000', icon: SiExpress, level: 90 },
    { name: 'Git', color: '#F05032', icon: FaGitAlt, level: 90 },
    { name: 'Docker', color: '#2496ED', icon: FaDocker, level: 75 }
  ]
}) => {
  return (
    <section 
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Skills section"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-accent opacity-5" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-black text-[var(--color-text)] mb-6">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Interactive 3D visualization of my tech stack. Drag to explore!
          </p>
          <div className="w-24 h-2 gradient-primary mx-auto mt-6 rounded-full" />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D Skill Cloud */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[600px] relative rounded-3xl overflow-hidden glass"
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
              <pointLight position={[-10, -10, -10]} intensity={0.8} color="#EC4899" />
              <pointLight position={[0, -10, 5]} intensity={0.6} color="#06B6D4" />
              
              <SkillCloud skills={skills} />
              
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
            
            {/* Instruction overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                🖱️ Drag to rotate • Auto-rotating
              </p>
            </div>
          </motion.div>
          
          {/* Right: Skill List with Icons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass p-4 rounded-xl hover:scale-105 transition-transform duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ 
                      background: `linear-gradient(135deg, ${skill.color}20, ${skill.color}40)`,
                      color: skill.color 
                    }}
                  >
                    <skill.icon />
                  </div>
                  
                  {/* Skill info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg text-[var(--color-text)]">
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                        {skill.level}%
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills3D;
