import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import AdaptiveCanvas from '../atoms/AdaptiveCanvas';
import Magnetic from '../atoms/Magnetic';
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
 * Soft radial glow sprite texture — used for blooms, debris and halos.
 */
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Anamorphic lens-flare / starburst sprite texture for the supernova peak.
 */
const createFlareTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.translate(128, 128);
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 46);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  const spikes = [
    [0, 124], [Math.PI / 2, 124], [Math.PI / 4, 70], [-Math.PI / 4, 70],
  ];
  spikes.forEach(([ang, len]) => {
    ctx.save();
    ctx.rotate(ang);
    const grad = ctx.createLinearGradient(-len, 0, len, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.95)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-len, -1.5, len * 2, 3);
    ctx.restore();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Bright annulus sprite texture — the black hole's glowing photon ring.
 */
const createRingTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.6, 'rgba(255,255,255,0)');
  g.addColorStop(0.76, 'rgba(255,236,200,0.9)');
  g.addColorStop(0.85, 'rgba(255,255,255,1)');
  g.addColorStop(0.93, 'rgba(255,205,140,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
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
 * Supernova - a cinematic stellar explosion: a blinding bloom, a lens-flare
 * starburst at the peak, a white shockwave shell, two expanding colored gas
 * shells (cool + ember) and a burst of multi-colored glowing debris, fading to
 * darkness before the next cycle. All layers are additive sprites/points so the
 * whole thing reads as light rather than geometry.
 */
const Supernova = ({
  position = [0, 0, -14],
  color = '#67e8f9',
  emberColor = '#fb923c',
  delay = 0,
  period = 16,
}) => {
  const glowRef = useRef();
  const flareRef = useRef();
  const shockRef = useRef();
  const shellRef = useRef();
  const emberRef = useRef();
  const debrisRef = useRef();
  const debrisCount = 110;

  const glowTex = useMemo(createGlowTexture, []);
  const flareTex = useMemo(createFlareTexture, []);

  const { directions, positions, debrisColors } = useMemo(() => {
    const dirs = new Float32Array(debrisCount * 3);
    const cols = new Float32Array(debrisCount * 3);
    const hot = new THREE.Color('#ffffff');
    const warm = new THREE.Color(emberColor);
    const cool = new THREE.Color(color);
    for (let i = 0; i < debrisCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.55 + Math.random() * 0.85;
      dirs[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      dirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      dirs[i * 3 + 2] = Math.cos(phi) * speed;
      const mix = Math.random();
      const c = mix < 0.4 ? hot : mix < 0.7 ? warm : cool;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return { directions: dirs, positions: new Float32Array(debrisCount * 3), debrisColors: cols };
  }, [color, emberColor]);

  useFrame(({ clock }) => {
    const cycle = ((clock.elapsedTime + delay) % period) / period;
    const blast = 0.28;
    const active = cycle < blast;
    const e = active ? cycle / blast : 0;
    const expand = 1 - Math.pow(1 - e, 3);          // easeOutCubic
    const flash = active ? Math.max(0, 1 - e * 2.2) : 0;
    const after = active ? Math.pow(1 - e, 1.8) : 0;

    if (glowRef.current) {
      glowRef.current.scale.setScalar(0.4 + expand * 5);
      glowRef.current.material.opacity = flash * 0.9 + after * 0.12;
    }
    if (flareRef.current) {
      flareRef.current.scale.setScalar(4 + e * 12);
      flareRef.current.material.opacity = active ? Math.max(0, 1 - e * 3) : 0;
      flareRef.current.material.rotation = e * 0.6;
    }
    if (shockRef.current) {
      shockRef.current.scale.setScalar(0.2 + expand * 6.5);
      shockRef.current.material.opacity = active ? Math.pow(1 - e, 1.3) * 0.7 : 0;
    }
    if (shellRef.current) {
      shellRef.current.scale.setScalar(0.3 + expand * 4.6);
      shellRef.current.material.opacity = active ? (1 - e) * 0.4 : 0;
    }
    if (emberRef.current) {
      emberRef.current.scale.setScalar(0.25 + expand * 3.4);
      emberRef.current.material.opacity = active ? (1 - e) * 0.5 : 0;
    }
    if (debrisRef.current) {
      const arr = debrisRef.current.geometry.attributes.position.array;
      const dist = expand * 6;
      for (let i = 0; i < debrisCount; i++) {
        arr[i * 3] = directions[i * 3] * dist;
        arr[i * 3 + 1] = directions[i * 3 + 1] * dist;
        arr[i * 3 + 2] = directions[i * 3 + 2] * dist;
      }
      debrisRef.current.geometry.attributes.position.needsUpdate = true;
      debrisRef.current.material.opacity = active ? Math.pow(1 - e, 1.2) * 0.95 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Bloom */}
      <sprite ref={glowRef}>
        <spriteMaterial map={glowTex} color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {/* Lens-flare starburst */}
      <sprite ref={flareRef}>
        <spriteMaterial map={flareTex} color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {/* White shockwave shell */}
      <mesh ref={shockRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Cool gas shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Warm ember shell */}
      <mesh ref={emberRef}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color={emberColor} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Glowing debris */}
      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={debrisCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={debrisCount} array={debrisColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial map={glowTex} size={0.26} vertexColors transparent opacity={0} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
};

/**
 * BlackHole - a drifting black hole: a pure-black event horizon that occludes
 * the stars behind it (so it literally swallows them as it moves), wrapped by a
 * glowing photon ring, a tilted accretion disk of orbiting embers and a stream
 * of stars spiralling inward to their doom, plus a soft gravitational halo.
 */
const BlackHole = ({ startPosition = [9, 9, -19] }) => {
  const groupRef = useRef();
  const diskRef = useRef();
  const inflowRef = useRef();
  const ringRef = useRef();
  const haloRef = useRef();

  const glowTex = useMemo(createGlowTexture, []);
  const ringTex = useMemo(createRingTexture, []);

  const horizon = 1.5;
  const diskCount = 420;
  const inflowCount = 220;

  const disk = useMemo(() => {
    const positions = new Float32Array(diskCount * 3);
    const colors = new Float32Array(diskCount * 3);
    const data = [];
    const inner = new THREE.Color('#fff1d0');
    const mid = new THREE.Color('#ffae5c');
    const outer = new THREE.Color('#ff5e3a');
    for (let i = 0; i < diskCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const t = Math.pow(Math.random(), 0.6);
      const radius = horizon * 1.25 + t * 3.6;
      const speed = 0.9 / Math.sqrt(radius);
      const thickness = (Math.random() - 0.5) * 0.1 * radius;
      data.push({ angle, radius, speed, thickness });
      const c = t < 0.4 ? inner.clone().lerp(mid, t / 0.4) : mid.clone().lerp(outer, (t - 0.4) / 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, data };
  }, []);

  const inflow = useMemo(() => {
    const positions = new Float32Array(inflowCount * 3);
    const data = [];
    for (let i = 0; i < inflowCount; i++) {
      data.push({
        angle: Math.random() * Math.PI * 2,
        radius: horizon * 1.3 + Math.random() * 4.5,
        height: (Math.random() - 0.5) * 1.6,
      });
    }
    return { positions, data };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const d = Math.min(delta, 0.05);

    if (groupRef.current) {
      groupRef.current.position.x = ((startPosition[0] - t * 0.34 + 26) % 52) - 26;
      groupRef.current.position.y = startPosition[1] + Math.sin(t * 0.18) * 1.6;
    }
    if (diskRef.current) {
      const arr = diskRef.current.geometry.attributes.position.array;
      for (let i = 0; i < diskCount; i++) {
        const p = disk.data[i];
        p.angle += p.speed * d;
        arr[i * 3] = Math.cos(p.angle) * p.radius;
        arr[i * 3 + 1] = p.thickness;
        arr[i * 3 + 2] = Math.sin(p.angle) * p.radius;
      }
      diskRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (inflowRef.current) {
      const arr = inflowRef.current.geometry.attributes.position.array;
      for (let i = 0; i < inflowCount; i++) {
        const p = inflow.data[i];
        p.radius -= (0.55 + 0.8 / p.radius) * d;
        p.angle += (1.1 / Math.max(p.radius, 0.3)) * d;
        p.height *= 0.992;
        if (p.radius < horizon * 0.7) {
          p.radius = horizon * 1.3 + Math.random() * 4.5;
          p.angle = Math.random() * Math.PI * 2;
          p.height = (Math.random() - 0.5) * 1.6;
        }
        arr[i * 3] = Math.cos(p.angle) * p.radius;
        arr[i * 3 + 1] = p.height;
        arr[i * 3 + 2] = Math.sin(p.angle) * p.radius;
      }
      inflowRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.85 + Math.sin(t * 2) * 0.12;
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.5 + Math.sin(t * 1.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={startPosition} rotation={[1.15, 0, 0.35]}>
      {/* Gravitational halo */}
      <sprite ref={haloRef} scale={[9, 9, 1]}>
        <spriteMaterial map={glowTex} color="#ffb066" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      {/* Event horizon — occludes stars behind it */}
      <mesh>
        <sphereGeometry args={[horizon, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Photon ring (camera-facing, encircles the horizon) */}
      <sprite ref={ringRef} scale={[3.8, 3.8, 1]} renderOrder={3}>
        <spriteMaterial map={ringTex} color="#ffe6b3" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} />
      </sprite>
      {/* Accretion disk */}
      <points ref={diskRef} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={diskCount} array={disk.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={diskCount} array={disk.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial map={glowTex} size={0.18} vertexColors transparent opacity={0.95} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {/* Stars spiralling in to be swallowed */}
      <points ref={inflowRef} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={inflowCount} array={inflow.positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial map={glowTex} size={0.13} color="#cfe8ff" transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
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
                color="#EAF4FF" 
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
                color="#DCEBFF" 
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
 * ParallaxRig - gently glides the camera toward the cursor so the whole cosmos
 * (stars, supernovae, the black hole) shifts with depth as you move the mouse,
 * making the scene feel alive and immersive. Pure camera motion — no layout.
 */
const ParallaxRig = () => {
  useFrame((state) => {
    const { pointer, camera } = state;
    camera.position.x += (pointer.x * 1.3 - camera.position.x) * 0.045;
    camera.position.y += (pointer.y * 0.9 - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);
  });
  return null;
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
        <AdaptiveCanvas
          ref={canvasRef}
          eager
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={isDark ? 0.2 : 1.15} />
          <pointLight position={[10, 10, 10]} intensity={isDark ? 0.3 : 1} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={isDark ? 0.2 : 0.5} color={isDark ? "#4FB3D4" : "#FDB813"} />
          <ParallaxRig />
          
          {isDark ? (
            /* Night Sky Theme */
            <>
              <StarrySky />
              <FloatingStars />
              <FloatingCode />
              <Constellations />
              <Moon />
              <BlackHole />
              <Supernova position={[12, 6, -17]} color="#67e8f9" emberColor="#fb923c" delay={2} period={19} />
              <Supernova position={[-14, -4, -19]} color="#a78bfa" emberColor="#f472b6" delay={9} period={24} />
              <Supernova position={[4, 10, -22]} color="#34d399" emberColor="#fbbf24" delay={17} period={29} />
              <ShootingStar delay={0} startPos={[12, 8, -8]} />
              <ShootingStar delay={2500} startPos={[-10, 6, -6]} />
              <ShootingStar delay={5000} startPos={[8, -5, -10]} />
              <ShootingStar delay={7500} startPos={[-8, 4, -7]} />
            </>
          ) : (
            /* Day Sky Theme */
            <>
              <hemisphereLight args={["#ffffff", "#bcd9ff", 1.4]} />
              <Sun />
              <Clouds />
              <Birds />
            </>
          )}
        </AdaptiveCanvas>
        
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
            <Magnetic className="inline-flex">
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
            </Magnetic>

            <Magnetic className="inline-flex">
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
            </Magnetic>
            
            <Magnetic className="inline-flex">
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
            </Magnetic>
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
