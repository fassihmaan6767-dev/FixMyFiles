'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlurRevealTextProps {
  text: string;
  className?: string;
  prefixIcon?: React.ReactNode;
}

export function BlurRevealText({ text, className = '', prefixIcon }: BlurRevealTextProps) {
  return (
    <div className={`relative flex items-center overflow-hidden ${className}`}>
      {prefixIcon && <span className="mr-2 shrink-0">{prefixIcon}</span>}
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, filter: 'blur(8px)', x: -10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
          exit={{ opacity: 0, filter: 'blur(6px)', x: 10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block truncate"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
