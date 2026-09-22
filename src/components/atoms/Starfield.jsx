import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BLACK_HOLE, roam } from '../../utils/roaming';

/**
 * Starfield
 * ---------
 * The hero's stars, rendered as ~3000 instanced camera-facing quads driven by a
 * vertex shader so they respond to the black hole the way real matter and light
 * do:
 *
 *   • Bending of light — distant starlight is deflected *around* the hole and
 *     piles up into a bright Einstein ring hugging the shadow.
 *   • Accretion — stars inside the sphere of influence are drawn inward and
 *     swirled sideways (they had to shed angular momentum to fall at all).
 *   • Tidal stretching (spaghettification) — each quad is stretched along the
 *     radius toward the hole and squeezed across it, peaking halfway in.
 *   • Capture — anything that crosses the horizon fades out completely.
 *
 * Doing this on the GPU keeps 3000 stars essentially free; nothing is written
 * back to the CPU per frame except the hole's position.
 */

export const starfieldVertexShader = /* glsl */`
  precision highp float;

  attribute vec3 iOffset;
  attribute float iScale;
  attribute vec3 iColor;

  uniform vec3 uBH;
  uniform float uCapture;
  uniform float uReach;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vUv = uv;
    vColor = iColor;

    // A star nearer the camera only has to be a short world-distance away to
    // appear the same distance from the hole, so scale both radii by depth.
    float depth = max(cameraPosition.z - iOffset.z, 1.0)
                / max(cameraPosition.z - uBH.z, 1.0);
    float capture = uCapture * depth;
    float reach = uReach * depth;

    vec3 base = iOffset;
    vec2 toBH = uBH.xy - base.xy;
    float b = max(length(toBH), 0.0001);
    vec2 radial = toBH / b;

    // 1 inside the horizon, 0 beyond the reach of the hole.
    float pull = 1.0 - smoothstep(capture, reach, b);

    // ---- Bending of light: starlight is deflected around the hole --------
    float bend = (2.4 / max(b, 0.9)) * depth;
    base.xy -= radial * bend;

    // ---- Accretion: spiral in rather than falling straight down ----------
    base.xy += radial * (pull * b * 0.9);
    base.xy += vec2(-radial.y, radial.x) * (pull * pull * 2.6 * depth);

    // ---- Tidal stretching: long radially, thin across --------------------
    // Weighted by pull on top of the bell, so only stars actually close to the
    // hole streak; distant ones are barely touched. The peak is deliberately
    // extreme, because that is what spaghettification looks like.
    float stretch = pull * (1.0 - pull) * 4.0 * pull * 8.0;

    // Build the quad in the camera plane, local +X along the screen radius.
    vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 camUp    = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec2 rAxis = normalize(
      vec2(dot(vec3(radial, 0.0), camRight), dot(vec3(radial, 0.0), camUp))
      + vec2(1e-5, 0.0)
    );
    vec2 tAxis = vec2(-rAxis.y, rAxis.x);

    vec2 local = position.xy * iScale;
    vec2 offs = rAxis * (local.x * (1.0 + stretch))
              + tAxis * (local.y * max(1.0 - stretch * 0.19, 0.16));

    vec3 worldPos = base + camRight * offs.x + camUp * offs.y;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(worldPos, 1.0);

    // Twinkle as before, plus a flare-up where stars crowd into the ring.
    float twinkle = 0.72 + 0.28 * sin(uTime * 2.0 + iOffset.x * 3.1 + iOffset.y * 5.7);
    float ring = exp(-pow((b - capture * 2.2) / (capture * 1.4), 2.0));
    // Long thin streaks would otherwise fade to nothing, so brighten them as
    // they are reeled out.
    float streakBoost = 1.0 + stretch * 0.45;
    vColor = iColor * twinkle * streakBoost * (1.0 + 2.6 * ring);

    // Whatever crosses the horizon does not come back.
    vAlpha = 1.0 - smoothstep(0.55, 1.0, pull);
  }
`;

export const starfieldFragmentShader = /* glsl */`
  precision highp float;

  uniform sampler2D uMap;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float mask = texture2D(uMap, vUv).a;
    float a = mask * vAlpha;
    if (a <= 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/** Tight, soft glow — stretches cleanly into a streak. */
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.12, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.28)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const Starfield = ({ count = 3000 }) => {
  const materialRef = useRef();
  const texture = useMemo(() => createGlowTexture(), []);

  const geometry = useMemo(() => {
    // Seeded random function for deterministic results.
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const offsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      offsets[i * 3] = (pseudoRandom(i * 3) - 0.5) * 50;
      offsets[i * 3 + 1] = (pseudoRandom(i * 3 + 1) - 0.5) * 30;
      offsets[i * 3 + 2] = (pseudoRandom(i * 3 + 2) - 0.5) * 40 - 10;

      const size = 0.22 + pseudoRandom(i * 7) * 0.3;
      scales[i] = size;

      // Bigger stars are brighter.
      const brightness = 0.6 + (size / 0.52) * 0.4;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness * 1.1; // slightly blue tint
    }

    const plane = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = plane.index;
    geo.setAttribute('position', plane.attributes.position);
    geo.setAttribute('uv', plane.attributes.uv);
    geo.setAttribute('iOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('iScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('iColor', new THREE.InstancedBufferAttribute(colors, 3));
    geo.instanceCount = count;
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 90);

    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uBH: { value: new THREE.Vector3(0, 0, BLACK_HOLE.planeZ) },
      // World units. The shadow is ~1 world unit across; the hole's pull is
      // felt out to roughly a dozen.
      uCapture: { value: 1.1 },
      uReach: { value: 12 },
      uTime: { value: 0 },
    }),
    [texture]
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uBH.value.set(roam.x, roam.y, BLACK_HOLE.planeZ);
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={starfieldVertexShader}
        fragmentShader={starfieldFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default Starfield;
