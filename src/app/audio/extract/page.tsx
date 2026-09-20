import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ExtractAudioClient } from './extract-audio-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/extract'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function ExtractAudioPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/extract" config={toolConfig} />
      <ExtractAudioClient />
      <ToolArticleSection
        toolName="Audio Extractor"
        whatIs={[
          'Ever recorded a lecture, saved a webinar, or captured a video on your phone just for the speech or music? Keeping bulky video files around eats up storage fast. When you only need the audio for a podcast, study notes, or background listening, dragging a whole video into a heavyweight editing program feels like overkill. Worse, most online converters make you upload your private footage to remote servers, wait in line behind paying subscribers, and risk your privacy.',
          'I built this audio extractor to get rid of that hassle. You drop your video file into the browser, pick whether you want a lightweight MP3 or an uncompressed WAV, and pull out the audio track in seconds. It runs locally on your hardware. There is no software to install, no watermark stamped onto your file, and no account signup. Just a fast, straightforward tool to grab your audio and keep moving.',
        ]}
        howToSteps={[
          'Drop your MP4, WebM, or MOV video into the drop zone, or browse to select it from your device.',
          'Choose your target audio format: MP3 for a smaller file size or WAV for lossless sound quality.',
          'Click the "Extract Audio" button to start separating the soundtrack from the video.',
          'Keep an eye on the progress bar while your browser decodes and converts the audio.',
          'Download the extracted audio file straight to your local storage once processing finishes.',
        ]}
        privacyInfo={[
          'Most web converters upload your files to remote cloud servers for transcoding. That means strangers could theoretically access your personal video recordings, family memories, or sensitive workplace presentations. I think that architecture is flawed and unnecessarily risky. This tool runs entirely on your device using WebAssembly technology.',
          "Your video stays in your browser's private memory sandbox throughout the whole process. Not a single byte ever travels over the internet to my servers or anyone else's. The moment you close or refresh this tab, all temporary data is instantly cleared from memory. Your files remain strictly yours.",
        ]}
        faqs={[
          {
            question: 'What video formats can I extract audio from?',
            answer:
              'You can extract audio from MP4, WebM, and MOV files. These three cover almost every video recorded on iPhones, Android phones, modern cameras, and screen recording software.',
          },
          {
            question: 'Does extracting the audio reduce its original sound quality?',
            answer:
              'If you select WAV, no quality is lost because WAV preserves uncompressed audio. If you pick MP3, it uses a high-bitrate encoder that keeps audio crisp while drastically reducing file size.',
          },
          {
            question: 'Why does the browser download a file the first time I use this?',
            answer:
              'To process video without a backend server, the page loads FFmpeg compiled to WebAssembly (about 25MB). It downloads once, caches in your browser, and works even when you are offline.',
          },
          {
            question: 'How long does audio extraction take?',
            answer:
              "Most short clips finish in a few seconds. Because conversion uses your computer's own processor rather than a remote cloud server, extraction speed depends directly on file size and your device speed.",
          },
        ]}
      />
    </>
  );
}
