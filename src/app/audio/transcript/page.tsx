import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
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
    </>
  );
}
