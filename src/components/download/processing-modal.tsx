'use client';

import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Minus, X, Sparkles, CheckCircle2, AlertCircle, FileSpreadsheet, Cpu, Gamepad2 } from 'lucide-react';
import { useDownloadStore } from '@/store/use-download-store';
import { PingPongGame } from './ping-pong-game';

export function ProcessingModal() {
  const {
    downloads,
    activeModalId,
    isModalOpen,
    closeModal,
    minimizeModal,
    cancelDownload,
    triggerBrowserDownload,
  } = useDownloadStore();

  const currentDownload = useMemo(() => {
    if (!activeModalId) return downloads[0] || null;
    return downloads.find((d) => d.id === activeModalId) || downloads[0] || null;
  }, [downloads, activeModalId]);

  const targetProgress = currentDownload?.progress ?? 0;
  const springProgress = useSpring(targetProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.6,
    restDelta: 0.001,
  });

  useEffect(() => {
    springProgress.set(targetProgress);
  }, [targetProgress, springProgress]);

  const progressWidth = useTransform(springProgress, (val) => `${Math.min(100, Math.max(0, val))}%`);

  // AI-Style Dynamic Stage Texts based on progress percentage
  const aiStatusText = useMemo(() => {
    if (!currentDownload) return 'Preparing export pipeline...';

    if (currentDownload.status === 'completed') {
      return 'Export finished! Your file has been saved.';
    }
    if (currentDownload.status === 'error') {
      return currentDownload.error || 'An error occurred during processing.';
    }

    const p = currentDownload.progress;
    if (p < 15) return 'Warming up WebAssembly engines & memory buffers...';
    if (p < 35) return 'Mounting file chunks into browser virtual memory...';
    if (p < 60) return 'Processing media streams via multi-threaded worker...';
    if (p < 85) return `Encoding high-efficiency ${currentDownload.format} payload...`;
    if (p < 98) return 'Finalizing binary stream and assembling file container...';
    return 'Almost there! Finalizing download package...';
  }, [currentDownload]);

  if (!isModalOpen || !currentDownload) {
    return null;
  }

  const isCompleted = currentDownload.status === 'completed';
  const isError = currentDownload.status === 'error';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={minimizeModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          key="modal-dialog"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg rounded-3xl bg-zinc-900/90 border border-white/15 p-6 shadow-2xl backdrop-blur-xl text-white overflow-hidden z-10"
        >
          {/* Subtle Ambient Glow Behind Modal */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                {isCompleted ? 'Export Complete' : 'Processing File'}
              </h2>
              <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">
                {currentDownload.format}
              </span>
            </div>

            {/* Actions: Minimize & Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={minimizeModal}
                title="Minimize to bottom-right toast"
                aria-label="Minimize"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (!isCompleted) cancelDownload(currentDownload.id);
                  closeModal();
                }}
                title={isCompleted ? 'Close' : 'Cancel & Close'}
                aria-label="Close"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* File Meta Info */}
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2 truncate max-w-[70%]">
              <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate font-medium text-zinc-200" title={currentDownload.filename}>
                {currentDownload.filename}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Threaded Worker</span>
            </div>
          </div>

          {/* AI Thinking Status Bar with Smooth Left-to-Right Transition */}
          <div className="mt-5 min-h-[32px] flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-950/50 border border-white/5 overflow-hidden">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 animate-spin-slow" />
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={aiStatusText}
                  initial={{ opacity: 0, filter: 'blur(8px)', x: -14 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                  exit={{ opacity: 0, filter: 'blur(6px)', x: 14 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="text-xs font-medium text-zinc-300 truncate"
                >
                  {aiStatusText}
                </motion.p>
              </AnimatePresence>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-400 shrink-0">
              {currentDownload.progress}%
            </span>
          </div>

          {/* Fluid Progress Bar */}
          <div className="mt-3 relative h-2.5 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isError
                  ? 'bg-rose-500'
                  : isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400'
              }`}
              style={{ width: progressWidth }}
            />
            {/* Shimmer light pass */}
            {!isCompleted && !isError && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />
            )}
          </div>

          {/* Mini-Game Section: Ping Pong while you wait */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Play Ping Pong while your file exports</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">100% Off-Thread Engine</span>
            </div>

            {/* Canvas Ping Pong Component */}
            <PingPongGame />
          </div>

          {/* Footer Status / Quick actions */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={minimizeModal}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Continue browsing in background &rarr;
            </button>

            {isCompleted ? (
              <button
                onClick={() => triggerBrowserDownload(currentDownload.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Again
              </button>
            ) : isError ? (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                Export Failed
              </div>
            ) : (
              <button
                onClick={minimizeModal}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-zinc-200 transition-colors cursor-pointer"
              >
                Minimize (`_`)
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
