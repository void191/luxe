import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

// GET all users
export async function GET(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(`
      SELECT id, email, first_name, last_name, is_admin, status, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
