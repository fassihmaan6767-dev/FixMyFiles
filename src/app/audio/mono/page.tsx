import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
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
    </>
  );
}
