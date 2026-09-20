import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the FixMyFiles team. Report bugs, suggest new tools, or ask questions. We read every message.',
};

/**
 * Contact Page — AdSense requires a contact page.
 * Clean UI with email link and a simple contact form shell.
 */
export default function ContactPage() {
  return (
    <ProseLayout title="Contact Us" subtitle="We read every message">
      <p>
        Have a question? Found a bug? Want to suggest a new tool? Or maybe you just want to say hi.
        Whatever the reason, I&apos;d love to hear from you.
      </p>

      {/* Quick Contact Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 not-prose">
        {/* Email Card */}
        <a
          href="mailto:support@fixmyfiles.app"
          className="group flex items-start gap-4 rounded-xl border border-white/10 bg-zinc-900/50 p-5 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">Email Us</p>
            <p className="text-sm text-blue-400 mt-0.5">support@fixmyfiles.app</p>
          </div>
        </a>

        {/* Response Time Card */}
        <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">Response Time</p>
            <p className="text-sm text-zinc-400 mt-0.5">Usually within 24–48 hours</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
          <h2 className="!mt-0 !mb-0">Send a Message</h2>
        </div>

        <form
          action="mailto:support@fixmyfiles.app"
          method="POST"
          encType="text/plain"
          className="space-y-5 not-prose"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Ahmed"
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Your Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              placeholder="Tell me what's on your mind..."
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors resize-y"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Send Message
          </button>
        </form>

        <p className="mt-4 text-xs text-zinc-600">
          This opens your default email client. If you prefer, you can also email us directly at{' '}
          <a href="mailto:support@fixmyfiles.app" className="text-blue-400">
            support@fixmyfiles.app
          </a>.
        </p>
      </div>
    </ProseLayout>
  );
}
