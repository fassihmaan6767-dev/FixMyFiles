import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'FixMyFiles processes every file locally in your browser. We never upload, store, or access your files. Read our full privacy policy including Google AdSense disclosures.',
};

/**
 * Privacy Policy Page — AdSense-compliant with DART cookie disclosure,
 * GDPR/CCPA user rights, and repeated "no-upload" USP.
 */
export default function PrivacyPage() {
  return (
    <ProseLayout title="Privacy Policy" subtitle="Last Updated: September 2026">
      <p>
        At <strong>FixMyFiles</strong>, privacy is not a marketing buzzword — it&apos;s the entire
        reason this site exists. We built these tools specifically so you would never have to upload
        personal files to a stranger&apos;s server. Here is exactly how we handle your information.
      </p>

      <h2>The &quot;No-Upload&quot; Promise</h2>
      <p>
        <strong>We do not upload, store, or see your files. Period.</strong>
      </p>
      <p>
        Every tool on FixMyFiles uses client-side processing. That means when you trim an audio file,
        merge a PDF, or resize an image, all the work happens inside your own web browser using
        technologies like the Web Audio API, Canvas, pdf-lib, and WebAssembly. Your files live in
        your device&apos;s RAM while you edit them, and they are discarded the moment you close the
        tab. Nothing is transmitted to our servers — because we don&apos;t have file servers. There is
        zero risk of a data leak on our end because we never had your data in the first place.
      </p>

      <h2>Information We Do Collect</h2>
      <p>
        We do not collect any personally identifiable information. However, like most websites, we
        use basic analytics to understand how visitors use the site — things like which tools are
        popular, what countries our visitors come from, and how long people stay on a page. This data
        is aggregated and anonymous. We cannot use it to identify you individually.
      </p>

      <h2>Google AdSense &amp; Cookies</h2>
      <p>
        To keep FixMyFiles 100% free, we display advertisements through{' '}
        <strong>Google AdSense</strong>. Google and its ad partners may use cookies — including
        the <strong>DoubleClick DART cookie</strong> — to serve ads based on your browsing history
        across websites. These cookies allow Google to show you more relevant ads.
      </p>
      <p>
        <strong>Important things to know about these cookies:</strong>
      </p>
      <ul>
        <li>
          Google uses the DART cookie to serve ads based on your visits to FixMyFiles and other
          websites on the internet.
        </li>
        <li>
          These cookies do <strong>not</strong> track or access the files you process using our
          tools. Your files are never involved in advertising in any way.
        </li>
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on your prior visits
          to this and other websites.
        </li>
        <li>
          You can opt out of personalized advertising at any time by visiting{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google&apos;s Ads Settings
          </a>.
        </li>
        <li>
          You can also opt out of third-party vendor cookies for personalized advertising by visiting{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>.
        </li>
      </ul>

      <h2>Your Rights (GDPR &amp; CCPA)</h2>
      <p>
        If you are a resident of the European Economic Area (EEA) or California, you have specific
        rights regarding your personal data:
      </p>
      <ul>
        <li>
          <strong>Right to Access:</strong> You can request to know what personal data (if any) we
          hold about you. In our case, we hold none — your files are never stored.
        </li>
        <li>
          <strong>Right to Deletion:</strong> You can request deletion of your data. Since we do not
          store user files or personal data, there is nothing to delete on our end.
        </li>
        <li>
          <strong>Right to Opt-Out:</strong> You may opt out of the sale or sharing of personal
          information. We do not sell personal information. For cookie preferences, use the cookie
          consent banner on our site or visit Google&apos;s Ads Settings linked above.
        </li>
        <li>
          <strong>Right to Non-Discrimination:</strong> We will not treat you differently for
          exercising any of your privacy rights.
        </li>
      </ul>

      <h2>Children&apos;s Privacy</h2>
      <p>
        FixMyFiles is not directed at children under 13. We do not knowingly collect personal
        information from children. If you believe a child has provided us with personal data,
        please contact us so we can take appropriate action.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. When we do, we will revise the
        &quot;Last Updated&quot; date at the top of this page. We encourage you to check back
        periodically.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this privacy policy or how we handle data, reach out at{' '}
        <a href="mailto:support@fixmyfiles.app">support@fixmyfiles.app</a>. We are happy to
        answer any concerns.
      </p>
    </ProseLayout>
  );
}
