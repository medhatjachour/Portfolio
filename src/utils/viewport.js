/**
 * viewport.js — one shared definition of "this is a phone-sized viewport".
 *
 * Two very different things depend on it and they MUST agree:
 *
 *   • `AdaptiveCanvas` skips the decorative 3D scenes entirely on phones, and
 *   • the hero's roaming black hole steps its gravity simulation.
 *
 * If those two disagreed you would get the worst case: the UI being pulled
 * around by a black hole that isn't being drawn. Keeping the query in one place
 * makes that impossible.
 */

export const MOBILE_QUERY = '(max-width: 767px)';

export function isMobileViewport() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(MOBILE_QUERY).matches;
}

/**
 * Reports the current mobile state immediately, then again whenever it changes
 * (resize, rotate, devtools). Returns an unsubscribe function.
 */
export function watchMobileViewport(onChange) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mql = window.matchMedia(MOBILE_QUERY);
  const handler = (event) => onChange(event.matches);

  onChange(mql.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}
