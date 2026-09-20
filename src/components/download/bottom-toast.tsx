'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import {
  Download,
  Maximize2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useDownloadStore, DownloadItem } from '@/store/use-download-store';

interface BottomToastProps {
  item: DownloadItem;
  index: number;
  isHovered: boolean;
}

/**
 * Butter-smooth Progress Bar using Framer Motion Physics
 * Ensures 0 stutter and continuous fluid movement even if worker updates come in bursts.
 */
function SmoothProgressBar({ progress, status }: { progress: number; status: string }) {
  // Smooth spring interpolator
  const spring = useSpring(progress, {
    stiffness: 90,
    damping: 22,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Local creeping target so the bar never appears frozen during heavy chunks
  const [crawlOffset, setCrawlOffset] = useState(0);

  useEffect(() => {
    // Reset crawl offset when real progress updates arrive
    setCrawlOffset(0);
    spring.set(progress);
  }, [progress, spring]);

  // Subtle live pulse: micro-advance if processing to prevent perceived freeze
  useEffect(() => {
    if (status !== 'processing' || progress >= 95) return;

    const interval = setInterval(() => {
      setCrawlOffset((prev) => {
        const next = prev + 0.3;
        // Do not crawl past 96% or more than 4% ahead of real progress
        if (progress + next > 96 || next > 4) return prev;
        spring.set(progress + next);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [status, progress, spring]);

  const width = useTransform(spring, (latest) => `${Math.min(100, Math.max(0, latest))}%`);

  return (
    <div className="relative h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
      <motion.div
        style={{ width }}
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full"
      />
      {status === 'processing' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        />
      )}
    </div>
  );
}

export function BottomToast({ item, index, isHovered }: BottomToastProps) {
  const {
    maximizeModal,
    cancelDownload,
    removeDownload,
    triggerBrowserDownload,
  } = useDownloadStore();

  // Deck stacking mathematics
  // Resting: Stacked like playing cards
  const unhoveredY = -index * 10;
  const unhoveredScale = 1 - index * 0.05;
  const unhoveredZIndex = 30 - index;
  const unhoveredOpacity = index > 2 ? 0 : 1 - index * 0.12;

  // Hovered: Fanned out into a vertical list
  const hoveredY = -(index * 82);
  const hoveredScale = 1;
  const hoveredZIndex = 40 - index;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        opacity: isHovered ? 1 : unhoveredOpacity,
        y: isHovered ? hoveredY : unhoveredY,
        scale: isHovered ? hoveredScale : unhoveredScale,
        zIndex: isHovered ? hoveredZIndex : unhoveredZIndex,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 28,
      }}
      onClick={() => maximizeModal(item.id)}
      className={`absolute bottom-0 right-0 w-full rounded-2xl p-3.5 backdrop-blur-xl border transition-colors cursor-pointer group shadow-2xl ${
        item.status === 'completed'
          ? 'bg-zinc-900/95 border-emerald-500/30 hover:border-emerald-500/50'
          : item.status === 'error'
          ? 'bg-zinc-900/95 border-rose-500/30 hover:border-rose-500/50'
          : 'bg-zinc-900/95 border-white/15 hover:border-blue-500/40'
      }`}
    >
      {/* Edge Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate flex-1 min-w-0">
          {item.status === 'processing' ? (
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-30" />
            </div>
          ) : item.status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}

          <span className="text-xs font-semibold text-zinc-200 truncate" title={item.filename}>
            {item.filename}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono uppercase bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded font-medium">
            {item.format}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeModal(item.id);
            }}
            title="Expand to Game & Details"
            className="w-5 h-5 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (item.status === 'processing') {
                cancelDownload(item.id);
              } else {
                removeDownload(item.id);
              }
            }}
            title={item.status === 'processing' ? 'Cancel' : 'Dismiss'}
            className="w-5 h-5 flex items-center justify-center rounded text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-2.5">
        {item.status === 'processing' ? (
          <div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1 font-mono">
              <span className="truncate max-w-[180px]">
                {item.statusMessage || 'Transcoding stream...'}
              </span>
              <span className="font-semibold text-blue-400">{item.progress}%</span>
            </div>

            {/* Framer Motion Spring-interpolated progress bar */}
            <SmoothProgressBar progress={item.progress} status={item.status} />
          </div>
        ) : item.status === 'completed' ? (
          <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-0.5">
            <span>Export complete</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerBrowserDownload(item.id);
              }}
              className="flex items-center gap-1 font-medium text-white hover:underline text-[11px] cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Save File
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-rose-400 truncate">
            {item.error || 'Export failed'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
