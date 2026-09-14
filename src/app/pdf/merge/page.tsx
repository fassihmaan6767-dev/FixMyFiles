import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { PdfMergeClient } from './pdf-merge-client';

const toolConfig = TOOL_SEO_CONFIG['/pdf/merge'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function PdfMergePage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/pdf/merge" config={toolConfig} />
      <PdfMergeClient />
    </>
  );
}
