'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { exportAudioBuffer } from '@/lib/audio-exporter';

/**
 * StereoToMonoClient
 * Stereo to Mono Converter:
 * - Upload stereo audio, show channel info
 * - Average L + R channels: mono[i] = (left[i] + right[i]) / 2
 * - Export as WAV or MP3
 */

export function StereoToMonoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [channelInfo, setChannelInfo] = useState<{ channels: number; sampleRate: number; duration: number } | null>(null);
  const [format, setFormat] = useState('wav');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setIsConverted(false);

    const ctx = new AudioContext();
    const ab = await f.arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    setChannelInfo({
      channels: buf.numberOfChannels,
      sampleRate: buf.sampleRate,
      duration: buf.duration,
    });
    ctx.close();
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const ctx = new AudioContext();
      const ab = await file.arrayBuffer();
      const srcBuf = await ctx.decodeAudioData(ab);

      // Create mono buffer
      const monoBuffer = new AudioBuffer({
        numberOfChannels: 1,
        length: srcBuf.length,
        sampleRate: srcBuf.sampleRate,
      });

      const monoData = monoBuffer.getChannelData(0);

      if (srcBuf.numberOfChannels >= 2) {
        const left = srcBuf.getChannelData(0);
        const right = srcBuf.getChannelData(1);
        for (let i = 0; i < left.length; i++) {
          monoData[i] = (left[i] + right[i]) / 2;
        }
      } else {
        // Already mono, just copy
        const source = srcBuf.getChannelData(0);
        monoData.set(source);
      }

      const baseName = file.name.replace(/\.[^.]+$/, '');
      await exportAudioBuffer(monoBuffer, format, `${baseName}_mono`);
      setIsConverted(true);
      ctx.close();
    } catch (err) {
      console.error('Conversion failed:', err);
      alert('Conversion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageLayout
      title="Stereo to Mono Converter"
      description="Convert stereo audio to mono by averaging left and right channels."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*"
          label="Drop your stereo audio file here"
          sublabel="Supports MP3, WAV, OGG, FLAC"
        />
      ) : (
        <div className="space-y-6">
          {/* Channel Info Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 text-center">
            <Headphones className="h-10 w-10 text-violet-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{file.name}</h3>
            {channelInfo && (
              <div className="flex items-center justify-center gap-6 text-sm text-zinc-400">
                <span>{channelInfo.channels === 1 ? 'Mono' : 'Stereo'} ({channelInfo.channels}ch)</span>
                <span>{channelInfo.sampleRate} Hz</span>
                <span>{formatTime(channelInfo.duration)}</span>
              </div>
            )}

            {/* Visual */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                {channelInfo?.channels === 1 ? 'Mono' : 'Stereo (L+R)'}
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600" />
              <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                Mono (Averaged)
              </div>
            </div>
          </div>

          {/* Converted success badge */}
          {isConverted && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <CheckCircle className="h-4 w-4" /> Conversion complete! File downloaded.
            </div>
          )}

          {/* Export */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setFile(null); setChannelInfo(null); setIsConverted(false); }}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              ← Upload a different file
            </button>
            <div className="flex items-center gap-2">
              <FormatSelector formats={['wav', 'mp3', 'webm', 'ogg']} selected={format} onSelect={setFormat} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleConvert}
                disabled={isProcessing}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/20',
                  isProcessing
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                )}
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'Converting...' : 'Convert to Mono'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
