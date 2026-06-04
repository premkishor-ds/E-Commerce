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
    'variants',
    'availability',
    'availability check',
  ],
  COMPARE: ['compare', 'vs', 'versus', 'difference between', 'which is better'],
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
  ],
  VIEW_CART: [
    'view cart',
    'my cart',
    'show cart',
    "what's in cart",
    'cart items',
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
  RETURN_ORDER: [
    'return',
    'return order',
    'send back',
    'return request',
    'exchange order',
    'exchange',
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
  ],
  WISHLIST_VIEW: ['my wishlist', 'view wishlist', 'saved items', 'favourites'],
  WISHLIST_REMOVE: [
    'remove from wishlist',
    'unsave',
    'delete wishlist',
    'remove favorite',
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
  REVIEW_PRODUCT: [
    'review',
    'rate',
    'rating',
    'leave review',
    'write review',
    'feedback',
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
  INVENTORY_CHECK: ['in stock', 'available', 'stock', 'availability'],
  ADMIN_PRODUCTS: [
    'manage products',
    'edit product',
    'delete product',
    'admin product',
    'product management',
  ],
  ADMIN_ORDERS: [
    'manage orders',
    'all orders',
    'admin orders',
    'order management',
  ],
  ADMIN_USERS: [
    'manage users',
    'user list',
    'customers list',
    'admin users',
    'role management',
    'permission management',
  ],
  ADMIN_COUPONS: ['manage coupons', 'create coupon', 'coupon management'],
  ADMIN_ANALYTICS: [
    'system analytics',
    'audit logs',
    'sales analytics',
    'cms management',
    'review moderation',
  ],
  VENDOR_PRODUCTS: [
    'my products',
    'vendor products',
    'my listings',
    'inventory management',
  ],
  VENDOR_ANALYTICS: [
    'my sales',
    'vendor analytics',
    'sales report',
    'my revenue',
  ],
  VENDOR_SETTLEMENTS: [
    'my settlements',
    'vendor settlements',
    'payouts',
    'settlement status',
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
};

// ─── ENTITY EXTRACTOR ─────────────────────────────────────────────────────────

export function extractEntities(text: string): Record<string, string> {
  const entities: Record<string, string> = {};
  const lower = text.toLowerCase();

  // Extract price constraints
  const priceMatch = lower.match(/under\s+[\$₹£€]?\s*(\d[\d,]*)/);
  if (priceMatch) entities.maxPrice = priceMatch[1].replace(',', '');

  const minPriceMatch = lower.match(/above\s+[\$₹£€]?\s*(\d[\d,]*)/);
  if (minPriceMatch) entities.minPrice = minPriceMatch[1].replace(',', '');

  // Extract coupon code (all-caps words 4-12 chars)
  const couponMatch = text.match(/\b([A-Z][A-Z0-9]{3,11})\b/);
  if (couponMatch) entities.couponCode = couponMatch[1];

  // Extract order ID (supports standard short IDs or 24-character MongoDB ObjectIds)
  const orderIdMatch = text.match(/ORD[-\s]?([A-Z0-9]{5,24})/i);
  if (orderIdMatch) entities.orderId = 'ORD-' + orderIdMatch[1].toUpperCase();

  // Extract email
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  );
  if (emailMatch) entities.email = emailMatch[0];

  // Extract rating number (1-5)
  const ratingMatch = lower.match(/\b([1-5])\s*(star|stars|\/5)?\b/);
  if (ratingMatch) entities.rating = ratingMatch[1];

  // Extract quantity
  const qtyMatch = lower.match(/(\d+)\s*(item|piece|unit|qty|quantity|x)/);
  if (qtyMatch) entities.quantity = qtyMatch[1];

  // Extract category keywords
  const categories = [
    'electronics',
    'fashion',
    'kitchen',
    'fitness',
    'sports',
    'apparel',
    'home',
  ];
  for (const cat of categories) {
    if (lower.includes(cat)) {
      entities.category = cat;
      break;
    }
  }

  // Extract common product type keywords
  const productTypes = [
    'laptop',
    'phone',
    'headphone',
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
    'treadmill',
    'keyboard',
    'mouse',
  ];
  const sortedProductTypes = [...productTypes].sort((a, b) => b.length - a.length);
  for (const pt of sortedProductTypes) {
    if (lower.includes(pt)) {
      entities.productType = pt;
      break;
    }
  }

  // Extract brand keywords
  const brands = [
    'apple',
    'samsung',
    'sony',
    'lg',
    'dell',
    'hp',
    'lenovo',
    'asus',
    'nike',
    'adidas',
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

  // Extract sort preference
  if (lower.includes('cheapest') || lower.includes('lowest price'))
    entities.sort = 'price_asc';
  if (lower.includes('expensive') || lower.includes('highest price'))
    entities.sort = 'price_desc';
  if (lower.includes('best rated') || lower.includes('top rated'))
    entities.sort = 'rating_desc';
  if (lower.includes('newest') || lower.includes('latest'))
    entities.sort = 'newest';

  return entities;
}

// ─── INTENT SCORER ────────────────────────────────────────────────────────────

export function classifyIntent(message: string): IntentMatch {
  const lower = message.toLowerCase().trim();
  const scores: Record<string, number> = {};

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower === kw) {
        score += 10;
      } // Exact match
      else if (lower.startsWith(kw)) {
        score += 7;
      } // Starts with
      else if (lower.includes(kw)) {
        score += 4;
      } // Contains
      else {
        // Partial token match
        const kwTokens = kw.split(' ');
        const msgTokens = lower.split(/\s+/);
        const matches = kwTokens.filter((t) => msgTokens.includes(t)).length;
        score += matches * 1.5;
      }
    }
    if (score > 0) scores[intent] = score;
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
  APPLY_COUPON: ['Customer', 'Admin', 'Super Admin'],
  REMOVE_COUPON: ['Customer', 'Admin', 'Super Admin'],
  CHECKOUT: ['Customer', 'Admin', 'Super Admin'],
  VIEW_ORDERS: ['Customer', 'Admin', 'Super Admin'],
  CANCEL_ORDER: ['Customer', 'Admin', 'Super Admin'],
  RETURN_ORDER: ['Customer', 'Admin', 'Super Admin'],
  REFUND: ['Customer', 'Admin', 'Super Admin'],
  REORDER: ['Customer', 'Admin', 'Super Admin'],
  DOWNLOAD_INVOICE: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_ADD: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_VIEW: ['Customer', 'Admin', 'Super Admin'],
  WISHLIST_REMOVE: ['Customer', 'Admin', 'Super Admin'],
  GDPR_EXPORT: ['Customer', 'Admin', 'Super Admin', 'Vendor', 'Customer Support'],
  GDPR_DELETE: ['Customer', 'Admin', 'Super Admin', 'Vendor', 'Customer Support'],
  CREATE_TICKET: ['Customer', 'Admin', 'Super Admin', 'Customer Support'],
  VIEW_TICKETS: ['Customer', 'Admin', 'Super Admin', 'Customer Support'],
  ESCALATE: ['Customer', 'Admin', 'Super Admin'],
  REVIEW_PRODUCT: ['Customer', 'Admin', 'Super Admin'],
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
};

export function hasPermission(intent: string, userRoles: string[]): boolean {
  const required = INTENT_PERMISSIONS[intent];
  if (!required) return true; // Public intent
  return userRoles.some((role) => required.includes(role));
}
