import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';

// GET /api/packs/[id] — get pack + worksheets
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { id } = await params;
  try {
    const packResult = await db.execute({
      sql: `SELECT * FROM packs WHERE id = ?`,
      args: [id],
    });

    if (packResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const r = packResult.rows[0];
    const pack = {
      id: r.id,
      title: r.title,
      overview: r.overview,
      gradeRange: r.grade_range,
      theme: r.theme,
      category: r.category ?? 'Bible Story',
      isFeatured: Boolean(r.is_featured),
      createdBy: r.created_by,
      createdAt: r.created_at,
    };

    const wsResult = await db.execute({
      sql: `SELECT * FROM worksheets WHERE pack_id = ? ORDER BY sort_order ASC`,
      args: [id],
    });

    const worksheets = wsResult.rows.map((w) => ({
      id: w.id,
      title: w.title,
      gradeLevel: w.grade_level,
      objective: w.objective,
      parentInstructions: w.parent_instructions,
      contentMarkup: w.content_markup,
      bibleVerse: w.bible_verse,
      order: w.sort_order,
    }));

    return NextResponse.json({ pack, worksheets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/packs/[id] — update pack metadata
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { title, overview, gradeRange, category } = await req.json();

    await db.execute({
      sql: `UPDATE packs SET title = ?, overview = ?, grade_range = ?, category = ? WHERE id = ?`,
      args: [title, overview, gradeRange, category ?? 'Bible Story', id],
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/packs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Worksheets cascade delete via FK, but delete explicitly for safety
    await db.execute({ sql: `DELETE FROM worksheets WHERE pack_id = ?`, args: [id] });
    await db.execute({ sql: `DELETE FROM packs WHERE id = ?`, args: [id] });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
