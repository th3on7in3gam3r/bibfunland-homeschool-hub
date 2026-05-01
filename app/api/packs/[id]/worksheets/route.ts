import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { getUserTier } from '@/lib/subscription';
import { TIERS } from '@/lib/tiers';
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
    // Ownership check — verify the pack belongs to the requesting user
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

    // Tier check — user must have edit permission
    const tier = await getUserTier(userId);
    if (!TIERS[tier].limits.canEdit) {
      return NextResponse.json(
        {
          error: `Your ${TIERS[tier].name} plan does not allow adding worksheets. Upgrade to access this feature.`,
          upgradeRequired: true,
          tier,
        },
        { status: 403 }
      );
    }

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
  } catch (err: unknown) {
    console.error('Worksheet insert error:', err);
    const message = err instanceof Error ? err.message : 'Failed to add worksheet';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
