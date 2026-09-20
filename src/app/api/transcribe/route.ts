import { NextRequest, NextResponse } from 'next/server';

/**
 * Groq Whisper API Proxy Route
 * FixMyFiles.app — whisper-large-v3 Transcription
 *
 * Handles:
 * - Forwarding audio payload to Groq API with verbose_json
 * - Extracting exact `retry-after` header on HTTP 429 Rate Limits
 * - Fallback error parsing for dynamic retry seconds
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GROQ_API_KEY is not configured on the server. Please add your Groq API key to .env.local to enable whisper-large-v3-turbo transcription.',
        },
        { status: 500 }
      );
    }

    const incomingFormData = await request.formData();
    const file = incomingFormData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No audio or video file provided in the request.' },
        { status: 400 }
      );
    }

    // Build Groq API payload
    const groqFormData = new FormData();
    const filename = (file as File).name || 'audio.mp3';
    groqFormData.append('file', file, filename);
    groqFormData.append('model', 'whisper-large-v3-turbo');
    groqFormData.append('response_format', 'verbose_json');

    // Handle Language & Prompt Logic
    const language = incomingFormData.get('language') as string | null;
    const clientPrompt = incomingFormData.get('prompt') as string | null;

    if (language === 'roman_urdu_hinglish') {
      // Omit language parameter for Roman Urdu / Hinglish, inject strict phonetic prompt
      const strictRomanPrompt =
        'Transcribe the audio exactly as spoken. Force the output entirely in Roman Urdu/Hinglish script.';
      const finalPrompt = clientPrompt
        ? `${strictRomanPrompt} ${clientPrompt}`
        : strictRomanPrompt;
      groqFormData.append('prompt', finalPrompt);
    } else {
      // Standard ISO language code (e.g., 'ur', 'es', 'fr', 'en')
      if (language && language !== 'auto') {
        groqFormData.append('language', language);
      }
      if (clientPrompt) {
        groqFormData.append('prompt', clientPrompt);
      }
    }

    // Dispatch to Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    // ─── PART 1: Handle 429 Rate Limit & Extract retry-after ───────────────────
    if (groqResponse.status === 429) {
      // 1. Read retry-after header
      const retryAfterHeader = groqResponse.headers.get('retry-after');
      let retryAfter = 60; // Default fallback 60 seconds

      if (retryAfterHeader) {
        const parsed = parseInt(retryAfterHeader, 10);
        if (!isNaN(parsed) && parsed > 0) {
          retryAfter = parsed;
        }
      }

      // 2. Inspect Groq error body for exact wait time (e.g. "Please try again in 14.2s")
      try {
        const errorJson = await groqResponse.json();
        const msg = errorJson?.error?.message;
        if (msg) {
          const match = msg.match(/try again in ([\d\.]+)s/i);
          if (match && match[1]) {
            retryAfter = Math.ceil(parseFloat(match[1]));
          }
        }
      } catch {
        // Body was not JSON, fallback to header or 60s
      }

      console.warn(`[Groq Rate Limit] 429 encountered. Client must wait ${retryAfter}s.`);

      return NextResponse.json(
        {
          status: 429,
          error: 'Rate limit reached on Groq free tier.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    // Handle other non-200 responses
    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      let errorMsg = `Groq API responded with HTTP ${groqResponse.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson?.error?.message || errorMsg;
      } catch {}

      return NextResponse.json({ error: errorMsg }, { status: groqResponse.status });
    }

    // Parse and return verbose_json (containing text and segments)
    const result = await groqResponse.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Transcribe route exception:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while transcribing audio' },
      { status: 500 }
    );
  }
}
