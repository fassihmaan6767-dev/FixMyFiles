import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about FixMyFiles — fast, free, and private file tools built for the modern web.',
};

/**
 * About Page
 * Uses exact human-written content provided in the brief.
 */
export default function AboutPage() {
  return (
    <ProseLayout title="About FixMyFiles">
      <p>
        Welcome to <strong>FixMyFiles</strong>! Have you ever tried to quickly trim an audio file,
        resize an image, or merge a PDF, only to be forced to sign up for an account, pay a
        subscription, or wait for heavy files to upload to an unknown server?
      </p>
      <p>
        We&apos;ve been there, and it&apos;s frustrating. That&apos;s exactly why we built FixMyFiles.
      </p>
      <p>
        We are a small team of developers dedicated to creating <strong>fast, free, and
        incredibly simple</strong> online tools. Our philosophy is simple: Utility should be
        accessible, and privacy should be guaranteed.
      </p>
      <p>
        Unlike most online tool websites, FixMyFiles uses modern browser technologies. This means
        when you edit a file on our website, <strong>all the processing happens directly inside
        your own web browser</strong>. Your files never leave your device, and they are never
        uploaded to our servers. It&apos;s faster, safer, and 100% private.
      </p>
      <p>
        Whether you are a student formatting a document, a creator trimming a voice note, or a
        developer needing quick UI mockups, our toolkit is designed to save you time and solve
        your digital headaches instantly.
      </p>
      <p className="mt-8 text-zinc-300 italic">
        Keep creating,<br />
        <strong>The FixMyFiles Team</strong>
      </p>
    </ProseLayout>
  );
}
