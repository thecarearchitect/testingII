import Anthropic from '@anthropic-ai/sdk';
import { MODES, ModeId } from '@/lib/modes';
import { NextRequest } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, modeId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const mode = MODES.find((m) => m.id === (modeId as ModeId)) ?? MODES[0];

    const systemPrompt = `${mode.systemPrompt}

Formatierungshinweise:
- Strukturiere längere Antworten mit klaren Absätzen
- Nutze Listen (mit Bindestrichen) für Aufzählungen
- Hebe wichtige Begriffe mit **Fettschrift** hervor
- Bei Musterbriefen: Formatiere sie klar und vollständig
- Bleibe immer sachlich, empathisch und lösungsorientiert`;

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
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
