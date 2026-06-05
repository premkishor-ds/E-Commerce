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
    images: ['/images/headphones.png'],
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
    images: ['/images/cooker.png'],
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
    images: ['/images/leggings.png'],
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
    images: ['/images/bicycle.png'],
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

const brands = [
  'Samsung', 'Apple', 'Sony', 'Nike', 'Adidas', 'Dell', 'HP', 'Lenovo', 'OnePlus', 'Google',
  'LG', 'Asus', 'Acer', 'Realme', 'Oppo', 'Vivo', 'Xiaomi', 'Redmi', 'Motorola',
  'Puma', 'Reebok', 'ApexTech', 'NexaHome', 'AuraWear', 'VeloSport'
];

const productTypes = [
  'phone', 'laptop', 'mouse', 'shoes', 'watch', 'TV', 'earbuds', 'speaker',
  'multi-cooker', 'treadmill', 'headphone', 'camera', 'tablet', 'shirt',
  'jacket', 'bag', 'cooker', 'bicycle', 'keyboard', 'monitor',
  'refrigerator', 'washing machine', 'microwave', 'blender', 'air purifier'
];

const productTypeCategoryMap: Record<string, string> = {
  'multi-cooker': 'Home & Kitchen',
  'cooker': 'Home & Kitchen',
  'refrigerator': 'Home & Kitchen',
  'washing machine': 'Home & Kitchen',
  'microwave': 'Home & Kitchen',
  'blender': 'Home & Kitchen',
  'air purifier': 'Home & Kitchen',
  
  'smartwatch': 'Electronics',
  'laptop': 'Electronics',
  'phone': 'Electronics',
  'headphone': 'Electronics',
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
  
  'shirt': 'Fashion & Apparel',
  'shoes': 'Fashion & Apparel',
  'jacket': 'Fashion & Apparel',
  'bag': 'Fashion & Apparel',
  'leggings': 'Fashion & Apparel',
  
  'treadmill': 'Fitness & Sports',
  'bicycle': 'Fitness & Sports'
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
  
  'smartwatch': 'smartwatch,watch',
  'laptop': 'laptop,computer',
  'phone': 'smartphone,phone',
  'headphone': 'headphones,audio',
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
  
  'shirt': 'shirt,apparel',
  'shoes': 'shoes,sneakers',
  'jacket': 'jacket,apparel',
  'bag': 'bag,backpack',
  'leggings': 'leggings,apparel',
  
  'treadmill': 'treadmill,fitness',
  'bicycle': 'bicycle,bike'
};

let idCounter = 1;

function generateMockProducts() {
  for (let b = 0; b < brands.length; b++) {
    for (let p = 0; p < productTypes.length; p++) {
      for (let c = 0; c < colors.length; c++) {
        for (let s = 0; s < sizes.length; s++) {
          if (generatedProducts.length >= 1000) {
            return;
          }
          const brand = brands[b];
          const productType = productTypes[p];
          const cat = productTypeCategoryMap[productType] || 'Electronics';
          
          const kw = keywordMap[productType] || 'gadget';
          const image = `https://loremflickr.com/600/600/${kw}?lock=${idCounter}`;
          
          const color = colors[c];
          const size = sizes[s];
          const basePrice = prices[(b + p + c + s) % prices.length];
          const price = parseFloat((basePrice - (idCounter % 5) * (basePrice > 1000 ? 100 : 5)).toFixed(2));
          
          const uniqueTitle = `${brand} ${productType.charAt(0).toUpperCase() + productType.slice(1)} - ${color.toUpperCase()} (${size})`;
          const uniqueDescription = `This ${brand} ${productType} is a premium product in ${color} color and size ${size}, built for outstanding reliability and performance.`;
          const sku = `SKU-${brand.substring(0, 3).toUpperCase()}-${productType.substring(0, 4).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${size}-${idCounter++}`;
          const tags = [productType, brand.toLowerCase(), color, size.toLowerCase()];
          const averageRating = parseFloat((4.0 + (idCounter % 10) * 0.1).toFixed(1));

          generatedProducts.push({
            id: `generated-prod-${idCounter}`,
            title: uniqueTitle,
            description: uniqueDescription,
            price: price,
            category: cat,
            brand: brand,
            sku: sku,
            images: [image],
            tags: tags,
            averageRating: averageRating,
            specifications: [
              { name: 'Color', value: color },
              { name: 'Size', value: size },
              { name: 'Model Year', value: '2026' }
            ],
            faqs: [
              { question: 'What is the shipping dimensions?', answer: 'It is packaged in a standard compact box optimized for safe transit.' }
            ],
            reviews: [
              { user: `Customer-${idCounter}`, rating: 5, comment: `High-quality ${productType}. Fully satisfied.`, verified: true }
            ]
          });
        }
      }
    }
  }
}

generateMockProducts();

export const PRODUCTS: Product[] = [...initialProducts, ...generatedProducts];
