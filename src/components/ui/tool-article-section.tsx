import { FaqAccordion } from '@/components/ui/faq-accordion';
import { FAQSchemaMarkup } from '@/components/seo/schema-markup';
import type { FaqItem } from '@/components/ui/faq-accordion';

/**
 * ToolArticleSection
 * Renders a rich-text article below each tool UI to satisfy AdSense "thick content"
 * requirements. Provides humanized explanatory copy, a step-by-step guide,
 * privacy transparency, and an FAQ accordion — all with FAQPage JSON-LD for SEO.
 *
 * This is a Server Component. The FaqAccordion inside it is a Client Component
 * (uses native <details> so hydration is minimal).
 */

interface ToolArticleSectionProps {
  /** The tool name, e.g. "Audio Trimmer" */
  toolName: string;
  /** H2: "What is [Tool Name]?" — paragraphs explaining the problem it solves */
  whatIs: string[];
  /** H2: "How to Use" — ordered step-by-step instructions */
  howToSteps: string[];
  /** H2: "Privacy & Security" — paragraphs about client-side processing */
  privacyInfo: string[];
  /** H2: "Frequently Asked Questions" — accordion items */
  faqs: FaqItem[];
}

export function ToolArticleSection({
  toolName,
  whatIs,
  howToSteps,
  privacyInfo,
  faqs,
}: ToolArticleSectionProps) {
  return (
    <>
      <FAQSchemaMarkup faqs={faqs} />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="prose-custom">
          {/* --- What is this tool? --- */}
          <h2>What Is the {toolName}?</h2>
          {whatIs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {/* --- How to use --- */}
          <h2>How to Use the {toolName}</h2>
          <ol>
            {howToSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {/* --- Privacy & Security --- */}
          <h2>Why This Is 100% Private &amp; Secure</h2>
          {privacyInfo.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {/* --- FAQs --- */}
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="mt-2">
          <FaqAccordion items={faqs} />
        </div>
      </article>
    </>
  );
}
