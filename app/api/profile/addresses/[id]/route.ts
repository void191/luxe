import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// PUT update address
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country, is_default_shipping, is_default_billing } = await request.json();

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Verify ownership
    const ownerCheck = await client.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [id, user.id]
    );

    if (ownerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (is_default_shipping) {
      await client.query(
        'UPDATE addresses SET is_default_shipping = FALSE WHERE user_id = $1 AND id != $2',
        [user.id, id]
      );
    }
    if (is_default_billing) {
      await client.query(
        'UPDATE addresses SET is_default_billing = FALSE WHERE user_id = $1 AND id != $2',
        [user.id, id]
      );
    }

    const result = await client.query(
      `UPDATE addresses
       SET label = $1, type = $2, first_name = $3, last_name = $4, phone = $5, line1 = $6, line2 = $7,
           city = $8, state = $9, postal_code = $10, country = $11, is_default_shipping = $12, is_default_billing = $13, updated_at = CURRENT_TIMESTAMP
       WHERE id = $14 AND user_id = $15
       RETURNING *`,
      [label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country, is_default_shipping, is_default_billing, id, user.id]
    );

    await client.query('COMMIT');

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating address:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE address
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
