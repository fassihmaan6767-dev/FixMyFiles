import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { GlassmorphismClient } from './glassmorphism-client';

const toolConfig = TOOL_SEO_CONFIG['/dev/glassmorphism'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function GlassmorphismPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/dev/glassmorphism" config={toolConfig} />
      <GlassmorphismClient />
    </>
  );
}
