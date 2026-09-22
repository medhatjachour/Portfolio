import { applyGravity, getTargetCenters, invalidateMeasurements } from './gravity';

/**
 * roaming.js — the "brain" behind the hero's black hole.
 *
 * The hole's position lives here as plain module state so it has a single
 * source of truth shared by two very different consumers:
 *
 *   • the 3D scene, which draws the hole wherever `roam.x/roam.y` points, and
 *   • the DOM, whose elements get bent by `applyGravity` as the hole passes.
 *
 * Driving it from a plain requestAnimationFrame loop (rather than from inside
 * the WebGL render loop) means the UI-absorbing effect keeps working even if
 * the canvas is paused, off-screen, or unavailable.
 */

// Both the virtual camera inside the black-hole shader and these values
// describe the same plane, so keep them in sync with BlackHole.jsx.
export const BLACK_HOLE = {
  size: 9, // world units — the small, hungry one
  zoom: 0.75, // shader uZoom
  shadowUv: 2.6 / 16, // shadow angular radius (2.6 r_s) at shader CAM_DIST = 16
  planeZ: -19,
};

const CAMERA_Z = 10; // hero camera z
const FOV_DEG = 75; // hero camera fov

// ---------------------------------------------------------------------------
// Sky attractors. 3D objects (the moon, floating code words, ...) register a
// world-space position here so the hole deliberately hunts them down, exactly
// the way it hunts the DOM elements.
// ---------------------------------------------------------------------------
const attractors = new Set();

export function registerAttractor(fn) {
  attractors.add(fn);
  return () => attractors.delete(fn);
}

function attractorTargets() {
  const out = [];
  attractors.forEach((fn) => {
    const p = fn();
    if (p) out.push(p);
  });
  return out;
}

/** Where the hole is, and where it is heading (billboard-plane world units). */
export const roam = {
  x: 0,
  y: 1.5,
  tx: 0,
  ty: 1.5,
  timer: 0,
};

/** A new hole appears at the centre-top of the hero. */
export function resetRoam(x = 0, y = 1.5) {
  roam.x = x;
  roam.y = y;
  roam.tx = x;
  roam.ty = y;
  roam.timer = 0;
}

/** World-units -> pixels, for a plane square to the camera. */
export function pxPerUnit(height) {
  const dist = CAMERA_Z - BLACK_HOLE.planeZ;
  return height / (2 * dist * Math.tan((FOV_DEG * Math.PI) / 360));
}

let measureTimer = 0;

/**
 * Advance the drift and drag the hero's elements along with it.
 *
 * @param {number} dt  seconds since the last frame
 * @param {Element} root  the hero section (coordinate space for everything)
 */
export function stepRoam(dt, root) {
  if (!root) return;
  const width = root.clientWidth;
  const height = root.clientHeight;
  if (!width || !height) return;

  const scale = pxPerUnit(height);

  // ---- Pick a new destination now and then --------------------------
  roam.timer -= dt;
  if (roam.timer <= 0) {
    roam.timer = 2.4 + Math.random() * 3.6;

    const domCenters = getTargetCenters();
    const skyTargets = attractorTargets();
    const roll = Math.random();

    if (domCenters.length > 0 && roll < 0.5) {
      // Hunt one of the hero's DOM elements.
      const c = domCenters[(Math.random() * domCenters.length) | 0];
      roam.tx = (c.x - width / 2) / scale;
      roam.ty = -(c.y - height / 2) / scale;
    } else if (skyTargets.length > 0 && roll < 0.8) {
      // Hunt something drifting in the sky — the moon, a floating word...
      const c = skyTargets[(Math.random() * skyTargets.length) | 0];
      roam.tx = c.x;
      roam.ty = c.y;
    } else {
      // Otherwise wander to an empty patch of sky.
      roam.tx = (Math.random() * 2 - 1) * (width / scale) * 0.25;
      roam.ty = (Math.random() * 2 - 1) * (height / scale) * 0.22;
    }
  }

  // ---- Glide toward it (frame-rate independent easing) --------------
  const ease = Math.min(1, dt * 0.8);
  roam.x += (roam.tx - roam.x) * ease;
  roam.y += (roam.ty - roam.y) * ease;

  // ---- Re-measure occasionally so we survive reflows and font swaps --
  measureTimer -= dt;
  if (measureTimer <= 0) {
    measureTimer = 2;
    invalidateMeasurements();
  }

  // ---- Bend the UI into the gravity well ----------------------------
  const screenX = width / 2 + roam.x * scale;
  const screenY = height / 2 - roam.y * scale;
  const shadowRadiusPx = ((BLACK_HOLE.shadowUv / BLACK_HOLE.zoom) * BLACK_HOLE.size * scale) / 2;

  applyGravity(screenX, screenY, Math.max(110, shadowRadiusPx * 8), root, dt);
}
