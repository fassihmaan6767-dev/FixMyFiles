import { pipeline, env } from '@xenova/transformers';

// Configure transformers to not look for local models in the browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task = 'automatic-speech-recognition';
  static model = 'Xenova/whisper-tiny.en';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task as any, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, audioData } = event.data;

  if (type === 'transcribe') {
    try {
      // Load the model with safe progress reporting
      const transcriber = await PipelineSingleton.getInstance((progressData: any) => {
        try {
          self.postMessage({
            type: 'progress',
            data: {
              status: progressData?.status,
              file: progressData?.file,
              progress: typeof progressData?.progress === 'number' ? progressData.progress : 0,
            },
          });
        } catch {
          // Ignore any progress serialization quirks
        }
      });

      self.postMessage({ type: 'status', message: 'Model loaded. Transcribing audio...' });

      // Run transcription without non-cloneable callbacks
      // (callback_function passes raw Tensor objects which crash structuredClone)
      const result = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      // Extract and sanitize primitive text and chunk data so no Tensor is ever sent
      const text = typeof result?.text === 'string' ? result.text.trim() : '';
      const chunks: { text: string; timestamp: [number, number] }[] = [];

      if (Array.isArray(result?.chunks)) {
        for (const c of result.chunks) {
          if (c && typeof c.text === 'string') {
            const start = Array.isArray(c.timestamp) ? Number(c.timestamp[0]) || 0 : 0;
            const end = Array.isArray(c.timestamp) ? Number(c.timestamp[1]) || start + 3 : start + 3;
            chunks.push({
              text: c.text,
              timestamp: [start, end],
            });
          }
        }
      }

      // If no chunks were returned but text exists, create a default chunk
      if (chunks.length === 0 && text) {
        chunks.push({ text, timestamp: [0, 5] });
      }

      // Send final clean result
      self.postMessage({
        type: 'complete',
        data: {
          text,
          chunks,
        },
      });
    } catch (error) {
      console.error('Transcription error:', error);
      self.postMessage({ type: 'error', error: (error as Error).message });
    }
  }
});
