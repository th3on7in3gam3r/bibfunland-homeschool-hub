import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';

// POST /api/profile/role — updates the user's role
export async function POST(req: Request) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { role } = await req.json();
    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Insert or update the subscription record with the new role
    await db.execute({
      sql: `INSERT INTO subscriptions (user_id, role, tier, status) 
            VALUES (?, ?, 'free', 'active')
            ON CONFLICT(user_id) DO UPDATE SET role = ?, updated_at = datetime('now')`,
      args: [userId, role, role],
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
