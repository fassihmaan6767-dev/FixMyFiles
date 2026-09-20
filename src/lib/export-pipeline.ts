'use client';

import { useDownloadStore } from '@/store/use-download-store';

class ExportPipeline {
  private worker: Worker | null = null;
  private pendingTasks = new Map<
    string,
    {
      resolve: (blob: Blob) => void;
      reject: (err: Error) => void;
    }
  >();

  private getWorker(): Worker {
    if (!this.worker && typeof window !== 'undefined') {
      this.worker = new Worker(new URL('../workers/export.worker.ts', import.meta.url), {
        type: 'module',
      });

      this.worker.onmessage = (e: MessageEvent) => {
        const { id, type } = e.data;
        const progress = e.data.payload?.progress ?? e.data.progress;
        const stage = e.data.payload?.stage ?? e.data.stage;
        const buffer = e.data.payload?.buffer ?? e.data.buffer;
        const mimeType = e.data.payload?.mimeType ?? e.data.mimeType;
        const error = e.data.payload?.error ?? e.data.error;
        const store = useDownloadStore.getState();

        if (type === 'PROGRESS') {
          store.setProgress(id, progress, stage);
        } else if (type === 'COMPLETE') {
          const blob = new Blob([buffer], { type: mimeType });
          store.completeDownload(id, blob);

          const task = this.pendingTasks.get(id);
          if (task) {
            task.resolve(blob);
            this.pendingTasks.delete(id);
          }
        } else if (type === 'ERROR') {
          store.failDownload(id, error || 'Unknown export failure');

          const task = this.pendingTasks.get(id);
          if (task) {
            task.reject(new Error(error));
            this.pendingTasks.delete(id);
          }
        }
      };

      this.worker.onerror = (err) => {
        console.error('Export worker error:', err);
      };
    }

    return this.worker!;
  }

  /**
   * Universal audio buffer export handled completely off-thread in the Web Worker
   */
  public async exportAudio(
    audioBuffer: AudioBuffer,
    format: string,
    filename: string
  ): Promise<string> {
    const store = useDownloadStore.getState();
    const cleanName = filename.endsWith(`.${format}`) ? filename : `${filename}.${format}`;

    const id = store.addDownload({
      filename: cleanName,
      format,
      engine: 'worker-wasm',
      initialMessage: 'Dispatching audio buffers to worker...',
    });

    try {
      // Extract channel Float32Arrays and transfer them
      const numChannels = audioBuffer.numberOfChannels;
      const channelBuffers: ArrayBuffer[] = [];

      for (let i = 0; i < numChannels; i++) {
        // Clone channel data so transfer doesn't neuter the original buffer in audio context
        const data = audioBuffer.getChannelData(i);
        const copy = new Float32Array(data);
        channelBuffers.push(copy.buffer);
      }

      const worker = this.getWorker();

      return new Promise<string>((resolve, reject) => {
        this.pendingTasks.set(id, {
          resolve: () => resolve(id),
          reject,
        });

        worker.postMessage(
          {
            id,
            type: 'ENCODE_AUDIO',
            data: {
              channelBuffers,
              sampleRate: audioBuffer.sampleRate,
              format,
            },
          },
          channelBuffers
        );
      });
    } catch (err: any) {
      store.failDownload(id, err.message || 'Worker initialization failed');
      throw err;
    }
  }

  /**
   * FFmpeg media transcoding running off-thread
   */
  public async transcodeMedia(
    inputFile: File,
    outputFilename: string,
    format: string,
    ffmpegArgs: string[]
  ): Promise<string> {
    const store = useDownloadStore.getState();

    const id = store.addDownload({
      filename: outputFilename,
      format,
      engine: 'worker-wasm',
      initialMessage: 'Spinning up multi-threaded FFmpeg engine...',
    });

    try {
      const inputBuffer = await inputFile.arrayBuffer();
      const worker = this.getWorker();

      return new Promise<string>((resolve, reject) => {
        this.pendingTasks.set(id, {
          resolve: () => resolve(id),
          reject,
        });

        worker.postMessage(
          {
            id,
            type: 'FFMPEG_PROCESS',
            data: {
              inputName: inputFile.name,
              outputName: outputFilename,
              inputBuffer,
              args: ffmpegArgs,
            },
          },
          [inputBuffer]
        );
      });
    } catch (err: any) {
      store.failDownload(id, err.message || 'Transcode failure');
      throw err;
    }
  }
}

export const exportPipeline = new ExportPipeline();
