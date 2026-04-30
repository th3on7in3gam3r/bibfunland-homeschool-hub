import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';

// GET /api/packs/[id]/favorite — check if current user has favorited this pack
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ isFavorited: false });

  const { id } = await params;
  const result = await db.execute({
    sql: `SELECT 1 FROM favorites WHERE user_id = ? AND pack_id = ?`,
    args: [userId, id],
  });

  return NextResponse.json({ isFavorited: result.rows.length > 0 });
}

// POST /api/packs/[id]/favorite — toggle favorite
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await db.execute({
      sql: `SELECT 1 FROM favorites WHERE user_id = ? AND pack_id = ?`,
      args: [userId, id],
    });

    if (existing.rows.length > 0) {
      // Remove favorite
      await db.execute({
        sql: `DELETE FROM favorites WHERE user_id = ? AND pack_id = ?`,
        args: [userId, id],
      });
      return NextResponse.json({ isFavorited: false });
    } else {
      // Add favorite
      await db.execute({
        sql: `INSERT INTO favorites (user_id, pack_id, created_at) VALUES (?, ?, ?)`,
        args: [userId, id, new Date().toISOString()],
      });
      return NextResponse.json({ isFavorited: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
