import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDB } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  await ensureDB();
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Save lead
    await db.execute({
      sql: `INSERT INTO leads (email, source) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET source = excluded.source`,
      args: [email, source || 'homepage'],
    });

    // Optional: Send a specific lead welcome email
    // For now, let's just send the standard one but with a modified name
    try {
      await sendWelcomeEmail(email, 'Friend');
    } catch (e) {
      console.error('Lead welcome email failed', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
