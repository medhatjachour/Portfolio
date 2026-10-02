import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import AdaptiveCanvas from '../atoms/AdaptiveCanvas';
import Magnetic from '../atoms/Magnetic';
import GravityTarget from '../atoms/GravityTarget';
import Starfield from '../atoms/Starfield';
import BlackHole from './BlackHole';
import { resetRoam, stepRoam, registerAttractor, roam } from '../../utils/roaming';
import { tidalAt } from '../../utils/tidal';
import { resetGravityTargets } from '../../utils/gravity';
import { watchMobileViewport } from '../../utils/viewport';
import { Text,  Float } from '@react-three/drei';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaLinkedin, FaDownload,  FaMicrosoft } from 'react-icons/fa';
import { SiReact, SiPython, SiTypescript, SiJavascript } from 'react-icons/si';
import { useThemeStore } from '../../store/themeStore';

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

  // Let the hole hunt a few of these words down, like everything else.
  useEffect(() => {
    const offs = codeSnippets
      .filter((_, i) => i % 7 === 0)
      .map((snippet) =>
        registerAttractor(() => ({ x: snippet.position[0], y: snippet.position[1] }))
      );
    return () => offs.forEach((off) => off());
  }, [codeSnippets]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;

    group.children.forEach((child, i) => {
      const cfg = codeSnippets[i];
      const [bx, by, bz] = cfg.position;
      const info = tidalAt(bx, by, bz);

      // Base drift, then dragged toward the hole across the screen.
      const bob = Math.sin(t * cfg.speed + i) * 0.5;
      child.position.set(
        bx + (roam.x - bx) * info.pull * 0.8,
        by + bob + (roam.y - by) * info.pull * 0.8,
        bz
      );

      child.rotation.y = t * 0.15 + cfg.rotation;
      // The long axis of the stretch lines up with the radius toward the hole.
      child.rotation.z = info.pull > 0.02 ? info.angle : Math.sin(t * 0.1 + i) * 0.1;

      // Spaghettified: reeled out along the radius, thinned across it.
      const survive = 1 - info.capture;
      child.scale.set(survive * info.longAxis, survive * info.shortAxis, survive);
    });
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
    const group = starsRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;

    group.children.forEach((star, i) => {
      const cfg = stars[i];
      const [bx, by, bz] = cfg.position;
      const info = tidalAt(bx, by, bz);

      // Dragged toward the hole across the screen.
      star.position.set(
        bx + (roam.x - bx) * info.pull * 0.8,
        by + (roam.y - by) * info.pull * 0.8,
        bz
      );

      // Tidal stretch along the radius, then collapse into the horizon.
      const survive = (1 - info.capture) * cfg.scale;
      star.rotation.z = info.angle;
      star.scale.set(
        survive * info.longAxis,
        survive * info.shortAxis,
        survive * Math.max(info.shortAxis, 0.4)
      );

      if (star.material) {
        // Twinkle as before, then dim as it is swallowed.
        const twinkle = Math.sin(t * cfg.speed + cfg.delay) * 0.5;
        const opacity = Math.max(0.2, Math.min(1, cfg.brightness + twinkle));
        star.material.opacity = opacity * (1 - info.pull);
      }
    });
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

/** Where the moon lives, and where a new one comes back. */
const MOON_POSITION = [-14, 7, -22];

/**
 * Moon - a bright glowing moon that the black hole can drag in, stretch and
 * swallow. Once it has crossed the horizon it stays gone for a while, then a
 * fresh moon fades back in (nothing ever comes back out of the horizon).
 */
const Moon = () => {
  const moonRef = useRef();
  const glowRef = useRef();
  const groupRef = useRef();
  const lifeRef = useRef({ alive: 1, respawnAt: 0 });

  // The hole deliberately hunts the moon — but only while there is a moon.
  useEffect(
    () =>
      registerAttractor(() =>
        lifeRef.current.alive > 0.9
          ? { x: MOON_POSITION[0], y: MOON_POSITION[1] }
          : null
      ),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const life = lifeRef.current;
    const info = tidalAt(MOON_POSITION[0], MOON_POSITION[1], MOON_POSITION[2]);

    if (moonRef.current) {
      moonRef.current.rotation.y = t * 0.05;
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 0.5) * 0.1 + 1;
      glowRef.current.material.opacity = 0.3 * pulse * life.alive;
    }

    // Swallowed: gone for a stretch, then a new moon drifts back in.
    if (life.alive > 0.02 && info.capture > 0.97) {
      life.alive = 0;
      life.respawnAt = t + 7 + Math.random() * 9;
    } else if (life.alive < 1 && t > life.respawnAt) {
      life.alive = Math.min(1, life.alive + state.delta * 0.4);
    }

    const group = groupRef.current;
    if (!group) return;

    const [mx, my, mz] = MOON_POSITION;
    // Dragged toward the hole across the screen...
    group.position.set(
      mx + (roam.x - mx) * info.pull * 0.85,
      my + (roam.y - my) * info.pull * 0.85,
      mz
    );

    // ...while the tidal gradient reels it out along the radius, thins it across
    // and flattens it through — peaking just before it crosses the horizon.
    const survive = (1 - info.capture) * life.alive;
    group.rotation.z = info.angle;
    group.scale.set(
      survive * info.longAxis,
      survive * info.shortAxis,
      survive * (0.45 + info.shortAxis * 0.55)
    );
  });

  return (
    <group ref={groupRef} position={MOON_POSITION}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group>
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
    </group>
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
 * (stars, moon, the roaming black hole) shifts with depth as you move the
 * mouse, making the scene feel alive and immersive. Pure camera motion — no
 * layout.
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
  const sectionRef = useRef(null);
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

  // The roaming black hole. Its position lives in utils/roaming.js and is stepped
  // from a plain rAF loop rather than the WebGL render loop, so the hero's
  // elements keep getting pulled in even if the canvas is paused or unavailable.
  //
  // Switched off entirely on phone-sized viewports. AdaptiveCanvas skips the 3D
  // scene there too, so bending the UI around a hole that is never drawn would
  // just look broken — and it is exactly the wrong place to spend pixels.
  useEffect(() => {
    if (!isDark || typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    let raf = 0;
    let last = 0;

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      // Simulate only while the hero is actually on screen.
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        stepRoam(dt, section);
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      resetRoam();
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const unwatch = watchMobileViewport((isMobile) => {
      if (isMobile) {
        stop();
        resetGravityTargets(); // hand every element back untouched
      } else {
        start();
      }
    });

    return () => {
      unwatch();
      stop();
      resetGravityTargets();
    };
  }, [isDark]);

  return (
    <section ref={sectionRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
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
              <Starfield />
              <FloatingStars />
              <FloatingCode />
              <Constellations />
              <Moon />
              <BlackHole />
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
          <GravityTarget className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
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
          </GravityTarget>

          {/* Animated Introduction */}
          <GravityTarget className="relative space-y-3">
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
              Software Engineer — React, TypeScript &amp; Node.js
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

            {/* Availability — the first thing a hiring manager should see. */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className={`mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs md:text-sm font-medium backdrop-blur-md border ${
                isDark
                  ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Open to new roles — remote, or relocation to UAE / KSA
            </motion.div>
          </motion.div>
          </GravityTarget>

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
            <GravityTarget className="inline-flex">
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
            </GravityTarget>

            <GravityTarget className="inline-flex">
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
            </GravityTarget>
            
            <GravityTarget className="inline-flex">
            <Magnetic className="inline-flex">
            <motion.a
              href="/Medhat_Ashour_Software_Engineer.pdf"
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
            </GravityTarget>
          </motion.div>

          {/* Scroll indicator */}
          <GravityTarget className="mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
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
          </GravityTarget>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroNew;
