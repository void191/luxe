import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let userId: number;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { first_name, last_name } = await request.json();

    if (!first_name || !last_name) {
      return NextResponse.json({ message: 'First name and last name are required' }, { status: 400 });
    }

    const db = getDb();
    const client = await db.connect();

    try {
      // Update user profile
      const result = await client.query(
        'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, email, first_name, last_name, is_admin',
        [first_name, last_name, userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user: result.rows[0] });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
