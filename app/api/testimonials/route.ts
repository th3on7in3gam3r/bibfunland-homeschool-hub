import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

// Ensure testimonials table exists
async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      user_name TEXT NOT NULL,
      role TEXT DEFAULT 'Homeschool Parent',
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

// GET /api/testimonials
export async function GET() {
  try {
    await ensureTable();
    const result = await db.execute(
      `SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 10`
    );
    const testimonials = result.rows.map((r) => ({
      id: r.id,
      userName: r.user_name,
      role: r.role,
      content: r.content,
      rating: r.rating,
      createdBy: r.created_by,
      createdAt: r.created_at,
    }));
    return NextResponse.json({ testimonials });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/testimonials
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureTable();
    const { userName, content, rating } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const id = randomUUID();
    await db.execute({
      sql: `INSERT INTO testimonials (id, user_name, role, content, rating, created_by, created_at)
            VALUES (?, ?, 'Homeschool Parent', ?, ?, ?, ?)`,
      args: [id, userName ?? 'Anonymous Parent', content, rating ?? 5, userId, new Date().toISOString()],
    });

    return NextResponse.json({ id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/testimonials?id=xxx
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Only allow deleting own testimonials
    await db.execute({
      sql: `DELETE FROM testimonials WHERE id = ? AND created_by = ?`,
      args: [id, userId],
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
