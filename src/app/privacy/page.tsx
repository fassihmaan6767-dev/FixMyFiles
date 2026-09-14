import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read how FixMyFiles protects your privacy. All file processing happens in your browser — we never see your files.',
};

/**
 * Privacy Policy Page
 * Uses exact human-written content provided in the brief.
 */
export default function PrivacyPage() {
  return (
    <ProseLayout title="Privacy Policy" subtitle="Last Updated: September 2026">
      <p>
        At <strong>FixMyFiles</strong>, your privacy isn&apos;t just an afterthought — it&apos;s
        the core feature of our platform. We built this website to give you peace of mind while
        editing your personal files.
      </p>

      <h2>How We Handle Your Files (The &quot;No-Upload&quot; Promise)</h2>
      <p>
        The most important thing you need to know is this: <strong>We do not collect, store, or
        see the files you process using our tools.</strong> Our tools are built using client-side
        processing. This means all the editing happens locally on your own device. Because your
        files are never uploaded to our servers, there is absolutely zero risk of data leaks from
        our end.
      </p>

      <h2>Information We Do Collect</h2>
      <p>
        While we don&apos;t touch your files, we collect basic, non-personally identifiable
        information (via standard analytics) to keep the website running, see which tools are
        popular, and understand general geographic data.
      </p>

      <h2>Advertising and Cookies</h2>
      <p>
        To keep FixMyFiles 100% free, we use Google AdSense. Google uses cookies (including
        DoubleClick) to serve ads based on your prior visits. You can opt out of personalized
        advertising by visiting{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google&apos;s Ads Settings
        </a>.
      </p>

      <h2>Contact Us</h2>
      <p>
        Reach out at{' '}
        <a href="mailto:contact@fixmyfiles.com">contact@fixmyfiles.com</a>{' '}
        for any data queries.
      </p>
    </ProseLayout>
  );
}
