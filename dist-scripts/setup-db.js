"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const db = (0, db_1.getDb)();
        const client = yield db.connect();
        try {
            console.log('Dropping existing tables...');
            yield client.query('DROP TABLE IF EXISTS user_activity_log, wishlist, reviews, cart_items, order_items, orders, products, addresses, categories, users CASCADE;');
            console.log('Existing tables dropped.');
            console.log('Creating tables...');
            // Users Table
            yield client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          is_admin BOOLEAN DEFAULT FALSE,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"users" table created.');
            // Addresses Table
            yield client.query(`
      CREATE TABLE addresses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          label VARCHAR(100),
          type VARCHAR(20) DEFAULT 'shipping',
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(30),
          line1 VARCHAR(255) NOT NULL,
          line2 VARCHAR(255),
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100),
          postal_code VARCHAR(20) NOT NULL,
          country VARCHAR(100) NOT NULL,
          is_default_shipping BOOLEAN DEFAULT FALSE,
          is_default_billing BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            yield client.query(`CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);`);
            yield client.query(`CREATE UNIQUE INDEX IF NOT EXISTS addresses_default_shipping ON addresses(user_id) WHERE is_default_shipping;`);
            yield client.query(`CREATE UNIQUE INDEX IF NOT EXISTS addresses_default_billing ON addresses(user_id) WHERE is_default_billing;`);
            console.log('"addresses" table created.');
            // Categories Table
            yield client.query(`
      CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL
      );
    `);
            console.log('"categories" table created.');
            // Products Table
            yield client.query(`
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC(10, 2) NOT NULL,
          category_id INTEGER REFERENCES categories(id),
          image_url VARCHAR(255),
          stock INTEGER DEFAULT 0,
          rating NUMERIC(3, 2) DEFAULT 0.00,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"products" table created.');
            // Orders Table
            yield client.query(`
      CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          shipping_address_id INTEGER REFERENCES addresses(id),
          billing_address_id INTEGER REFERENCES addresses(id),
          total_amount NUMERIC(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending', -- e.g., pending, completed, shipped, cancelled
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"orders" table created.');
            // Order Items Table
            yield client.query(`
      CREATE TABLE order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price NUMERIC(10, 2) NOT NULL
      );
    `);
            console.log('"order_items" table created.');
            // Cart Items Table
            yield client.query(`
      CREATE TABLE cart_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"cart_items" table created.');
            // Reviews Table
            yield client.query(`
      CREATE TABLE reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"reviews" table created.');
            // Wishlist Table
            yield client.query(`
      CREATE TABLE wishlist (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          product_id INTEGER REFERENCES products(id)
      );
    `);
            console.log('"wishlist" table created.');
            // User Activity Log Table
            yield client.query(`
      CREATE TABLE user_activity_log (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          acted_by_admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(100) NOT NULL,
          payload JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
            console.log('"user_activity_log" table created.');
            console.log('Inserting sample data...');
            const samplePasswordHash = '$2a$10$7EqJtq98hPqEX7fNZaFWo.P1qjNenE2no0RvrRZtGJPD7Wv.Y4RSa';
            const insertedUsers = yield client.query(`
      INSERT INTO users (email, password, first_name, last_name, is_admin)
      VALUES
        ('admin@example.com', '${samplePasswordHash}', 'Admin', 'User', TRUE),
        ('jane@example.com', '${samplePasswordHash}', 'Jane', 'Doe', FALSE)
      RETURNING id, email;
    `);
            yield client.query(`
      INSERT INTO categories (name, slug) VALUES ('Electronics', 'electronics'), ('Books', 'books'), ('Clothing', 'clothing');
    `);
            yield client.query(`
      INSERT INTO products (name, description, price, category_id, image_url, stock) VALUES
      ('Laptop', 'A powerful laptop.', 1200.00, 1, '/images/laptop.jpg', 50),
      ('Smartphone', 'A latest model smartphone.', 800.00, 1, '/images/smartphone.jpg', 100),
      ('PHP for Beginners', 'A book to learn PHP.', 25.50, 2, '/images/php-book.jpg', 200),
      ('T-Shirt', 'A comfortable cotton t-shirt.', 15.00, 3, '/images/tshirt.jpg', 500);
    `);
            const adminId = (_a = insertedUsers.rows.find((row) => row.email === 'admin@example.com')) === null || _a === void 0 ? void 0 : _a.id;
            const janeId = (_b = insertedUsers.rows.find((row) => row.email === 'jane@example.com')) === null || _b === void 0 ? void 0 : _b.id;
            if (adminId && janeId) {
                yield client.query(`INSERT INTO addresses (user_id, label, type, first_name, last_name, phone, line1, city, state, postal_code, country, is_default_shipping, is_default_billing)
         VALUES
         ($1, 'HQ', 'shipping', 'Admin', 'User', '+1-202-555-0110', '1 Admin Plaza', 'Seattle', 'WA', '98101', 'USA', TRUE, TRUE),
         ($2, 'Home', 'shipping', 'Jane', 'Doe', '+1-202-555-0182', '123 Main Street', 'Austin', 'TX', '73301', 'USA', TRUE, TRUE);`, [adminId, janeId]);
            }
            console.log('Sample data inserted.');
            console.log('Database setup complete.');
        }
        catch (error) {
            console.error('Error setting up database:', error);
        }
        finally {
            client.release();
            // End the pool to allow the script to exit
            db.end();
        }
    });
}
setupDatabase();
