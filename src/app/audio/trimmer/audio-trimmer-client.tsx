'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  Play,
  Pause,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Volume2,
  Loader2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { exportAudioBuffer } from '@/lib/audio-exporter';

type TrimMode = 'extract' | 'delete';

interface RegionData {
  id: string;
  start: number;
  end: number;
}

export function AudioTrimmerClient() {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingRegion, setIsPlayingRegion] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [mode, setMode] = useState<TrimMode>('extract');
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [format, setFormat] = useState('wav');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- Refs ---
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<RegionsPlugin | null>(null);
  const audioFallbackRef = useRef<HTMLAudioElement>(null);

  // Format time helper (mm:ss.ms)
  const formatTime = (t: number) => {
    if (isNaN(t) || t < 0) return '00:00.00';
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // 1. Handle file selection
  const handleFiles = useCallback((files: File[]) => {
    const audioFile = files[0];
    if (!audioFile) return;

    // Cleanup previous URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const newUrl = URL.createObjectURL(audioFile);
    setFile(audioFile);
    setAudioUrl(newUrl);
    setRegions([]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsPlayingRegion(false);
    setLoadError(null);
    setIsLoadingWaveform(true);
  }, [audioUrl]);

  // 2. Initialize WaveSurfer via useEffect when file & DOM container are ready!
  useEffect(() => {
    if (!file || !audioUrl || !waveformRef.current) return;

    let isSubscribed = true;

    // Destroy existing instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    setIsLoadingWaveform(true);
    setLoadError(null);

    try {
      const regionsPlugin = RegionsPlugin.create();
      regionsPluginRef.current = regionsPlugin;

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#52525b',
        progressColor: '#3b82f6',
        cursorColor: '#60a5fa',
        cursorWidth: 2,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 140,
        normalize: true,
        plugins: [regionsPlugin],
        url: audioUrl,
      });

      wavesurferRef.current = ws;

      ws.on('ready', () => {
        if (!isSubscribed) return;
        const totalDur = ws.getDuration();
        setDuration(totalDur);
        setIsLoadingWaveform(false);

        // Add default region covering 20% to 80%
        const start = Math.max(0, totalDur * 0.2);
        const end = Math.min(totalDur, totalDur * 0.8);

        const initialRegion = regionsPlugin.addRegion({
          start,
          end: end > start ? end : totalDur,
          color: mode === 'extract' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)',
          drag: true,
          resize: true,
        });

        setRegions([{ id: initialRegion.id, start: initialRegion.start, end: initialRegion.end }]);
      });

      ws.on('timeupdate', (time: number) => {
        if (isSubscribed) {
          setCurrentTime(time);
        }
      });

      ws.on('play', () => isSubscribed && setIsPlaying(true));
      ws.on('pause', () => {
        if (isSubscribed) {
          setIsPlaying(false);
          setIsPlayingRegion(false);
        }
      });
      ws.on('finish', () => {
        if (isSubscribed) {
          setIsPlaying(false);
          setIsPlayingRegion(false);
        }
      });

      ws.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        if (isSubscribed) {
          setIsLoadingWaveform(false);
          setLoadError('Waveform preview failed to load. You can still use the audio player below.');
        }
      });

      // Region update listeners
      regionsPlugin.on('region-updated', (region) => {
        if (!isSubscribed) return;
        setRegions((prev) =>
          prev.map((r) =>
            r.id === region.id ? { ...r, start: region.start, end: region.end } : r
          )
        );
      });

      regionsPlugin.on('region-out', () => {
        if (isPlayingRegion && ws) {
          ws.pause();
          setIsPlayingRegion(false);
        }
      });

    } catch (e) {
      console.error('WaveSurfer initialization failed:', e);
      setIsLoadingWaveform(false);
      setLoadError('Failed to initialize waveform.');
    }

    return () => {
      isSubscribed = false;
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [file, audioUrl]);

  // Update region colors on mode change
  useEffect(() => {
    if (!regionsPluginRef.current) return;
    const allRegions = regionsPluginRef.current.getRegions();
    allRegions.forEach((region) => {
      region.setOptions({
        color:
          mode === 'extract'
            ? 'rgba(59, 130, 246, 0.25)'
            : 'rgba(239, 68, 68, 0.25)',
      });
    });
  }, [mode]);

  // Playback handlers
  const togglePlay = () => {
    if (!wavesurferRef.current) {
      // Fallback to native audio
      if (audioFallbackRef.current) {
        if (isPlaying) {
          audioFallbackRef.current.pause();
          setIsPlaying(false);
        } else {
          audioFallbackRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }
    setIsPlayingRegion(false);
    wavesurferRef.current.playPause();
  };

  const playSelectedRegion = () => {
    if (!wavesurferRef.current || !regionsPluginRef.current || regions.length === 0) return;
    const firstRegion = regionsPluginRef.current.getRegions()[0];
    if (firstRegion) {
      setIsPlayingRegion(true);
      firstRegion.play();
    }
  };

  const resetPlayhead = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.seekTo(0);
      setCurrentTime(0);
    }
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!wavesurferRef.current) return;
    const newZoom = Math.max(0, Math.min(100, zoomLevel + delta));
    setZoomLevel(newZoom);
    wavesurferRef.current.zoom(newZoom);
  };

  // Manual timestamp edits
  const handleRegionChange = (id: string, field: 'start' | 'end', value: number) => {
    const clampedVal = Math.max(0, Math.min(duration, value));
    setRegions((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const newStart = field === 'start' ? Math.min(clampedVal, r.end - 0.05) : r.start;
        const newEnd = field === 'end' ? Math.max(clampedVal, r.start + 0.05) : r.end;

        // Sync with wavesurfer region
        const wsRegion = regionsPluginRef.current?.getRegions().find((reg) => reg.id === id);
        if (wsRegion) {
          wsRegion.setOptions({ start: newStart, end: newEnd });
        }

        return { ...r, start: newStart, end: newEnd };
      })
    );
  };

  // Add extra region
  const addRegion = () => {
    if (!regionsPluginRef.current || !wavesurferRef.current) return;
    const dur = wavesurferRef.current.getDuration() || duration;
    const start = dur * 0.1;
    const end = dur * 0.3;
    const region = regionsPluginRef.current.addRegion({
      start,
      end,
      color: mode === 'extract' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)',
      drag: true,
      resize: true,
    });
    setRegions((prev) => [...prev, { id: region.id, start: region.start, end: region.end }]);
  };

  // Clear regions
  const clearRegions = () => {
    regionsPluginRef.current?.clearRegions();
    setRegions([]);
  };

  // Export processed audio
  const handleExport = async () => {
    if (!file || regions.length === 0) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const sampleRate = audioBuffer.sampleRate;
      const channels = audioBuffer.numberOfChannels;

      const sortedRegions = [...regions].sort((a, b) => a.start - b.start);
      const rawSegments: { start: number; end: number }[] = [];

      if (mode === 'extract') {
        rawSegments.push(...sortedRegions.map((r) => ({ start: r.start, end: r.end })));
      } else {
        let cursor = 0;
        for (const region of sortedRegions) {
          if (cursor < region.start) {
            rawSegments.push({ start: cursor, end: region.start });
          }
          cursor = Math.max(cursor, region.end);
        }
        if (cursor < audioBuffer.duration) {
          rawSegments.push({ start: cursor, end: audioBuffer.duration });
        }
      }

      // Compute exact integer sample slices clamped to the buffer length
      const sampleSegments = rawSegments
        .map((seg) => {
          const clampedStart = Math.max(0, Math.min(seg.start, audioBuffer.duration));
          const clampedEnd = Math.max(clampedStart, Math.min(seg.end, audioBuffer.duration));
          const startSample = Math.max(0, Math.min(Math.floor(clampedStart * sampleRate), audioBuffer.length));
          const endSample = Math.max(startSample, Math.min(Math.floor(clampedEnd * sampleRate), audioBuffer.length));
          return { startSample, endSample, length: endSample - startSample };
        })
        .filter((s) => s.length > 0);

      const totalSamples = sampleSegments.reduce((sum, seg) => sum + seg.length, 0);

      if (totalSamples === 0) {
        alert('No audio content found in the selected range.');
        setIsProcessing(false);
        audioCtx.close();
        return;
      }

      const outputBuffer = new AudioBuffer({
        numberOfChannels: channels,
        length: totalSamples,
        sampleRate: sampleRate,
      });

      let offset = 0;
      for (const seg of sampleSegments) {
        const copyLen = Math.min(seg.length, totalSamples - offset);
        if (copyLen > 0) {
          for (let ch = 0; ch < channels; ch++) {
            const channelData = audioBuffer.getChannelData(ch);
            const segData = channelData.subarray(seg.startSample, seg.startSample + copyLen);
            outputBuffer.getChannelData(ch).set(segData, offset);
          }
          offset += copyLen;
        }
      }

      const baseName = file.name.replace(/\.[^.]+$/, '');
      await exportAudioBuffer(outputBuffer, format, `${baseName}_trimmed`);
      audioCtx.close();
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to process audio. Please ensure the file is a valid audio format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setAudioUrl(null);
    setRegions([]);
    setDuration(0);
    setCurrentTime(0);
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
  };

  return (
    <ToolPageLayout
      title="Audio Trimmer & Cutter"
      description="Trim audio files with interactive waveform precision. 100% private in-browser processing."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*"
          label="Drop your audio file here"
          sublabel="Supports MP3, WAV, OGG, FLAC, AAC, M4A"
        />
      ) : (
        <div className="space-y-6">
          {/* File Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <Volume2 className="h-5 w-5 text-blue-400 shrink-0" />
              <span className="text-sm font-medium text-zinc-200 truncate max-w-[240px] sm:max-w-md">
                {file.name}
              </span>
              <span className="text-xs text-zinc-500 font-mono shrink-0">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-white/5 transition-colors"
              >
                Change File
              </button>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-5 overflow-hidden">
            {isLoadingWaveform && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm gap-3">
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                <p className="text-xs text-zinc-400">Rendering waveform audio...</p>
              </div>
            )}

            {loadError && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                {loadError}
              </div>
            )}

            {/* Waveform container */}
            <div ref={waveformRef} className="w-full cursor-pointer" />

            {/* Zoom Controls Overlay */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <div className="text-[11px] text-zinc-500">
                Drag the shaded region handles to adjust trim boundaries
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 mr-1">Zoom:</span>
                <button
                  onClick={() => handleZoom(-10)}
                  disabled={zoomLevel <= 0}
                  className="p-1 rounded-md bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleZoom(10)}
                  disabled={zoomLevel >= 100}
                  className="p-1 rounded-md bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Fallback Native Audio Player (always available for instant listening) */}
          {audioUrl && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900/30 border border-white/5">
              <span className="text-xs text-zinc-500 shrink-0">Native Player:</span>
              <audio
                ref={audioFallbackRef}
                src={audioUrl}
                controls
                className="w-full h-8 max-w-full accent-blue-500"
              />
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setMode('extract')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                mode === 'extract'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                  : 'bg-zinc-900/50 text-zinc-400 border border-white/10 hover:text-white'
              )}
            >
              <Scissors className="h-4 w-4" />
              Keep Selected (Extract)
            </button>
            <button
              onClick={() => setMode('delete')}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                mode === 'delete'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm shadow-red-500/20'
                  : 'bg-zinc-900/50 text-zinc-400 border border-white/10 hover:text-white'
              )}
            >
              <Trash2 className="h-4 w-4" />
              Remove Selected (Cut)
            </button>
          </div>

          {/* Playback & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-zinc-900/50 border border-white/10">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                className="w-11 h-11 rounded-xl bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-md"
                title={isPlaying ? 'Pause' : 'Play Full Track'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </motion.button>
              
              <button
                onClick={resetPlayhead}
                className="w-11 h-11 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700 transition-colors border border-white/5"
                title="Rewind to start"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {regions.length > 0 && (
                <button
                  onClick={playSelectedRegion}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium border border-blue-500/20 transition-colors"
                >
                  Play Selection
                </button>
              )}
            </div>

            {/* Region Tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={addRegion}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors border border-white/10"
              >
                <Plus className="h-3.5 w-3.5" /> Add Region
              </button>
              <button
                onClick={clearRegions}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors border border-white/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            {/* Export Group */}
            <div className="flex items-center gap-3">
              <FormatSelector
                formats={['wav', 'mp3', 'webm', 'ogg']}
                selected={format}
                onSelect={setFormat}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={isProcessing || regions.length === 0}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isProcessing || regions.length === 0
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/20'
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Export Trim
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Region List & Numerical Adjusters */}
          {regions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Active Selection Range ({regions.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {regions.map((r, i) => {
                  const segDur = Math.max(0, r.end - r.start);
                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl bg-zinc-900/50 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Region {i + 1}
                        </span>
                        <span className="text-zinc-400 font-mono">
                          Duration: {formatTime(segDur)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">
                            Start Time (s)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max={r.end}
                            value={Number(r.start.toFixed(2))}
                            onChange={(e) =>
                              handleRegionChange(r.id, 'start', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-500 block mb-1">
                            End Time (s)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min={r.start}
                            max={duration}
                            value={Number(r.end.toFixed(2))}
                            onChange={(e) =>
                              handleRegionChange(r.id, 'end', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
