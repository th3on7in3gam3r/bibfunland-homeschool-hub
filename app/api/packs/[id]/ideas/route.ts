import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { generateWorksheetIdeas } from '@/lib/ai';

export const maxDuration = 60;

// POST /api/packs/[id]/ideas — generate AI worksheet ideas for a pack
export async function POST(
  _req: NextRequest,
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
      sql: `SELECT title, overview, grade_range FROM packs WHERE id = ?`,
      args: [id],
    });

    if (packResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const pack = packResult.rows[0];
    const ideas = await generateWorksheetIdeas(
      pack.title as string,
      pack.overview as string,
      pack.grade_range as string
    );

    return NextResponse.json({ ideas });
  } catch (err: any) {
    console.error('Ideas generation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
