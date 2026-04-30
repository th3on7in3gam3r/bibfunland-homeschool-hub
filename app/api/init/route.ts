import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

// GET /api/init — creates DB tables (safe to call multiple times)
export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ ok: true, message: 'DB initialized' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
