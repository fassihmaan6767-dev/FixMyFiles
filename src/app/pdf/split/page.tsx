import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
import { PdfSplitClient } from './pdf-split-client';

const toolConfig = TOOL_SEO_CONFIG['/pdf/split'];

export const metadata: Metadata = {
  title: toolConfig.title,
  description: toolConfig.description,
  keywords: toolConfig.keywords,
};

export default function PdfSplitPage() {
  return (
    <>
      <SoftwareAppSchemaMarkup toolPath="/pdf/split" config={toolConfig} />
      <PdfSplitClient />
      <ToolArticleSection
        toolName="PDF Splitter"
        whatIs={[
          'Ever had a 50-page document where you only needed page 7, or a scanned contract where you had to pull out just the signature page? Most online PDF tools force you to upload sensitive files to remote servers, wait in an upload queue, and cross your fingers that your private documents aren\'t stored indefinitely.',
          'Blind splitting is just as frustrating. Typing arbitrary page numbers like "4-8, 12, 19" into a blank text box without seeing what is on those pages is pure guesswork. One tiny typo and you end up sending the wrong invoice or omitting a crucial page.',
          'I built this tool to make splitting documents visual, fast, and private. Every page renders as a sharp thumbnail directly on your screen. You simply click the exact pages you want to keep, verify your selection at a glance, and export a fresh PDF in seconds.',
        ]}
        howToSteps={[
          'Drop your PDF into the upload area above, or click to choose a file from your computer.',
          'Wait a moment while thumbnail previews render for every page in your document.',
          'Click individual page thumbnails to toggle selection, or use "Select All" and "Deselect All".',
          'Review the highlighted page cards and page count to confirm you have picked the right sheets.',
          'Click the "Extract Pages" button to immediately download your new, focused PDF.',
        ]}
        privacyInfo={[
          'Your documents never leave your computer. When you handle bank statements, tax filings, legal agreements, or medical records, uploading them to unfamiliar servers is an unnecessary privacy risk.',
          'This tool operates 100% client-side inside your browser. We render previews with pdfjs-dist and extract pages with pdf-lib directly in your device\'s memory. No files are uploaded to the cloud, no logs are kept, and no data is tracked. You can even disconnect your internet after loading the page and split documents completely offline.',
        ]}
        faqs={[
          {
            question: 'Can I extract just one single page from my PDF?',
            answer:
              'Yes, absolutely. Deselect all pages, click the single thumbnail you need, and export. You will immediately get a clean one-page PDF with all original formatting and selectable text intact.',
          },
          {
            question: 'Will extracting pages reduce visual quality or text sharpness?',
            answer:
              'Not at all. This tool does not convert pages into compressed images or rasterize text. It extracts the raw PDF objects, vector paths, and embedded fonts directly, so quality remains 100% identical to the original.',
          },
          {
            question: 'Can I split a large document into multiple separate files?',
            answer:
              'Yes. You can select any group of pages and export them. To split a book or report into chapters, pick the pages for chapter one and export, then select chapter two and export again.',
          },
          {
            question: 'Is there a limit on file size or number of pages?',
            answer:
              'There are no arbitrary cloud limits or paywalls here. Processing depends only on your computer\'s available memory. Documents with dozens or hundreds of pages split quickly on modern browsers.',
          },
        ]}
      />
    </>
  );
}
