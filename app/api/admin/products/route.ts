import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

// GET all products (admin)
export async function GET(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// POST create product (admin)
export async function POST(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const { name, description, price, category, stock, image, images, sizes, colors, features } = await request.json();

    const result = await client.query(
      `INSERT INTO products (name, description, price, category, stock, image, images, sizes, colors, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, description, price, category, stock || 0, image, images || [], sizes || [], colors || [], features || []]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
