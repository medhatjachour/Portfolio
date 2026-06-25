import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * AdaptiveCanvas
 * A drop-in replacement for @react-three/fiber's <Canvas> that keeps the exact
 * same visuals while dramatically reducing the cost of having many 3D scenes on
 * one page:
 *
 *  1. Lazy context creation — the WebGL context (and all geometry/particle
 *     buffers) is only created once the canvas scrolls near the viewport. This
 *     avoids spinning up several WebGL contexts at once on initial load.
 *  2. Off-screen pause — when the canvas scrolls out of view the render loop is
 *     switched to `frameloop="never"`, so idle scenes stop consuming the GPU/CPU.
 *     It resumes seamlessly when scrolled back.
 *  3. Capped device-pixel-ratio — renders at most 1.5x to avoid the huge
 *     fill-rate cost of native retina resolution on decorative backgrounds.
 *  4. Mobile fallback — on phones (<= 767px) decorative background scenes are
 *     skipped entirely so the section's own gradient shows through, keeping
 *     small devices buttery. Pass `keepOnMobile` for canvases that are the
 *     content itself (e.g. the AI avatar, the easter-egg scene).
 *
 * All canvases here live inside `position: absolute` containers, so the
 * placeholder sentinel below has zero layout impact.
 */
const MOBILE_QUERY = '(max-width: 767px)';

const AdaptiveCanvas = forwardRef(function AdaptiveCanvas(
  {
    children,
    dpr = [1, 1.5],
    frameloop = 'always',
    eager = false,
    rootMargin = '200px',
    keepOnMobile = false,
    ...props
  },
  forwardedRef
) {
  const sentinelRef = useRef(null);
  const canvasElRef = useRef(null);
  // Whether the WebGL context has been created yet.
  const [mounted, setMounted] = useState(eager);
  // Whether the canvas is currently visible (controls the render loop).
  const [inView, setInView] = useState(true);
  // Whether we are on a small screen (decorative scenes are skipped there).
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
      ? window.matchMedia(MOBILE_QUERY).matches
      : false
  );

  // Track viewport size so the fallback engages/disengages on resize & rotate.
  useEffect(() => {
    if (keepOnMobile || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [keepOnMobile]);

  const disabled = isMobile && !keepOnMobile;

  // Create the context only when the canvas approaches the viewport.
  useEffect(() => {
    if (mounted) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  // Pause/resume the render loop as the canvas enters/leaves the viewport.
  useEffect(() => {
    if (!mounted) return;
    const el = canvasElRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (disabled) {
    // On phones the decorative scene is skipped; the parent gradient shows.
    return null;
  }

  if (!mounted) {
    // Out-of-flow sentinel that the first observer watches. Matches the absolute
    // background containers these canvases live in, so layout is unaffected.
    return (
      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      />
    );
  }

  return (
    <Canvas
      ref={(node) => {
        canvasElRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      dpr={dpr}
      frameloop={inView ? frameloop : 'never'}
      {...props}
    >
      {children}
    </Canvas>
  );
});

export default AdaptiveCanvas;
