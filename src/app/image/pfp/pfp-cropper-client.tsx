'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CircleUser, Download, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/audio-exporter';

/**
 * PfpCropperClient
 * Profile picture cropper with circular mask:
 * - Drag to pan image under circular mask
 * - Zoom slider
 * - Export as transparent PNG (circular crop)
 */

export function PfpCropperClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputSize, setOutputSize] = useState(512);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const imgFile = files[0];
    if (!imgFile) return;
    setFile(imgFile);
    setPreview(URL.createObjectURL(imgFile));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Export circular crop as PNG
  const handleExport = async () => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      const size = outputSize;
      canvas.width = size;
      canvas.height = size;

      // Clear with transparency
      ctx.clearRect(0, 0, size, size);

      // Create circular clip path
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Load and draw image
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => { img.onload = resolve; });

      // Calculate draw position based on zoom and pan
      // The preview area is 320x320 visually, map pan to canvas coords
      const scale = size / 320;
      const drawSize = size * zoom;
      const drawX = (size - drawSize) / 2 + pan.x * scale;
      const drawY = (size - drawSize) / 2 + pan.y * scale;

      ctx.drawImage(img, drawX, drawY, drawSize, drawSize);

      // Export
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Export failed.');
          setIsProcessing(false);
          return;
        }
        downloadBlob(blob, `profile_${size}x${size}.png`);
        setIsProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Export failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Profile Picture Cropper"
      description="Crop any image into a perfect circle. Export as transparent PNG."
    >
      <canvas ref={canvasRef} className="hidden" />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Drop your image here"
          sublabel="Best with square or portrait photos"
        />
      ) : (
        <div className="space-y-6">
          {/* Crop Preview */}
          <div className="flex items-center justify-center">
            <div
              className="relative w-80 h-80 rounded-full overflow-hidden border-2 border-white/20 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Crop preview"
                  className="absolute select-none pointer-events-none"
                  style={{
                    width: `${100 * zoom}%`,
                    height: `${100 * zoom}%`,
                    left: `${50 + (pan.x / 320) * 100}%`,
                    top: `${50 + (pan.y / 320) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'cover',
                  }}
                  draggable={false}
                />
              )}
              {/* Drag hint overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <Move className="h-8 w-8 text-white/60" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="max-w-sm mx-auto space-y-4">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-zinc-500" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <ZoomIn className="h-4 w-4 text-zinc-500" />
            </div>

            {/* Output Size */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-500">Output Size</label>
              <select
                value={outputSize}
                onChange={(e) => setOutputSize(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-sm text-white focus:outline-none"
              >
                <option value={128}>128 × 128</option>
                <option value={256}>256 × 256</option>
                <option value={512}>512 × 512</option>
                <option value={1024}>1024 × 1024</option>
              </select>
            </div>
          </div>

          {/* Export */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setFile(null); setPreview(null); }}
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
              {isProcessing ? 'Processing...' : 'Download PNG'}
            </motion.button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
