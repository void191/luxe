import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

// GET user orders
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const client = await db.connect();

  try {
    const ordersResult = await client.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at,
              u.email, u.first_name, u.last_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [id]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await client.query(
          `SELECT oi.quantity, oi.price, p.name as product_name
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          ...order,
          items: itemsResult.rows,
        };
      })
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
