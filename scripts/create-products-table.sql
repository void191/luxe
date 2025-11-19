-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  description TEXT,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  images TEXT[], -- Array of image URLs
  sizes TEXT[], -- Array of available sizes
  colors JSONB, -- JSON array of {name, value}
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  features TEXT[], -- Array of product features
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Insert sample products if table is empty
INSERT INTO products (name, price, original_price, description, category, stock, images, sizes, colors, rating, in_stock, features, is_new)
SELECT 
  'Cashmere Blend Sweater',
  189.99,
  249.99,
  'Experience unparalleled luxury with our premium cashmere blend sweater.',
  'Women',
  50,
  ARRAY['/luxury-cashmere-sweater.png', '/luxury-wool-cardigan.jpg'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  '[{"name":"Ivory","value":"#F5F5DC"},{"name":"Charcoal","value":"#36454F"}]'::jsonb,
  4.8,
  true,
  ARRAY['Premium cashmere blend', 'Ribbed crew neck', 'Long sleeves', 'Relaxed fit'],
  false
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO products (name, price, description, category, stock, images, sizes, colors, rating, in_stock, features, is_new)
SELECT 
  'Italian Leather Handbag',
  449.99,
  'A timeless handbag crafted from the finest Italian leather.',
  'Accessories',
  30,
  ARRAY['/luxury-leather-handbag.jpg'],
  ARRAY['One Size'],
  '[{"name":"Black","value":"#000000"}]'::jsonb,
  4.9,
  true,
  ARRAY['Genuine Italian leather', 'Gold-tone hardware'],
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Italian Leather Handbag');
