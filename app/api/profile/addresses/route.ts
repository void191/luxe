import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// GET user addresses
export async function GET(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(
      `SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default_shipping DESC, is_default_billing DESC, created_at DESC`,
      [user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// POST create address
export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country, is_default_shipping, is_default_billing } = await request.json();

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // If setting as default, unset other defaults
    if (is_default_shipping) {
      await client.query(
        'UPDATE addresses SET is_default_shipping = FALSE WHERE user_id = $1',
        [user.id]
      );
    }
    if (is_default_billing) {
      await client.query(
        'UPDATE addresses SET is_default_billing = FALSE WHERE user_id = $1',
        [user.id]
      );
    }

    const result = await client.query(
      `INSERT INTO addresses (user_id, label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country, is_default_shipping, is_default_billing)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [user.id, label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country, is_default_shipping, is_default_billing]
    );

    await client.query('COMMIT');

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating address:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
