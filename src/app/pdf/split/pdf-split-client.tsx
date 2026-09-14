'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Split, Download, Check } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/audio-exporter';

/**
 * PdfSplitClient
 * PDF Splitter & Extractor:
 * - Upload PDF, render thumbnail previews via pdf.js
 * - Click pages to select/deselect
 * - Extract selected pages into new PDF via pdf-lib
 */

interface PageThumb {
  pageNum: number;
  dataUrl: string;
  selected: boolean;
}

export function PdfSplitClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load PDF and render thumbnails using pdf.js
  const handleFiles = useCallback(async (files: File[]) => {
    const pdfFile = files[0];
    if (!pdfFile) return;
    setFile(pdfFile);
    setIsLoading(true);
    setPages([]);

    try {
      // Dynamic import of pdfjs-dist for client-side only
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const thumbs: PageThumb[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        thumbs.push({
          pageNum: i,
          dataUrl: canvas.toDataURL('image/jpeg', 0.7),
          selected: true, // All selected by default
        });
      }

      setPages(thumbs);
    } catch (err) {
      console.error('PDF load failed:', err);
      alert('Failed to load PDF. The file may be corrupted or encrypted.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle page selection
  const togglePage = (pageNum: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageNum === pageNum ? { ...p, selected: !p.selected } : p
      )
    );
  };

  // Select/deselect all
  const selectAll = () => setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  const deselectAll = () => setPages((prev) => prev.map((p) => ({ ...p, selected: false })));

  // Extract selected pages using pdf-lib
  const handleExport = async () => {
    if (!file) return;
    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) {
      alert('Please select at least one page.');
      return;
    }

    setIsProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const newPdf = await PDFDocument.create();

      // Copy selected pages (0-indexed in pdf-lib)
      const pageIndices = selectedPages.map((p) => p.pageNum - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

      downloadBlob(blob, file.name.replace('.pdf', '_extracted.pdf'));
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to extract pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <ToolPageLayout
      title="PDF Splitter & Extractor"
      description="Upload a PDF, select the pages you want, and extract them into a new file."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept=".pdf,application/pdf"
          label="Drop your PDF here"
          sublabel="We'll render thumbnail previews of each page"
        />
      ) : (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-400">Rendering page thumbnails...</p>
            </div>
          ) : (
            <>
              {/* Selection Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {selectedCount} of {pages.length} pages selected
                </span>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-blue-400 hover:text-blue-300">
                    Select All
                  </button>
                  <span className="text-zinc-600">|</span>
                  <button onClick={deselectAll} className="text-xs text-zinc-400 hover:text-white">
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Page Thumbnails Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {pages.map((page) => (
                  <motion.button
                    key={page.pageNum}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePage(page.pageNum)}
                    className={cn(
                      'relative rounded-xl overflow-hidden border-2 transition-all duration-200',
                      page.selected
                        ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'border-white/10 opacity-50 hover:opacity-75'
                    )}
                  >
                    <img
                      src={page.dataUrl}
                      alt={`Page ${page.pageNum}`}
                      className="w-full h-auto"
                    />
                    {/* Selection indicator */}
                    {page.selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {/* Page number */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center">
                      <span className="text-xs text-zinc-300">{page.pageNum}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Export */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setFile(null); setPages([]); }}
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  ← Upload a different PDF
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  disabled={isProcessing || selectedCount === 0}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isProcessing || selectedCount === 0
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  )}
                >
                  <Download className="h-4 w-4" />
                  {isProcessing ? 'Extracting...' : `Extract ${selectedCount} Pages`}
                </motion.button>
              </div>
            </>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
