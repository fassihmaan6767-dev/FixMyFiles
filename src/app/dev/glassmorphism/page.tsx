import type { Metadata } from 'next';
import { SoftwareAppSchemaMarkup } from '@/components/seo/schema-markup';
import { TOOL_SEO_CONFIG } from '@/lib/tool-seo-config';
import { ToolArticleSection } from '@/components/ui/tool-article-section';
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
      <ToolArticleSection
        toolName="Glassmorphism Generator"
        whatIs={[
          'CSS frosted glass looks stunning in modern interfaces, but dialing in the code by hand is a massive headache. You tweak backdrop blur, mess with alpha channels in RGBA colors, add subtle border highlights, and refresh your browser twenty times just to see if the contrast holds up. Miss one vendor prefix like -webkit-backdrop-filter, and your sleek frosted card turns into an opaque gray rectangle on Safari.',
          'I built this generator so frontend devs and designers can stop guessing values in DevTools. You get visual sliders for blur depth, surface opacity, saturation boost, and border outline, all updating live against colorful backdrop elements. When the look clicks, you grab clean CSS that drops straight into your project without extra dependencies.',
        ]}
        howToSteps={[
          'Adjust the Blur slider to set how heavily the background elements behind your card are softened.',
          'Tweak the Opacity and choose a Background Color to balance transparency against text readability.',
          'Use the Saturation slider to make vibrant colors behind the glass pop or stay subtle.',
          'Refine the Border Opacity and Border Radius to give your card a crisp, glowing glass edge.',
          'Check your card against the live gradient preview to ensure your content stands out.',
          'Click "Copy CSS" to grab the production-ready code with vendor prefixes included.',
        ]}
        privacyInfo={[
          'Everything in this tool runs completely inside your browser. No styles, color choices, or layout data get transmitted to a remote server or stored in a database. Your design ideas stay on your machine.',
          'Because the generator is built entirely with client-side JavaScript, it calculates RGBA values and renders your preview instantly with zero network lag. You can disconnect from Wi-Fi or work completely offline, and the sliders, live preview, and CSS clipboard will keep working without a hitch.',
        ]}
        faqs={[
          {
            question: 'What is glassmorphism in web design?',
            answer:
              'Glassmorphism is a UI style that mimics translucent frosted glass. It combines a semi-transparent background, background blur (backdrop-filter), and a faint border highlight to create a layered, floating effect that lets colors behind the element bleed through softly.',
          },
          {
            question: 'Does this CSS work across all major browsers?',
            answer:
              'Yes. Modern versions of Chrome, Firefox, Safari, and Edge fully support backdrop-filter. The generated snippet automatically includes -webkit-backdrop-filter so your frosted cards render properly on iOS Safari and macOS WebKit browsers without unexpected fallback issues.',
          },
          {
            question: 'Can I adapt this effect for dark mode interfaces?',
            answer:
              'Definitely. Instead of white, pick a dark tint like #000000 or a deep navy #0f172a for the background color, and keep opacity between 15% and 35%. Pair it with light text and a delicate border highlight to create a sleek dark-mode glass panel.',
          },
          {
            question: 'How do I add this generated CSS to Tailwind or plain CSS?',
            answer:
              'For standard CSS, paste the copied rules directly into your class or ID selector. If you use Tailwind CSS, you can apply equivalent utility classes like bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl to achieve the exact same frosted appearance.',
          },
        ]}
      />
    </>
  );
}
