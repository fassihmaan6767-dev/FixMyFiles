import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { StereoToMonoClient } from './stereo-to-mono-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/mono'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function StereoToMonoPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/mono" config={toolConfig} />
      <StereoToMonoClient />
      <ToolArticleSection
        toolName="Stereo to Mono Converter"
        whatIs={[
          'Ever listen to a podcast or voice recording with headphones and realize one speaker is stuck in your left ear while the other is stranded on the right? Or maybe you played a track through a single speaker, and half the instruments vanished. That happens when audio is panned hard across two stereo channels instead of balanced properly.',
          'This tool fixes that imbalance in seconds. It reads both audio channels, sums them, and calculates the exact average across a single channel. The result is a clean, centered mono file where every voice and instrument sounds balanced on any speaker or headphone setup.',
          'No bloated software or audio plugins needed. Drop your track in, choose your output format, and your browser handles the channel math instantly.',
        ]}
        howToSteps={[
          'Drop your audio file into the box above, or click to select a track (MP3, WAV, OGG, and FLAC supported).',
          'Check the file summary to view channel count, sample rate, and duration.',
          'Choose your export format: WAV for lossless audio, or MP3, OGG, or WebM for smaller file sizes.',
          'Click "Convert to Mono" to merge the stereo channels into a single balanced stream.',
          'The converted mono track downloads automatically to your device.',
        ]}
        privacyInfo={[
          "Most online audio converters upload your files to remote servers. That means private voice notes, raw podcasts, or client recordings end up stored on somebody else's machine. I built this tool so all audio rendering happens directly inside your web browser using the Web Audio API.",
          'Your files never leave your computer. There are no server uploads, no waiting queues, and zero tracking. You can even disconnect your internet after loading the page and convert files completely offline.',
        ]}
        faqs={[
          {
            question: 'Why should I convert stereo audio to mono?',
            answer:
              'Mono gives you uniform sound across all playback gear. It fixes awkward hard-panned podcast interviews, stops instruments from disappearing on single-speaker systems like phones or smart speakers, and helps listeners with single-ear hearing.',
          },
          {
            question: 'Does converting to mono cut file size in half?',
            answer:
              'For uncompressed WAV files, yes. Stereo stores two separate audio channels, while mono stores one, cutting raw audio data in half. For compressed formats like MP3 or OGG, size depends on bitrate, though mono encodes much more efficiently.',
          },
          {
            question: 'Will converting stereo to mono hurt audio quality?',
            answer:
              'No. The conversion calculates a clean mathematical average: (Left + Right) / 2. Unless your original recording had severe out-of-phase stereo effects that cancel out when combined, your audio will sound clear, full, and punchy.',
          },
          {
            question: 'What audio formats are supported?',
            answer:
              'You can import MP3, WAV, OGG, FLAC, and AAC files. For export, you can save your new mono audio as WAV, MP3, WebM, or OGG.',
          },
        ]}
      />
    </>
  );
}
