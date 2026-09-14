import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { AudioTrimmerClient } from './audio-trimmer-client';

const toolConfig = TOOL_SEO_CONFIG['/audio/trimmer'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function AudioTrimmerPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/audio/trimmer" config={toolConfig} />
      <AudioTrimmerClient />
    </>
  );
}
