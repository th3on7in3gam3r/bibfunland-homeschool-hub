import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';

// PATCH /api/packs/[id]/worksheets/reorder
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const packResult = await db.execute({
      sql: `SELECT created_by FROM packs WHERE id = ?`,
      args: [id],
    });

    if (packResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    if (packResult.rows[0].created_by !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { order } = await req.json();

    for (const item of order) {
      await db.execute({
        sql: `UPDATE worksheets SET sort_order = ? WHERE id = ? AND pack_id = ?`,
        args: [item.order, item.id, id],
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
