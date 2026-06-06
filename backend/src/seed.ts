import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

// Define schemas locally to avoid TS compilation issues in node script
const UserSchema = new mongoose.Schema(
  {
    email: String,
    passwordHash: String,
    phone: String,
    otpCode: String,
    otpExpiresAt: Date,
    roles: [String],
    permissions: [String],
  },
  { timestamps: true },
);

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
  },
  { timestamps: true },
);

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  { timestamps: true },
);

const InventorySchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true },
    stock: Number,
    lowStockThreshold: Number,
    logs: [Object],
  },
  { timestamps: true },
);

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    sku: { type: String, unique: true },
    images: [String],
    tags: [String],
    averageRating: Number,
    specifications: [Object],
    faqs: [Object],
  },
  { timestamps: true },
);
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  },
  { timestamps: true },
);

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number,
      },
    ],
    status: String,
    shippingAddress: Object,
    totalPrice: Number,
    trackingCode: String,
  },
  { timestamps: true },
);

const TicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    status: String,
    priority: String,
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        message: String,
        sentAt: Date,
      },
    ],
  },
  { timestamps: true },
);

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    status: String,
  },
  { timestamps: true },
);

const UserMemorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    searchHistory: [String],
    viewedProducts: [String],
  },
  { timestamps: true },
);

// Models
const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Brand = mongoose.model('Brand', BrandSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Wishlist = mongoose.model('Wishlist', WishlistSchema);
const Order = mongoose.model('Order', OrderSchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const Review = mongoose.model('Review', ReviewSchema);
const UserMemory = mongoose.model('UserMemory', UserMemorySchema);

const usersData = [
  {
    email: 'john.doe@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550143',
  },
  {
    email: 'alice.smith@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550189',
  },
  {
    email: 'bob.johnson@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550156',
  },
  {
    email: 'clara.oswald@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550172',
  },
  {
    email: 'danny.pink@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550111',
  },
  {
    email: 'amy.pond@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550122',
  },
  {
    email: 'rory.williams@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550133',
  },
  {
    email: 'river.song@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550144',
  },
  {
    email: 'martha.jones@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550155',
  },
  {
    email: 'donna.noble@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    phone: '+12025550166',
  },
  {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    roles: ['Admin'],
    phone: '+12025550000',
  },
];

const categoriesData = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Fitness & Sports', slug: 'fitness-sports' },
];

const brandsData = [
  { name: 'ApexTech' },
  { name: 'AuraWear' },
  { name: 'NexaHome' },
  { name: 'VeloSport' },
  { name: 'Apple' },
  { name: 'Samsung' },
  { name: 'Sony' },
  { name: 'LG' },
  { name: 'Dell' },
  { name: 'HP' },
  { name: 'Lenovo' },
  { name: 'Asus' },
  { name: 'Acer' },
  { name: 'OnePlus' },
  { name: 'Realme' },
  { name: 'Oppo' },
  { name: 'Vivo' },
  { name: 'Xiaomi' },
  { name: 'Redmi' },
  { name: 'Motorola' },
  { name: 'Nike' },
  { name: 'Adidas' },
  { name: 'Puma' },
  { name: 'Reebok' },
  { name: 'Logitech' },
  { name: 'Bose' },
  { name: 'Intel' },
  { name: 'AMD' },
  { name: 'Nvidia' },
  { name: 'Microsoft' },
];

const initialProductsData = [
  {
    title: 'Apex Sound-Pro ANC Headphones',
    description:
      'Immersive sound with professional-grade Active Noise Cancellation, 40-hour playback duration.',
    price: 299.99,
    categoryName: 'Electronics',
    brandName: 'ApexTech',
    sku: 'APX-SND-PRO',
    images: ['/images/headphones.png'],
    tags: ['audio', 'wireless', 'headphones'],
    averageRating: 4.8,
    specifications: [{ name: 'Driver Size', value: '40mm Dynamic' }],
    faqs: [{ question: ' sweat resistant?', answer: 'Yes, IPX4.' }],
  },
  {
    title: 'Nexa Smart Multi-Cooker XL',
    description:
      '10-in-1 kitchen appliance for pressure cooking, slow cooking, steaming, and baking.',
    price: 189.99,
    categoryName: 'Home & Kitchen',
    brandName: 'NexaHome',
    sku: 'NEX-COOK-XL',
    images: ['/images/cooker.png'],
    tags: ['kitchen', 'cooking', 'smart-home'],
    averageRating: 4.6,
    specifications: [{ name: 'Capacity', value: '8 Quarts' }],
    faqs: [{ question: 'Dishwasher safe?', answer: 'Yes.' }],
  },
  {
    title: 'Aura Sport Training Leggings',
    description:
      'High-waisted compression tights featuring moisture-wicking technology.',
    price: 65.0,
    categoryName: 'Fashion',
    brandName: 'AuraWear',
    sku: 'AUR-S-LEG',
    images: ['/images/leggings.png'],
    tags: ['clothing', 'athletic', 'leggings'],
    averageRating: 4.5,
    specifications: [{ name: 'Fabric Type', value: 'Polyester' }],
    faqs: [{ question: 'Phone pocket?', answer: 'Yes.' }],
  },
  {
    title: 'VeloSport Hybrid Carbon Bicycle',
    description:
      'Ultra-lightweight aerodynamic carbon fiber frame. Equipped with Shimano gears.',
    price: 950.0,
    categoryName: 'Fitness & Sports',
    brandName: 'VeloSport',
    sku: 'VEL-HYB-CARB',
    images: ['/images/bicycle.png'],
    tags: ['cycling', 'hybrid', 'sports'],
    averageRating: 4.9,
    specifications: [{ name: 'Frame Material', value: 'Carbon Fiber' }],
    faqs: [{ question: 'Assemble needed?', answer: 'Yes, partially.' }],
  },
];

function generate1000Products() {
  const generated = [...initialProductsData];
  
  const brands = [
    'Samsung', 'Apple', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Google',
    'LG', 'Asus', 'Acer', 'Realme', 'Oppo', 'Vivo', 'Xiaomi', 'Redmi', 'Motorola',
    'Puma', 'Reebok', 'ApexTech', 'NexaHome', 'AuraWear', 'VeloSport',
    'Logitech', 'Bose', 'Intel', 'AMD', 'Nvidia', 'Microsoft'
  ];

  const productTypes = [
    'phone', 'laptop', 'mouse', 'shoes', 'watch', 'TV', 'earbuds', 'speaker',
    'multi-cooker', 'treadmill', 'headphone', 'camera', 'tablet', 'shirt',
    'jacket', 'bag', 'cooker', 'bicycle', 'keyboard', 'monitor',
    'refrigerator', 'washing machine', 'microwave', 'blender', 'air purifier',
    'headphones', 'smartwatch', 'charger', 'cable', 'backpack', 'desk lamp',
    'router', 'microphone', 'projector', 'hard drive', 'graphics card'
  ];

  const productTypeCategoryMap: Record<string, string> = {
    'multi-cooker': 'Home & Kitchen',
    'cooker': 'Home & Kitchen',
    'refrigerator': 'Home & Kitchen',
    'washing machine': 'Home & Kitchen',
    'microwave': 'Home & Kitchen',
    'blender': 'Home & Kitchen',
    'air purifier': 'Home & Kitchen',
    'desk lamp': 'Home & Kitchen',
    
    'smartwatch': 'Electronics',
    'laptop': 'Electronics',
    'phone': 'Electronics',
    'headphone': 'Electronics',
    'headphones': 'Electronics',
    'earphone': 'Electronics',
    'earbud': 'Electronics',
    'earbuds': 'Electronics',
    'speaker': 'Electronics',
    'watch': 'Electronics',
    'camera': 'Electronics',
    'tablet': 'Electronics',
    'keyboard': 'Electronics',
    'mouse': 'Electronics',
    'monitor': 'Electronics',
    'television': 'Electronics',
    'tv': 'Electronics',
    'TV': 'Electronics',
    'charger': 'Electronics',
    'cable': 'Electronics',
    'router': 'Electronics',
    'microphone': 'Electronics',
    'projector': 'Electronics',
    'hard drive': 'Electronics',
    'graphics card': 'Electronics',
    
    'shirt': 'Fashion',
    'shoes': 'Fashion',
    'jacket': 'Fashion',
    'bag': 'Fashion',
    'backpack': 'Fashion',
    'leggings': 'Fashion',
    
    'treadmill': 'Fitness & Sports',
    'bicycle': 'Fitness & Sports'
  };

  const productTypeImages: Record<string, string> = {
    'multi-cooker': '/images/cooker.png',
    'cooker': '/images/cooker.png',
    'refrigerator': '/images/cooker.png',
    'washing machine': '/images/cooker.png',
    'microwave': '/images/cooker.png',
    'blender': '/images/cooker.png',
    'air purifier': '/images/cooker.png',
    'desk lamp': '/images/cooker.png',
    
    'smartwatch': '/images/smartwatch.png',
    'laptop': '/images/laptop.png',
    'phone': '/images/phone.png',
    'headphone': '/images/headphones.png',
    'headphones': '/images/headphones.png',
    'earphone': '/images/headphones.png',
    'earbud': '/images/earbuds.png',
    'earbuds': '/images/earbuds.png',
    'speaker': '/images/headphones.png',
    'watch': '/images/smartwatch.png',
    'camera': '/images/headphones.png',
    'tablet': '/images/laptop.png',
    'keyboard': '/images/mouse.png',
    'mouse': '/images/mouse.png',
    'monitor': '/images/mouse.png',
    'television': '/images/tv.png',
    'tv': '/images/tv.png',
    'TV': '/images/tv.png',
    'charger': '/images/laptop.png',
    'cable': '/images/laptop.png',
    'router': '/images/laptop.png',
    'microphone': '/images/laptop.png',
    'projector': '/images/laptop.png',
    'hard drive': '/images/laptop.png',
    'graphics card': '/images/laptop.png',
    
    'shirt': '/images/leggings.png',
    'shoes': '/images/shoes.png',
    'jacket': '/images/leggings.png',
    'bag': '/images/leggings.png',
    'backpack': '/images/leggings.png',
    'leggings': '/images/leggings.png',
    
    'treadmill': '/images/bicycle.png',
    'bicycle': '/images/bicycle.png',
  };

  const colors = ['black', 'white', 'blue', 'red', 'gold', 'silver', 'green', 'yellow', 'pink', 'gray', 'purple', 'orange'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '9', '10', '8', '6', '7', '11', '12'];
  const prices = [100, 200, 500, 1000, 15000, 20000, 50000];

  const keywordMap: Record<string, string> = {
    'multi-cooker': 'cooker,kitchen',
    'cooker': 'cooker,kitchen',
    'refrigerator': 'refrigerator,appliance',
    'washing machine': 'washingmachine,appliance',
    'microwave': 'microwave,kitchen',
    'blender': 'blender,kitchen',
    'air purifier': 'airpurifier,appliance',
    'desk lamp': 'desklamp,kitchen,home',
    
    'smartwatch': 'smartwatch,watch',
    'laptop': 'laptop,computer',
    'phone': 'smartphone,phone',
    'headphone': 'headphones,audio',
    'headphones': 'headphones,audio',
    'earphone': 'earphones,audio',
    'earbud': 'earbuds,audio',
    'earbuds': 'earbuds,audio',
    'speaker': 'speaker,audio',
    'watch': 'watch',
    'camera': 'camera',
    'tablet': 'tablet,ipad',
    'keyboard': 'keyboard,computer',
    'mouse': 'mouse,computer',
    'monitor': 'monitor,screen',
    'television': 'television,tv',
    'tv': 'television,tv',
    'TV': 'television,tv',
    'charger': 'charger,power',
    'cable': 'cable,usb',
    'router': 'router,wifi',
    'microphone': 'microphone,audio',
    'projector': 'projector,video',
    'hard drive': 'harddrive,storage',
    'graphics card': 'gpu,graphics',
    
    'shirt': 'shirt,apparel',
    'shoes': 'shoes,sneakers',
    'jacket': 'jacket,apparel',
    'bag': 'bag,backpack',
    'backpack': 'backpack,bag',
    'leggings': 'leggings,apparel',
    
    'treadmill': 'treadmill,fitness',
    'bicycle': 'bicycle,bike'
  };

  let idCounter = 1;
  for (const brand of brands) {
    for (const productType of productTypes) {
      const catName = productTypeCategoryMap[productType] || 'Electronics';
      
      const kw = keywordMap[productType] || 'gadget';
      const image = `https://loremflickr.com/600/600/${kw}?lock=${idCounter}`;
      
      const color = colors[idCounter % colors.length];
      const size = sizes[idCounter % sizes.length];
      const basePrice = prices[idCounter % prices.length];
      const price = parseFloat((basePrice - (idCounter % 5) * (basePrice > 1000 ? 100 : 5)).toFixed(2));
      
      const title = `${brand} ${productType.charAt(0).toUpperCase() + productType.slice(1)} - ${color.toUpperCase()} (${size})`;
      const description = `This ${brand} ${productType} is a premium product in ${color} color and size ${size}, built for outstanding reliability and performance.`;
      const sku = `SKU-${brand.substring(0, 3).toUpperCase()}-${productType.substring(0, 4).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${size}-${idCounter}`;
      const tags = [productType, brand.toLowerCase(), color, size.toLowerCase()];
      const averageRating = parseFloat((4.0 + (idCounter % 10) * 0.1).toFixed(1));

      generated.push({
        title,
        description,
        price,
        categoryName: catName,
        brandName: brand,
        sku,
        images: [image],
        tags,
        averageRating,
        specifications: [
          { name: 'Color', value: color },
          { name: 'Size', value: size },
          { name: 'Model Year', value: '2026' }
        ],
        faqs: [{ question: 'Is it original?', answer: `Yes, it is an official ${brand} product.` }],
      });
      idCounter++;
    }
  }

  return generated;
}

const productsData = generate1000Products();

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to Database. Seeding...');

  // 1. Clean existing collections by dropping them to clear conflicting indexes
  const collections = ['users', 'categories', 'brands', 'inventories', 'products', 'carts', 'wishlists', 'orders', 'tickets', 'reviews', 'usermemories'];
  for (const col of collections) {
    try {
      await mongoose.connection.db!.dropCollection(col);
    } catch (e) {
      // Ignore if collection doesn't exist
    }
  }
  console.log('Dropped existing collections.');

  // 2. Insert Categories and Brands
  const categories = await Category.insertMany(categoriesData);
  const brands = await Brand.insertMany(brandsData);
  console.log('Inserted Categories & Brands.');

  // Helper map
  const catMap = new Map(categories.map((c) => [c.name, c._id]));
  const brandMap = new Map(brands.map((b) => [b.name, b._id]));

  // 3. Insert Products and Inventories
  const productsToInsert = [];
  const inventoriesToInsert = [];
  for (const p of productsData) {
    const catId = catMap.get(p.categoryName);
    const brandId = brandMap.get(p.brandName);
    productsToInsert.push({
      title: p.title,
      description: p.description,
      price: p.price,
      category: catId,
      brand: brandId,
      sku: p.sku,
      images: p.images,
      tags: p.tags,
      averageRating: p.averageRating,
      specifications: p.specifications,
      faqs: p.faqs,
    });

    inventoriesToInsert.push({
      sku: p.sku,
      stock: 50,
      lowStockThreshold: 5,
      logs: [
        { quantityChanged: 50, reason: 'Initial Seed', timestamp: new Date() },
      ],
    });
  }

  const products = await Product.insertMany(productsToInsert);
  await Product.createIndexes();
  await Inventory.insertMany(inventoriesToInsert);
  console.log('Inserted Products & Inventories.');

  // 4. Insert 10 Users and their personalized activities
  for (let i = 0; i < usersData.length; i++) {
    const uData = usersData[i];
    const passwordHash = await bcrypt.hash(uData.password, 10);
    const user = await User.create({
      email: uData.email,
      passwordHash,
      phone: uData.phone,
      roles: uData.roles,
    });

    console.log(`Created User: ${user.email}`);

    // Create User Memory searches
    const searchTerms = [
      ['audio', 'headphones', 'music'], // John
      ['kitchen', 'cooking', 'home'], // Alice
      ['clothing', 'leggings', 'fitness'], // Bob
      ['cycling', 'bicycle', 'sports'], // Clara
      ['headphones', 'sound', 'ApexTech'], // Danny
      ['cooker', 'pot', 'appliances'], // Amy
      ['leggings', 'wear', 'stretch'], // Rory
      ['bicycle', 'carbon', 'VeloSport'], // River
      ['audio', 'ANC', 'ApexSound'], // Martha
      ['cooker', 'kitchen', 'XL'], // Donna
    ][i];

    await UserMemory.create({
      userId: user._id,
      searchHistory: searchTerms,
      viewedProducts: [String(products[i % products.length]._id)],
    });

    // Create dynamic cart entries
    const cartProd = products[(i + 1) % products.length];
    await Cart.create({
      userId: user._id,
      items: [{ productId: cartProd._id, quantity: 1 }],
    });

    // Create dynamic wishlist entries
    const wishProd = products[(i + 2) % products.length];
    await Wishlist.create({
      userId: user._id,
      products: [wishProd._id],
    });

    // Create dynamic Orders (different status/totals)
    const orderProd = products[(i + 3) % products.length] as any;
    const statuses = [
      'Pending',
      'Shipped',
      'Delivered',
      'Paid',
      'Delivered',
      'Pending',
      'Shipped',
      'Delivered',
      'Paid',
      'Delivered',
    ];
    await Order.create({
      userId: user._id,
      items: [
        {
          productId: orderProd._id,
          quantity: 1,
          price: orderProd.price as number,
        },
      ],
      status: statuses[i],
      shippingAddress: {
        fullName: uData.email.split('@')[0].replace('.', ' '),
        addressLine1: `${100 + i * 23} Commerce St`,
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: uData.phone,
      },
      totalPrice: (orderProd.price as number) + 15.0,
      trackingCode: statuses[i] !== 'Pending' ? `TRK-${Date.now()}-${i}` : '',
    });

    // Create support tickets for some users
    if (i % 2 === 0) {
      await Ticket.create({
        userId: user._id,
        subject: i === 0 ? 'Where is my order?' : 'Defective product received',
        status: i === 0 ? 'Open' : 'Pending',
        priority: i === 0 ? 'Medium' : 'High',
        messages: [
          {
            senderId: user._id,
            message: 'I need immediate assistance with my request.',
            sentAt: new Date(),
          },
        ],
      });
    }

    // Create reviews for delivered orders
    if (statuses[i] === 'Delivered') {
      await Review.create({
        productId: orderProd._id,
        userId: user._id,
        rating: 4 + (i % 2),
        comment: `Excellent product, really loved using it! Highly recommended.`,
        status: 'Approved',
      });
    }
  }

  console.log('Database Seeding Completed Successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
