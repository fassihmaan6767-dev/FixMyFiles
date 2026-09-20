import type { Metadata } from 'next';
import { ProseLayout } from '@/components/layout/prose-layout';

export const metadata: Metadata = {
  title: 'About Us — Our Story',
  description:
    'FixMyFiles was built out of frustration with slow, ad-heavy file converters that upload your files to unknown servers. Here is why we do things differently.',
};

/**
 * About Page — Humanized personal story for AdSense approval.
 * Written in first-person, conversational tone from the developer.
 */
export default function AboutPage() {
  return (
    <ProseLayout title="About FixMyFiles" subtitle="The story behind the tools">
      <h2>It Started With a Simple Problem</h2>
      <p>
        A couple of years ago, I needed to trim a voice note. Just chop off the first few seconds
        and save it. Should take ten seconds, right? Instead, I spent fifteen minutes bouncing
        between sketchy websites — each one plastered with pop-ups, begging me to sign up, or
        uploading my file to who-knows-where before I could do anything.
      </p>
      <p>
        I&apos;m a developer. I know that trimming audio is something a browser can do on its own.
        The Web Audio API has been around for years. So I thought: why does every &quot;free online
        tool&quot; insist on sending my files to a server? Most of the time, they don&apos;t even
        need to. They do it because they want to harvest your data, lock you into a subscription,
        or slow things down so the &quot;pro&quot; plan looks attractive.
      </p>
      <p>
        That frustrated me enough to build something better.
      </p>

      <h2>What FixMyFiles Actually Is</h2>
      <p>
        FixMyFiles is a collection of file tools that work <strong>entirely inside your
        browser</strong>. When you trim an audio file here, the processing happens on your computer.
        When you merge two PDFs, the merging happens in your browser&apos;s memory. When you resize
        an image, the Canvas API on your device does the work.
      </p>
      <p>
        Nothing gets uploaded. Nothing leaves your machine. There is no server sitting in some data
        center reading your files. Your stuff stays your stuff.
      </p>
      <p>
        I use technologies like the <strong>Web Audio API</strong> for audio tools,
        the <strong>Canvas API</strong> for image processing,{' '}
        <strong>pdf-lib</strong> for PDF manipulation,{' '}
        <strong>FFmpeg compiled to WebAssembly</strong> for video-to-audio extraction, and even{' '}
        <strong>Whisper AI running locally</strong> for speech-to-text transcription. All of it
        runs right there in your browser tab.
      </p>

      <h2>Why Free? What&apos;s the Catch?</h2>
      <p>
        There is no catch. The site is supported by advertising (Google AdSense), which means I can
        keep every tool completely free without needing your email, your credit card, or your files.
        You get the tool, I get a few cents from an ad. Fair trade.
      </p>
      <p>
        I don&apos;t sell data because I literally don&apos;t have any of your data to sell. Your
        files never touch my servers. The only analytics I use are basic, anonymous traffic stats to
        see which tools are popular so I know what to build next.
      </p>

      <h2>Who Is This For?</h2>
      <p>
        Pretty much anyone who works with files. Students formatting documents for submission.
        Podcasters trimming intros. Content creators cropping profile pictures. Developers
        validating JSON or grabbing a glassmorphism CSS snippet. If you have ever Googled
        &quot;free online [tool] no sign up&quot; — I built this for you.
      </p>

      <h2>What&apos;s Next</h2>
      <p>
        I keep adding new tools based on what people actually ask for. If there&apos;s something you
        need that isn&apos;t here yet, shoot me an email at{' '}
        <a href="mailto:support@fixmyfiles.app">support@fixmyfiles.app</a> — I genuinely read
        every message.
      </p>
      <p>
        Thanks for using FixMyFiles. I hope it saves you the same headache it saved me.
      </p>

      <p className="mt-8 text-zinc-300 italic">
        Keep creating,<br />
        <strong>The FixMyFiles Developer</strong>
      </p>
    </ProseLayout>
  );
}
