import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth";

// GET - Fetch all orders (admin only)
export async function GET(request: Request) {
  admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getDb();

  try {
    // Fetch all orders with user and address info
    const ordersResult = await client.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at,
              u.id as user_id, u.email, u.first_name, u.last_name,
              sa.line1 as shipping_line1, sa.city as shipping_city, sa.state as shipping_state,
              ba.line1 as billing_line1, ba.city as billing_city, ba.state as billing_state
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
       LEFT JOIN addresses ba ON o.billing_address_id = ba.id
       ORDER BY o.created_at DESC`
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await client.query(
          `SELECT oi.quantity, oi.price, oi.product_id, oi.product_name, oi.product_image
           FROM order_items oi
           WHERE oi.order_id = $1`,
          [order.id]
        );

        return {
          id: order.id,
          total: parseFloat(order.total_amount),
          status: order.status,
          date: order.created_at,
          user: {
            id: order.user_id,
            email: order.email,
            first_name: order.first_name,
            last_name: order.last_name,
          },
          items: itemsResult.rows.map((item) => ({
            id: item.product_id,
            name: item.product_name || 'Unknown Product',
            image: item.product_image || '/placeholder.svg',
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
          shipping_address: order.shipping_line1
            ? {
                line1: order.shipping_line1,
                city: order.shipping_city,
                state: order.shipping_state,
              }
            : null,
          billing_address: order.billing_line1
            ? {
                line1: order.billing_line1,
                city: order.billing_city,
                state: order.billing_state,
              }
            : null,
        };
      })
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
