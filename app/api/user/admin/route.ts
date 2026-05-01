import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/admin';

// GET /api/user/admin — returns whether the signed-in user has admin privileges
export async function GET() {
  const { userId } = await auth();
  return NextResponse.json({ isAdmin: isAdmin(userId) });
}
