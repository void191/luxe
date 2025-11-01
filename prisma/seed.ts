import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxe.com' },
    update: {},
    create: {
      email: 'admin@luxe.com',
      name: 'Admin User',
      password: '$2a$10$YourHashedPasswordHere', // In production, use proper password hashing
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample products
  const products = [
    {
      name: 'Cashmere Blend Sweater',
      description: 'Experience unparalleled luxury with our premium cashmere blend sweater. Crafted from the finest materials, this piece combines exceptional softness with timeless elegance.',
      price: 189.99,
      originalPrice: 249.99,
      image: '/luxury-cashmere-sweater.png',
      category: 'Women',
      isNew: false,
      stock: 25,
    },
    {
      name: 'Italian Leather Handbag',
      description: 'Handcrafted Italian leather handbag with premium hardware and elegant design.',
      price: 449.99,
      image: '/luxury-leather-handbag.jpg',
      category: 'Accessories',
      isNew: true,
      stock: 15,
    },
    {
      name: 'Tailored Wool Blazer',
      description: 'Sophisticated wool blazer with modern tailoring and classic appeal.',
      price: 329.99,
      image: '/luxury-wool-blazer.png',
      category: 'Men',
      isNew: true,
      stock: 20,
    },
    {
      name: 'Silk Scarf Collection',
      description: 'Premium silk scarves featuring exclusive patterns and vibrant colors.',
      price: 89.99,
      originalPrice: 129.99,
      image: '/luxury-silk-scarf.png',
      category: 'Accessories',
      isNew: false,
      stock: 40,
    },
    {
      name: 'Merino Wool Cardigan',
      description: 'Luxuriously soft merino wool cardigan perfect for layering.',
      price: 159.99,
      image: '/luxury-merino-cardigan.png',
      category: 'Women',
      isNew: true,
      stock: 30,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Sample products created')

  // Create sample customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: '$2a$10$YourHashedPasswordHere',
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Sample customer created:', customer.email)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
