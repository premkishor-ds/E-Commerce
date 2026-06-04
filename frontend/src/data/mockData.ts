export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  images: string[];
  tags: string[];
  averageRating: number;
  specifications: Array<{ name: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
  reviews: Array<{ user: string; rating: number; comment: string; verified: boolean }>;
}

export const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', desc: 'Next-gen devices and smart gadgets' },
  { name: 'Fashion & Apparel', slug: 'fashion', desc: 'Premium style options for everyone' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', desc: 'Decor, cookwares, and appliances' },
  { name: 'Fitness & Sports', slug: 'fitness-sports', desc: 'High quality athletic and training gears' }
];

export const BRANDS = ['ApexTech', 'AuraWear', 'NexaHome', 'VeloSport'];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Apex Sound-Pro ANC Headphones',
    description: 'Immersive sound with professional-grade Active Noise Cancellation, 40-hour playback duration, and premium leather finishes.',
    price: 299.99,
    category: 'Electronics',
    brand: 'ApexTech',
    sku: 'APX-SND-PRO',
    images: ['https://picsum.photos/seed/headphones/600/600'],
    tags: ['audio', 'wireless', 'headphones', 'premium'],
    averageRating: 4.8,
    specifications: [
      { name: 'Driver Size', value: '40mm Dynamic' },
      { name: 'Battery Life', value: 'Up to 40 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.2, USB-C' }
    ],
    faqs: [
      { question: 'Is it sweat resistant?', answer: 'Yes, it features IPX4 sweat and splash resistance.' },
      { question: 'What is the warranty period?', answer: 'It comes with a 2-year manufacturer warranty.' }
    ],
    reviews: [
      { user: 'Sarah K.', rating: 5, comment: 'Incredible noise cancellation, absolutely love it!', verified: true },
      { user: 'David M.', rating: 4, comment: 'Comfortable to wear for long flights. Audio is very crisp.', verified: true }
    ]
  },
  {
    id: 'prod-2',
    title: 'Nexa Smart Multi-Cooker XL',
    description: '10-in-1 kitchen appliance for pressure cooking, slow cooking, steaming, and baking. Smart temperature sensor technology.',
    price: 189.99,
    category: 'Home & Kitchen',
    brand: 'NexaHome',
    sku: 'NEX-COOK-XL',
    images: ['https://picsum.photos/seed/cooker/600/600'],
    tags: ['kitchen', 'cooking', 'smart-home', 'appliances'],
    averageRating: 4.6,
    specifications: [
      { name: 'Capacity', value: '8 Quarts' },
      { name: 'Presets', value: '15 Cook Modes' },
      { name: 'Material', value: 'Stainless Steel' }
    ],
    faqs: [
      { question: 'Is the inner pot dishwasher safe?', answer: 'Yes, the inner non-stick pot is fully dishwasher safe.' }
    ],
    reviews: [
      { user: 'Elena R.', rating: 5, comment: 'Saves so much cooking time. Best purchase ever.', verified: true }
    ]
  },
  {
    id: 'prod-3',
    title: 'Aura Sport Training Leggings',
    description: 'High-waisted compression tights featuring moisture-wicking technology and premium stretch fabrics.',
    price: 65.00,
    category: 'Fashion & Apparel',
    brand: 'AuraWear',
    sku: 'AUR-S-LEG',
    images: ['https://picsum.photos/seed/leggings/600/600'],
    tags: ['clothing', 'athletic', 'stretch', 'leggings'],
    averageRating: 4.5,
    specifications: [
      { name: 'Fabric Type', value: '82% Polyester, 18% Elastane' },
      { name: 'Pocket Count', value: '2 Side Pockets' }
    ],
    faqs: [
      { question: 'Does it have phone pocket?', answer: 'Yes, it features deep lateral pockets that fit large cell phones.' }
    ],
    reviews: [
      { user: 'Julia F.', rating: 4, comment: 'Perfect stretch and thick material. Fits true to size.', verified: true }
    ]
  },
  {
    id: 'prod-4',
    title: 'VeloSport Hybrid Carbon Bicycle',
    description: 'Ultra-lightweight aerodynamic carbon fiber frame. Equipped with Shimano gears and dual hydraulic disc brakes.',
    price: 1450.00,
    category: 'Fitness & Sports',
    brand: 'VeloSport',
    sku: 'VEL-HYB-CARB',
    images: ['https://picsum.photos/seed/bicycle/600/600'],
    tags: ['outdoor', 'fitness', 'cycling', 'bicycle'],
    averageRating: 4.9,
    specifications: [
      { name: 'Frame Material', value: 'Full Carbon Fiber' },
      { name: 'Gears', value: 'Shimano Tiagra 2x10 Speed' },
      { name: 'Weight', value: '8.4 kg' }
    ],
    faqs: [
      { question: 'Is assembly required?', answer: 'It is shipped 85% assembled. Tools and simple instructions are included.' }
    ],
    reviews: [
      { user: 'Robert G.', rating: 5, comment: 'Extraordinarily fast and light. High-end components!', verified: true }
    ]
  }
];

const generatedProducts: Product[] = [];
const categories = ['Electronics', 'Home & Kitchen', 'Fashion & Apparel', 'Fitness & Sports'];
const brands = ['ApexTech', 'NexaHome', 'AuraWear', 'VeloSport'];
const adjectives = ['Pro', 'Ultra', 'Infinity', 'Classic', 'Apex', 'Eco', 'Elite', 'Flex', 'Nomad', 'Summit', 'Vantage', 'Matrix', 'Fusion', 'Axis', 'Element'];

const nounMap: Record<string, string[]> = {
  'Electronics': ['Wireless Earbuds', 'Smart Watch', 'USB-C Docking Station', 'Mechanical Keyboard', '4K Web Camera', 'Noise Cancelling Mic', 'Smart Speaker', 'Power Bank 20k', 'Gaming Mouse', 'IPS Monitor'],
  'Fashion & Apparel': ['Winter Parka Jacket', 'Slim Fit Denim Jeans', 'Runners Mesh Sneakers', 'Wool Knit Sweater', 'Classic Cotton Tee', 'Leather Travel Belt', 'Athletic Crew Socks', 'Waterproof Windbreaker', 'Leather Chelsea Boots', 'Active Track Jacket'],
  'Home & Kitchen': ['Air Fryer Oven', 'Drip Coffee Maker', 'Stainless Knife Set', 'Silicon Spatula Set', 'Non-stick Frying Pan', 'Ceramic Tea Pot', 'Electric Water Kettle', 'Smart Food Scale', 'Knife Sharpener', 'Glass Food Containers'],
  'Fitness & Sports': ['Yoga Foam Roller', 'Adjustable Dumbbell Set', 'Resistance Band Pack', 'Speed Jump Rope', 'Ergonomic Water Bottle', 'Hydration Backpack', 'Cycling GPS Computer', 'Padded Bike Shorts', 'Running Waist Pack', 'Protein Shaker Cup']
};

for (let i = 1; i <= 1000; i++) {
  const cat = categories[i % categories.length];
  const brand = brands[i % brands.length];
  const adj = adjectives[i % adjectives.length];
  const nouns = nounMap[cat];
  const noun = nouns[i % nouns.length];

  const uniqueTitle = `${brand} ${adj} ${noun} v${i}`;
  const uniqueDescription = `The ${brand} ${adj} is a premium ${noun.toLowerCase()} designed for maximum performance in ${cat.toLowerCase()} activities. Version ${i} includes certified components.`;

  // Use deterministic seed-based Picsum URLs that always load correctly
  const uniqueImg = `https://picsum.photos/seed/prod-${i}/600/600`;

  generatedProducts.push({
    id: `generated-prod-${i}`,
    title: uniqueTitle,
    description: uniqueDescription,
    price: parseFloat((45 + (i * 2.5) % 800).toFixed(2)),
    category: cat,
    brand: brand,
    sku: `SKU-GEN-${100000 + i}`,
    images: [uniqueImg],
    tags: [cat.toLowerCase().replace(' ', '-'), brand.toLowerCase(), adj.toLowerCase(), 'generated'],
    averageRating: parseFloat((4.0 + (i % 10) * 0.1).toFixed(1)),
    specifications: [
      { name: 'Model Line', value: `${adj} Series` },
      { name: 'Hardware Revision', value: `Rev-${i}` },
      { name: 'Safety Certificate', value: 'CE Standard' }
    ],
    faqs: [
      { question: 'What is the shipping dimensions?', answer: 'It is packaged in a standard compact box optimized for safe transit.' }
    ],
    reviews: [
      { user: `Customer-${i}`, rating: 5, comment: `High-quality ${noun.toLowerCase()}. Fully satisfied.`, verified: true }
    ]
  });
}

export const PRODUCTS: Product[] = [...initialProducts, ...generatedProducts];

export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Top Smart Kitchen Gadgets for 2026',
    excerpt: 'Discover how multi-cookers and smart temperature sensors are revolutionizing home cooking routines.',
    date: 'June 1, 2026',
  },
  {
    id: 'blog-2',
    title: 'A Guide to Carbon Fiber Aerodynamics',
    excerpt: 'Why high-end hybrid bicycles are shifting to composite fibers and what it means for your speed.',
    date: 'May 28, 2026',
  }
];
