import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms and conditions for using FixMyFiles free online file tools. Clear, fair, and written in plain English.',
};

/**
 * Terms of Service Page — Expanded with clearer sections,
 * third-party acknowledgements, and human-friendly language.
 */
export default function TermsPage() {
  return (
    <ProseLayout title="Terms of Service" subtitle="Last Updated: September 2026">
      <p>
        Welcome to FixMyFiles. By using this website, you agree to the following terms. We&apos;ve
        kept them short, clear, and written in plain English — because nobody enjoys reading legal
        jargon.
      </p>

      <h2>1. Free to Use</h2>
      <p>
        All tools on FixMyFiles are completely free for both personal and commercial use. There are
        no hidden fees, no premium tiers, and no feature locks. You do not need to create an account
        or provide any personal information to use our tools.
      </p>

      <h2>2. Your Files, Your Property</h2>
      <p>
        You retain full ownership of every file you process using FixMyFiles. We do not claim any
        rights over your content. Since all processing happens locally in your browser, we never
        have access to your files in the first place. What you bring in is yours — what you take out
        is yours.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>
        You agree not to use FixMyFiles for any unlawful purpose. Specifically, you agree not to:
      </p>
      <ul>
        <li>Use our tools to process files that contain illegal content</li>
        <li>Attempt to reverse-engineer, decompile, or extract the source code of our tools</li>
        <li>Use automated bots, scrapers, or similar tools to abuse or overload the website</li>
        <li>Interfere with the normal functioning of the site for other users</li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>
        FixMyFiles uses <strong>Google AdSense</strong> to display advertisements, which helps us
        keep the tools free. Google may use cookies and tracking technologies as described in
        our <a href="/privacy">Privacy Policy</a>. By using this site, you acknowledge that
        third-party ad services operate alongside our tools.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        FixMyFiles is provided <strong>&quot;as is&quot;</strong> and{' '}
        <strong>&quot;as available&quot;</strong> without warranties of any kind, either express or
        implied. While we do our best to keep everything working smoothly, we cannot guarantee that:
      </p>
      <ul>
        <li>The tools will be available 100% of the time without interruption</li>
        <li>The output will always be perfectly error-free</li>
        <li>The tools will meet every specific requirement you might have</li>
      </ul>
      <p>
        <strong>Always keep backups of your original files.</strong> We are not responsible for any
        data loss that may occur while using our tools.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, FixMyFiles and its developer(s) shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages resulting from
        your use of (or inability to use) the website or its tools. This includes, but is not
        limited to, damages for loss of data, revenue, or profits.
      </p>

      <h2>7. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time as we add new tools or features. When we make
        changes, we will update the &quot;Last Updated&quot; date at the top of this page. Your
        continued use of FixMyFiles after any changes means you accept the updated terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These terms are governed by and construed in accordance with applicable laws. Any disputes
        arising from these terms or your use of FixMyFiles will be resolved in the appropriate
        courts of the jurisdiction in which the site operator resides.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms? Reach out at{' '}
        <a href="mailto:support@fixmyfiles.app">support@fixmyfiles.app</a> — we are always happy
        to clarify.
      </p>
    </ProseLayout>
  );
}
