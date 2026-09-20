'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileAudio,
  FileVideo,
  Download,
  Copy,
  Check,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Edit3,
  Volume2,
  VolumeX,
  Languages,
  ArrowDown,
  Clock,
  RefreshCw,
  Globe,
  Settings2,
} from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { BlurRevealText } from '@/components/ui/blur-reveal-text';
import { downloadBlob } from '@/lib/audio-exporter';
import { TRANSCRIPTION_LANGUAGES } from '@/lib/languages';

export interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: [number, number]; // [start, end] in seconds
}

export function AudioTranscriptClient() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  // Playback & Sync State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeChunkIndex, setActiveChunkIndex] = useState<number>(-1);

  // Pre-transcription Language Configuration
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [appliedLanguage, setAppliedLanguage] = useState<string>('auto');
  const [showLanguageSettings, setShowLanguageSettings] = useState<boolean>(false);

  // Transcription & Groq Turbo API State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [stageText, setStageText] = useState('Ready to transcribe');
  const [error, setError] = useState<string | null>(null);

  // Live Countdown & ETA Queue State for Groq 429 Rate Limits
  const [countdown, setCountdown] = useState<number | null>(null);
  const [initialWaitSeconds, setInitialWaitSeconds] = useState<number>(60);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Transcript Data
  const [chunks, setChunks] = useState<TranscriptChunk[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<string>('');
  const [exportFormat, setExportFormat] = useState('srt');
  const [copied, setCopied] = useState(false);

  // Spotify-style Synced Lyrics: AutoSync & Scroll Detection
  const [isAutoSync, setIsAutoSync] = useState<boolean>(true);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // DOM Refs
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Format time helpers (mm:ss or hh:mm:ss)
  const formatTimeDisplay = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatSubTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return {
      srt: `${h}:${m}:${s},${ms}`,
      vtt: `${h}:${m}:${s}.${ms}`,
    };
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (programmaticScrollTimerRef.current) clearTimeout(programmaticScrollTimerRef.current);
    };
  }, []);

  // 1. File Selection (Supports Audio & Video)
  // Does NOT start transcription automatically, allows user to pick language first!
  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;

    if (mediaUrl) URL.revokeObjectURL(mediaUrl);

    // Cancel any ongoing countdown queue
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const isVid = f.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(f.name);
    const newUrl = URL.createObjectURL(f);

    setFile(f);
    setMediaUrl(newUrl);
    setIsVideo(isVid);
    setChunks([]);
    setActiveChunkIndex(-1);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsAutoSync(true);
    setShowLanguageSettings(false);
    setError(null);
    setCountdown(null);
    setStageText('Choose your language below and click Start Transcription.');
  }, [mediaUrl]);

  // 2. Prepare payload (extract audio track if file is a heavy video or > 24MB)
  const prepareAudioFile = async (inputFile: File): Promise<Blob> => {
    if (inputFile.type.startsWith('audio/') && inputFile.size < 24 * 1024 * 1024) {
      return inputFile;
    }

    setStageText('Extracting audio track for fast Groq Turbo cloud transfer...');
    const arrayBuffer = await inputFile.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000,
    });
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioCtx.close();

    const { encodeWAV } = await import('@/lib/audio-exporter');
    return encodeWAV(audioBuffer);
  };

  // 3. Groq Turbo Transcription Request Function
  const executeTranscription = useCallback(
    async (targetFile: File, languageParam: string) => {
      setIsTranscribing(true);
      setError(null);
      setAppliedLanguage(languageParam);
      setShowLanguageSettings(false);
      setStageText('Connecting to Groq Whisper Turbo API (whisper-large-v3-turbo)...');

      try {
        const audioBlob = await prepareAudioFile(targetFile);

        const formData = new FormData();
        const baseName = targetFile.name.replace(/\.[^.]+$/, '');
        formData.append('file', audioBlob, `${baseName}.wav`);
        formData.append('language', languageParam);

        setStageText(
          languageParam === 'roman_urdu_hinglish'
            ? 'Transcribing audio into Roman Urdu / Hinglish (Groq Turbo)...'
            : `Transcribing audio via Groq Whisper Turbo (${languageParam.toUpperCase()})...`
        );

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        // Catch 429 Rate Limit, Start Countdown & Auto-Resume
        if (response.status === 429) {
          const resData = await response.json().catch(() => ({}));
          const waitTime = Number(resData?.retryAfter) || 60;

          setInitialWaitSeconds(waitTime);
          setCountdown(waitTime);
          setStageText(`High demand. Estimated wait time: ${waitTime}s`);

          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

          countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                if (countdownTimerRef.current) {
                  clearInterval(countdownTimerRef.current);
                  countdownTimerRef.current = null;
                }
                setCountdown(null);
                setStageText('Wait complete! Auto-resuming transcription with Groq Turbo...');
                setTimeout(() => {
                  executeTranscription(targetFile, languageParam);
                }, 100);
                return null;
              }
              const nextVal = prev - 1;
              setStageText(`High demand. Estimated wait time: ${nextVal}s`);
              return nextVal;
            });
          }, 1000);

          return;
        }

        // Non-429 error handling
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error || `Groq API responded with HTTP ${response.status}`);
        }

        // Success: Parse verbose_json containing segments
        const data = await response.json();
        setIsTranscribing(false);
        setCountdown(null);
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        setStageText('Transcription complete! Synced lyrics ready.');
        setIsAutoSync(true);

        if (Array.isArray(data?.segments) && data.segments.length > 0) {
          const mappedChunks: TranscriptChunk[] = data.segments.map((seg: any) => ({
            id: `chunk_${seg.id}_${Math.round(seg.start * 100)}`,
            text: seg.text.trim(),
            timestamp: [seg.start, seg.end],
          }));
          setChunks(mappedChunks);
        } else if (typeof data?.text === 'string' && data.text.trim()) {
          setChunks([
            {
              id: 'chunk_0',
              text: data.text.trim(),
              timestamp: [0, duration || 5],
            },
          ]);
        }
      } catch (err: any) {
        console.error('Transcription execution error:', err);
        setIsTranscribing(false);
        setCountdown(null);
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setError(err?.message || 'Failed to transcribe audio via Groq Whisper Turbo');
        setStageText('Transcription failed.');
      }
    },
    [duration]
  );

  const startTranscription = () => {
    if (!file) return;
    executeTranscription(file, selectedLanguage);
  };

  const cancelQueue = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
    setIsTranscribing(false);
    setStageText('Transcription cancelled.');
  };

  // 4. Programmatic Auto-Scroll with Smooth Center Alignment
  const scrollActiveChunkIntoCenter = (index: number) => {
    const targetEl = chunkRefs.current[index];
    if (!targetEl) return;

    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimerRef.current) {
      clearTimeout(programmaticScrollTimerRef.current);
    }

    targetEl.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    programmaticScrollTimerRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 750);
  };

  // 5. Media Playback & Synced Lyrics Highlight
  const handleTimeUpdate = () => {
    const el = mediaRef.current;
    if (!el) return;

    const t = el.currentTime;
    setCurrentTime(t);

    if (chunks.length === 0) return;

    const index = chunks.findIndex(
      (c) => t >= c.timestamp[0] - 0.1 && t <= (c.timestamp[1] || c.timestamp[0] + 3) + 0.1
    );

    if (index !== -1 && index !== activeChunkIndex) {
      setActiveChunkIndex(index);
      // Automatic scroll ONLY fires if isAutoSync === true
      if (isAutoSync) {
        scrollActiveChunkIntoCenter(index);
      }
    }
  };

  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  const seekToChunk = (startSec: number, index?: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, startSec);
    if (!isPlaying) {
      el.play();
      setIsPlaying(true);
    }
    if (typeof index === 'number') {
      setActiveChunkIndex(index);
      setIsAutoSync(true);
      scrollActiveChunkIntoCenter(index);
    }
  };

  const skipSeconds = (delta: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.min(duration, Math.max(0, el.currentTime + delta));
  };

  // 6. Manual User Scroll Listeners (Sets isAutoSync to false)
  const handleContainerScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    if (isAutoSync) {
      setIsAutoSync(false);
    }
  };

  const handleManualWheel = () => {
    isProgrammaticScrollRef.current = false;
    if (isAutoSync) {
      setIsAutoSync(false);
    }
  };

  const handleManualTouch = () => {
    isProgrammaticScrollRef.current = false;
    if (isAutoSync) {
      setIsAutoSync(false);
    }
  };

  // 7. Resync Logic (Triggered by Floating Sync Button)
  const handleResync = () => {
    setIsAutoSync(true);
    const targetIdx = activeChunkIndex !== -1 ? activeChunkIndex : 0;
    if (targetIdx !== -1 && chunkRefs.current[targetIdx]) {
      scrollActiveChunkIntoCenter(targetIdx);
    }
  };

  // 8. Inline Transcript Editing
  const startInlineEdit = (index: number, text: string) => {
    setEditingIndex(index);
    setEditDraft(text);
  };

  const saveInlineEdit = (index: number) => {
    if (editingIndex === null) return;
    const trimmed = editDraft.trim();
    setChunks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, text: trimmed || c.text } : c))
    );
    setEditingIndex(null);
    setEditDraft('');
  };

  const cancelInlineEdit = () => {
    setEditingIndex(null);
    setEditDraft('');
  };

  const fullFormattedText = useMemo(() => {
    return chunks.map((c) => c.text).join(' ');
  }, [chunks]);

  const handleExport = () => {
    if (chunks.length === 0) return;
    const baseName = file?.name.replace(/\.[^.]+$/, '') || 'transcript';

    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    if (exportFormat === 'txt') {
      content = chunks
        .map((c) => `[${formatTimeDisplay(c.timestamp[0])}] ${c.text}`)
        .join('\n\n');
      filename = `${baseName}_transcript.txt`;
    } else if (exportFormat === 'srt') {
      content = chunks
        .map((c, i) => {
          const start = formatSubTime(c.timestamp[0]).srt;
          const end = formatSubTime(c.timestamp[1] || c.timestamp[0] + 3).srt;
          return `${i + 1}\n${start} --> ${end}\n${c.text}\n`;
        })
        .join('\n');
      filename = `${baseName}.srt`;
      mimeType = 'application/x-subrip';
    } else if (exportFormat === 'vtt') {
      content =
        'WEBVTT\n\n' +
        chunks
          .map((c, i) => {
            const start = formatSubTime(c.timestamp[0]).vtt;
            const end = formatSubTime(c.timestamp[1] || c.timestamp[0] + 3).vtt;
            return `${i + 1}\n${start} --> ${end}\n${c.text}\n`;
          })
          .join('\n');
      filename = `${baseName}.vtt`;
      mimeType = 'text/vtt';
    }

    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);
  };

  const copyAllText = async () => {
    if (!fullFormattedText) return;
    await navigator.clipboard.writeText(fullFormattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLanguageObj = useMemo(() => {
    return TRANSCRIPTION_LANGUAGES.find((l) => l.code === selectedLanguage);
  }, [selectedLanguage]);

  return (
    <ToolPageLayout
      title="Audio & Video Transcriber"
      description="Powered by Groq Whisper Large v3 Turbo with interactive Spotify-style synced lyrics viewer. Lightning-fast transcription with automatic rate-limit queueing."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.mkv,.mp3,.wav,.ogg,.m4a,.flac"
          label="Drop your audio or video file here"
          sublabel="Supports MP4, WebM, MOV, MP3, WAV, M4A, FLAC (Powered by Groq whisper-large-v3-turbo)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar with Model Badge & Language Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              {isVideo ? (
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <FileVideo className="h-5 w-5" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <FileAudio className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-[280px] sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {isVideo ? 'Video Media' : 'Audio Stream'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Groq Turbo Model Badge */}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Languages className="w-3.5 h-3.5" />
                Groq Whisper Turbo
              </span>

              {/* Active Language Badge */}
              {chunks.length > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <Globe className="w-3.5 h-3.5" />
                  {TRANSCRIPTION_LANGUAGES.find((l) => l.code === appliedLanguage)?.name || appliedLanguage}
                </span>
              )}

              {/* Ephemeral Privacy Badge */}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <span>☁️ Ephemeral Groq AI processing</span>
              </span>

              {chunks.length > 0 && (
                <button
                  onClick={() => setShowLanguageSettings(!showLanguageSettings)}
                  className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Language</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (mediaUrl) URL.revokeObjectURL(mediaUrl);
                  setFile(null);
                  setMediaUrl(null);
                  setChunks([]);
                  cancelQueue();
                }}
                className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                Change File
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Player Dock & Pre-Transcription Language Selector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl">
                {isVideo ? (
                  <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                    {mediaUrl && (
                      <video
                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                        src={mediaUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={togglePlay}
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    )}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-white/90 text-zinc-950 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </motion.div>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-blue-950/20 to-zinc-950 text-center gap-4">
                    <div className="relative w-28 h-28 rounded-full bg-zinc-900 border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                      <div className="absolute inset-2 rounded-full border border-white/5 border-dashed animate-spin-slow" />
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    {mediaUrl && (
                      <audio
                        ref={mediaRef as React.RefObject<HTMLAudioElement>}
                        src={mediaUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    )}
                  </div>
                )}

                {/* Timeline & Controls */}
                <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-t border-white/10 space-y-3">
                  <div className="space-y-1">
                    <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => {
                          const t = parseFloat(e.target.value);
                          setCurrentTime(t);
                          if (mediaRef.current) mediaRef.current.currentTime = t;
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 px-0.5">
                      <span>{formatTimeDisplay(currentTime)}</span>
                      <span>{formatTimeDisplay(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => skipSeconds(-5)}
                        title="Rewind 5 seconds"
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </motion.button>
                      <button
                        onClick={() => skipSeconds(5)}
                        title="Forward 5 seconds"
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 -scale-x-100" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const speeds = [0.75, 1, 1.25, 1.5, 2];
                          const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
                          setPlaybackRate(next);
                          if (mediaRef.current) mediaRef.current.playbackRate = next;
                        }}
                        className="text-xs font-mono px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 cursor-pointer"
                      >
                        {playbackRate}x
                      </button>

                      <button
                        onClick={() => {
                          const el = mediaRef.current;
                          if (!el) return;
                          el.muted = !isMuted;
                          setIsMuted(!isMuted);
                        }}
                        className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART 1: PRE-TRANSCRIPTION GLOBAL LANGUAGE SELECTOR CARD */}
              {(chunks.length === 0 || showLanguageSettings) && countdown === null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-2xl space-y-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Languages className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Which language do you want the response in?
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Choose output language or phonetic Roman Urdu script before transcribing.
                      </p>
                    </div>
                  </div>

                  {/* Comprehensive Global Language Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="transcription-language" className="text-xs font-medium text-zinc-300">
                      Select Spoken / Target Language
                    </label>
                    <div className="relative">
                      <select
                        id="transcription-language"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        disabled={isTranscribing}
                        className="w-full appearance-none px-4 py-3 rounded-2xl bg-zinc-950 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer font-medium pr-10 shadow-inner"
                      >
                        <optgroup label="Special Formats">
                          {TRANSCRIPTION_LANGUAGES.filter((l) => l.group === 'Special').map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white py-1">
                              {lang.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Popular Languages">
                          {TRANSCRIPTION_LANGUAGES.filter((l) => l.group === 'Popular').map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white py-1">
                              {lang.name} {lang.nativeName ? `(${lang.nativeName})` : ''}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="All Global Languages">
                          {TRANSCRIPTION_LANGUAGES.filter((l) => l.group === 'All').map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-zinc-900 text-white py-1">
                              {lang.name} {lang.nativeName ? `(${lang.nativeName})` : ''}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ArrowDown className="w-4 h-4 opacity-70" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Format Advice Box */}
                  {selectedLanguage === 'roman_urdu_hinglish' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed"
                    >
                      <span className="font-semibold text-amber-300">🔥 Roman Urdu / Hinglish Mode:</span> Audio will be transcribed phonetically into English/Latin alphabet characters (e.g., &quot;Aap kaise hain?&quot;).
                    </motion.div>
                  )}

                  {selectedLanguage === 'auto' && (
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs leading-relaxed">
                      <span className="font-semibold text-blue-300">✨ Auto-Detect Mode:</span> Groq Whisper Turbo will automatically recognize the spoken language across 90+ supported languages.
                    </div>
                  )}

                  {selectedLanguage !== 'auto' && selectedLanguage !== 'roman_urdu_hinglish' && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs leading-relaxed">
                      <span className="font-semibold text-emerald-300">🎯 Targeted Language:</span> Speech recognition locked to{' '}
                      <span className="font-bold text-white">{selectedLanguageObj?.name}</span> for highest accuracy.
                    </div>
                  )}

                  {/* Prominent Trigger Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={startTranscription}
                    disabled={isTranscribing}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transcribing with Groq Turbo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Start Transcription</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* PART 2: Live ETA Countdown UI & Auto-Resume for Rate Limits */}
              {countdown !== null && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3 backdrop-blur-md shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        High Demand Rate Limit Queue
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {countdown}s
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white">
                    High demand. Estimated wait time: <span className="text-amber-300 font-mono font-bold">{countdown}s</span>
                  </p>

                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((initialWaitSeconds - countdown) / (initialWaitSeconds || 1)) * 100))}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-amber-300/80 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Auto-resuming automatically when timer reaches 0s
                    </span>
                    <button
                      onClick={cancelQueue}
                      className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Status Banner when transcribing (No countdown) */}
              {isTranscribing && countdown === null && (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin-slow shrink-0" />
                    <BlurRevealText
                      text={stageText}
                      className="text-xs font-medium text-zinc-300"
                    />
                  </div>
                  <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full w-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column: Spotify-Style Synced Lyrics Viewer (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-200">Synced Lyrics & Transcript</h3>
                  {chunks.length > 0 && (
                    <span className="text-[11px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {chunks.length} segments
                    </span>
                  )}
                </div>

                {chunks.length > 0 && (
                  <button
                    onClick={copyAllText}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* MASKED CONTAINER (TOP & BOTTOM FADE) & NATIVE MOUSE WHEEL SCROLLING */}
              <div
                className="relative rounded-3xl bg-zinc-950/90 border border-white/10 shadow-2xl overflow-hidden p-6"
                style={{ height: '520px' }}
              >
                <div className="absolute top-3 right-4 z-20 flex items-center gap-2">
                  <span className="text-[10px] font-medium tracking-wide uppercase text-zinc-500 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-md select-none">
                    Click line to jump · Double-click to edit
                  </span>
                </div>

                {/* PART 3: Native Mouse Wheel Scrolling & Hidden Scrollbars */}
                <div
                  ref={scrollContainerRef}
                  onScroll={handleContainerScroll}
                  onWheel={handleManualWheel}
                  onTouchMove={handleManualTouch}
                  className="h-full overflow-y-auto space-y-4 pr-3 select-text [overscroll-behavior:contain] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                  }}
                >
                  {chunks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-3">
                      <Sparkles className="w-8 h-8 opacity-40 text-blue-400 animate-pulse" />
                      <p className="text-sm font-medium text-zinc-400">Ready to transcribe</p>
                      <p className="text-xs max-w-sm leading-relaxed text-zinc-500">
                        Select your preferred language in the panel on the left and click &quot;Start Transcription&quot; to generate your Spotify-style synced lyrics.
                      </p>
                    </div>
                  ) : (
                    <div className="pt-16 pb-20 space-y-4">
                      {chunks.map((chunk, index) => {
                        const isActive = index === activeChunkIndex;
                        const isEditing = editingIndex === index;

                        return (
                          <div
                            key={chunk.id || index}
                            ref={(el) => {
                              chunkRefs.current[index] = el;
                            }}
                            onClick={() => {
                              if (!isEditing) seekToChunk(chunk.timestamp[0], index);
                            }}
                            onDoubleClick={() => startInlineEdit(index, chunk.text)}
                            className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                              isActive
                                ? 'bg-white/10 dark:bg-white/12 border-white/20 shadow-lg shadow-white/5 scale-[1.02]'
                                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span
                                className={`text-[11px] font-mono shrink-0 px-2 py-0.5 rounded-md transition-colors ${
                                  isActive
                                    ? 'bg-blue-500 text-white font-bold'
                                    : 'text-zinc-500 bg-white/5 group-hover:text-zinc-300'
                                }`}
                              >
                                {formatTimeDisplay(chunk.timestamp[0])}
                              </span>

                              <div className="flex-1 min-w-0">
                                {isEditing ? (
                                  <div
                                    className="space-y-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <textarea
                                      autoFocus
                                      value={editDraft}
                                      onChange={(e) => setEditDraft(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          saveInlineEdit(index);
                                        } else if (e.key === 'Escape') {
                                          cancelInlineEdit();
                                        }
                                      }}
                                      className="w-full text-sm font-medium text-white bg-zinc-900 border border-blue-500 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                      rows={2}
                                    />
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={cancelInlineEdit}
                                        className="px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-white bg-white/5 cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => saveInlineEdit(index)}
                                        className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm cursor-pointer"
                                      >
                                        Save Edit
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p
                                    className={`text-base leading-relaxed tracking-wide transition-all ${
                                      isActive
                                        ? 'text-white font-bold text-lg drop-shadow-sm'
                                        : 'text-zinc-400 group-hover:text-zinc-200'
                                    }`}
                                  >
                                    {chunk.text}
                                  </p>
                                )}
                              </div>

                              {!isEditing && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startInlineEdit(index, chunk.text);
                                  }}
                                  title="Edit line"
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-opacity cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PART 4: THE SPOTIFY FLOATING "SYNC" BUTTON */}
                <AnimatePresence>
                  {!isAutoSync && chunks.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 16, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResync}
                      className="absolute bottom-5 right-5 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/40 backdrop-blur-md cursor-pointer transition-all"
                    >
                      <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                      <span>Sync to playback</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Export Panel */}
              {chunks.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-medium">Export Format:</span>
                    <FormatSelector
                      formats={['srt', 'vtt', 'txt']}
                      selected={exportFormat}
                      onSelect={setExportFormat}
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export {exportFormat.toUpperCase()}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
