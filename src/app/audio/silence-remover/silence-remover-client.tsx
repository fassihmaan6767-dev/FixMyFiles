'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { VolumeX, Download, Zap } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { exportAudioBuffer } from '@/lib/audio-exporter';

/**
 * SilenceRemoverClient
 * Silence Remover:
 * - Threshold slider (dB): detect silence below this level
 * - Minimum duration (ms): only remove silences longer than this
 * - Iterates PCM data, detects silent chunks, splices them out
 */

export function SilenceRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(-40);
  const [minDuration, setMinDuration] = useState(300);
  const [format, setFormat] = useState('wav');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{ originalDur: number; newDur: number; removed: number } | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    setFile(files[0] || null);
    setStats(null);
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStats(null);

    try {
      const ctx = new AudioContext();
      const ab = await file.arrayBuffer();
      const srcBuf = await ctx.decodeAudioData(ab);
      const sampleRate = srcBuf.sampleRate;
      const channels = srcBuf.numberOfChannels;

      // Convert threshold from dB to linear amplitude
      const thresholdLinear = Math.pow(10, threshold / 20);
      const minSilenceSamples = Math.floor((minDuration / 1000) * sampleRate);

      // Use channel 0 for silence detection
      const data = srcBuf.getChannelData(0);

      // Find non-silent segments
      type Segment = { start: number; end: number };
      const segments: Segment[] = [];
      let silenceStart: number | null = null;
      let segStart = 0;

      for (let i = 0; i < data.length; i++) {
        const isSilent = Math.abs(data[i]) < thresholdLinear;

        if (isSilent && silenceStart === null) {
          silenceStart = i;
        } else if (!isSilent && silenceStart !== null) {
          const silenceLength = i - silenceStart;
          if (silenceLength >= minSilenceSamples) {
            // Record the non-silent segment before this silence
            if (silenceStart > segStart) {
              segments.push({ start: segStart, end: silenceStart });
            }
            segStart = i;
          }
          silenceStart = null;
        }
      }
      // Final segment
      if (segStart < data.length) {
        const endPos = silenceStart !== null && (data.length - silenceStart) >= minSilenceSamples
          ? silenceStart
          : data.length;
        if (endPos > segStart) {
          segments.push({ start: segStart, end: endPos });
        }
      }

      // Calculate total output length
      const totalSamples = segments.reduce((sum, seg) => sum + (seg.end - seg.start), 0);

      if (totalSamples === 0) {
        alert('The entire audio was detected as silence with the current settings. Try a lower threshold.');
        setIsProcessing(false);
        return;
      }

      // Create output buffer
      const outBuf = new AudioBuffer({
        numberOfChannels: channels,
        length: totalSamples,
        sampleRate: sampleRate,
      });

      let offset = 0;
      for (const seg of segments) {
        const length = seg.end - seg.start;
        const copyLen = Math.min(length, totalSamples - offset);
        if (copyLen > 0) {
          for (let ch = 0; ch < channels; ch++) {
            const chData = srcBuf.getChannelData(ch).subarray(seg.start, seg.start + copyLen);
            outBuf.getChannelData(ch).set(chData, offset);
          }
          offset += copyLen;
        }
      }

      // Stats
      const originalDur = srcBuf.duration;
      const newDur = outBuf.duration;
      setStats({ originalDur, newDur, removed: originalDur - newDur });

      const baseName = file.name.replace(/\.[^.]+$/, '');
      await exportAudioBuffer(outBuf, format, `${baseName}_no_silence`);
      ctx.close();
    } catch (err) {
      console.error('Silence removal failed:', err);
      alert('Processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fmtTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  return (
    <ToolPageLayout
      title="Silence Remover"
      description="Automatically detect and remove silent sections from audio files."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*"
          label="Drop your audio file here"
          sublabel="Supports MP3, WAV, OGG, FLAC"
        />
      ) : (
        <div className="space-y-6">
          {/* File info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <VolumeX className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-zinc-300 truncate">{file.name}</span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-400">Silence Threshold</label>
                <span className="text-sm text-white font-mono">{threshold} dB</span>
              </div>
              <input type="range" min="-60" max="-10" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-orange-500" />
              <p className="text-xs text-zinc-600 mt-1">Lower = more sensitive (detects quieter sounds as silence)</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-400">Min Silence Duration</label>
                <span className="text-sm text-white font-mono">{minDuration} ms</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={minDuration} onChange={(e) => setMinDuration(Number(e.target.value))} className="w-full accent-orange-500" />
              <p className="text-xs text-zinc-600 mt-1">Only remove silent sections longer than this</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
                <p className="text-xs text-zinc-500 mb-1">Original</p>
                <p className="text-lg font-bold text-white font-mono">{fmtTime(stats.originalDur)}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
                <p className="text-xs text-zinc-500 mb-1">New</p>
                <p className="text-lg font-bold text-emerald-400 font-mono">{fmtTime(stats.newDur)}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
                <p className="text-xs text-zinc-500 mb-1">Removed</p>
                <p className="text-lg font-bold text-orange-400 font-mono">{fmtTime(stats.removed)}</p>
              </div>
            </div>
          )}

          {/* Export */}
          <div className="flex items-center justify-between">
            <button onClick={() => { setFile(null); setStats(null); }} className="text-sm text-zinc-500 hover:text-white transition-colors">← Upload a different file</button>
            <div className="flex items-center gap-2">
              <FormatSelector formats={['wav', 'mp3', 'webm', 'ogg']} selected={format} onSelect={setFormat} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProcess}
                disabled={isProcessing}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-orange-500/20',
                  isProcessing ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'
                )}
              >
                <Zap className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Remove Silence & Export'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
