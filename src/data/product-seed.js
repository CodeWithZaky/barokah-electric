import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [...Array(5).keys()].map((index) => ({
    name: `Product ${index + 1}`,
    description: `Description for product ${index + 1}`,
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)), // Random price between 10 and 110
    rate: parseFloat((Math.random() * 5).toFixed(1)), // Random rate between 0.0 and 5.0
    published: Math.random() > 0.5, // Random true or false
    userId: "cm2x0d4fa0000mapa1j36z6lq", // Replace with an actual user ID from your database
    images: [
      {
        imageURL: `https://picsum.photos/400/400?random=${index + 1}`,
      },
    ],
  }));

  console.log(`Seeding ${products.length} products...`);

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        rate: product.rate,
        published: product.published,
        userId: product.userId,
        images: {
          create: product.images,
        },
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
