'use client';

import { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FileDropzone
 * Reusable drag-and-drop file upload zone with:
 * - Drag state visual feedback (border glow, scale pulse)
 * - File type filtering via accept prop
 * - Multiple file support
 * - Click-to-browse fallback
 */
interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
  maxSizeMB?: number;
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  label = 'Drop your file here',
  sublabel = 'or click to browse',
  className,
  maxSizeMB = 500,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndEmit = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const fileArray = Array.from(files);
      const maxBytes = maxSizeMB * 1024 * 1024;

      // Check file sizes
      const oversized = fileArray.filter((f) => f.size > maxBytes);
      if (oversized.length > 0) {
        alert(
          `File(s) too large for browser processing: ${oversized.map((f) => f.name).join(', ')}. Max size: ${maxSizeMB}MB.`
        );
        return;
      }

      onFiles(multiple ? fileArray : [fileArray[0]]);
    },
    [onFiles, multiple, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      validateAndEmit(e.dataTransfer.files);
    },
    [validateAndEmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndEmit(e.target.files);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    },
    [validateAndEmit]
  );

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl cursor-pointer',
        'border-2 border-dashed transition-all duration-300',
        isDragging
          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
          : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/80',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300',
          isDragging ? 'bg-blue-500/20' : 'bg-white/5'
        )}
      >
        {isDragging ? (
          <FileIcon className="h-7 w-7 text-blue-400" />
        ) : (
          <Upload className="h-7 w-7 text-zinc-400" />
        )}
      </div>

      <div className="text-center">
        <p className={cn('font-medium', isDragging ? 'text-blue-300' : 'text-zinc-300')}>
          {isDragging ? 'Release to upload' : label}
        </p>
        <p className="text-sm text-zinc-500 mt-1">{sublabel}</p>
      </div>
    </motion.div>
  );
}
