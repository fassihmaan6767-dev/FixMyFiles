'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href = '/#tools',
  label = 'Back',
  className = '',
}: BackButtonProps) {
  return (
    <Link href={href} className="inline-block">
      <motion.span
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.96 }}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/90 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-xs backdrop-blur-md cursor-pointer ${className}`}
        aria-label={`Go back to ${label}`}
      >
        <ArrowLeft className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        <span>{label}</span>
      </motion.span>
    </Link>
  );
}
