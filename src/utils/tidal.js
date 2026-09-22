import { BLACK_HOLE, roam } from './roaming';

/**
 * tidal.js — how the hero's 3D objects respond to the black hole.
 *
 * The maths is deliberately done on the *lateral* (screen-plane) offset rather
 * than the full 3D distance: the hero camera looks straight down -Z, so the
 * lateral offset is what the eye reads as "how close is that thing to the hole",
 * and it keeps the 3D objects moving in lock-step with the DOM elements, which
 * live in screen space too. `dist` is still reported for anything that needs the
 * real separation.
 *
 * The tidal part is what stretches infalling matter: the near side is pulled
 * harder than the far side, so an object elongates along the radius toward the
 * hole and gets squeezed across it ("spaghettification"). Elongation peaks
 * halfway in and spikes again as the object plunges through the horizon.
 */

// Screen-plane radius the hole's gravity is noticeable over (world units).
const REACH = 13;

// Lateral distance at which tidal forces start visibly tearing an object.
const TEAR_DIST = 6;

// Peak tidal elongation midway through the fall, and how hard the plunge
// stretches it as it crosses the horizon.
const MAX_STRETCH = 3.2;
const TEAR_STRENGTH = 0.85;

// Floor on the cross axis so the squeeze can never invert an object.
const CROSS_FLOOR = 0.22;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * @returns {{
 *   dist: number,      // true 3D distance to the hole
 *   lateral: number,   // screen-plane distance to the hole
 *   pull: number,      // 0 outside the reach, 1 sitting on the horizon
 *   capture: number,   // 0 safe, 1 fully swallowed
 *   angle: number,     // screen-space angle of the radius (for rotation.z)
 *   stretch: number,   // tidal elongation, peaks halfway in
 *   tear: number       // extra elongation as it plunges toward the horizon
 * }}
 */
export function tidalAt(x, y, z) {
  const dx = roam.x - x;
  const dy = roam.y - y;
  const dz = BLACK_HOLE.planeZ - z;

  const lateral = Math.hypot(dx, dy);
  const dist = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), 0.0001);

  const raw = 1 - lateral / REACH;
  const pull = raw <= 0 ? 0 : raw * raw * (3 - 2 * raw); // smoothstep

  // Extra elongation as the object plunges the last stretch toward the horizon.
  const tear = Math.max(0, TEAR_DIST - lateral) * TEAR_STRENGTH;

  // Weighted by `pull` on top of the bell, so an object only really deforms
  // once it is genuinely close; far away it is barely touched.
  const stretch = MAX_STRETCH * pull * (1 - pull) * 4 * pull;
  const elongation = stretch + tear;

  return {
    dist,
    lateral,
    pull,
    capture: 1 - clamp01((lateral - 2) / 3.5),
    // Camera looks down -z, so a plain z-rotation lines the long axis up with
    // the radius on screen.
    angle: Math.atan2(dy, dx),
    stretch,
    tear,
    // Scale multipliers, already clamped: reeled out along the radius and
    // squeezed across it, without ever crossing zero.
    longAxis: 1 + elongation,
    shortAxis: Math.max(1 - elongation * 0.5, CROSS_FLOOR),
  };
}
