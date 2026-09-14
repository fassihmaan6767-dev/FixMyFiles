import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { JsonFormatterClient } from './json-formatter-client';

const toolConfig = TOOL_SEO_CONFIG['/dev/json'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function JsonFormatterPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/dev/json" config={toolConfig} />
      <JsonFormatterClient />
    </>
  );
}
