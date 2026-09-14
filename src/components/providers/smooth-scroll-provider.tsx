'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScrollProvider
 * Initializes Lenis for buttery smooth scrolling globally.
 * Wraps the entire app in layout.tsx.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis with tuned parameters for Apple-like smoothness
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // RAF loop to drive Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
