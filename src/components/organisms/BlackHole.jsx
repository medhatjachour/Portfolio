import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BLACK_HOLE, roam } from '../../utils/roaming';

/**
 * BlackHole
 * ---------
 * A physically-motivated Schwarzschild black hole rendered as a single
 * camera-facing billboard whose fragment shader *ray-traces null geodesics*
 * through curved spacetime. Nothing here is a "sprite with a ring on top" —
 * the visuals all fall out of the maths:
 *
 *   • Bending light  — every pixel marches a photon along the null-geodesic
 *     equation  d²r/dλ² = -1.5 h² r / r⁵  (in units where r_s = 1, with h the
 *     conserved specific angular momentum). Rays that would pass beside the
 *     hole curve around it, producing the Einstein ring and the lensed
 *     "over-the-top / under-the-bottom" arcs of the accretion disk.
 *
 *   • Swallowing the sky — any ray that reaches r < r_s is captured, so the
 *     shadow is opaque black and genuinely occludes the starfield behind it.
 *
 *   • Pulling in matter — the accretion disk is a volumetric ring of gas on
 *     Keplerian orbits (Ω = √(M/r³)). Differential rotation shears the
 *     turbulence into spirals and an inward drift makes material visibly fall
 *     in toward the innermost stable circular orbit (r = 3 r_s).
 *
 *   • Relativistic light — the approaching side of the disk is Doppler
 *     beamed (I ∝ δ³) so it blazes while the receding side dims, and
 *     gravitational redshift (√(1 - r_s/r)) dims and reddens gas near the
 *     horizon. Disk colour follows a blackbody-ish temperature ramp.
 *
 * Physics references: photon sphere at 1.5 r_s, shadow radius ≈ 2.6 r_s,
 * ISCO at 3 r_s, orbital speed 0.5c at ISCO.
 */

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uSteps;
  uniform float uBrightness;
  uniform float uZoom;

  // Scene geometry, all in Schwarzschild-radius units (r_s = 1 -> M = 0.5).
  const float CAM_DIST   = 16.0;   // observer distance from the hole
  const float CAM_HEIGHT = 3.2;    // observer height above the disk plane
  const float R_IN       = 3.0;    // innermost stable circular orbit (3 r_s)
  const float R_OUT      = 10.0;   // outer edge of the accretion disk
  const float R_ESCAPE   = 42.0;

  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash2(i);
    float b = hash2(i + vec2(1.0, 0.0));
    float c = hash2(i + vec2(0.0, 1.0));
    float d = hash2(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + 17.1;
      a *= 0.5;
    }
    return v;
  }

  // Blackbody-like ramp: 0 = white-hot inner disk, 1 = cool outer embers.
  vec3 diskPalette(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c0 = vec3(1.00, 0.99, 0.96);
    vec3 c1 = vec3(1.00, 0.88, 0.62);
    vec3 c2 = vec3(1.00, 0.58, 0.22);
    vec3 c3 = vec3(0.60, 0.13, 0.04);
    if (t < 0.30) return mix(c0, c1, t / 0.30);
    if (t < 0.62) return mix(c1, c2, (t - 0.30) / 0.32);
    return mix(c2, c3, (t - 0.62) / 0.38);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;

    // ---- Virtual observer, tilted slightly above the orbital plane ----
    vec3 camPos = vec3(0.0, CAM_HEIGHT, CAM_DIST);
    vec3 fwd    = normalize(-camPos);
    vec3 right  = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up     = cross(right, fwd);

    vec3 pos = camPos;
    vec3 vel = normalize(fwd + right * (p.x * uZoom) + up * (p.y * uZoom));

    // Conserved angular momentum of the photon (radial force => no torque).
    vec3  L  = cross(pos, vel);
    float h2 = dot(L, L);

    vec3  col   = vec3(0.0);
    float alpha = 0.0;
    int   steps = int(uSteps);

    for (int i = 0; i < 200; i++) {
      if (i >= steps) break;

      float r = length(pos);
      if (r < 1.0) { alpha = 1.0; break; }   // crossed the horizon -> black
      if (r > R_ESCAPE) break;               // escaped to the background sky

      float dt = clamp(0.075 * r, 0.035, 1.05);

      // Velocity-Verlet integration of the null geodesic.
      vec3 acc  = -1.5 * h2 * pos / (r * r * r * r * r);
      vec3 npos = pos + vel * dt + acc * (0.5 * dt * dt);
      float nr  = max(length(npos), 0.30);
      vec3 nacc = -1.5 * h2 * npos / pow(nr, 5.0);
      vel += (acc + nacc) * (0.5 * dt);
      pos  = npos;

      // ---------- Accretion disk: gas in the equatorial plane ----------
      float rr = length(pos.xz);
      if (rr > R_IN && rr < R_OUT) {
        float phi     = atan(pos.z, pos.x);
        float omega   = sqrt(0.5 / (rr * rr * rr));      // Keplerian Ω
        float scaleH  = 0.085 * rr + 0.05;               // flaring scale height
        float vert    = exp(-0.5 * (pos.y * pos.y) / (scaleH * scaleH));

        // Co-rotating turbulence: differential rotation shears it into arms.
        float swirl  = phi - omega * uTime * 10.0;
        float infall = uTime * 0.4;
        float n = fbm(vec2(rr * 0.85 - infall, swirl * 2.3));
        n = mix(n, fbm(vec2(rr * 0.30 - infall * 0.6, swirl * 0.85)), 0.55);

        float t    = clamp((rr - R_IN) / (R_OUT - R_IN), 0.0, 1.0);
        float dens = smoothstep(R_IN, R_IN + 1.4, rr)
                   * (1.0 - smoothstep(R_OUT - 4.5, R_OUT, rr));
        dens *= 0.30 + 1.25 * n;

        // Relativistic Doppler beaming toward the observer.
        vec3  obsDir = normalize(camPos - pos);
        vec3  vdir   = normalize(vec3(-sin(phi), 0.0, cos(phi)));
        float beta   = min(0.92, sqrt(0.5 / max(rr - 1.0, 0.4)));
        float gamma  = 1.0 / sqrt(max(1.0 - beta * beta, 1e-3));
        float dopp   = 1.0 / (gamma * (1.0 - beta * dot(vdir, obsDir)));
        float beam   = pow(clamp(dopp, 0.0, 3.5), 3.0);

        // Gravitational redshift dims and reddens gas close to the horizon.
        float gz = sqrt(clamp(1.0 - 1.0 / rr, 0.0, 1.0));

        // Emissivity falls off as the disk cools outward.
        float radiance = pow(R_IN / rr, 2.0);

        // Blueshifted (approaching) side runs hotter, receding side cooler.
        float tShift = clamp(t + 0.35 * (1.0 - dopp) - 0.15 * (1.0 - gz), 0.0, 1.0);

        vec3 emission = diskPalette(tShift) * radiance * beam * gz * dens * vert;
        col   += emission * dt * 2.2 * uBrightness;
        alpha  = max(alpha, clamp(dens * vert * 1.15, 0.0, 0.94));
      }
    }

    // ---- Photon ring: light that looped the hole, hugging the shadow ----
    float rho     = length(p);
    float shadowR = (2.6 / CAM_DIST) / uZoom;
    float ring    = exp(-pow((rho - shadowR) / (shadowR * 0.17), 2.0));
    col += vec3(1.0, 0.88, 0.68) * ring * 0.55 * uBrightness;

    // Warm glow spilling outward past the shadow.
    float halo = exp(-pow((rho - shadowR) / (shadowR * 1.15), 2.0)) * 0.15;
    col += vec3(1.0, 0.68, 0.42) * halo * uBrightness;

    // Filmic tone map: keeps the hot inner disk bright without clipping the
    // whole accretion flow to a flat white blob.
    col = 1.0 - exp(-col);

    // Fade the billboard edge so it can never show a hard seam.
    float edge = smoothstep(1.0, 0.74, rho);
    col   *= edge;
    alpha *= edge;

    gl_FragColor = vec4(col, alpha);
  }
`;

const isLowPowerDevice = () => {
  if (typeof window === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  return window.innerWidth < 1280 || cores <= 4;
};

/** Soft radial glow used for the relativistic jets. */
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.72)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.20)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Two collimated beams of plasma fired along the spin axis — the fraction of
 * infalling matter that is *not* swallowed. Matter only escapes along the poles,
 * so the beams stay close to the disk axis (screen-vertical here) and carry a
 * bright synchrotron-blue core.
 */
const JET_BEAMS = [
  { y: 5.0, sx: 1.7, sy: 10.5, color: '#5fb0ff', opacity: 0.22, speed: 2.6 },
  { y: -5.0, sx: 1.7, sy: 10.5, color: '#5fb0ff', opacity: 0.22, speed: 3.1 },
  { y: 4.4, sx: 0.5, sy: 9.0, color: '#eaf6ff', opacity: 0.4, speed: 3.6 },
  { y: -4.4, sx: 0.5, sy: 9.0, color: '#eaf6ff', opacity: 0.4, speed: 4.1 },
];

/**
 * BlackHole
 * The visual half of the hero's little black hole: it draws itself wherever
 * `roam` currently points (see utils/roaming.js, which also bends the DOM
 * elements the hole pulls in). Keeping the motion model outside the WebGL loop
 * means the UI-absorbing effect survives a paused or unavailable canvas.
 */
const BlackHole = ({ brightness = 0.95 }) => {
  const groupRef = useRef();
  const jetsRef = useRef();
  const materialRef = useRef();
  const glowTex = useMemo(() => createGlowTexture(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSteps: { value: isLowPowerDevice() ? 92 : 150 },
      uBrightness: { value: brightness },
      uZoom: { value: BLACK_HOLE.zoom },
    }),
    [brightness]
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    group.position.set(roam.x, roam.y, BLACK_HOLE.planeZ);
    // Stay square to the camera so the shadow never skews into an ellipse.
    group.lookAt(state.camera.position);

    if (jetsRef.current) {
      jetsRef.current.position.set(roam.x, roam.y, BLACK_HOLE.planeZ);
      const t = state.clock.elapsedTime;
      jetsRef.current.children.forEach((beam, i) => {
        const cfg = JET_BEAMS[i];
        if (!cfg || !beam.material) return;
        const phase = t * cfg.speed;
        beam.material.opacity = (cfg.opacity + 0.09 * Math.sin(phase)) * brightness;
        // Slight breathing so the beam reads as flowing plasma, not a bar.
        beam.scale.set(cfg.sx, cfg.sy * (1 + 0.05 * Math.sin(phase * 0.6)), 1);
      });
    }
  });

  return (
    <>
      {/* Relativistic jets — renderOrder 11 keeps them under the shadow (12) */}
      <group ref={jetsRef} position={[roam.x, roam.y, BLACK_HOLE.planeZ]}>
        {JET_BEAMS.map((beam, i) => (
          <sprite
            key={i}
            position={[0, beam.y, 0]}
            scale={[beam.sx, beam.sy, 1]}
            renderOrder={11}
          >
            <spriteMaterial
              map={glowTex}
              color={beam.color}
              transparent
              opacity={beam.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest={false}
            />
          </sprite>
        ))}
      </group>

      <group ref={groupRef} position={[roam.x, roam.y, BLACK_HOLE.planeZ]}>
        <mesh renderOrder={12} frustumCulled={false}>
          <planeGeometry args={[BLACK_HOLE.size, BLACK_HOLE.size]} />
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            depthTest={false}
            // Premultiplied compositing: result = col + dst * (1 - alpha), which
            // lets glowing gas add to the sky while the shadow stays opaque black.
            blending={THREE.CustomBlending}
            blendEquation={THREE.AddEquation}
            blendSrc={THREE.OneFactor}
            blendDst={THREE.OneMinusSrcAlphaFactor}
          />
        </mesh>
      </group>
    </>
  );
};

export default BlackHole;
