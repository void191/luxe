import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(`
      SELECT id, name, price, original_price, description, category, stock,
             images, sizes, colors, rating, reviews_count, in_stock, features,
             is_new, is_featured, created_at, updated_at
      FROM products
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT update product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
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
      UPDATE products SET
        name = $1,
        price = $2,
        original_price = $3,
        description = $4,
        category = $5,
        stock = $6,
        images = $7,
        sizes = $8,
        colors = $9,
        features = $10,
        is_new = $11,
        is_featured = $12,
        in_stock = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `, [
      name,
      price,
      original_price || null,
      description,
      category,
      stock,
      images || [],
      sizes || [],
      JSON.stringify(colors || []),
      features || [],
      is_new || false,
      is_featured || false,
      stock > 0,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
