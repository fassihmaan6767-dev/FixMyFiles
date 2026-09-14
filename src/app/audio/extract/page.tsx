import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
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
    </>
  );
}
