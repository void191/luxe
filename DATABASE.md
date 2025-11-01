# Database Setup

This project uses PostgreSQL with Prisma ORM for database management.

## Prerequisites

- PostgreSQL 14+ installed and running
- Node.js 18+ installed

## Quick Start

### 1. Set up your database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE luxe;

# Exit psql
\q
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials:

```
DATABASE_URL="postgresql://username:password@localhost:5432/luxe?schema=public"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Push schema to database

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### 6. Seed the database (optional)

Populate the database with sample data:

```bash
npm run db:seed
```

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (for development)
- `npm run db:migrate` - Create and run migrations (for production)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (visual database browser)

## Database Schema

The database includes the following models:

### Core Models
- **User** - Customer and admin accounts
- **Product** - Product catalog with pricing and inventory
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items in orders

### Shopping Features
- **Cart** - Shopping cart for users
- **CartItem** - Items in shopping carts
- **Wishlist** - User wishlists
- **WishlistItem** - Items in wishlists

### Social Features
- **Review** - Product reviews and ratings

## Using Prisma Client

Import and use Prisma Client in your code:

```typescript
import { prisma } from '@/lib/db'

// Example: Get all products
const products = await prisma.product.findMany()

// Example: Create a new order
const order = await prisma.order.create({
  data: {
    userId: 'user_id',
    orderNumber: 'ORD-001',
    status: 'PENDING',
    total: 199.99,
    // ... other fields
  }
})
```

## Prisma Studio

View and edit your database visually:

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

## Production Deployment

For production, always use migrations:

```bash
# Create migration
npm run db:migrate

# Apply migration in production
npx prisma migrate deploy
```

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:
1. Ensure PostgreSQL is running: `sudo service postgresql status`
2. Check your DATABASE_URL in `.env`
3. Verify PostgreSQL accepts connections on port 5432

### Schema Changes

After changing `schema.prisma`:
1. Run `npm run db:generate` to update Prisma Client
2. Run `npm run db:migrate` to create and apply migration

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
