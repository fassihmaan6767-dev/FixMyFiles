import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { SilenceRemoverClient } from './silence-remover-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/silence-remover'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function SilenceRemoverPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/silence-remover" config={toolConfig} />
      <SilenceRemoverClient />
      <ToolArticleSection
        toolName="Audio Silence Remover"
        whatIs={[
          'Editing raw voice recordings can be tedious. If you record podcasts, voiceovers, or lectures, you know the grind: scrubbing through an audio timeline just to snip out dead air, long hesitations, and awkward pauses. Doing that manually takes forever and drains your creative energy.',
          'I built this silence remover to handle that repetitive grunt work in seconds. The tool scans your audio track, spots gaps below your chosen volume level, and trims them away cleanly. You get tight, snappy dialogue without losing the natural rhythm of your speech.',
          'You stay in full control. Tweak the sensitivity threshold in decibels and set a minimum gap duration, so natural breaths stay intact while lengthy dead pauses disappear.',
        ]}
        howToSteps={[
          'Drop your audio file into the box above, or select one from your computer.',
          'Set the Silence Threshold slider to match your room noise—lower for quiet studio mics or higher if there is slight background hum.',
          'Adjust the Min Silence Duration slider to choose how long a pause must last before getting cut.',
          'Select your export format (WAV, MP3, WebM, or OGG) and click "Remove Silence & Export".',
          'Review your time-saved stats and download the tightened track instantly.',
        ]}
        privacyInfo={[
          'Your audio never leaves your computer. Typical online editors send your tracks to remote cloud servers to process them. That wastes bandwidth, slows you down, and exposes private recordings or client work to third-party machines.',
          'This tool runs entirely in your browser through the Web Audio API. Your device processes the raw sound data in local memory, cuts quiet gaps, and exports your file directly. No uploads, no server logs, and zero tracking. It even works offline.',
        ]}
        faqs={[
          {
            question: 'How does it detect silence?',
            answer:
              'The tool analyzes your track\'s raw audio amplitude via the Web Audio API. Any section staying below your chosen decibel threshold for longer than your minimum duration setting is sliced out.',
          },
          {
            question: 'Can I adjust what counts as silence?',
            answer:
              'Yes, with the Silence Threshold slider. The default -40 dB works well for normal speech. If you have background noise like computer fans, raise it toward -30 dB. For treated studio rooms, drop it to -50 dB.',
          },
          {
            question: 'Will it remove natural pauses in speech?',
            answer:
              'Only if your minimum duration is set too low. Keeping the duration between 300 ms and 500 ms preserves natural conversational rhythm while eliminating dead air and long pauses.',
          },
          {
            question: 'Does it work with music?',
            answer:
              'It is designed primarily for spoken voice like podcasts and voiceovers. Music usually has lingering reverb and background instrumentation that rarely drops below the silence threshold, so results will vary.',
          },
        ]}
      />
    </>
  );
}
