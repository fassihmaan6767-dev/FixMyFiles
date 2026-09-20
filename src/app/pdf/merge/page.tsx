import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
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
      <ToolArticleSection
        toolName="PDF Merger"
        whatIs={[
          "We have all been there. You have a handful of PDF files—bank statements, signed contracts, receipts, or lecture slides—scattered in your downloads folder. You just want to combine them into a single clean file and send it off. Most online PDF mergers make you upload sensitive files to an unknown server, wait in line, or pay a monthly fee. That felt completely unnecessary.",
          "I built this tool so you can join documents quickly and privately. It runs entirely inside your browser using a lightweight library called pdf-lib. Drop your files in, drag them into the order you want, and click merge. There is no queue, no waiting on server uploads, and no account to create.",
          "Within seconds, your browser binds the pages together and downloads the combined file straight to your machine. Fast, quiet, and hassle-free.",
        ]}
        howToSteps={[
          "Drop your PDF files into the upload box, or click to browse from your device.",
          "Drag the cards up or down to arrange files in your preferred merge order.",
          "Review file names and sizes, removing any accidental additions with the delete button.",
          "Click 'Merge & Download PDF' to combine everything instantly into one document.",
        ]}
        privacyInfo={[
          "When handling contracts, tax paperwork, medical forms, or invoices, privacy is critical. With this tool, your PDFs never leave your device. The code processes your documents directly in browser memory using client-side JavaScript.",
          "No files get uploaded to a cloud server, nothing is saved to remote storage, and no logs are kept. When you close the tab, everything disappears from memory. You can even disconnect your internet after loading the page and it will work without issue.",
        ]}
        faqs={[
          {
            question: "Is there a limit on how many PDFs I can merge?",
            answer:
              "No artificial limits. You can combine as many documents as your computer memory can handle. Merging dozens of files with hundreds of pages takes only seconds.",
          },
          {
            question: "Will merging affect document quality or formatting?",
            answer:
              "Not at all. The tool copies raw PDF page streams directly into the new file. Fonts, vector drawings, form fields, and high-resolution images stay exactly as sharp as the originals.",
          },
          {
            question: "Can I reorder individual pages before merging?",
            answer:
              "You can reorder entire documents by dragging them in the list. The pages within each document stay in their original order. If you need to rearrange specific pages within a single file, try our PDF page organizer.",
          },
          {
            question: "Does it work with password-protected PDFs?",
            answer:
              "If a PDF is encrypted with an open password, the browser cannot read its pages without credentials. You will need to unlock or decrypt the file before adding it here.",
          },
        ]}
      />
    </>
  );
}
