'use client';

import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, X, Download, FileText, Loader2 } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/audio-exporter';

interface PdfEntry {
  id: string;
  file: File;
  name: string;
  size: string;
}

export function PdfMergeClient() {
  const [pdfs, setPdfs] = useState<PdfEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const entries: PdfEntry[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    }));
    setPdfs((prev) => [...prev, ...entries]);
  }, []);

  const removePdf = (id: string) => setPdfs((prev) => prev.filter((p) => p.id !== id));

  // Merge PDFs using pdf-lib
  const handleExport = async () => {
    if (pdfs.length < 2) return;
    setIsProcessing(true);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const entry of pdfs) {
        const bytes = await entry.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(bytes);
        const indices = sourcePdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(sourcePdf, indices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, 'merged_document.pdf');
    } catch (err) {
      console.error('Merge failed:', err);
      alert('Failed to merge PDFs. Some files may be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="PDF Merger"
      description="Combine multiple PDF files into one document with smooth drag-and-drop sequencing."
    >
      <div className="space-y-6">
        <FileDropzone
          onFiles={handleFiles}
          accept=".pdf,application/pdf"
          multiple
          label="Drop PDF files here"
          sublabel="Add multiple PDFs to merge them together"
        />

        {pdfs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Document Sequence ({pdfs.length})
              </h4>
              <span className="text-[11px] text-zinc-500">Drag items to rearrange merge order</span>
            </div>

            <Reorder.Group axis="y" values={pdfs} onReorder={setPdfs} className="space-y-2">
              {pdfs.map((pdf, index) => (
                <Reorder.Item
                  key={pdf.id}
                  value={pdf}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                  <FileText className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span className="text-xs text-zinc-500 font-mono w-5">{index + 1}</span>
                  <span className="text-sm text-zinc-300 flex-1 truncate">{pdf.name}</span>
                  <span className="text-xs text-zinc-500 font-mono">{pdf.size}</span>
                  <button
                    onClick={() => removePdf(pdf.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

        {pdfs.length >= 2 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPdfs([])}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Clear all
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={isProcessing}
              className={cn(
                'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/20',
                isProcessing
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Merging...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Merge & Download PDF
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
