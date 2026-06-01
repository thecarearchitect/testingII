import Anthropic from '@anthropic-ai/sdk';
import { MODES, ModeId } from '@/lib/modes';
import { checkRateLimit } from '@/lib/rateLimiter';
import { NextRequest } from 'next/server';

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Types ──────────────────────────────────────────────────────────────────

interface IncomingAttachment {
  name: string;
  mediaType: 'application/pdf' | 'image/jpeg' | 'image/png';
  data: string; // base64, no prefix
  size: number;
}

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
  attachment?: IncomingAttachment;
}

type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }
  | { type: 'image'; source: { type: 'base64'; media_type: 'image/jpeg' | 'image/png'; data: string } };

function toAnthropicMessages(messages: IncomingMessage[]) {
  return messages.map((m) => {
    if (m.role === 'assistant' || !m.attachment) {
      return { role: m.role as 'user' | 'assistant', content: m.content };
    }

    const blocks: ContentBlock[] = [];

    if (m.attachment.mediaType === 'application/pdf') {
      blocks.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: m.attachment.data },
      });
    } else {
      blocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: m.attachment.mediaType as 'image/jpeg' | 'image/png',
          data: m.attachment.data,
        },
      });
    }

    if (m.content) blocks.push({ type: 'text', text: m.content });

    return { role: 'user' as const, content: blocks };
  });
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API-Schlüssel fehlt. Bitte ANTHROPIC_API_KEY in den Vercel-Umgebungsvariablen hinterlegen.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Du hast das aktuelle Anfrage-Limit erreicht. Bitte versuche es später erneut.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, modeId, userSettings } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const mode = MODES.find((m) => m.id === (modeId as ModeId)) ?? MODES[0];

    const personalBlock = userSettings?.personalContext?.trim()
      ? `\n\n---\nPERSÖNLICHER KONTEXT DES NUTZERS:\n${userSettings.personalContext.trim()}\n\nBerücksichtige diesen Kontext in allen Antworten. Beziehe dich darauf, wo es sinnvoll ist.`
      : '';

    const instructionsBlock = userSettings?.customInstructions?.trim()
      ? `\n\nEIGENE ANWEISUNGEN DES NUTZERS:\n${userSettings.customInstructions.trim()}\n\nHalte dich strikt an diese Anweisungen.`
      : '';

    const systemPrompt = `${mode.systemPrompt}${personalBlock}${instructionsBlock}

---
Formatierungshinweise:
- Strukturiere längere Antworten mit klaren Absätzen
- Nutze Listen (mit Bindestrichen) für Aufzählungen
- Hebe wichtige Begriffe mit **Fettschrift** hervor
- Bei Musterbriefen: vollständig und direkt verwendbar formatieren
- Bleibe sachlich, empathisch und lösungsorientiert`;

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: toAnthropicMessages(messages as IncomingMessage[]) as any,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Fehler bei der KI-Anfrage. Bitte versuche es erneut.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
