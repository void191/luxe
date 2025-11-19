const { Pool } = require('pg');

async function migrateProductsTable() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:marewan19@localhost:5432/luxe_db'
  });

  try {
    console.log('Creating products table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        image VARCHAR(500),
        images TEXT[], 
        sizes TEXT[],
        colors TEXT[],
        features TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Products table created successfully');

    // Insert sample products
    const sampleProducts = [
      {
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a classic fit',
        price: 29.99,
        category: 'Clothing',
        stock: 50,
        image: '/placeholder.svg',
        images: ['/placeholder.svg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray'],
        features: ['100% Cotton', 'Machine Washable', 'Classic Fit']
      },
      {
        name: 'Denim Jeans',
        description: 'Comfortable stretch denim jeans',
        price: 79.99,
        category: 'Clothing',
        stock: 30,
        image: '/placeholder.svg',
        images: ['/placeholder.svg'],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Blue', 'Black'],
        features: ['Stretch Denim', 'Five Pockets', 'Belt Loops']
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioned sole',
        price: 89.99,
        category: 'Footwear',
        stock: 25,
        image: '/placeholder.svg',
        images: ['/placeholder.svg'],
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Red'],
        features: ['Breathable Mesh', 'Cushioned Sole', 'Lightweight']
      }
    ];

    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, description, price, category, stock, image, images, sizes, colors, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [
          product.name,
          product.description,
          product.price,
          product.category,
          product.stock,
          product.image,
          product.images,
          product.sizes,
          product.colors,
          product.features
        ]
      );
    }

    console.log('Sample products inserted');

    const result = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`Total products in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

migrateProductsTable();
