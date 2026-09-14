import { HeroSection } from '@/components/home/hero-section';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { FAQSection } from '@/components/home/faq-section';
import { FAQSchemaMarkup } from '@/components/seo/schema-markup';

/**
 * Home Page
 * The stunning landing page combining:
 * 1. Hero Section — animated gradient + CTA
 * 2. Categories Grid — 4 interactive tool category cards
 * 3. FAQ Section — AdSense-friendly accordion
 * 4. FAQPage JSON-LD — structured data for Google rich results & AI bots
 */

/**
 * FAQ data for JSON-LD schema — mirrors the FAQ accordion content.
 * Keeping this at the page level (server component) ensures the JSON-LD
 * renders in the initial HTML for crawlers.
 */
const homepageFaqs = [
  {
    question: 'Is FixMyFiles really free?',
    answer:
      'Yes, 100%! All tools on FixMyFiles are completely free to use for both personal and commercial purposes. There are no hidden fees, no premium tiers, and no account signups required. We sustain the platform through minimal, non-intrusive advertising.',
  },
  {
    question: 'How is my data kept private?',
    answer:
      "Your files never leave your device. Every tool on FixMyFiles uses client-side processing, meaning all file editing happens directly in your browser using technologies like the Web Audio API, HTML5 Canvas, and pdf-lib. We don't have servers that receive your files — it's technically impossible for us to see them. Zero server uploads, 100% privacy guaranteed.",
  },
  {
    question: 'What file formats do you support?',
    answer:
      'We support a wide range of formats across categories. Audio tools handle MP3, WAV, OGG, and more. Image tools work with PNG, JPG, WEBP, and SVG. PDF tools process standard PDF files. Our Dev Tools handle JSON, CSS, and various text formats. We are constantly adding support for new formats.',
  },
  {
    question: 'Do my files get uploaded to any server?',
    answer:
      'Absolutely not. FixMyFiles processes every file 100% in your browser memory using modern Web APIs. Your files are never transmitted over the internet — they stay on your device at all times. This is what makes FixMyFiles the most private file tool platform available.',
  },
  {
    question: 'What browsers are supported?',
    answer:
      'FixMyFiles works on all modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and Brave. For the best experience, we recommend using the latest version of your browser.',
  },
];

export default function HomePage() {
  return (
    <article>
      <FAQSchemaMarkup faqs={homepageFaqs} />
      <HeroSection />
      <CategoriesGrid />
      <FAQSection />
    </article>
  );
}
