import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { AudioTranscriptClient } from './audio-transcript-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/transcript'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function AudioTranscriptPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/transcript" config={toolConfig} />
      <AudioTranscriptClient />
      <ToolArticleSection
        toolName="Audio Transcriber"
        whatIs={[
          'Transcribing voice recordings, interviews, podcasts, or lectures by hand is tedious and exhausting. Most online transcription tools lock you behind expensive subscriptions, limit audio minutes, or produce unformatted walls of text without synced playback.',
          'FixMyFiles Transcriber is powered by Groq Whisper Large v3 Turbo—the fastest speech-to-text inference engine available. It features an interactive Spotify-style synced lyrics viewer, full global language selection (including Roman Urdu and Hinglish), and instant export to timestamped SRT, VTT, and TXT files.',
        ]}
        howToSteps={[
          'Upload your audio or video file (MP3, WAV, MP4, M4A, WebM, FLAC, and MOV formats are supported).',
          'Select your target language from the global language dropdown, or choose Auto-Detect or Roman Urdu / Hinglish.',
          'Click "Start Transcription" to initiate inference with Groq Whisper Large v3 Turbo.',
          'Enjoy the Spotify-style synced lyrics viewer with real-time highlighting, click-to-seek, and one-click resyncing.',
          'Export your transcript as plain text or timed SRT / VTT subtitle captions for video editing.',
        ]}
        privacyInfo={[
          'Audio privacy is paramount. When using FixMyFiles Transcriber, audio files are processed ephemerally solely to perform inference via Groq AI. No files are stored or used for training, and memory buffers are purged as soon as transcription completes.',
        ]}
        faqs={[
          {
            question: 'How fast is Groq Whisper Large v3 Turbo?',
            answer:
              'Groq Whisper Large v3 Turbo delivers up to 216x real-time speed. A 10-minute audio file is typically transcribed in just a few seconds.',
          },
          {
            question: 'What languages are supported?',
            answer:
              'Over 70+ global languages are supported including English, Urdu, Hindi, Spanish, Arabic, French, German, and Japanese, alongside custom Roman Urdu / Hinglish Latin script transcription.',
          },
          {
            question: 'How does the Spotify synced lyrics mode work?',
            answer:
              'As your audio or video plays, the corresponding transcript segment highlights automatically and scrolls into view. If you scroll away manually, a floating Sync button lets you snap right back to the active playback line.',
          },
          {
            question: 'Can I export subtitles for YouTube or video editors?',
            answer:
              'Yes! You can download standard SRT or WebVTT caption files with microsecond-accurate timestamps ready for YouTube, Premiere Pro, DaVinci Resolve, or Final Cut Pro.',
          },
        ]}
      />
    </>
  );
}
