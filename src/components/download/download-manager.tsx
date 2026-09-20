'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Maximize2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useDownloadStore, DownloadItem } from '@/store/use-download-store';
import { ProcessingModal } from './processing-modal';
import { BottomToast } from './bottom-toast';

export function DownloadManager() {
  const {
    downloads,
    isModalOpen,
    maximizeModal,
    cancelDownload,
    removeDownload,
    clearCompleted,
    triggerBrowserDownload,
  } = useDownloadStore();

  const [isHovered, setIsHovered] = useState(false);

  // If there are no downloads at all, render nothing (or just the modal if opened)
  if (downloads.length === 0) {
    return <ProcessingModal />;
  }

  // Active items for the stacked toast
  // We prioritize active / processing downloads first, then completed/failed
  const visibleDownloads = [...downloads].slice(0, 5);
  const activeCount = downloads.filter((d) => d.status === 'processing').length;
  const completedCount = downloads.filter((d) => d.status === 'completed').length;

  return (
    <>
      {/* Centered Processing Modal (Game, AI Text, Progress) */}
      <ProcessingModal />

      {/* Canva-Style Bottom-Right Stacked Toasts */}
      <div
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover / Stack header badge when multiple downloads exist */}
        {downloads.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-medium text-zinc-300 backdrop-blur-md shadow-lg"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {activeCount > 0
                ? `${activeCount} export${activeCount > 1 ? 's' : ''} in progress`
                : `${completedCount} export${completedCount > 1 ? 's' : ''} ready`}
            </span>
            {isHovered ? (
              <span className="text-[10px] text-zinc-400 ml-1">· Click card to open</span>
            ) : (
              <span className="text-[10px] text-blue-400 font-mono ml-0.5">
                (Hover to fan out)
              </span>
            )}
            {completedCount > 0 && isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearCompleted();
                }}
                className="ml-2 text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </motion.div>
        )}

        {/* Stack Deck Area */}
        <div
          className="relative w-84 transition-all duration-300"
          style={{
            height: isHovered
              ? `${Math.max(88, visibleDownloads.length * 80)}px`
              : '88px',
          }}
        >
          <AnimatePresence>
            {visibleDownloads.map((item, index) => (
              <BottomToast
                key={item.id}
                item={item}
                index={index}
                isHovered={isHovered}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
