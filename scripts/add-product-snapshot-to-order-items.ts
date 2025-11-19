import { getDb } from '../lib/db';

async function addProductSnapshotColumns() {
  const client = await getDb();
  
  try {
    console.log('Adding product snapshot columns to order_items table...');
    
    // Add product_name and product_image columns
    await client.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS product_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS product_image VARCHAR(500);
    `);
    
    console.log('✓ Successfully added product_name and product_image columns to order_items');
    console.log('✓ Order items will now snapshot product data at purchase time');
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding columns:', error);
    process.exit(1);
  }
}

addProductSnapshotColumns();
