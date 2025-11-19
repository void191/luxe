import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

// GET all products
export async function GET() {
  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(`
      SELECT id, name, price, original_price, description, category, stock, 
             images, sizes, colors, rating, reviews_count, in_stock, features, 
             is_new, is_featured, created_at, updated_at
      FROM products
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// POST create new product (admin only)
export async function POST(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const body = await request.json();
    const {
      name,
      price,
      original_price,
      description,
      category,
      stock,
      images,
      sizes,
      colors,
      features,
      is_new,
      is_featured
    } = body;

    const result = await client.query(`
      INSERT INTO products (
        name, price, original_price, description, category, stock,
        images, sizes, colors, features, is_new, is_featured, in_stock
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      name,
      price,
      original_price || null,
      description,
      category,
      stock || 0,
      images || [],
      sizes || [],
      JSON.stringify(colors || []),
      features || [],
      is_new || false,
      is_featured || false,
      (stock || 0) > 0
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
