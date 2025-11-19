import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET - Fetch user's orders
export async function GET(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getDb();

  try {
    // Fetch user's orders with items
    const ordersResult = await client.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, o.shipping_address_id, o.billing_address_id,
              sa.line1 as shipping_line1, sa.city as shipping_city, sa.state as shipping_state,
              ba.line1 as billing_line1, ba.city as billing_city, ba.state as billing_state
       FROM orders o
       LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
       LEFT JOIN addresses ba ON o.billing_address_id = ba.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user.id]
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

// POST - Create new order
export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getDb();

  try {
    const body = await request.json();
    const {
      items,
      total_amount,
      shipping_address,
      billing_address,
      promo_code,
      discount_amount,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!total_amount || total_amount <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    if (!shipping_address) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Create shipping address
    const shippingResult = await client.query(
      `INSERT INTO addresses (user_id, label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        user.id,
        "Shipping Address",
        "shipping",
        shipping_address.first_name,
        shipping_address.last_name,
        shipping_address.phone,
        shipping_address.line1,
        shipping_address.line2 || null,
        shipping_address.city,
        shipping_address.state,
        shipping_address.postal_code,
        shipping_address.country || "USA",
      ]
    );
    const shippingAddressId = shippingResult.rows[0].id;

    // Create billing address (use shipping if same)
    let billingAddressId = shippingAddressId;
    if (billing_address && billing_address.line1 !== shipping_address.line1) {
      const billingResult = await client.query(
        `INSERT INTO addresses (user_id, label, type, first_name, last_name, phone, line1, line2, city, state, postal_code, country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          user.id,
          "Billing Address",
          "billing",
          billing_address.first_name,
          billing_address.last_name,
          billing_address.phone,
          billing_address.line1,
          billing_address.line2 || null,
          billing_address.city,
          billing_address.state,
          billing_address.postal_code,
          billing_address.country || "USA",
        ]
      );
      billingAddressId = billingResult.rows[0].id;
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, shipping_address_id, billing_address_id, total_amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [user.id, shippingAddressId, billingAddressId, total_amount, "pending"]
    );
    const orderId = orderResult.rows[0].id;

    // Create order items with product snapshots
    for (const item of items) {
      // First, check if columns exist, if not add them inline
      try {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_name, product_image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.product_id, item.quantity, item.price, item.name, item.image]
        );
      } catch (err) {
        // If columns don't exist, add them first
        await client.query(`
          ALTER TABLE order_items 
          ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
          ADD COLUMN IF NOT EXISTS product_image VARCHAR(500);
        `);
        // Then retry insert
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, product_name, product_image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.product_id, item.quantity, item.price, item.name, item.image]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      id: orderId,
      status: "success",
      created_at: orderResult.rows[0].created_at,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
