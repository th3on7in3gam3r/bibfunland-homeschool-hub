import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';

async function checkAdmin() {
  const { userId } = await auth();
  return userId === process.env.ADMIN_USER_ID;
}

export async function GET() {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureDB();
  const result = await db.execute(`SELECT * FROM packs ORDER BY created_at DESC`);
  
  const packs = result.rows.map(r => ({
    id: r.id,
    title: r.title,
    gradeRange: r.grade_range,
    isFeatured: Boolean(r.is_featured),
    createdBy: r.created_by,
    createdAt: r.created_at
  }));

  return NextResponse.json({ packs });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, isFeatured } = await req.json();
  await ensureDB();
  await db.execute({
    sql: `UPDATE packs SET is_featured = ? WHERE id = ?`,
    args: [isFeatured ? 1 : 0, id]
  });

  return NextResponse.json({ success: true });
}
