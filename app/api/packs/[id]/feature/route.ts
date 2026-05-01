import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

// PATCH /api/packs/[id]/feature — admin-only toggle for is_featured
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const packResult = await db.execute({
      sql: `SELECT is_featured FROM packs WHERE id = ?`,
      args: [id],
    });

    if (packResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const { isFeatured } = await req.json();

    await db.execute({
      sql: `UPDATE packs SET is_featured = ? WHERE id = ?`,
      args: [isFeatured ? 1 : 0, id],
    });

    return NextResponse.json({ ok: true, isFeatured });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : 'Server error') }, { status: 500 });
  }
}
