import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAdminToken } from '@/lib/auth';

// GET single user
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const result = await client.query(
      `SELECT id, email, first_name, last_name, is_admin, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT update user
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminUser = verifyAdminToken(request);
  if (!adminUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { email, first_name, last_name, is_admin: isAdmin, status, password } = await request.json();

  const db = getDb();
  const client = await db.connect();

  try {
    // Check if user exists
    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let updateQuery = `
      UPDATE users
      SET email = $1, first_name = $2, last_name = $3, is_admin = $4, status = $5, updated_at = CURRENT_TIMESTAMP
    `;
    const queryParams: any[] = [email, first_name, last_name, isAdmin, status];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password = $6`;
      queryParams.push(hashedPassword);
    }

    updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING id, email, first_name, last_name, is_admin, status, updated_at`;
    queryParams.push(id);

    const result = await client.query(updateQuery, queryParams);

    // Log activity
    await client.query(
      `INSERT INTO user_activity_log (user_id, acted_by_admin_id, action, payload)
       VALUES ($1, $2, $3, $4)`,
      [id, adminUser.id, 'user_updated', JSON.stringify({ email, first_name, last_name, isAdmin, status })]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminUser = verifyAdminToken(request);
  if (!adminUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    // Prevent deleting yourself
    if (parseInt(id) === adminUser.id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Log activity
    await client.query(
      `INSERT INTO user_activity_log (user_id, acted_by_admin_id, action, payload)
       VALUES ($1, $2, $3, $4)`,
      [id, adminUser.id, 'user_deleted', JSON.stringify({ deleted_user_id: id })]
    );

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
