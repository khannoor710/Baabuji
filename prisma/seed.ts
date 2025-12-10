import { PrismaClient, UserRole, Category, FabricType, Pattern } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@baabuji.com' },
    update: {},
    create: {
      email: 'admin@baabuji.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: '+919876543210',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create customer users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      phone: '+919123456789',
    },
  });
  console.log('✅ Created customer user:', customer.email);

  // Create sample products
  const products = [
    {
      name: 'Premium Cotton Unstitched Suit',
      slug: 'premium-cotton-unstitched-suit',
      description: 'Luxurious cotton fabric perfect for formal occasions. Soft, breathable, and easy to stitch.',
      category: Category.MEN,
      fabricType: FabricType.COTTON,
      pattern: Pattern.SOLID,
      color: 'Navy Blue',
      price: 249900, // ₹2,499.00
      comparePrice: 299900,
      stock: 50,
      isFeatured: true,
      tags: ['premium', 'cotton', 'formal'],
      metaTitle: 'Premium Cotton Unstitched Suit - Baabuji',
      metaDescription: 'High-quality cotton unstitched suit fabric for men',
    },
    {
      name: 'Silk Embroidered Dress Material',
      slug: 'silk-embroidered-dress-material',
      description: 'Elegant silk fabric with intricate embroidery. Perfect for special occasions and festivals.',
      category: Category.WOMEN,
      fabricType: FabricType.SILK,
      pattern: Pattern.EMBROIDERED,
      color: 'Maroon',
      price: 399900,
      stock: 30,
      isFeatured: true,
      tags: ['silk', 'embroidered', 'festive'],
    },
    {
      name: 'Linen Printed Kurta Fabric',
      slug: 'linen-printed-kurta-fabric',
      description: 'Breathable linen with beautiful floral prints. Ideal for casual summer wear.',
      category: Category.WOMEN,
      fabricType: FabricType.LINEN,
      pattern: Pattern.PRINTED,
      color: 'Sky Blue',
      price: 179900,
      stock: 75,
      isFeatured: false,
      tags: ['linen', 'printed', 'summer'],
    },
    {
      name: 'Cotton Checks Shirt Material',
      slug: 'cotton-checks-shirt-material',
      description: 'Classic checked cotton fabric. Versatile and comfortable for everyday wear.',
      category: Category.MEN,
      fabricType: FabricType.COTTON,
      pattern: Pattern.CHECKS,
      color: 'Blue & White',
      price: 149900,
      stock: 100,
      isFeatured: false,
      tags: ['cotton', 'checks', 'casual'],
    },
    {
      name: 'Wool Blend Shawl Fabric',
      slug: 'wool-blend-shawl-fabric',
      description: 'Warm and cozy wool blend perfect for winter accessories.',
      category: Category.UNISEX,
      fabricType: FabricType.BLENDED,
      pattern: Pattern.SOLID,
      color: 'Charcoal Grey',
      price: 199900,
      stock: 40,
      isFeatured: false,
      tags: ['wool', 'winter', 'shawl'],
    },
    {
      name: 'Kids Cotton Kurta Set Fabric',
      slug: 'kids-cotton-kurta-set-fabric',
      description: 'Soft cotton fabric perfect for kids\' ethnic wear. Comfortable and easy to maintain.',
      category: Category.KIDS,
      fabricType: FabricType.COTTON,
      pattern: Pattern.PRINTED,
      color: 'Yellow',
      price: 99900,
      stock: 60,
      isFeatured: true,
      tags: ['kids', 'cotton', 'ethnic'],
    },
  ];

  // Create placeholder images using data URLs (works offline)
  const generatePlaceholderDataUrl = (width: number, height: number, text: string, bgColor = 'cccccc', textColor = '333333') => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23${bgColor}' width='${width}' height='${height}'/%3E%3Ctext fill='%23${textColor}' font-size='24' font-family='Arial, sans-serif' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
  };

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: [
            {
              url: generatePlaceholderDataUrl(800, 1000, productData.name.substring(0, 30), 'f5f0ea', '8b4c42'),
              altText: productData.name,
              isPrimary: true,
              displayOrder: 0,
            },
            {
              url: generatePlaceholderDataUrl(800, 1000, 'Detail View', 'e9dfd0', '72403a'),
              altText: `${productData.name} detail`,
              isPrimary: false,
              displayOrder: 1,
            },
          ],
        },
      },
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  // Create sample newsletter subscribers
  await prisma.newsletterSubscriber.create({
    data: {
      email: 'subscriber@example.com',
    },
  });
  console.log('✅ Created newsletter subscriber');

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
