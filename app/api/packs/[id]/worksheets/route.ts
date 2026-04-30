import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { randomUUID } from 'crypto';

// POST /api/packs/[id]/worksheets — add a worksheet to a pack
export async function POST(
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
    const body = await req.json();
    const { title, gradeLevel, objective, parentInstructions, contentMarkup, bibleVerse } = body;

    const orderResult = await db.execute({
      sql: `SELECT MAX(sort_order) as max_order FROM worksheets WHERE pack_id = ?`,
      args: [id],
    });
    const maxOrder = (orderResult.rows[0]?.max_order as number) ?? -1;

    const wsId = randomUUID();
    await db.execute({
      sql: `INSERT INTO worksheets (id, pack_id, title, grade_level, objective, parent_instructions, content_markup, bible_verse, sort_order, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        wsId, id, title, gradeLevel, objective,
        parentInstructions, contentMarkup, bibleVerse,
        maxOrder + 1, new Date().toISOString(),
      ],
    });

    return NextResponse.json({ id: wsId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
