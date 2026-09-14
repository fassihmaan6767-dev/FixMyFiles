'use client';

import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Merge, GripVertical, X, Download, Plus } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormatSelector } from '@/components/ui/format-selector';
import { cn } from '@/lib/utils';
import { exportAudioBuffer } from '@/lib/audio-exporter';

/**
 * AudioMergerClient
 * Merge multiple audio files into one:
 * - Framer Motion Reorder for proper drag UI
 * - Decode all to AudioBuffer, concatenate sequentially
 * - Export to WAV or MP3
 */

interface AudioTrack {
  id: string;
  file: File;
  name: string;
  duration: number;
}

export function AudioMergerClient() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [format, setFormat] = useState('wav');
  const [isProcessing, setIsProcessing] = useState(false);

  // Add files to the track list
  const handleFiles = useCallback(async (files: File[]) => {
    const audioCtx = new AudioContext();
    const newTracks: AudioTrack[] = [];

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        newTracks.push({
          id: Math.random().toString(36).slice(2),
          file,
          name: file.name,
          duration: audioBuffer.duration,
        });
      } catch {
        alert(`Could not decode "${file.name}". Unsupported format.`);
      }
    }

    audioCtx.close();
    setTracks((prev) => [...prev, ...newTracks]);
  }, []);

  // Remove a track
  const removeTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  // Merge and export
  const handleExport = async () => {
    if (tracks.length < 2) return;
    setIsProcessing(true);

    try {
      const audioCtx = new AudioContext();
      const buffers: AudioBuffer[] = [];

      // Decode all tracks
      for (const track of tracks) {
        const arrayBuffer = await track.file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        buffers.push(audioBuffer);
      }

      // Calculate total length
      const sampleRate = buffers[0].sampleRate;
      const channels = Math.max(...buffers.map((b) => b.numberOfChannels));
      const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);

      // Create merged buffer
      const mergedBuffer = new AudioBuffer({
        numberOfChannels: channels,
        length: totalLength,
        sampleRate,
      });

      let offset = 0;
      for (const buf of buffers) {
        const copyLen = Math.min(buf.length, totalLength - offset);
        if (copyLen > 0) {
          for (let ch = 0; ch < channels; ch++) {
            const sourceData = ch < buf.numberOfChannels
              ? buf.getChannelData(ch)
              : buf.getChannelData(0); // mono fallback
            mergedBuffer.getChannelData(ch).set(sourceData.subarray(0, copyLen), offset);
          }
          offset += copyLen;
        }
      }

      // Export via universal audio exporter
      await exportAudioBuffer(mergedBuffer, format, 'merged_audio');
      audioCtx.close();
    } catch (err) {
      console.error('Merge failed:', err);
      alert('Merge failed. Try using fewer or smaller files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageLayout
      title="Audio Merger"
      description="Merge multiple audio files into one. Drag to reorder tracks."
    >
      <div className="space-y-6">
        {/* Drop Zone */}
        <FileDropzone
          onFiles={handleFiles}
          accept="audio/*"
          multiple
          label="Drop audio files here"
          sublabel="Add multiple files to merge them together"
        />

        {/* Track List with Framer Motion Reorder */}
        {tracks.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Track Order ({tracks.length} files)
            </h4>
            <Reorder.Group
              axis="y"
              values={tracks}
              onReorder={setTracks}
              className="space-y-2"
            >
              {tracks.map((track, index) => (
                <Reorder.Item
                  key={track.id}
                  value={track}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing relative z-10"
                >
                  <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                  <span className="text-xs text-zinc-500 font-mono w-6">{index + 1}</span>
                  <span className="text-sm text-zinc-300 flex-1 truncate">{track.name}</span>
                  <span className="text-xs text-zinc-500 font-mono">{formatTime(track.duration)}</span>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}

        {/* Export Controls */}
        {tracks.length >= 2 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10">
            <FormatSelector
              formats={['wav', 'mp3', 'webm', 'ogg']}
              selected={format}
              onSelect={setFormat}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={isProcessing}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-blue-500/20',
                isProcessing
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              )}
            >
              <Download className="h-4 w-4" />
              {isProcessing ? 'Merging...' : 'Merge & Export'}
            </motion.button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
