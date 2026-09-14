'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * MagneticButton
 * A premium button with:
 * - Magnetic hover effect (follows cursor within bounds)
 * - Spring press animation (scale down on click)
 * - Optional pulse glow animation
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  pulse?: boolean;
  href?: string;
}

export function MagneticButton({ children, className, onClick, pulse, href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate mouse offset from center for magnetic pull
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? 'a' : 'button';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      <motion.div
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Component
          href={href}
          onClick={onClick}
          className={cn(
            'relative inline-flex items-center justify-center gap-2',
            'px-8 py-3.5 rounded-full',
            'bg-white text-zinc-950 font-medium text-sm',
            'hover:bg-zinc-200 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950',
            pulse && 'animate-pulse-glow',
            className
          )}
        >
          {children}
        </Component>
      </motion.div>
    </motion.div>
  );
}
