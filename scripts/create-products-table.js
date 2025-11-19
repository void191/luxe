const { Pool } = require('pg');

async function createProductsTable() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:marewan19@localhost:5432/luxe_db'
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        category VARCHAR(100),
        image VARCHAR(500),
        images TEXT[],
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Products table created successfully');
    
    // Check if table is empty and seed with sample data
    const count = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(count.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO products (name, description, price, category, image, stock, featured)
        VALUES 
          ('Premium Leather Jacket', 'High-quality leather jacket with modern design', 299.99, 'Outerwear', '/placeholder.svg', 10, true),
          ('Designer Handbag', 'Luxury handbag with premium materials', 499.99, 'Accessories', '/placeholder.svg', 5, true),
          ('Silk Dress', 'Elegant silk dress for special occasions', 199.99, 'Dresses', '/placeholder.svg', 8, false),
          ('Classic Watch', 'Timeless watch with leather strap', 399.99, 'Accessories', '/placeholder.svg', 15, true)
      `);
      console.log('Sample products inserted');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

createProductsTable();
