/**
 * gravity.js — the tidal physics that bends the hero's DOM elements.
 *
 * The roaming black hole publishes its position every frame and each registered
 * element (see <GravityTarget/>) goes through the same sequence real infalling
 * matter does:
 *
 *   1. Tidal tug      — gravity is stronger on the near side, so the element is
 *                       pulled toward the hole and stretched along the radius
 *                       while being squeezed across it ("spaghettification").
 *   2. Spiral infall  — angular momentum is lost, so instead of dropping
 *                       straight down the radius the path curves inward.
 *   3. Capture        — inside the shadow it is held on the horizon and fades
 *                       out entirely (nothing crosses back out of the horizon).
 *   4. Relativistic jet — the fraction of material that is *not* swallowed is
 *                       flung back out along the spin axis by the bipolar jets,
 *                       not teleported to an arbitrary spot.
 *
 * Everything is written straight to `style.transform` / `style.opacity` — no
 * React state is touched per frame, so the animation costs zero re-renders.
 * Because transforms never affect layout, the page itself never reflows.
 */

// How far (px) the jets can fling an element from where it started. Bounded so
// the hero stays readable.
const MAX_RELEASE_X = 150;
const MAX_RELEASE_Y = 110;

// Homes slowly drift back toward the original spot so the hero self-heals
// instead of staying permanently scrambled. ~10s half-life: slow enough that a
// jet launch is clearly visible, quick enough that the layout resolves.
const HOME_DECAY = 0.9988;

// Position is driven by a damped spring rather than a plain lerp: a spring has
// momentum, so a jet launch overshoots and settles instead of sliding limply
// into place. zeta = DAMPING / (2*sqrt(SPRING)) ~= 0.77, i.e. a touch
// underdamped. SPRING is deliberately soft — a stiff spring yanks elements into
// the hole in a couple of frames, which reads as a snap rather than a fall.
const SPRING = 34; // 1/s^2
const DAMPING = 9; // 1/s

// Speed (px/s) of the kick an element gets as the jet throws it out.
const JET_SPEED = 400;

// Scale/opacity have no momentum, so they stay simple eases. `EASE` is a
// frame-rate-independent factor derived per frame from dt.
const EASE_PER_SECOND = 10;

// Peak lateral drift of the spiral, in px, at the halfway point of the fall.
const SPIRAL_PX = 160;

// Peak tidal elongation. Applied to a proximity-weighted bell, so a distant
// element is barely touched while one actually falling in gets reeled out to
// roughly 1.8x its length with the cross axis collapsed — a proper noodle.
const MAX_STRETCH = 3.4;

// How thin the cross axis gets at peak stretch, and the floor that keeps it from
// collapsing to (or past) zero and flipping the element inside out.
const CROSS_SQUEEZE = 0.72;
const CROSS_FLOOR = 0.3;

export const gravityTargets = new Set();

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Walk the offsetParent chain to get the element's untransformed position
 * relative to `root`. offsetLeft/offsetTop ignore transforms, so the numbers
 * stay stable while we are animating the element.
 */
function layoutOffset(el, root) {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== root) {
    x += node.offsetLeft || 0;
    y += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return { x, y };
}

export function createTarget(el) {
  return {
    el,
    root: null,
    baseX: 0,
    baseY: 0,
    w: 0,
    h: 0,
    measured: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    scale: 1,
    opacity: 1,
    homeX: 0,
    homeY: 0,
    swallowed: false,
    released: false,
    hold: 0,
    cooldown: 0,
  };
}

/**
 * Hand every element back to the page exactly as it was authored. Used when the
 * simulation is switched off — leaving a phone, unmounting, reduced-motion — so
 * nothing is ever left bent around an invisible black hole.
 */
export function resetGravityTargets() {
  gravityTargets.forEach((t) => {
    t.x = 0;
    t.y = 0;
    t.vx = 0;
    t.vy = 0;
    t.scale = 1;
    t.opacity = 1;
    t.homeX = 0;
    t.homeY = 0;
    t.swallowed = false;
    t.released = false;
    t.hold = 0;
    t.cooldown = 0;
    if (t.el && t.el.style) {
      t.el.style.transform = '';
      t.el.style.opacity = '';
    }
  });
}

/** Force a re-measure on the next frame (resize, layout shift, etc.). */
export function invalidateMeasurements() {
  gravityTargets.forEach((t) => {
    t.measured = false;
  });
}

function measure(t, root) {
  const { x, y } = layoutOffset(t.el, root);
  t.baseX = x;
  t.baseY = y;
  t.w = t.el.offsetWidth;
  t.h = t.el.offsetHeight;
  t.root = root;
  t.measured = true;
}

/** Screen-space centre of each registered element (used for target picking). */
export function getTargetCenters() {
  const centers = [];
  gravityTargets.forEach((t) => {
    if (!t.measured || !t.el.isConnected) return;
    if (t.cooldown > 0) return; // just spat out — leave it alone for a moment
    centers.push({
      x: t.baseX + t.w / 2 + t.homeX,
      y: t.baseY + t.h / 2 + t.homeY,
    });
  });
  return centers;
}

/**
 * A bipolar relativistic jet flings material out along the black hole's spin
 * axis — which, for a billboarded accretion disk viewed slightly from above,
 * projects to the screen-vertical axis. Ejected elements are therefore given a
 * new resting place *and an impulse* along the jet (with the jet's opening
 * angle), so they are thrown out and settle, rather than teleporting.
 */
function launch(t) {
  const axis = Math.random() < 0.5 ? -1 : 1; // north or south jet
  const halfAngle = (55 * Math.PI) / 180;
  const angle = (axis * Math.PI) / 2 + (Math.random() * 2 - 1) * halfAngle;

  const distance = 90 + Math.random() * 140;
  const dirX = Math.cos(angle);
  const dirY = -Math.sin(angle); // CSS y grows downward

  // Where it eventually comes to rest...
  t.homeX = Math.max(-MAX_RELEASE_X, Math.min(MAX_RELEASE_X, dirX * distance * 0.6));
  t.homeY = Math.max(-MAX_RELEASE_Y, Math.min(MAX_RELEASE_Y, dirY * distance * 0.65));

  // ...and the kick that gets it there.
  t.vx += dirX * JET_SPEED;
  t.vy += dirY * JET_SPEED;

  t.cooldown = 4 + Math.random() * 3;
}

/**
 * Advance the gravity simulation.
 *
 * The element's distance to the hole is measured from where it *actually is*
 * right now, not from its resting place. That matters: measuring from home made
 * the pull lag behind the element as it fell in, so captures only fired when the
 * hole happened to sit on the original spot and the element would hover short of
 * the horizon instead of going in.
 *
 * @param {number} bhX  black hole centre, px relative to `root`
 * @param {number} bhY  black hole centre, px relative to `root`
 * @param {number} influenceRadius  px radius of gravitational reach
 * @param {Element} root  element the coordinates are relative to (the hero)
 * @param {number} dt  seconds since the previous frame
 */
export function applyGravity(bhX, bhY, influenceRadius, root, dt = 0.016) {
  if (prefersReducedMotion || !root) return;

  const step = Math.min(dt, 0.05);
  // Close enough to the horizon to count as "gone in".
  const swallowRadius = influenceRadius * 0.3;
  // Frame-rate independent easing for the momentum-free properties.
  const ease = 1 - Math.exp(-EASE_PER_SECOND * step);

  gravityTargets.forEach((t) => {
    const el = t.el;
    if (!el || !el.isConnected) return;

    if (t.cooldown > 0) t.cooldown -= step;

    if (!t.measured || t.root !== root) measure(t, root);
    if (!t.w || !t.h) return;

    const cx = t.baseX + t.w / 2;
    const cy = t.baseY + t.h / 2;

    // Vector from where the element is rendered right now to the hole.
    const toHoleX = bhX - (cx + t.x);
    const toHoleY = bhY - (cy + t.y);
    const dist = Math.hypot(toHoleX, toHoleY);
    const inv = dist > 0.0001 ? 1 / dist : 0;
    const radialX = inv ? toHoleX * inv : 1;
    const radialY = inv ? toHoleY * inv : 0;

    // 0 outside the influence radius, 1 sitting on the horizon.
    const raw = 1 - dist / influenceRadius;
    const pull = raw <= 0 ? 0 : raw * raw * (3 - 2 * raw); // smoothstep

    if (!t.swallowed) {
      if (dist < swallowRadius) {
        // Captured: hold it on the horizon for a beat so you can actually see
        // it cross over, then let the jets deal with what is left.
        t.swallowed = true;
        t.released = false;
        t.hold = 0.9 + Math.random() * 0.8;
        t.vx = 0;
        t.vy = 0;
      }
    } else {
      t.hold -= step;
      if (t.hold <= 0 && !t.released) {
        launch(t);
        t.released = true;
      }
      if (dist > influenceRadius * 0.8) {
        t.swallowed = false;
        t.released = false;
      }
    }

    // Material sheds angular momentum before it can fall in, so the path curves
    // sideways instead of dropping straight down the radius.
    const spiral = SPIRAL_PX * pull * (1 - pull);

    let targetX;
    let targetY;
    let targetScale;
    let targetOpacity;

    if (t.swallowed && !t.released) {
      // Being swallowed. Pinned to the horizon and driven to nothing explicitly,
      // rather than relying on `pull` — otherwise an element captured at the
      // edge of the swallow radius only half-vanishes.
      targetX = bhX - cx;
      targetY = bhY - cy;
      targetScale = 0;
      targetOpacity = 0;
    } else {
      // Blend between the resting place and the horizon: at full pull the
      // element's centre lands exactly on the hole, at zero pull it sits at home.
      // After a launch the hole is ignored until it has let go, so the jet kick
      // is not fighting the pull of the very hole that threw it.
      const effectivePull = t.released ? 0 : pull;

      targetX =
        t.homeX + (bhX - cx - t.homeX) * effectivePull * 0.98 - radialY * spiral;
      targetY =
        t.homeY + (bhY - cy - t.homeY) * effectivePull * 0.98 + radialX * spiral;
      targetScale = 1 - pull * 0.6;
      targetOpacity = 1 - pull * pull;

      // Out of range entirely: settle exactly on home instead of hovering a few
      // pixels off it, which is what made the return look imprecise.
      if (effectivePull < 0.02) {
        targetX = t.homeX;
        targetY = t.homeY;
      }
    }

    // Integrate the position with a damped spring. This is what gives the jet
    // launch its arc, overshoot and settle.
    const accX = (targetX - t.x) * SPRING - t.vx * DAMPING;
    const accY = (targetY - t.y) * SPRING - t.vy * DAMPING;
    t.vx += accX * step;
    t.vy += accY * step;
    t.x += t.vx * step;
    t.y += t.vy * step;

    t.scale += (targetScale - t.scale) * ease;
    t.opacity += (targetOpacity - t.opacity) * ease;

    t.homeX *= HOME_DECAY;
    t.homeY *= HOME_DECAY;

    // ---- Tidal stretching (spaghettification) --------------------------
    // The near side of the element is pulled harder than the far side, so it is
    // stretched along the radius toward the hole and squeezed across it. The
    // bell peaks halfway in; multiplying by `pull` again weights it by proximity
    // so an element that merely *rests* within range is not permanently deformed.
    const bell = pull * (1 - pull) * 4;
    const stretch = MAX_STRETCH * bell * pull;
    const size = Math.max(t.scale, 0.0001);
    const alongRadius = Math.max(size * (1 + stretch), 0.0001);
    const acrossRadius = Math.max(
      size * Math.max(1 - stretch * CROSS_SQUEEZE, CROSS_FLOOR),
      0.0001
    );
    // CSS rotate() is clockwise-positive and the screen y axis points down, so
    // this angle already matches the element -> hole direction.
    const angleDeg = (Math.atan2(radialY, radialX) * 180) / Math.PI;

    el.style.transform =
      `translate3d(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px, 0) ` +
      `rotate(${angleDeg.toFixed(2)}deg) ` +
      `scale(${alongRadius.toFixed(4)}, ${acrossRadius.toFixed(4)}) ` +
      `rotate(${(-angleDeg).toFixed(2)}deg)`;
    el.style.opacity = t.opacity.toFixed(3);
  });
}
