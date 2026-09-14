'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music, Download, Play, Pause, RotateCcw } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { exportAudioBuffer } from '@/lib/audio-exporter';

/**
 * AudioBoosterClient
 * Volume & Bass Booster:
 * - Two premium sliders: Volume (0-500%) and Bass Boost (0-20 dB)
 * - Real-time preview via Web Audio API GainNode + BiquadFilterNode
 * - Offline rendering for export to WAV/MP3
 */

export function AudioBoosterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [volume, setVolume] = useState(100);
  const [bass, setBass] = useState(0);
  const [format, setFormat] = useState('wav');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Preview refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));

    // Decode the audio
    const ctx = new AudioContext();
    const arrayBuffer = await f.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    bufferRef.current = audioBuffer;
    audioCtxRef.current = ctx;
  }, []);

  // Preview playback with effects applied in real-time
  const togglePreview = () => {
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    if (!bufferRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    // Create nodes
    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;

    const gain = ctx.createGain();
    gain.gain.value = volume / 100;

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200;
    bassFilter.gain.value = bass;

    // Connect: source -> bass -> gain -> output
    source.connect(bassFilter);
    bassFilter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.onended = () => setIsPlaying(false);

    sourceRef.current = source;
    gainRef.current = gain;
    bassRef.current = bassFilter;
    setIsPlaying(true);
  };

  // Update gain in real-time during preview
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (bassRef.current) bassRef.current.gain.value = bass;
  }, [bass]);

  // Offline render and export
  const handleExport = async () => {
    if (!bufferRef.current) return;
    setIsProcessing(true);

    try {
      const srcBuffer = bufferRef.current;
      const offlineCtx = new OfflineAudioContext(
        srcBuffer.numberOfChannels,
        srcBuffer.length,
        srcBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = srcBuffer;

      const gain = offlineCtx.createGain();
      gain.gain.value = volume / 100;

      const bassFilter = offlineCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;
      bassFilter.gain.value = bass;

      source.connect(bassFilter);
      bassFilter.connect(gain);
      gain.connect(offlineCtx.destination);

      source.start();
      const renderedBuffer = await offlineCtx.startRendering();

      const baseName = file?.name.replace(/\.[^.]+$/, '') || 'boosted';
      await exportAudioBuffer(renderedBuffer, format, `${baseName}_boosted`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. The file may be too large for browser processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Volume & Bass Booster"
      description="Boost volume up to 500% and enhance bass. All processing in your browser."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*"
          label="Drop your audio file here"
          sublabel="Supports MP3, WAV, OGG, FLAC, and more"
        />
      ) : (
        <div className="space-y-6">
          {/* File info */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <div className="flex items-center gap-3">
              <Music className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-zinc-300 truncate max-w-[250px]">{file.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePreview}
                className="w-9 h-9 rounded-lg bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </motion.button>
            </div>
          </div>

          {/* Sliders Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Volume Slider */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-400" />
                  <h4 className="text-sm font-medium text-zinc-300">Volume Boost</h4>
                </div>
                <span className="text-2xl font-bold text-white font-mono">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-blue-500 h-2"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>0%</span>
                <span>100%</span>
                <span>250%</span>
                <span>500%</span>
              </div>
            </div>

            {/* Bass Slider */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-violet-400" />
                  <h4 className="text-sm font-medium text-zinc-300">Bass Boost</h4>
                </div>
                <span className="text-2xl font-bold text-white font-mono">+{bass}dB</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={bass}
                onChange={(e) => setBass(Number(e.target.value))}
                className="w-full accent-violet-500 h-2"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>0 dB</span>
                <span>10 dB</span>
                <span>20 dB</span>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-zinc-500 mr-2 self-center">Presets:</span>
            {[
              { label: 'Loud', vol: 200, b: 0 },
              { label: 'Bass Heavy', vol: 100, b: 15 },
              { label: 'Club Mode', vol: 300, b: 18 },
              { label: 'Reset', vol: 100, b: 0 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { setVolume(p.vol); setBass(p.b); }}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <button
              onClick={() => { setFile(null); setAudioUrl(null); setVolume(100); setBass(0); }}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              ← Upload a different file
            </button>
            <div className="flex items-center gap-2">
              <FormatSelector formats={['wav', 'mp3', 'webm', 'ogg']} selected={format} onSelect={setFormat} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={isProcessing}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/20',
                  isProcessing
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                )}
              >
                <Download className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Export'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
