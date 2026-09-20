'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Film, Download, Loader2, Sparkles } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { exportAudioBuffer, downloadBlob } from '@/lib/audio-exporter';

/**
 * ExtractAudioClient
 * Extract Audio from Video:
 * - Accepts .mp4, .webm, .mov, .mkv video files
 * - Ultra-fast Native Web Audio extraction as primary path (instant, zero downloads)
 * - FFmpeg.wasm as secondary fallback for obscure video codecs
 * - Real-time progress and video preview
 * - Export as MP3 or WAV
 */

export function ExtractAudioClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [format, setFormat] = useState('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [engineUsed, setEngineUsed] = useState<'native' | 'ffmpeg' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(f));
    setError(null);
    setProgress(0);
    setStatus('');
    setEngineUsed(null);
  }, [videoUrl]);

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setError(null);
    setStatus('Analyzing video container...');

    // PATH 1: Fast Native Browser Audio Extraction
    try {
      setStatus('Extracting audio track via Browser Media Engine...');
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext();
      
      setProgress(35);
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setProgress(70);
      setStatus(`Encoding to ${format.toUpperCase()}...`);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      await exportAudioBuffer(audioBuffer, format, `${baseName}_audio`);

      setProgress(100);
      setStatus('Audio extracted successfully!');
      setEngineUsed('native');

      audioCtx.close();
      setIsProcessing(false);
      return;
    } catch (nativeErr) {
      console.warn('Native extraction bypassed, falling back to FFmpeg.wasm:', nativeErr);
    }

    // PATH 2: Multi-Threaded FFmpeg.wasm Off-Thread Worker
    try {
      setStatus('Dispatching to Multi-Threaded FFmpeg Worker (@ffmpeg/core-mt)...');
      setProgress(20);

      const { exportPipeline } = await import('@/lib/export-pipeline');
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const outputFilename = `${baseName}_audio.${format}`;

      const ext = file.name.substring(file.name.lastIndexOf('.')) || '.mp4';
      const inputName = `input${ext}`;
      const outputName = format === 'wav' ? 'output.wav' : 'output.mp3';

      const args =
        format === 'wav'
          ? ['-i', inputName, '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', outputName]
          : ['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-b:a', '192k', outputName];

      await exportPipeline.transcodeMedia(file, outputFilename, format, args);

      setProgress(100);
      setStatus('Audio extracted successfully via Multi-Threaded WASM!');
      setEngineUsed('ffmpeg');
    } catch (err) {
      console.error('Extraction failed:', err);
      setError('Could not extract audio. Please check that your video contains an audio track.');
      setStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Extract Audio from Video"
      description="Strip the audio track from any video file with zero server uploads."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
          label="Drop your video file here"
          sublabel="Supports MP4, WebM, MOV, and MKV"
        />
      ) : (
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 flex items-center justify-center overflow-hidden">
            {videoUrl && (
              <video
                src={videoUrl}
                controls
                className="max-h-[300px] max-w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* File info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <Film className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-zinc-300 truncate flex-1">{file.name}</span>
            <span className="text-xs text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> {status}
                </span>
                <span className="text-zinc-500 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Success notice */}
          {engineUsed && !isProcessing && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Sparkles className="h-4 w-4" />
              Extracted using {engineUsed === 'native' ? 'ultra-fast client-side Web Audio engine' : 'FFmpeg.wasm engine'}! Download started automatically.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Export Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setFile(null); setVideoUrl(null); setError(null); setEngineUsed(null); }}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              ← Upload a different video
            </button>
            <div className="flex items-center gap-2">
              <FormatSelector formats={['mp3', 'wav', 'webm', 'ogg']} selected={format} onSelect={setFormat} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleExtract}
                disabled={isProcessing}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isProcessing
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/20'
                )}
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'Extracting...' : 'Extract Audio'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
