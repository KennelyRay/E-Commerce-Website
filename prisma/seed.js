const { PrismaClient } = require('@prisma/client');
const productsData = require('../data/products.json');

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.user.upsert({
    where: { username: 'Admin' },
    update: {},
    create: {
      id: 'admin-1',
      name: 'Administrator',
      username: 'Admin',
      email: 'admin@vertixhub.com',
      password: '12345',
      isAdmin: true,
      isBanned: false,
    },
  });

  for (const product of productsData.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        image: product.image,
        images: product.images ?? null,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured ?? false,
        tags: product.tags,
        specifications: product.specifications ?? null,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        image: product.image,
        images: product.images ?? null,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured ?? false,
        tags: product.tags,
        specifications: product.specifications ?? null,
      },
    });
  }

  console.log(`Seeded ${productsData.products.length} products into Neon.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
