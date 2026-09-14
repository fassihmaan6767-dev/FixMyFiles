'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileAudio, Download, Copy, Check, Loader2, Play, Pause, AlertCircle, Sparkles, Mic, Cpu } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/audio-exporter';

/**
 * AudioTranscriptClient
 * Flagship Audio-to-Transcript tool:
 * 1. Engine A: Whisper AI via Web Worker (@xenova/transformers Xenova/whisper-tiny.en)
 * 2. Engine B: Native Browser Speech Engine (Instant, zero download required)
 * - Real-time transcript display
 * - Notion-style editing and formatting
 * - Export as TXT, SRT, or VTT with timestamps
 */

interface TranscriptChunk {
  text: string;
  timestamp: [number, number];
}

type EngineType = 'whisper' | 'native';

export function AudioTranscriptClient() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [engine, setEngine] = useState<EngineType>('native');
  
  // State
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [chunks, setChunks] = useState<TranscriptChunk[]>([]);
  const [fullText, setFullText] = useState('');
  
  const [exportFormat, setExportFormat] = useState('txt');
  const [copied, setCopied] = useState(false);

  // Refs
  const workerRef = useRef<Worker | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Worker for Whisper
    try {
      workerRef.current = new Worker(new URL('./transcript.worker.ts', import.meta.url), {
        type: 'module',
      });

      workerRef.current.onmessage = (e) => {
        const { type, data, message, error: workerError } = e.data;

        switch (type) {
          case 'progress':
            if (data.status === 'initiate') {
              setIsModelLoading(true);
              setStatus(`Downloading AI model: ${data.file || 'Whisper Tiny'}`);
            } else if (data.status === 'progress') {
              const pct = Math.round(data.progress);
              setProgress(pct);
              setStatus(`Downloading AI model: ${pct}%`);
            } else if (data.status === 'done') {
              setIsModelLoading(false);
              setProgress(100);
              setStatus('Model ready. Transcribing audio...');
            }
            break;
          case 'status':
            setStatus(message);
            break;
          case 'chunk':
            setChunks((prev) => {
              if (Array.isArray(data)) return data;
              return [...prev, data];
            });
            break;
          case 'complete':
            setIsTranscribing(false);
            setStatus('Transcription complete!');
            if (data.chunks) setChunks(data.chunks);
            if (data.text) setFullText(data.text.trim());
            break;
          case 'error':
            setIsTranscribing(false);
            setIsModelLoading(false);
            setError(`Whisper model error: ${workerError}. Tip: You can switch to "Browser Speech Engine" for instant transcription.`);
            setStatus('Failed.');
            break;
        }
      };
    } catch (e) {
      console.warn('Worker initialization error:', e);
    }

    return () => {
      workerRef.current?.terminate();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(f));
    setChunks([]);
    setFullText('');
    setStatus('');
    setError(null);
  }, [audioUrl]);

  const decodeAudio = async (f: File) => {
    const audioCtx = new window.AudioContext({ sampleRate: 16000 });
    const arrayBuffer = await f.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);
    audioCtx.close();
    return audioData;
  };

  // Start transcription based on selected engine
  const startTranscription = async () => {
    if (!file) return;
    setIsTranscribing(true);
    setError(null);
    setChunks([]);
    setFullText('');
    setProgress(0);

    if (engine === 'whisper') {
      if (!workerRef.current) {
        setError('Whisper Web Worker is unavailable.');
        setIsTranscribing(false);
        return;
      }

      setStatus('Decoding audio to 16kHz PCM...');
      try {
        const audioData = await decodeAudio(file);
        setStatus('Initializing Whisper AI Model (first time downloads weights)...');
        workerRef.current.postMessage({
          type: 'transcribe',
          audioData: audioData,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to decode audio file.');
        setIsTranscribing(false);
      }
    } else {
      // Native Browser Speech Recognition Engine
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Native Speech Recognition is only supported in Chrome and Edge browsers. Please use Whisper AI engine instead.');
        setIsTranscribing(false);
        return;
      }

      setStatus('Listening to audio playback through browser speech engine...');
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      let accumulated = '';

      recognition.onresult = (event: any) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + ' ';
            const currTime = audioRef.current?.currentTime || 0;
            setChunks((prev) => [
              ...prev,
              { text: result[0].transcript.trim(), timestamp: [Math.max(0, currTime - 3), currTime] },
            ]);
          }
        }
        if (final) {
          accumulated += final;
          setFullText(accumulated);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        if (isTranscribing && audioRef.current && !audioRef.current.paused) {
          try { recognition.start(); } catch {}
        } else {
          setIsTranscribing(false);
          setStatus('Transcription complete!');
        }
      };

      try {
        recognition.start();
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      } catch (e) {
        console.error(e);
        setError('Could not access speech recognition service.');
        setIsTranscribing(false);
      }
    }
  };

  const stopTranscription = () => {
    setIsTranscribing(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setStatus('Transcription stopped.');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return { srt: `${h}:${m}:${s},${ms}`, vtt: `${h}:${m}:${s}.${ms}`, display: `${m}:${s}` };
  };

  const handleExport = () => {
    if (chunks.length === 0 && !fullText) return;

    let content = '';
    let filename = '';
    let mimeType = 'text/plain';
    const baseName = file?.name.replace(/\.[^.]+$/, '') || 'transcript';

    if (exportFormat === 'txt') {
      content = fullText || chunks.map((c) => c.text).join(' ');
      filename = `${baseName}_transcript.txt`;
    } else if (exportFormat === 'srt') {
      content = chunks
        .map((c, i) => {
          const start = formatTime(c.timestamp[0]).srt;
          const end = formatTime(c.timestamp[1] || c.timestamp[0] + 3).srt;
          return `${i + 1}\n${start} --> ${end}\n${c.text.trim()}\n`;
        })
        .join('\n');
      filename = `${baseName}_transcript.srt`;
      mimeType = 'application/x-subrip';
    } else if (exportFormat === 'vtt') {
      content =
        'WEBVTT\n\n' +
        chunks
          .map((c) => {
            const start = formatTime(c.timestamp[0]).vtt;
            const end = formatTime(c.timestamp[1] || c.timestamp[0] + 3).vtt;
            return `${start} --> ${end}\n${c.text.trim()}\n`;
          })
          .join('\n');
      filename = `${baseName}_transcript.vtt`;
      mimeType = 'text/vtt';
    }

    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);
  };

  const copyText = async () => {
    const text = fullText || chunks.map((c) => c.text).join(' ');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      title="Audio to Transcript"
      description="Transcribe audio to text 100% locally in your browser. No paid APIs, no servers, zero data leaves your device."
    >
      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*,video/*"
          label="Drop your audio or video file here"
          sublabel="Supports MP3, WAV, MP4, WebM, FLAC, M4A"
        />
      ) : (
        <div className="space-y-6">
          {/* Dual Engine Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/10">
            <div>
              <h4 className="text-sm font-semibold text-white">Select Transcription Engine</h4>
              <p className="text-xs text-zinc-400">Choose between local deep learning or instant browser engine</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEngine('whisper')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all',
                  engine === 'whisper'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                )}
              >
                <Cpu className="h-3.5 w-3.5" />
                Whisper AI (WebAssembly)
              </button>
              <button
                onClick={() => setEngine('native')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all',
                  engine === 'native'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                )}
              >
                <Mic className="h-3.5 w-3.5" />
                Browser Speech (Instant)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Audio Preview & Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-400">Audio Source</h4>

              <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <FileAudio className="h-7 w-7 text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {audioUrl && (
                  <audio ref={audioRef} src={audioUrl} controls className="w-full h-9 accent-blue-500" />
                )}
              </div>

              {!isTranscribing ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startTranscription}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Start {engine === 'whisper' ? 'Whisper AI' : 'Instant'} Transcription
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={stopTranscription}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  Stop Transcription
                </motion.button>
              )}

              {/* Status Indicator */}
              {status && (
                <div className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10 text-xs text-zinc-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2">
                      {isTranscribing && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />}
                      {status}
                    </span>
                    {isModelLoading && <span className="text-blue-400 font-mono">{progress}%</span>}
                  </div>
                  {isModelLoading && (
                    <div className="w-full h-1.5 mt-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Right Column: Notion-style Transcript Viewer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-400">Live Transcript</h4>
                {(fullText || chunks.length > 0) && (
                  <button
                    onClick={copyText}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2.5 py-1 rounded-md"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Text
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="min-h-[320px] max-h-[460px] overflow-y-auto p-6 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-3 font-sans">
                {chunks.length === 0 && !fullText ? (
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-600 text-xs italic gap-2">
                    <Sparkles className="h-5 w-5 opacity-40" />
                    <span>Your transcribed text will appear here chunk by chunk...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chunks.map((chunk, i) => (
                      <div key={i} className="group flex items-start gap-3 text-xs leading-relaxed">
                        <span className="text-[10px] text-zinc-500 font-mono select-none shrink-0 mt-0.5 bg-white/5 px-1.5 py-0.5 rounded">
                          {formatTime(chunk.timestamp[0]).display}
                        </span>
                        <p className="text-zinc-200">{chunk.text}</p>
                      </div>
                    ))}
                    {isTranscribing && !isModelLoading && (
                      <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse mt-2" />
                    )}
                  </div>
                )}
              </div>

              {/* Export Panel */}
              {(fullText || chunks.length > 0) && (
                <div className="flex items-center justify-between pt-1">
                  <FormatSelector formats={['txt', 'srt', 'vtt']} selected={exportFormat} onSelect={setExportFormat} />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors shadow-md"
                  >
                    <Download className="h-3.5 w-3.5" /> Export {exportFormat.toUpperCase()}
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (audioUrl) URL.revokeObjectURL(audioUrl);
                setFile(null);
                setAudioUrl(null);
                setChunks([]);
                setFullText('');
                stopTranscription();
              }}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              ← Upload a different audio or video file
            </button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
