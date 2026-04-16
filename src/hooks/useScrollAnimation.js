import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Hook that returns a ref and whether the element is in view.
 * Used to trigger scroll-based animations.
 */
export function useScrollAnimation(options = { once: true, amount: 0.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, options);
  return { ref, isInView };
}
