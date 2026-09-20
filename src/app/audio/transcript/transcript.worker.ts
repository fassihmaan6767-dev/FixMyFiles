import { pipeline, env } from '@xenova/transformers';

// Configure transformers for 100% browser environment with permanent Cache API storage
env.allowLocalModels = false;
env.useBrowserCache = true;

/**
 * PipelineSingleton
 * Multilingual Whisper Tiny (Quantized)
 * Automatically detects languages: English, Urdu, Hindi, Spanish, French, Arabic, etc.
 * Uses ONNX quantized weights for ultra-fast in-browser inference.
 */
class PipelineSingleton {
  static task = 'automatic-speech-recognition';
  static model = 'Xenova/whisper-tiny';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task as any, this.model, {
        quantized: true, // Use optimized quantized ONNX weights (q8)
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Track file download progress across multiple files (config, tokenizer, onnx models)
const fileProgressMap = new Map<string, number>();

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, audioData, language } = event.data;

  if (type === 'transcribe') {
    try {
      fileProgressMap.clear();

      self.postMessage({
        type: 'stage',
        stage: 'init',
        message: 'Initializing multilingual Whisper AI engine...',
      });

      // Load model with smooth aggregate progress tracking
      const transcriber = await PipelineSingleton.getInstance((progressData: any) => {
        try {
          const file = progressData?.file || 'weights';
          const status = progressData?.status;
          const rawPct = typeof progressData?.progress === 'number' ? progressData.progress : 0;

          if (status === 'progress' || status === 'download') {
            fileProgressMap.set(file, rawPct);

            // Compute weighted progress across files
            let sum = 0;
            fileProgressMap.forEach((val) => {
              sum += val;
            });
            // If ONNX model is in map, give it higher weight
            const aggregateProgress = Math.min(
              99,
              Math.max(5, Math.round(sum / Math.max(1, fileProgressMap.size)))
            );

            self.postMessage({
              type: 'progress',
              data: {
                progress: aggregateProgress,
                file,
              },
            });
          }
        } catch {
          // Ignore serialization edge-cases
        }
      });

      self.postMessage({
        type: 'model_ready',
        stage: 'transcribing',
        message: 'Analyzing speech chunks & detecting language...',
      });

      // Multilingual inference with timestamped segments
      const result = await transcriber(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
        // null allows automatic language detection (Urdu, Hindi, Spanish, English, etc.)
        language: language || null,
        task: 'transcribe',
      });

      // Sanitize output so no non-cloneable objects/Tensors cross the thread boundary
      const text = typeof result?.text === 'string' ? result.text.trim() : '';
      const chunks: { id: string; text: string; timestamp: [number, number] }[] = [];

      if (Array.isArray(result?.chunks)) {
        result.chunks.forEach((c: any, index: number) => {
          if (c && typeof c.text === 'string') {
            const start = Array.isArray(c.timestamp) ? Number(c.timestamp[0]) || 0 : 0;
            const end = Array.isArray(c.timestamp) ? Number(c.timestamp[1]) || start + 3 : start + 3;
            chunks.push({
              id: `chunk_${index}_${Math.round(start * 100)}`,
              text: c.text.trim(),
              timestamp: [start, end],
            });
          }
        });
      }

      // Default chunk fallback if text is present without chunk timestamps
      if (chunks.length === 0 && text) {
        chunks.push({ id: 'chunk_0', text, timestamp: [0, 5] });
      }

      self.postMessage({
        type: 'complete',
        data: {
          text,
          chunks,
        },
      });
    } catch (error: any) {
      console.error('Whisper worker transcription error:', error);
      self.postMessage({
        type: 'error',
        error: error?.message || 'Speech recognition model execution error',
      });
    }
  }
});

export {};
