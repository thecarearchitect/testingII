import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';

const COUNT_KEY  = 'waitlist:count';
const EMAILS_KEY = 'waitlist:emails';
const LIMIT      = 100;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    const count = (await kv.get<number>(COUNT_KEY)) ?? 0;
    return Response.json({ count, limit: LIMIT });
  } catch {
    return Response.json({ error: 'KV nicht erreichbar.' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return Response.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    const sanitized = email.trim().toLowerCase();

    const alreadyExists = await kv.sismember(EMAILS_KEY, sanitized);
    if (alreadyExists) {
      const count = (await kv.get<number>(COUNT_KEY)) ?? 0;
      return Response.json({ count, alreadyExists: true });
    }

    await kv.sadd(EMAILS_KEY, sanitized);
    const count = await kv.incr(COUNT_KEY);

    // TODO: E-Mail Bestätigung via Resend wenn Founding Member freigeschaltet

    return Response.json({ count, alreadyExists: false });
  } catch {
    return Response.json({ error: 'Interner Fehler. Bitte erneut versuchen.' }, { status: 500 });
  }
}
