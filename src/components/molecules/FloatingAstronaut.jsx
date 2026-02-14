import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/**
 * Floating Astronaut Component
 * Realistic space floating with erratic movements and word-catching behavior
 */
export default function FloatingAstronaut({ position = [0, 0, 2], scale = 1.2 }) {
  const group = useRef();
  const limbsRef = useRef({ leftArm: null, rightArm: null, leftLeg: null, rightLeg: null });
  const [randomOffsets] = useState({
    xPhase: Math.random() * Math.PI * 2,
    yPhase: Math.random() * Math.PI * 2,
    zPhase: Math.random() * Math.PI * 2,
    rotPhase: Math.random() * Math.PI * 2,
  });
  const { scene } = useGLTF('/animated_floating_astronaut_in_space_suit_loop.glb');

  // Find limbs with more detailed joint structure
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const name = child.name.toLowerCase();
        
        // Find arms (shoulders, elbows, wrists, hands)
        if ((name.includes('arm') || name.includes('hand') || name.includes('shoulder') || 
             name.includes('upper') || name.includes('fore') || name.includes('wrist')) && 
            !limbsRef.current.leftArm && !limbsRef.current.rightArm) {
          if (name.includes('left') || name.includes('_l') || name.includes('.l') || name.includes('l_')) {
            limbsRef.current.leftArm = child;
          } else if (name.includes('right') || name.includes('_r') || name.includes('.r') || name.includes('r_')) {
            limbsRef.current.rightArm = child;
          }
        }
        
        // Find legs (hips, thighs, knees, ankles)
        if ((name.includes('leg') || name.includes('thigh') || name.includes('foot') || 
             name.includes('knee') || name.includes('shin') || name.includes('ankle')) && 
            !limbsRef.current.leftLeg && !limbsRef.current.rightLeg) {
          if (name.includes('left') || name.includes('_l') || name.includes('.l') || name.includes('l_')) {
            limbsRef.current.leftLeg = child;
          } else if (name.includes('right') || name.includes('_r') || name.includes('.r') || name.includes('r_')) {
            limbsRef.current.rightLeg = child;
          }
        }
      });
    }
  }, [scene]);

  // Dynamic, playful floating with exaggerated movements
  useFrame((state) => {
    if (group.current) {
      const time = state.clock.elapsedTime;
      
      // Energetic left-to-right movement with loops and spirals
      const primaryX = Math.sin(time * 0.2) * 6;
      const loopX = Math.sin(time * 0.7) * 1.5; // Loop-de-loop effect
      group.current.position.x = position[0] + primaryX + loopX;
      
      // Bouncy up-down with big range
      const bounceY = Math.sin(time * 0.5) * 2.5;
      const zigzagY = Math.cos(time * 0.8) * 1;
      group.current.position.y = position[1] + bounceY + zigzagY;
      
      // Spiraling depth
      const spiralZ = Math.cos(time * 0.6) * 1;
      group.current.position.z = position[2] + spiralZ;
      
      // Energetic spinning and tumbling
      group.current.rotation.y = time * 0.3 + Math.sin(time * 0.5) * 0.8;
      group.current.rotation.x = Math.sin(time * 0.4) * 0.6;
      group.current.rotation.z = Math.cos(time * 0.45) * 0.5;
      
      // Exaggerated limb animations
      const { leftArm, rightArm, leftLeg, rightLeg } = limbsRef.current;
      
      // Arms: Big swimming strokes
      if (leftArm) {
        // Big circular motion
        leftArm.rotation.x = Math.sin(time * 1.2) * 0.8;
        leftArm.rotation.z = Math.sin(time * 1) * 0.6 + 0.3;
        leftArm.rotation.y = Math.cos(time * 0.9) * 0.4;
      }
      
      if (rightArm) {
        // Opposite big stroke
        rightArm.rotation.x = Math.sin(time * 1.2 + Math.PI) * 0.8;
        rightArm.rotation.z = Math.sin(time * 1 + Math.PI) * 0.6 - 0.3;
        rightArm.rotation.y = Math.cos(time * 0.9 + Math.PI) * 0.4;
      }
      
      // Legs: Very subtle floating motion, nearly straight
    //   if (leftLeg) {
    //     // leftLeg.rotation.x = Math.sin(time * 1.5) * 0.08;       
    //     // leftLeg.rotation.z = Math.sin(time * 1.1) * 0.05;
    //     // leftLeg.rotation.y = Math.cos(time * 1.3) * 0.03;    
    //   }
      
      if (rightLeg) {
        rightLeg.rotation.x = Math.sin(time * 1.5 + Math.PI) * 0.08;
        rightLeg.rotation.z = Math.sin(time * 1.1 + Math.PI) * 0.05;
        rightLeg.rotation.y = Math.cos(time * 1.3 + Math.PI) * 0.03;
      }
    }
  });

  return (
    <>
      {/* Extremely bright lighting from all directions */}
      <hemisphereLight intensity={2} groundColor="#444444" />
      <ambientLight intensity={2} />
      
      {/* Multiple directional lights from different angles */}
      <directionalLight position={[10, 10, 5]} intensity={4} color="#ffffff" />
      <directionalLight position={[-10, 10, 5]} intensity={4} color="#ffffff" />
      <directionalLight position={[0, -10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[0, 10, -5]} intensity={3} color="#ffffff" />
      
      {/* Additional point lights close to astronaut */}
      <pointLight position={[5, 5, 3]} intensity={3} color="#ffffff" distance={30} />
      <pointLight position={[-5, 5, 3]} intensity={3} color="#ffffff" distance={30} />
      <pointLight position={[0, -5, 3]} intensity={2} color="#ffffff" distance={25} />
      
      <group ref={group} dispose={null}>
        <primitive object={scene} scale={scale} />
      </group>
    </>
  );
}

// Preload the model for better performance
useGLTF.preload('/animated_floating_astronaut_in_space_suit_loop.glb');
