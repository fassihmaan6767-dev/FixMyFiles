import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using FixMyFiles free online tools.',
};

/**
 * Terms of Service Page
 * Uses exact human-written content provided in the brief.
 */
export default function TermsPage() {
  return (
    <ProseLayout title="Terms of Service" subtitle="Last Updated: September 2026">
      <p>
        By using our website, you agree to these rules.
      </p>

      <h2>Free to Use</h2>
      <p>
        All tools are completely free for personal and commercial purposes. No accounts, no
        hidden fees.
      </p>

      <h2>Acceptable Use</h2>
      <p>
        You agree not to use our tools for malicious activities, reverse-engineer the site, or
        use automated bots to scrape/abuse our processing tools.
      </p>

      <h2>Disclaimer of Warranties</h2>
      <p>
        FixMyFiles is provided &quot;as is&quot;. We do not guarantee tools will be 100%
        error-free. We are not responsible for data loss. Always keep backups of original files.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as we add tools. Check back occasionally.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:contact@fixmyfiles.com">contact@fixmyfiles.com</a>
      </p>
    </ProseLayout>
  );
}
