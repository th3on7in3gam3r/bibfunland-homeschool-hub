import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { generateWorksheetPack } from '@/lib/ai';
import { randomUUID } from 'crypto';

export const maxDuration = 120;

// POST /api/packs/from-idea — generate a full new pack from an idea card
export async function POST(req: NextRequest) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, gradeLevel, category } = await req.json();

    if (!title || !gradeLevel) {
      return NextResponse.json(
        { error: 'title and gradeLevel are required' },
        { status: 400 }
      );
    }

    // Use the idea title as the theme to generate a full 6-worksheet pack
    const packData = await generateWorksheetPack(title, gradeLevel);

    const packId = randomUUID();
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO packs (id, title, overview, grade_range, theme, category, created_by, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        packId,
        packData.title,
        packData.overview,
        gradeLevel,
        title,
        category ?? 'Bible Story',
        userId,
        now,
      ],
    });

    for (let i = 0; i < packData.worksheets.length; i++) {
      const ws = packData.worksheets[i];
      await db.execute({
        sql: `INSERT INTO worksheets (id, pack_id, title, grade_level, objective, parent_instructions, content_markup, bible_verse, sort_order, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomUUID(),
          packId,
          ws.title,
          ws.gradeLevel,
          ws.objective,
          ws.parentInstructions,
          ws.contentMarkup,
          ws.bibleVerse,
          i,
          now,
        ],
      });
    }

    return NextResponse.json({ packId });
  } catch (err: any) {
    console.error('Pack from idea error:', err);
    const message = err?.error?.error?.message ?? err?.message ?? 'Generation failed';
    const status = err?.status === 400 ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
