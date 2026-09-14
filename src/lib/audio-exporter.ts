/**
 * Audio Exporter
 * 100% Client-Side Audio Encoding & Downloading Engine
 * Supports: WAV, MP3, WebM, OGG
 */

// Safe browser file downloader
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();

  // Defer revocation to ensure browser captures download stream
  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  }, 2000);
}

// 1. WAV Encoder (16-bit PCM)
export function encodeWAV(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;

  let interleaved: Float32Array;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    interleaved = new Float32Array(left.length + right.length);
    for (let i = 0; i < left.length; i++) {
      interleaved[i * 2] = left[i];
      interleaved[i * 2 + 1] = right[i];
    }
  } else {
    interleaved = buffer.getChannelData(0);
  }

  const dataLength = interleaved.length * (bitDepth / 8);
  const totalLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// 2. MP3 Encoder (128kbps LAME)
export async function encodeMP3(buffer: AudioBuffer): Promise<Blob> {
  // Use our self-contained Lame bundle
  // @ts-ignore
  const lameModule = await import('./lame-bundle.js');
  const Mp3Encoder = lameModule.Mp3Encoder || (lameModule.default && lameModule.default.Mp3Encoder);
  
  if (!Mp3Encoder) {
    throw new Error('Mp3Encoder could not be initialized');
  }

  const channels = Math.min(2, buffer.numberOfChannels);
  const encoder = new Mp3Encoder(channels, buffer.sampleRate, 128);
  const sampleBlockSize = 1152;
  const mp3Chunks: Uint8Array[] = [];

  const floatToInt16 = (f32: Float32Array): Int16Array => {
    const i16 = new Int16Array(f32.length);
    for (let i = 0; i < f32.length; i++) {
      const s = Math.max(-1, Math.min(1, f32[i]));
      i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return i16;
  };

  const left = floatToInt16(buffer.getChannelData(0));
  const right = channels > 1 ? floatToInt16(buffer.getChannelData(1)) : left;

  for (let i = 0; i < left.length; i += sampleBlockSize) {
    const leftChunk = left.subarray(i, i + sampleBlockSize);
    const rightChunk = right.subarray(i, i + sampleBlockSize);
    const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf && mp3buf.length > 0) {
      mp3Chunks.push(new Uint8Array(mp3buf));
    }
  }

  const flushBuf = encoder.flush();
  if (flushBuf && flushBuf.length > 0) {
    mp3Chunks.push(new Uint8Array(flushBuf));
  }

  return new Blob(mp3Chunks as unknown as BlobPart[], { type: 'audio/mp3' });
}

// 3. WebM / OGG Audio Encoder via native MediaRecorder
export async function encodeWebMOrOgg(buffer: AudioBuffer, preferredMime: string = 'audio/webm'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const mime = MediaRecorder.isTypeSupported(preferredMime)
        ? preferredMime
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : 'audio/webm';

      const ctx = new AudioContext({ sampleRate: buffer.sampleRate });
      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const dest = ctx.createMediaStreamDestination();
      src.connect(dest);

      const recorder = new MediaRecorder(dest.stream, { mimeType: mime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        ctx.close();
        resolve(new Blob(chunks, { type: mime }));
      };

      recorder.onerror = (err) => {
        ctx.close();
        reject(err);
      };

      recorder.start();
      src.start();

      src.onended = () => {
        setTimeout(() => {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }, 100);
      };
    } catch (err) {
      // Fallback to WAV if MediaRecorder stream fails
      resolve(encodeWAV(buffer));
    }
  });
}

// Universal Audio Export Function supporting WAV, MP3, WEBM, OGG
export async function exportAudioBuffer(
  buffer: AudioBuffer,
  format: string,
  baseFilename: string
): Promise<void> {
  const cleanBase = baseFilename.replace(/\.[^.]+$/, '');
  let blob: Blob;
  let filename: string;

  const fmt = format.toLowerCase();

  if (fmt === 'mp3') {
    try {
      blob = await encodeMP3(buffer);
      filename = `${cleanBase}.mp3`;
    } catch (e) {
      console.warn('MP3 encoding failed, falling back to WAV:', e);
      blob = encodeWAV(buffer);
      filename = `${cleanBase}.wav`;
    }
  } else if (fmt === 'webm') {
    blob = await encodeWebMOrOgg(buffer, 'audio/webm');
    filename = `${cleanBase}.webm`;
  } else if (fmt === 'ogg') {
    blob = await encodeWebMOrOgg(buffer, 'audio/ogg;codecs=opus');
    filename = `${cleanBase}.ogg`;
  } else {
    // Default WAV
    blob = encodeWAV(buffer);
    filename = `${cleanBase}.wav`;
  }

  downloadBlob(blob, filename);
}
