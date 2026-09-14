'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Lock, Unlock, Download, RotateCcw } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/audio-exporter';

/**
 * ImageResizerClient
 * Smart image resizer & converter:
 * - Upload image, see preview
 * - Custom Width/Height inputs with aspect ratio lock toggle
 * - Quality slider for lossy formats
 * - Export as PNG, JPG, or WEBP via canvas.toBlob()
 */

export function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(0.9);
  const [format, setFormat] = useState('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio = useRef(1);

  // Handle file upload
  const handleFiles = useCallback((files: File[]) => {
    const imgFile = files[0];
    if (!imgFile) return;
    setFile(imgFile);

    const url = URL.createObjectURL(imgFile);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      aspectRatio.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = url;
  }, []);

  // Dimension handlers with aspect ratio lock
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect) {
      setHeight(Math.round(val / aspectRatio.current));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect) {
      setWidth(Math.round(val * aspectRatio.current));
    }
  };

  // Reset to original dimensions
  const resetDimensions = () => {
    setWidth(originalSize.w);
    setHeight(originalSize.h);
  };

  // Export the resized image
  const handleExport = async () => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => { img.onload = resolve; });

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert format string to MIME type
      const mimeMap: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        webp: 'image/webp',
      };

      const mimeType = mimeMap[format] || 'image/png';

      // Export as blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert('Export failed. Try a different format.');
            setIsProcessing(false);
            return;
          }

          const baseName = file?.name.replace(/\.[^.]+$/, '') || 'resized';
          downloadBlob(blob, `${baseName}_${width}x${height}.${format}`);
          setIsProcessing(false);
        },
        mimeType,
        format === 'png' ? undefined : quality
      );
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed.');
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Image Resizer & Converter"
      description="Resize and convert images with pixel-perfect precision. All processing in your browser."
    >
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Drop your image here"
          sublabel="Supports PNG, JPG, WEBP, GIF, and more"
        />
      ) : (
        <div className="space-y-6">
          {/* Preview */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 flex items-center justify-center overflow-hidden">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="max-h-[400px] max-w-full object-contain rounded-lg"
              />
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dimension Inputs */}
            <div className="space-y-4 p-5 rounded-xl bg-zinc-900/50 border border-white/10">
              <h4 className="text-sm font-medium text-zinc-300">Dimensions</h4>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-xs text-zinc-500 mb-1 block">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    lockAspect
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-white/10'
                  )}
                  title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                >
                  {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                <div className="flex-1">
                  <label className="text-xs text-zinc-500 mb-1 block">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Original: {originalSize.w} × {originalSize.h}
                </span>
                <button
                  onClick={resetDimensions}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
            </div>

            {/* Format & Quality */}
            <div className="space-y-4 p-5 rounded-xl bg-zinc-900/50 border border-white/10">
              <h4 className="text-sm font-medium text-zinc-300">Export Settings</h4>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Format</label>
                <FormatSelector
                  formats={['png', 'jpg', 'webp']}
                  selected={format}
                  onSelect={setFormat}
                />
              </div>

              {format !== 'png' && (
                <div>
                  <label className="text-xs text-zinc-500 mb-2 block">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              ← Upload a different image
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={isProcessing}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all',
                isProcessing
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              )}
            >
              <Download className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Download'}
            </motion.button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
