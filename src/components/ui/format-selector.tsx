'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FormatSelector
 * A premium dropdown for selecting export file formats.
 * Used across all tool pages for consistent download UX.
 */
interface FormatSelectorProps {
  formats: string[];
  selected: string;
  onSelect: (format: string) => void;
  className?: string;
}

export function FormatSelector({ formats, selected, onSelect, className }: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl',
          'bg-zinc-800 border border-white/10 text-sm text-white',
          'hover:bg-zinc-700 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
        )}
      >
        <span className="uppercase font-mono text-xs tracking-wider">{selected}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full min-w-[120px] z-50 rounded-xl bg-zinc-800 border border-white/10 shadow-xl overflow-hidden"
          >
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => {
                  onSelect(format);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left',
                  'hover:bg-white/5 transition-colors duration-150',
                  selected === format ? 'text-blue-400' : 'text-zinc-300'
                )}
              >
                <span className="uppercase font-mono text-xs tracking-wider">{format}</span>
                {selected === format && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
