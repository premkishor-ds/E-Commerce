/**
 * Rule-Based Intent Engine — No AI/LLM dependencies
 * Scores messages against keyword dictionaries and returns ranked intents.
 */

export interface IntentMatch {
  intent: string;
  score: number;
  entities: Record<string, string>;
}

// ─── INTENT DEFINITIONS ───────────────────────────────────────────────────────

const INTENT_KEYWORDS: Record<string, string[]> = {
  GREET: [
    'hi',
    'hello',
    'hey',
    'good morning',
    'good evening',
    'sup',
    'howdy',
    'greetings',
  ],
  REGISTER: [
    'register',
    'sign up',
    'signup',
    'create account',
    'new account',
    'join',
    'get started',
  ],
  LOGIN: ['login', 'log in', 'signin', 'sign in', 'authenticate'],
  LOGOUT: ['logout', 'log out', 'signout', 'sign out', 'exit', 'quit session'],
  RESET_PASSWORD: [
    'reset password',
    'forgot password',
    'recover password',
    'recover account',
  ],
  CHANGE_PASSWORD: [
    'change password',
    'update password',
    'modify password',
    'new password',
  ],
  OTP_VERIFY: [
    'otp',
    'verify otp',
    'enter otp',
    'one time password',
    'code verify',
  ],
  EMAIL_VERIFY: ['verify email', 'email verification', 'confirm email'],
  ADDRESS_MANAGE: [
    'manage address',
    'my address',
    'shipping address',
    'billing address',
    'add address',
    'update address',
    'view addresses',
    'show addresses',
    'my addresses',
  ],
  VIEW_PROFILE: [
    'my profile',
    'view profile',
    'who am i',
    'account info',
    'my account',
    'profile management',
  ],
  UPDATE_PROFILE: [
    'update profile',
    'edit profile',
    'change name',
    'update email',
    'profile picture',
    'profile photo',
    'avatar',
    'update avatar',
    'update my profile picture',
    'update profile picture',
    'change profile picture',
    'change avatar',
    'upload picture',
  ],
  VIEW_LOYALTY: [
    'loyalty',
    'loyalty points',
    'my points',
    'rewards',
    'reward points',
  ],
  VIEW_WALLET: ['wallet', 'my wallet', 'wallet balance', 'balance', 'credit'],
  NOTIFICATION_PREF: [
    'notification preferences',
    'alert settings',
    'notification settings',
    'email alerts',
  ],
  SEARCH_PRODUCT: [
    'search',
    'show me',
    'find',
    'looking for',
    'want',
    'need',
    'get me',
    'i want',
    'display',
    'list',
  ],
  GET_PRODUCT: [
    'product details',
    'tell me about',
    'show details',
    'about this',
    'info on',
    'specification',
    'specifications',
    'show specs',
    'features',
    'variants',
    'warranty',
    'delivery estimate',
    'return policy',
    'seller info',
    'availability',
    'availability check',
    'what is',
    'describe',
  ],
  COMPARE: [
    'compare',
    'vs',
    'versus',
    'difference between',
    'which is better',
    'better between',
  ],
  SHOPPING_ASSISTANT: [
    'best phone under',
    'best laptop under',
    'help me choose',
    'help me pick',
    'what should i buy for',
    'recommend for',
    'gift for',
    'suggest a gift',
    'best for beginners',
    'best for gaming',
    'best earbuds for',
    'best camera for',
    'budget phone',
    'budget laptop',
  ],
  RECOMMEND: [
    'recommend',
    'suggest',
    'what should i buy',
    'best',
    'top',
    'popular',
    'trending',
    'good option',
    'similar products',
    'alternative products',
    'recently viewed',
  ],
  ADD_CART: [
    'add to cart',
    'add it',
    'buy',
    'purchase',
    'get this',
    "i'll take",
    'add this',
    'save for later',
  ],
  REMOVE_CART: [
    'remove from cart',
    'delete from cart',
    'take out',
    'remove it',
    'delete item',
    'clear cart',
    'empty cart',
  ],
  VIEW_CART: [
    'view cart',
    'my cart',
    'show cart',
    "what's in cart",
    'cart items',
    'show my cart',
    'cart summary',
  ],
  UPDATE_CART_QUANTITY: [
    'set quantity',
    'change quantity',
    'increase quantity',
    'decrease quantity',
    'update quantity',
    'update qty',
    'set qty',
    'quantity to',
    'change qty',
    'add more',
    'reduce quantity',
  ],
  SAVE_CART_FOR_LATER: [
    'save cart for later',
    'save my cart',
    'save cart',
    'stash my cart',
    'backup my cart',
  ],
  RESTORE_SAVED_CART: [
    'restore saved cart',
    'restore my cart',
    'restore cart',
    'retrieve saved cart',
    'get my saved cart',
  ],
  APPLY_COUPON: [
    'apply coupon',
    'use coupon',
    'discount code',
    'promo code',
    'apply code',
    'coupon',
  ],
  REMOVE_COUPON: [
    'remove coupon',
    'clear coupon',
    'delete coupon',
    'remove code',
  ],
  CHECKOUT: [
    'checkout',
    'place order',
    'buy now',
    'complete purchase',
    'pay now',
    'start checkout',
  ],
  VIEW_ORDERS: [
    'my orders',
    'order history',
    'past orders',
    'order list',
    'show orders',
    'view orders',
  ],
  TRACK_ORDER: [
    'track order',
    'where is my order',
    'order status',
    'delivery status',
    'shipping status',
    'track my',
  ],
  CANCEL_ORDER: ['cancel order', 'cancel my order', 'stop order', 'cancel ord'],
  MODIFY_ORDER: [
    'change delivery address',
    'update order address',
    'change order',
    'modify order',
    'reschedule delivery',
    'change order quantity',
    'update delivery',
  ],
  RETURN_ORDER: ['return', 'return order', 'send back', 'return request'],
  EXCHANGE_ORDER: [
    'exchange',
    'exchange order',
    'exchange size',
    'exchange color',
    'swap item',
    'swap size',
    'swap color',
    'exchange defective',
  ],
  REFUND: ['refund', 'money back', 'get refund', 'refund request'],
  REORDER: ['reorder', 'buy again', 'purchase again', 'repeat order'],
  DOWNLOAD_INVOICE: [
    'download invoice',
    'get invoice',
    'invoice pdf',
    'receipt',
  ],
  WISHLIST_ADD: [
    'add to wishlist',
    'save to wishlist',
    'wishlist item',
    'favourite',
    'favorite',
    'heart',
  ],
  WISHLIST_VIEW: [
    'my wishlist',
    'view wishlist',
    'saved items',
    'favourites',
    'show wishlist',
  ],
  WISHLIST_REMOVE: [
    'remove from wishlist',
    'unsave',
    'delete from wishlist',
    'remove favorite',
    'unfavourite',
  ],
  MOVE_TO_CART: [
    'move to cart',
    'add from wishlist',
    'move wishlist to cart',
    'buy from wishlist',
    'wishlist to cart',
  ],
  CLEAR_WISHLIST: [
    'clear wishlist',
    'empty wishlist',
    'remove all wishlist',
    'delete all saved',
    'clear saved items',
  ],
  GDPR_EXPORT: [
    'export my data',
    'download my data',
    'export profile data',
    'data portability',
    'gdpr export',
  ],
  GDPR_DELETE: [
    'delete my account',
    'request account deletion',
    'erase my data',
    'right to be forgotten',
    'gdpr delete',
  ],
  CREATE_TICKET: [
    'create ticket',
    'support ticket',
    'open ticket',
    'report issue',
    'complaint',
    'problem',
    'issue',
  ],
  VIEW_TICKETS: [
    'my tickets',
    'view tickets',
    'ticket status',
    'support history',
    'ticket list',
  ],
  ESCALATE: [
    'escalate',
    'talk to agent',
    'human support',
    'connect agent',
    'speak to human',
    'human handoff',
  ],
  LIVE_AGENT: [
    'live agent',
    'live chat',
    'talk to human now',
    'connect to support',
    'real person',
    'agent please',
  ],
  REVIEW_PRODUCT: [
    'leave review',
    'write review',
    'rate product',
    'submit review',
    'give feedback',
    'rate my purchase',
  ],
  VIEW_REVIEWS: [
    'show reviews',
    'read reviews',
    'product reviews',
    'view reviews',
    'customer reviews',
    'star reviews',
    'positive reviews',
    'negative reviews',
    '1 star',
    '5 star',
    'verified reviews',
  ],
  BROWSE_CATEGORY: [
    'category',
    'categories',
    'browse',
    'electronics',
    'fashion',
    'kitchen',
    'fitness',
    'sports',
  ],
  INVENTORY_CHECK: [
    'in stock',
    'available',
    'stock',
    'availability',
    'how many left',
  ],
  PRICE_ALERT: [
    'notify me when',
    'alert me when',
    'price drops',
    'back in stock alert',
    'notify when available',
    'price drop alert',
    'let me know when',
    'notify when price',
  ],
  ADMIN_PRODUCTS: [
    'manage products',
    'edit product',
    'delete product',
    'admin product',
    'product management',
    'add product',
    'update product',
    'disable product',
    'enable product',
    'bulk import',
    'update price',
    'update inventory',
  ],
  ADMIN_ORDERS: [
    'manage orders',
    'all orders',
    'admin orders',
    'order management',
    'update order status',
    'approve refund',
    'generate invoice',
  ],
  ADMIN_USERS: [
    'manage users',
    'user list',
    'customers list',
    'admin users',
    'role management',
    'permission management',
  ],
  ADMIN_COUPONS: [
    'manage coupons',
    'create coupon',
    'coupon management',
    'new coupon',
  ],
  ADMIN_ANALYTICS: [
    'system analytics',
    'audit logs',
    'sales analytics',
    'cms management',
    'review moderation',
    "today's sales",
    'monthly sales',
    'top products',
    'low stock products',
    'top customers',
    'revenue trends',
    'conversion rate',
    'cart abandonment',
  ],
  VENDOR_PRODUCTS: [
    'my products',
    'vendor products',
    'my listings',
    'inventory management',
    'add my product',
  ],
  VENDOR_ANALYTICS: [
    'my sales',
    'vendor analytics',
    'sales report',
    'my revenue',
    'my earnings',
  ],
  VENDOR_SETTLEMENTS: [
    'my settlements',
    'vendor settlements',
    'payouts',
    'settlement status',
    'payout history',
  ],
  ADD_ADDRESS: [
    'add new address',
    'add address',
    'new shipping address',
    'new delivery address',
    'add home address',
    'add office address',
  ],
  UPDATE_ADDRESS: [
    'update address',
    'edit address',
    'change address',
    'modify address',
    'change pincode',
    'update pincode',
    'change city',
  ],
  DELETE_ADDRESS: [
    'delete address',
    'remove address',
    'delete home address',
    'remove office address',
  ],
  SET_DEFAULT_ADDRESS: [
    'set default address',
    'make default',
    'default address',
    'set as default',
    'primary address',
  ],
  VIEW_PAYMENT_METHODS: [
    'my payment methods',
    'saved cards',
    'payment methods',
    'my cards',
    'saved payments',
    'view payment',
  ],
  ADD_PAYMENT_METHOD: [
    'add card',
    'add upi',
    'add payment method',
    'save card',
    'new payment method',
    'add payment',
  ],
  DELETE_PAYMENT_METHOD: [
    'remove card',
    'delete card',
    'remove payment method',
    'delete payment',
  ],
  HELP: ['help', 'what can you do', 'commands', 'guide', 'how to', 'assist'],
  THANKS: [
    'thank',
    'thanks',
    'thank you',
    'appreciate',
    'great',
    'awesome',
    'perfect',
  ],
  BYE: ['bye', 'goodbye', 'see you', 'later'],
  RETRY_PAYMENT: [
    'retry payment',
    'pay again',
    'retry pay',
    'try payment again',
  ],
  VIEW_PAYMENT_HISTORY: [
    'show payment history',
    'payment history',
    'my payments',
    'payment list',
  ],
  CHECK_PAYMENT_STATUS: [
    'check payment status',
    'payment status',
    'is my payment successful',
  ],
  RECOVER_CART: [
    'recover my cart',
    'resume checkout',
    'show abandoned cart',
    'recover cart',
  ],
};

// ─── ENTITY EXTRACTOR ─────────────────────────────────────────────────────────

export function extractEntities(text: string): Record<string, string> {
  const entities: Record<string, string> = {};
  const lower = text.toLowerCase();

  // ── Price constraints ────────────────────────────────────────────────────
  const priceMatch = lower.match(/under\s+[$₹£€]?\s*(\d[\d,]*)/);
  if (priceMatch) entities.maxPrice = priceMatch[1].replace(/,/g, '');

  const minPriceMatch = lower.match(/above\s+[$₹£€]?\s*(\d[\d,]*)/);
  if (minPriceMatch) entities.minPrice = minPriceMatch[1].replace(/,/g, '');

  // Between price range: "between X and Y" / "X to Y"
  const betweenMatch = lower.match(
    /between\s+[$₹£€]?\s*(\d[\d,]*)\s+and\s+[$₹£€]?\s*(\d[\d,]*)/,
  );
  if (betweenMatch) {
    entities.minPrice = betweenMatch[1].replace(/,/g, '');
    entities.maxPrice = betweenMatch[2].replace(/,/g, '');
  }
  const rangeMatch = lower.match(
    /[$₹£€]?\s*(\d[\d,]*)\s+to\s+[$₹£€]?\s*(\d[\d,]*)/,
  );
  if (rangeMatch && !betweenMatch) {
    entities.minPrice = rangeMatch[1].replace(/,/g, '');
    entities.maxPrice = rangeMatch[2].replace(/,/g, '');
  }

  // Rating filter: "above 4 stars", "4+ rating", "minimum 4 stars"
  const minRatingMatch = lower.match(
    /(?:above|minimum|at least|\+)\s*(\d)\s*(?:star|stars|rating)?/,
  );
  if (minRatingMatch) entities.minRating = minRatingMatch[1];
  // Exact rating filter for review listing: "1 star reviews"
  const exactRatingMatch = lower.match(
    /\b([1-5])\s*(?:star|stars)\s*(?:review|reviews)?\b/,
  );
  if (exactRatingMatch) entities.rating = exactRatingMatch[1];

  // ── Coupon code ──────────────────────────────────────────────────────────
  const couponMatch = text.match(/\b([A-Z][A-Z0-9]{3,11})\b/);
  if (couponMatch) entities.couponCode = couponMatch[1];

  // ── Order ID ──────────────────────────────────────────────────────────────
  const orderIdMatch = text.match(/ORD[-\s]?([A-Z0-9]{5,24})/i);
  if (orderIdMatch) entities.orderId = 'ORD-' + orderIdMatch[1].toUpperCase();

  // ── Email ─────────────────────────────────────────────────────────────────
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  if (emailMatch) entities.email = emailMatch[0];

  // ── Quantity ──────────────────────────────────────────────────────────────
  const qtyMatch = lower.match(/(\d+)\s*(item|piece|unit|qty|quantity|x)/);
  if (qtyMatch) entities.quantity = qtyMatch[1];
  // "set to 3", "change to 5", "quantity to 2"
  const qtyToMatch = lower.match(
    /(?:set|change|update|quantity)\s+(?:to|=)\s*(\d+)/,
  );
  if (qtyToMatch) entities.quantity = qtyToMatch[1];

  // ── Target price for alerts ───────────────────────────────────────────────
  const alertPriceMatch = lower.match(
    /(?:below|under|at|drops to|reaches)\s+[$₹£€]?\s*(\d[\d,]*)/,
  );
  if (alertPriceMatch)
    entities.alertPrice = alertPriceMatch[1].replace(/,/g, '');

  // ── Variant attributes ───────────────────────────────────────────────────
  const colors = [
    'red',
    'blue',
    'black',
    'white',
    'gold',
    'silver',
    'green',
    'yellow',
    'pink',
    'gray',
    'grey',
    'purple',
    'orange',
  ];
  for (const c of colors) {
    if (lower.includes(c)) {
      entities.color = c;
      break;
    }
  }
  const sizes = [
    'xxl',
    'xl',
    'xs',
    'small',
    'medium',
    'large',
    'size 6',
    'size 7',
    'size 8',
    'size 9',
    'size 10',
    'size 11',
    'size 12',
  ];
  const sizeAliases: Record<string, string> = {
    small: 'S',
    medium: 'M',
    large: 'L',
    xl: 'XL',
    xxl: 'XXL',
    xs: 'XS',
  };
  for (const s of sizes) {
    if (lower.includes(s)) {
      entities.size = sizeAliases[s] || s.replace('size ', '');
      break;
    }
  }
  const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
  if (ramMatch) entities.ram = ramMatch[1] + 'GB';
  const storageMatch = lower.match(
    /(\d+)\s*(?:gb|tb)\s*(?:storage|ssd|rom|disk)?/,
  );
  if (storageMatch && !ramMatch)
    entities.storage = storageMatch[0].replace(/\s+/g, '').toUpperCase();

  // ── Product name from comparison queries ─────────────────────────────────
  // "compare A vs B" / "compare A versus B"
  const compareMatch = text.match(
    /compare\s+(.+?)\s+(?:vs|versus|or|against)\s+(.+)/i,
  );
  if (compareMatch) {
    entities.compareProductA = compareMatch[1].trim();
    entities.compareProductB = compareMatch[2].trim();
  }

  // ── Category keywords ────────────────────────────────────────────────────
  const categories = [
    'electronics',
    'fashion',
    'kitchen',
    'fitness',
    'sports',
    'apparel',
    'home',
    'beauty',
    'books',
    'toys',
  ];
  for (const cat of categories) {
    if (lower.includes(cat)) {
      entities.category = cat;
      break;
    }
  }

  // ── Product type keywords ─────────────────────────────────────────────────
  const productTypes = [
    'multi-cooker',
    'smartwatch',
    'treadmill',
    'laptop',
    'phone',
    'headphone',
    'earphone',
    'earbud',
    'speaker',
    'watch',
    'camera',
    'tablet',
    'shirt',
    'shoes',
    'jacket',
    'bag',
    'cooker',
    'bicycle',
    'keyboard',
    'mouse',
    'monitor',
    'television',
    'tv',
    'refrigerator',
    'washing machine',
    'microwave',
    'blender',
    'air purifier',
  ];
  const sortedProductTypes = [...productTypes].sort(
    (a, b) => b.length - a.length,
  );
  for (const pt of sortedProductTypes) {
    if (lower.includes(pt)) {
      entities.productType = pt;
      break;
    }
  }

  // ── Brand keywords ────────────────────────────────────────────────────────
  const brands = [
    'apple',
    'samsung',
    'sony',
    'lg',
    'dell',
    'hp',
    'lenovo',
    'asus',
    'acer',
    'oneplus',
    'realme',
    'oppo',
    'vivo',
    'xiaomi',
    'redmi',
    'motorola',
    'nike',
    'adidas',
    'puma',
    'reebok',
    'apextech',
    'nexahome',
    'aurawear',
    'velosport',
  ];
  for (const brand of brands) {
    if (lower.includes(brand)) {
      entities.brand = brand;
      break;
    }
  }

  // ── Sort preference ───────────────────────────────────────────────────────
  if (
    lower.includes('cheapest') ||
    lower.includes('lowest price') ||
    lower.includes('low to high')
  )
    entities.sort = 'price_asc';
  if (
    lower.includes('expensive') ||
    lower.includes('highest price') ||
    lower.includes('high to low')
  )
    entities.sort = 'price_desc';
  if (
    lower.includes('best rated') ||
    lower.includes('top rated') ||
    lower.includes('highest rating')
  )
    entities.sort = 'rating_desc';
  if (
    lower.includes('newest') ||
    lower.includes('latest') ||
    lower.includes('new arrival')
  )
    entities.sort = 'newest';
  if (
    lower.includes('best selling') ||
    lower.includes('most popular') ||
    lower.includes('trending')
  )
    entities.sort = 'sales_desc';

  // ── Address label ─────────────────────────────────────────────────────────
  if (lower.includes('home address') || lower.includes('home'))
    entities.addressLabel = 'Home';
  if (
    lower.includes('office address') ||
    lower.includes('office') ||
    lower.includes('work')
  )
    entities.addressLabel = 'Office';

  // ── Payment type ──────────────────────────────────────────────────────────
  if (lower.includes('upi')) entities.paymentType = 'upi';
  else if (
    lower.includes('card') ||
    lower.includes('credit') ||
    lower.includes('debit')
  )
    entities.paymentType = 'card';
  else if (lower.includes('wallet')) entities.paymentType = 'wallet';
  else if (lower.includes('cod') || lower.includes('cash on delivery'))
    entities.paymentType = 'cod';
  else if (lower.includes('net banking') || lower.includes('netbanking'))
    entities.paymentType = 'netbanking';

  // ── Review section filter ─────────────────────────────────────────────────
  if (lower.includes('positive') || lower.includes('good reviews'))
    entities.reviewFilter = 'positive';
  if (lower.includes('negative') || lower.includes('bad reviews'))
    entities.reviewFilter = 'negative';
  if (lower.includes('verified')) entities.reviewFilter = 'verified';

  return entities;
}

// ─── INTENT SCORER ────────────────────────────────────────────────────────────

export function classifyIntent(message: string): IntentMatch {
  const lower = message.toLowerCase().trim();
  const scores: Record<string, number> = {};

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let maxScore = 0;
    for (const kw of keywords) {
      let score = 0;
      if (lower === kw) {
        score = 10;
      } // Exact match
      else if (lower.startsWith(kw)) {
        score = 7;
      } // Starts with
      else if (lower.includes(kw)) {
        score = 4;
      } // Contains
      else {
        // Partial token match
        const kwTokens = kw.split(' ');
        const msgTokens = lower.split(/\s+/);
        const matches = kwTokens.filter((t) => msgTokens.includes(t)).length;
        score = matches * 1.5;
      }
      if (score > maxScore) {
        maxScore = score;
      }
    }
    if (maxScore > 0) scores[intent] = maxScore;
  }

  // Find highest-scoring intent
  let topIntent = 'UNKNOWN';
  let topScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topIntent = intent;
    }
  }

  return {
    intent: topIntent,
    score: topScore,
    entities: extractEntities(message),
  };
}

// ─── PERMISSION MAP ───────────────────────────────────────────────────────────

export const INTENT_PERMISSIONS: Record<string, string[]> = {
  ADD_CART: ['Customer', 'Admin', 'Super Admin'],
  REMOVE_CART: ['Customer', 'Admin', 'Super Admin'],
  VIEW_CART: ['Customer', 'Admin', 'Super Admin'],
  UPDATE_CART_QUANTITY: ['Customer', 'Admin', 'Super Admin'],
  APPLY_COUPON: ['Customer', 'Admin', 'Super Admin'],
  REMOVE_COUPON: ['Customer', 'Admin', 'Super Admin'],
  CHECKOUT: ['Customer', 'Admin', 'Super Admin'],
  VIEW_ORDERS: ['Customer', 'Admin', 'Super Admin'],
  TRACK_ORDER: ['Customer', 'Admin', 'Super Admin'],
  CANCEL_ORDER: ['Customer', 'Admin', 'Super Admin'],
  MODIFY_ORDER: ['Customer', 'Admin', 'Super Admin'],
  RETURN_ORDER: ['Customer', 'Admin', 'Super Admin'],
  EXCHANGE_ORDER: ['Customer', 'Admin', 'Super Admin'],
  REFUND: ['Customer', 'Admin', 'Super Admin'],
  REORDER: ['Customer', 'Admin', 'Super Admin'],
  DOWNLOAD_INVOICE: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_ADD: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_VIEW: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_REMOVE: ['Customer', 'Admin', 'Super Admin'],
  MOVE_TO_CART: ['Customer', 'Admin', 'Super Admin'],
  CLEAR_WISHLIST: ['Customer', 'Admin', 'Super Admin'],
  PRICE_ALERT: ['Customer', 'Admin', 'Super Admin'],
  GDPR_EXPORT: [
    'Customer',
    'Admin',
    'Super Admin',
    'Vendor',
    'Customer Support',
  ],
  GDPR_DELETE: [
    'Customer',
    'Admin',
    'Super Admin',
    'Vendor',
    'Customer Support',
  ],
  CREATE_TICKET: ['Customer', 'Admin', 'Super Admin', 'Customer Support'],
  VIEW_TICKETS: ['Customer', 'Admin', 'Super Admin', 'Customer Support'],
  ESCALATE: ['Customer', 'Admin', 'Super Admin'],
  LIVE_AGENT: ['Customer', 'Admin', 'Super Admin'],
  REVIEW_PRODUCT: ['Customer', 'Admin', 'Super Admin'],
  VIEW_REVIEWS: [],
  UPDATE_PROFILE: [
    'Customer',
    'Admin',
    'Super Admin',
    'Vendor',
    'Customer Support',
  ],
  ADDRESS_MANAGE: [
    'Customer',
    'Admin',
    'Super Admin',
    'Vendor',
    'Customer Support',
  ],
  ADD_ADDRESS: ['Customer', 'Admin', 'Super Admin', 'Vendor'],
  UPDATE_ADDRESS: ['Customer', 'Admin', 'Super Admin', 'Vendor'],
  DELETE_ADDRESS: ['Customer', 'Admin', 'Super Admin', 'Vendor'],
  SET_DEFAULT_ADDRESS: ['Customer', 'Admin', 'Super Admin', 'Vendor'],
  VIEW_PAYMENT_METHODS: ['Customer', 'Admin', 'Super Admin'],
  ADD_PAYMENT_METHOD: ['Customer', 'Admin', 'Super Admin'],
  DELETE_PAYMENT_METHOD: ['Customer', 'Admin', 'Super Admin'],
  VIEW_LOYALTY: ['Customer', 'Admin', 'Super Admin'],
  VIEW_WALLET: ['Customer', 'Admin', 'Super Admin'],
  NOTIFICATION_PREF: [
    'Customer',
    'Admin',
    'Super Admin',
    'Vendor',
    'Customer Support',
  ],
  ADMIN_PRODUCTS: ['Admin', 'Super Admin'],
  ADMIN_ORDERS: ['Admin', 'Super Admin', 'Customer Support'],
  ADMIN_USERS: ['Admin', 'Super Admin'],
  ADMIN_COUPONS: ['Admin', 'Super Admin'],
  ADMIN_ANALYTICS: ['Admin', 'Super Admin'],
  VENDOR_PRODUCTS: ['Vendor', 'Seller', 'Admin', 'Super Admin'],
  VENDOR_ANALYTICS: ['Vendor', 'Seller', 'Admin', 'Super Admin'],
  VENDOR_SETTLEMENTS: ['Vendor', 'Seller', 'Admin', 'Super Admin'],
  SAVE_CART_FOR_LATER: ['Customer', 'Admin', 'Super Admin'],
  RESTORE_SAVED_CART: ['Customer', 'Admin', 'Super Admin'],
  RETRY_PAYMENT: ['Customer', 'Admin', 'Super Admin'],
  VIEW_PAYMENT_HISTORY: ['Customer', 'Admin', 'Super Admin'],
  CHECK_PAYMENT_STATUS: ['Customer', 'Admin', 'Super Admin'],
  RECOVER_CART: ['Customer', 'Admin', 'Super Admin'],
};

export function hasPermission(intent: string, userRoles: string[]): boolean {
  const required = INTENT_PERMISSIONS[intent];
  if (!required) return true; // Public intent
  return userRoles.some((role) => required.includes(role));
}
