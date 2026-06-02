import { NextRequest } from 'next/server';

// TODO: Connect to database (Supabase/Prisma)
// TODO: Add authentication check
//
// To integrate Supabase:
//   import { createClient } from '@supabase/supabase-js'
//   const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
//   await supabase.from('waitlist').insert({ email, created_at: new Date() })
//
// To integrate Resend (transactional email):
//   import { Resend } from 'resend'
//   const resend = new Resend(process.env.RESEND_API_KEY)
//   await resend.emails.send({ from: '...', to: email, subject: 'Du bist auf der Liste!' })

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return Response.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    const sanitized = email.trim().toLowerCase();

    // MVP: log to console — replace with real persistence below
    console.log(`[waitlist] New signup: ${sanitized} at ${new Date().toISOString()}`);

    // TODO: persist to Supabase / send via Resend (see comments above)

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ error: 'Interner Fehler. Bitte erneut versuchen.' }, { status: 500 });
  }
}
