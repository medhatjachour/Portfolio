import React, { useEffect, useRef } from 'react';
import { createTarget, gravityTargets } from '../../utils/gravity';

/**
 * GravityTarget
 * -------------
 * Wraps a hero element so the roaming black hole can bend it. The wrapper owns
 * the transform/opacity the gravity simulation writes, which keeps it from
 * fighting the framer-motion animations running on the child itself.
 *
 * Renders a plain <div>, so give it the layout classes the child used to carry
 * if you are replacing an existing wrapper.
 */
const GravityTarget = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const target = createTarget(el);
    gravityTargets.add(target);

    return () => {
      gravityTargets.delete(target);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export default GravityTarget;
