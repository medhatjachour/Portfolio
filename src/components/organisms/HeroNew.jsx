import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text,  Float } from '@react-three/drei';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaLinkedin, FaDownload,  FaMicrosoft } from 'react-icons/fa';
import { SiReact, SiPython, SiTypescript, SiJavascript } from 'react-icons/si';
import { useThemeStore } from '../../store/themeStore';

/**
 * Create a star-shaped texture with radial glow
 */
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const centerX = 64;
  const centerY = 64;
  
  // Draw star shape
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 20;
  
  // Create 5-pointed star
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angleOuter = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const angleInner = ((i * 2 + 1) * Math.PI) / 5 - Math.PI / 2;
    
    const xOuter = centerX + Math.cos(angleOuter) * 50;
    const yOuter = centerY + Math.sin(angleOuter) * 50;
    const xInner = centerX + Math.cos(angleInner) * 20;
    const yInner = centerY + Math.sin(angleInner) * 20;
    
    if (i === 0) {
      ctx.moveTo(xOuter, yOuter);
    } else {
      ctx.lineTo(xOuter, yOuter);
    }
    ctx.lineTo(xInner, yInner);
  }
  ctx.closePath();
  ctx.fill();
  
  // Add radial glow
  ctx.shadowBlur = 0;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Starry Sky - thousands of twinkling stars with size-based brightness
 */
const StarrySky = () => {
  const starsRef = useRef();
  const starCount = 3000;
  
  const starTexture = useMemo(() => createStarTexture(), []);
  
  const { positions, sizes, colors } = useMemo(() => {
    // Seeded random function for deterministic results
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    
    const pos = new Float32Array(starCount * 3);
    const size = new Float32Array(starCount);
    const cols = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Distribute stars across the sky
      pos[i * 3] = (pseudoRandom(i * 3) - 0.5) * 50;
      pos[i * 3 + 1] = (pseudoRandom(i * 3 + 1) - 0.5) * 30;
      pos[i * 3 + 2] = (pseudoRandom(i * 3 + 2) - 0.5) * 40 - 10;
      
      // Varying star sizes
      const starSize = pseudoRandom(i * 7) * 1.2 + 0.3;
      size[i] = starSize;
      
      // Brightness scales with size - bigger stars are brighter
      const brightness = 0.6 + (starSize / 1.5) * 0.4; // Bigger stars are brighter
      cols[i * 3] = brightness;
      cols[i * 3 + 1] = brightness;
      cols[i * 3 + 2] = brightness * 1.1; // Slightly blue tint
    }
    
    return { positions: pos, sizes: size, colors: cols };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      // Subtle rotation to simulate sky movement
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        alphaTest={0.01}
      />
    </points>
  );
};

/**
 * Floating Code Snippets - code fragments floating in the sky
 */
const FloatingCode = () => {
  const groupRef = useRef();
  
  const codeSnippets = useMemo(() => {
    const snippets = [
   // Programming Keywords
      'const', 'function', 'return', 'import', 'export',
      'async', 'await', 'class', 'extends', 'interface',
    
      
      // Operators & Syntax
      '=>', '{}', '[]', '()', '===', '!==', '&&', '||',
      '...', '?.', '??', '<>', '/>', '`${}`',
      
      // Frameworks & Libraries
      'React', 'Node.js', 'TypeScript', 'Next.js', 
     'Express', 'FastAPI', 'PYQT', 
      
      // Concepts
      'API', 'REST', 'GraphQL', 'DB', 'SQL', 'NoSQL',
      'Docker', 'K8s', 'CI/CD', 'Git', 'AWS', 'Azure',
      'Redux', 'State', 'Props', 'Hooks', 'JSX', 'CSS',
      
      // Methods & Functions
      'map()', 'filter()', 'reduce()', 'forEach()', 'find()',
      'push()', 'pop()', 'shift()', 'splice()', 'slice()',
      
      // Common terms
      'component', 'render', 'useState', 'useEffect', 'props',
      'callback', 'promise', 'fetch', 'axios', 'query'
    ];
    
    // Seeded random using index
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    
    return snippets.map((text, i) => ({
      text,
      position: [
        (pseudoRandom(i * 3) - 0.5) * 30,
        (pseudoRandom(i * 3 + 1) - 0.5) * 20,
        (pseudoRandom(i * 3 + 2) - 0.5) * 15 - 5
      ],
      rotation: pseudoRandom(i * 7) * Math.PI * 2,
      speed: 0.3 + pseudoRandom(i * 11) * 1.2,
      fontSize: 0.15 + pseudoRandom(i * 13) * 0.2,
      color: ['#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'][i % 7]
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = codeSnippets[i].position[1] + Math.sin(state.clock.elapsedTime * codeSnippets[i].speed + i) * 0.5;
        child.rotation.y = state.clock.elapsedTime * 0.15 + codeSnippets[i].rotation;
        child.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {codeSnippets.map((snippet, i) => (
        <Text
          key={i}
          position={snippet.position}
          fontSize={snippet.fontSize}
          color={snippet.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {snippet.text}
        </Text>
      ))}
    </group>
  );
};

/**
 * Shooting Stars - occasional streaks across the sky
 */
const ShootingStar = ({ delay = 0, startPos = [10, 5, -5] }) => {
  const starRef = useRef();
  const [isVisible, setIsVisible] = React.useState(false);
  const [startPosition] = React.useState(startPos);
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
          if (starRef.current) {
            starRef.current.position.set(...startPosition);
          }
        }, 2000);
      }, 8000);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [delay, startPosition]);

  useFrame(() => {
    if (starRef.current && isVisible) {
      starRef.current.position.x -= 0.15;
      starRef.current.position.y -= 0.08;
    }
  });

  if (!isVisible) return null;

  return (
    <group>
      <mesh ref={starRef} position={startPosition}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Trail effect */}
      <mesh position={[startPosition[0] + 0.3, startPosition[1] + 0.15, startPosition[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

/**
 * Extra Floating Stars - additional twinkling stars with size-based brightness
 */
const FloatingStars = () => {
  const starsRef = useRef();
  
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 150; i++) {
      const pseudoRandom = (seed) => {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      
      const scale = 0.5 + pseudoRandom(i * 7) * 2; // Size varies
      
      starArray.push({
        position: [
          (pseudoRandom(i * 5) - 0.5) * 40,
          (pseudoRandom(i * 5 + 1) - 0.5) * 25,
          (pseudoRandom(i * 5 + 2) - 0.5) * 20 - 5
        ],
        scale: scale,
        speed: 0.5 + pseudoRandom(i * 9) * 2,
        delay: pseudoRandom(i * 11) * Math.PI * 2,
        // Brightness scales with size - bigger stars are brighter
        brightness: 0.4 + (scale / 2.5) * 0.6
      });
    }
    return starArray;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.children.forEach((star, i) => {
        // Twinkle effect - bigger stars twinkle more dramatically
        const baseBrightness = stars[i].brightness;
        const twinkle = Math.sin(state.clock.elapsedTime * stars[i].speed + stars[i].delay) * 0.5;
        const opacity = baseBrightness + twinkle;
        
        if (star.material) {
          star.material.opacity = Math.max(0.2, Math.min(1, opacity));
        }
      });
    }
  });

  return (
    <group ref={starsRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position} scale={star.scale}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={star.brightness}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Constellation Lines - connecting stars to form patterns
 */
const Constellations = () => {
  const linesRef = useRef();
  
  const { positions } = useMemo(() => {
    const pos = [];
    const constellations = [
      // Big Dipper
      [[-8, 5, -10], [-6, 6, -10], [-4, 5.5, -10], [-2, 5, -10]],
      // Orion's Belt
      [[2, 0, -12], [4, -0.5, -12], [6, -1, -12]],
      // Random constellation
      [[-5, -3, -8], [-3, -2, -8], [-1, -3.5, -8]]
    ];
    
    constellations.forEach(constellation => {
      for (let i = 0; i < constellation.length - 1; i++) {
        pos.push(...constellation[i], ...constellation[i + 1]);
      }
    });
    
    return { positions: new Float32Array(pos) };
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4FB3D4" transparent opacity={0.3} />
    </lineSegments>
  );
};

/**
 * Moon - bright glowing moon
 */
const Moon = () => {
  const moonRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    // Gentle pulsing glow
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
      glowRef.current.material.opacity = 0.3 * pulse;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={[-18, 10, -25]}>
        {/* Main moon body */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial
            color="#F5F5DC"
            emissive="#FFFACD"
            emissiveIntensity={0.8}
            roughness={0.6}
            metalness={0}
          />
        </mesh>
        
        {/* Bright inner glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[3.2, 32, 32]} />
          <meshBasicMaterial
            color="#FFFACD"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        
        {/* Soft outer glow */}
        <mesh>
          <sphereGeometry args={[4.5, 32, 32]} />
          <meshBasicMaterial
            color="#FFF8DC"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
};

/**
 * Sun - bright sun for light mode
 */
const Sun = () => {
  const sunRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={0.2} rotationIntensity={0.03} floatIntensity={0.15}>
      {/* Main sun body */}
      <mesh ref={sunRef} position={[15, 8, -30]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF9800"
          emissiveIntensity={3}
          roughness={0}
          metalness={0}
        />
      </mesh>
      {/* Bright inner glow */}
      <mesh position={[15, 8, -30]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFEB3B"
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Medium glow */}
      <mesh position={[15, 8, -30]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#FFF59D"
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Outer soft glow */}
      <mesh ref={glowRef} position={[15, 8, -30]}>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial
          color="#FFF9C4"
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
};

/**
 * Clouds - fluffy clouds for light mode
 */
const Clouds = () => {
  const cloudsRef = useRef();
  
  const clouds = useMemo(() => {
    const cloudArray = [];
    for (let i = 0; i < 25; i++) {
      const pseudoRandom = (seed) => {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      
      cloudArray.push({
        position: [
          (pseudoRandom(i * 5) - 0.5) * 60,
          pseudoRandom(i * 5 + 1) * 12 + 3,
          (pseudoRandom(i * 5 + 2) - 0.5) * 35 - 8
        ],
        scale: 0.8 + pseudoRandom(i * 7) * 1.8,
        speed: 0.05 + pseudoRandom(i * 9) * 0.15
      });
    }
    return cloudArray;
  }, []);

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += clouds[i].speed * 0.01;
        if (cloud.position.x > 35) {
          cloud.position.x = -35;
        }
      });
    }
  });

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud, i) => (
        <Float key={i} speed={0.3} rotationIntensity={0.05} floatIntensity={0.3}>
          <group position={cloud.position} scale={cloud.scale}>
            {/* Create fluffy light blue cloud shapes */}
            {/* Main body - center */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color="#C5E1FF" 
                transparent 
                opacity={0.95} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Left puff */}
            <mesh position={[-0.9, 0.2, 0.1]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial 
                color="#D6ECFF" 
                transparent 
                opacity={0.9} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Right puff */}
            <mesh position={[0.9, 0.15, -0.1]}>
              <sphereGeometry args={[0.85, 16, 16]} />
              <meshStandardMaterial 
                color="#D6ECFF" 
                transparent 
                opacity={0.9} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Top puff */}
            <mesh position={[0.1, 0.7, 0]}>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshStandardMaterial 
                color="#E0F2FF" 
                transparent 
                opacity={0.85} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Top-left puff */}
            <mesh position={[-0.4, 0.6, 0.1]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial 
                color="#E8F6FF" 
                transparent 
                opacity={0.85} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Bottom fill */}
            <mesh position={[0.3, -0.3, 0]}>
              <sphereGeometry args={[0.75, 16, 16]} />
              <meshStandardMaterial 
                color="#D0E9FF" 
                transparent 
                opacity={0.88} 
                roughness={1}
                metalness={0}
              />
            </mesh>
            {/* Back depth */}
            <mesh position={[-0.2, 0.1, 0.5]}>
              <sphereGeometry args={[0.65, 16, 16]} />
              <meshStandardMaterial 
                color="#BBE1FF" 
                transparent 
                opacity={0.8} 
                roughness={1}
                metalness={0}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
};

/**
 * Flying Birds - animated birds for light mode
 */
const Birds = () => {
  const birdsRef = useRef();
  
  const birds = useMemo(() => {
    const birdArray = [];
    for (let i = 0; i < 8; i++) {
      const pseudoRandom = (seed) => {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      
      birdArray.push({
        position: [
          (pseudoRandom(i * 3) - 0.5) * 40,
          pseudoRandom(i * 3 + 1) * 10 + 5,
          (pseudoRandom(i * 3 + 2) - 0.5) * 20 - 5
        ],
        speed: 0.2 + pseudoRandom(i * 7) * 0.3,
        delay: pseudoRandom(i * 11) * Math.PI * 2
      });
    }
    return birdArray;
  }, []);

  useFrame((state) => {
    if (birdsRef.current) {
      birdsRef.current.children.forEach((bird, i) => {
        bird.position.x += birds[i].speed * 0.02;
        bird.position.y += Math.sin(state.clock.elapsedTime * 2 + birds[i].delay) * 0.01;
        bird.rotation.z = Math.sin(state.clock.elapsedTime * 3 + birds[i].delay) * 0.2;
        
        if (bird.position.x > 25) {
          bird.position.x = -25;
        }
      });
    }
  });

  return (
    <group ref={birdsRef}>
      {birds.map((bird, i) => (
        <group key={i} position={bird.position}>
          {/* Simple bird shape - two triangles for wings */}
          <mesh rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.05, 0.2, 3]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
          <mesh rotation={[0, 0, -0.3]} position={[0.15, 0, 0]}>
            <coneGeometry args={[0.05, 0.2, 3]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
        </group>
      ))}
    </group>
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
  const { isDark } = useThemeStore();
  
  // Memoize particle positions to avoid re-render issues
  const particles = useMemo(() => {
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    
    return [...Array(30)].map((_, i) => ({
      left: pseudoRandom(i * 5) * 100,
      top: pseudoRandom(i * 5 + 1) * 100,
      xMovement: pseudoRandom(i * 5 + 2) * 20 - 10,
      duration: 3 + pseudoRandom(i * 7) * 3,
      delay: pseudoRandom(i * 11) * 2
    }));
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0e27] via-[#0f1729] to-[#050810]' 
        : 'bg-gradient-to-br from-[#E3F2FD] via-[#BBDEFB] to-[#90CAF9]'
    }`}>
      {/* 3D Background - Day or Night */}
      <div className="absolute inset-0 z-0">
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={isDark ? 0.2 : 0.8} />
          <pointLight position={[10, 10, 10]} intensity={isDark ? 0.3 : 1} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={isDark ? 0.2 : 0.5} color={isDark ? "#4FB3D4" : "#FDB813"} />
          
          {isDark ? (
            /* Night Sky Theme */
            <>
              <StarrySky />
              <FloatingStars />
              <FloatingCode />
              <Constellations />
              <Moon />
              <ShootingStar delay={0} startPos={[12, 8, -8]} />
              <ShootingStar delay={2500} startPos={[-10, 6, -6]} />
              <ShootingStar delay={5000} startPos={[8, -5, -10]} />
              <ShootingStar delay={7500} startPos={[-8, 4, -7]} />
            </>
          ) : (
            /* Day Sky Theme */
            <>
              <Sun />
              <Clouds />
              <Birds />
            </>
          )}
        </Canvas>
        
        {/* Gradient overlay for depth */}
        <div className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-transparent via-black/30 to-black/60'
            : 'bg-gradient-to-b from-transparent via-white/20 to-white/40'
        }`} />
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
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse ${
                isDark ? 'bg-cyan-500/30' : 'bg-yellow-400/40'
              }`}></div>
              <img 
                src="/profile.png" 
                alt="Medhat Ashour" 
                className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-2xl ${
                  isDark ? 'border border-cyan-400/30' : 'border-2 border-yellow-400/50'
                }`}
              />
            </div>
          </motion.div>

          {/* Animated Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0],
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.3 },
              y: { 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative space-y-3"
          >
            {/* Cosmic particles around text */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full blur-[0.5px] ${
                    isDark ? 'bg-cyan-400/40' : 'bg-blue-500/30'
                  }`}
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 2, 1],
                    y: [0, -30, 0],
                    x: [0, particle.xMovement, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Glowing backdrop with pulse */}
            <motion.div 
              className={`absolute inset-0 -z-10 blur-3xl ${
                isDark 
                  ? 'bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent' 
                  : 'bg-gradient-radial from-yellow-300/20 via-blue-300/10 to-transparent'
              }`}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.h1 
              className="text-6xl md:text-8xl font-light tracking-wide leading-tight"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.3 },
                  default: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                className={`block text-[var(--color-text)] ${
                  isDark 
                    ? 'drop-shadow-[0_0_50px_rgba(6,182,212,0.5)]' 
                    : 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
                }`}
              >
                Medhat Ashour
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.8, 1, 0.8],
                y: [0, -3, 0],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }
              }}
              className={`text-2xl md:text-3xl font-light tracking-wider ${
                isDark 
                  ? 'text-cyan-400/90 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]' 
                  : 'text-blue-600 drop-shadow-[0_2px_8px_rgba(33,150,243,0.3)]'
              }`}
            >
              Software Engineer @ Microsoft
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.6, 0.9, 0.6],
                y: [0, -2, 0],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.9 },
                y: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }
              }}
              className="text-sm md:text-base text-[var(--color-text-muted)] italic font-light max-w-2xl mx-auto pt-3"
            >
              💭 everything in my imagination is possible
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 1.2 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }
            }}
            className="flex flex-wrap justify-center gap-4 pt-6"
          >
            <motion.a
              href="https://github.com/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: isDark ? "0 0 25px rgba(6,182,212,0.3)" : "0 0 25px rgba(33,150,243,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-white/5 border rounded-lg font-light transition-all ${
                isDark 
                  ? 'border-white/20 text-[var(--color-text)] hover:border-cyan-400/50 hover:bg-white/10' 
                  : 'border-blue-400/40 text-[var(--color-text)] hover:border-blue-500/70 hover:bg-white/20'
              }`}
            >
              <FaGithub className="text-lg" />
              <span>GitHub</span>
            </motion.a>

            <motion.a
              href="https://linkedin.com/in/medhatjachour"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: isDark ? "0 0 25px rgba(6,182,212,0.3)" : "0 0 25px rgba(33,150,243,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-white/5 border rounded-lg font-light transition-all ${
                isDark 
                  ? 'border-white/20 text-[var(--color-text)] hover:border-cyan-400/50 hover:bg-white/10' 
                  : 'border-blue-400/40 text-[var(--color-text)] hover:border-blue-500/70 hover:bg-white/20'
              }`}
            >
              <FaLinkedin className="text-lg" />
              <span>LinkedIn</span>
            </motion.a>
            
            <motion.a
              href="/medhat frontend engineer.pdf"
              download
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: isDark ? "0 0 25px rgba(6,182,212,0.3)" : "0 0 25px rgba(33,150,243,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md rounded-lg font-light transition-all ${
                isDark 
                  ? 'bg-white/10 border border-cyan-400/30 text-[var(--color-text)] hover:border-cyan-400 hover:bg-white/15' 
                  : 'bg-blue-500/20 border border-blue-500/50 text-[var(--color-text)] hover:border-blue-600 hover:bg-blue-500/30'
              }`}
            >
              <FaDownload className="text-lg" />
              <span>Resume</span>
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
              className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]"
            >
              <span className="text-sm font-medium">Discover My Journey</span>
              <div className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-2 ${
                isDark ? 'border-emerald-400/50' : 'border-blue-500/50'
              }`}>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDark ? 'bg-emerald-400' : 'bg-blue-500'
                  }`}
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
