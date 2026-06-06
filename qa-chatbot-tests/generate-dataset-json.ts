import * as fs from 'fs';
import * as path from 'path';

// Helper arrays
const PRODUCTS = [
  'phone', 'laptop', 'headphones', 'keyboard', 'mouse', 'monitor', 'camera',
  'smartwatch', 'speaker', 'tablet', 'charger', 'cable', 'backpack', 'desk lamp',
  'router', 'microphone', 'projector', 'earbuds', 'hard drive', 'graphics card'
];

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Logitech',
  'Bose', 'LG', 'Intel', 'AMD', 'Nvidia', 'Xiaomi', 'OnePlus', 'Microsoft'
];

const EMOTIONS = [
  'angry', 'disappointed', 'frustrated', 'impatient', 'upset', 'annoyed'
];

interface TestCase {
  id: string;
  category: string;
  priority: string;
  userType: string;
  preConditions: Record<string, any>;
  conversation: {
    user: string;
    expectedBot: {
      intent: string;
      messageContains: string[];
      showSuggestions?: boolean;
      brand?: string;
      budget?: number;
      showProducts?: boolean;
      expectedEntities?: Record<string, string>;
      expectedAction?: string;
      expectedResponse?: string;
      expectedUI?: string;
      expectedButtons?: string[];
      expectedSuggestions?: string[];
      expectedDatabaseChange?: string;
      expectedAPICall?: string;
      expectedFollowUp?: string;
      expectedSuccessCriteria?: string;
    };
  }[];
}

function generateAllCases(): TestCase[] {
  const cases: TestCase[] = [];

  // 1. GREETING (100 cases)
  const greetingTemplates = [
    'hello', 'hi', 'hey', 'good morning', 'good evening', 'yo', 'sup', 'hello there', 'hey bot', 'greetings',
    'hi there', 'hello assistant', 'hey assistant', 'good afternoon', 'good day', 'greetings bot', 'hello friend',
    'hi bot', 'howdy', 'whatsup'
  ];
  for (let i = 0; i < 100; i++) {
    const user = greetingTemplates[i % greetingTemplates.length];
    cases.push({
      id: `GREETING_${String(i + 1).padStart(3, '0')}`,
      category: 'greeting',
      priority: 'high',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user,
          expectedBot: {
            intent: 'GREET',
            messageContains: ['hello', 'hi', 'how can', 'help'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'GREET',
            expectedResponse: 'Hello! Welcome to ApexStore. How can I help you today?',
            expectedUI: 'text_with_suggestions',
            expectedButtons: [],
            expectedSuggestions: ['Search products', 'My orders', 'Help'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'none',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot greets the user and displays primary suggestions'
          }
        }
      ]
    });
  }

  // 2. CAPABILITY DISCOVERY (100 cases)
  const capabilityQueries = [
    'help', 'what can you do', 'show options', 'guide', 'commands', 'menu', 'options', 'list capabilities', 'features', 'what do you do',
    'help me', 'how to use', 'list features', 'info', 'support guide', 'instructions', 'bot guide', 'what options do i have', 'help options', 'what is this'
  ];
  for (let i = 0; i < 100; i++) {
    const user = capabilityQueries[i % capabilityQueries.length];
    cases.push({
      id: `CAPABILITY_${String(i + 1).padStart(3, '0')}`,
      category: 'capability_discovery',
      priority: 'medium',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user,
          expectedBot: {
            intent: 'HELP',
            messageContains: ['search', 'cart', 'order', 'help', 'ticket'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'HELP',
            expectedResponse: 'Here is what I can do: search products, manage cart, track orders, and raise support tickets.',
            expectedUI: 'menu_list',
            expectedButtons: [],
            expectedSuggestions: ['Search products', 'View cart', 'Track order', 'Create support ticket'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'none',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot lists help options and capability suggestions'
          }
        }
      ]
    });
  }

  // 3. PRODUCT SEARCH (300 cases)
  for (let i = 0; i < 300; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    const price = 10000 + (i % 5) * 10000;
    
    cases.push({
      id: `PRODUCT_SEARCH_${String(i + 1).padStart(3, '0')}`,
      category: 'product_search',
      priority: 'high',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: `need a ${brand} ${prod}`,
          expectedBot: {
            intent: 'SEARCH_PRODUCT',
            messageContains: [prod.toLowerCase()],
            showSuggestions: true,
            expectedEntities: { brand, productType: prod },
            expectedAction: 'SEARCH_PRODUCT',
            expectedResponse: `Here are the matching ${brand} ${prod}s`,
            expectedUI: 'product_grid',
            expectedButtons: [],
            expectedSuggestions: [`Add ${brand} ${prod} to cart`, 'Compare products'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'searchProductsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot returns products matching brand and product type'
          }
        }
      ]
    });
  }

  // 4. PRODUCT DETAILS (200 cases)
  for (let i = 0; i < 200; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    cases.push({
      id: `PRODUCT_DETAILS_${String(i + 1).padStart(3, '0')}`,
      category: 'product_details',
      priority: 'high',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: `show specs of ${brand} ${prod}`,
          expectedBot: {
            intent: 'GET_PRODUCT',
            messageContains: ['specifications', 'price', 'rating'],
            showSuggestions: true,
            expectedEntities: { brand, productType: prod },
            expectedAction: 'GET_PRODUCT',
            expectedResponse: `Specifications for ${brand} ${prod}`,
            expectedUI: 'specification_sheet',
            expectedSuggestions: ['Add to cart', 'Add to wishlist', 'Go back'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'getProductDetailsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot retrieves and displays product detailed specification sheet'
          }
        }
      ]
    });
  }

  // 5. PRODUCT COMPARISON (150 cases)
  for (let i = 0; i < 150; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand1 = BRANDS[i % BRANDS.length];
    const brand2 = BRANDS[(i + 1) % BRANDS.length];
    cases.push({
      id: `COMPARISON_${String(i + 1).padStart(3, '0')}`,
      category: 'product_comparison',
      priority: 'medium',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: `compare ${brand1} ${prod} vs ${brand2} ${prod}`,
          expectedBot: {
            intent: 'COMPARE',
            messageContains: ['price', 'rating', 'value', 'comparison'],
            showSuggestions: true,
            expectedEntities: { brand1, brand2, productType: prod },
            expectedAction: 'COMPARE',
            expectedResponse: `Here is the comparison table between ${brand1} and ${brand2} ${prod}`,
            expectedUI: 'comparison_table',
            expectedSuggestions: [`Add ${brand1} to cart`, `Add ${brand2} to cart`],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'compareProductsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot renders comparison table side-by-side'
          }
        }
      ]
    });
  }

  // 6. RECOMMENDATIONS (150 cases)
  for (let i = 0; i < 150; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    cases.push({
      id: `RECOMMENDATION_${String(i + 1).padStart(3, '0')}`,
      category: 'recommendations',
      priority: 'medium',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: `recommend the best ${prod} for gaming`,
          expectedBot: {
            intent: 'RECOMMEND',
            messageContains: ['best', 'gaming', 'rating', 'recommend'],
            showSuggestions: true,
            expectedEntities: { productType: prod, tag: 'gaming' },
            expectedAction: 'RECOMMEND',
            expectedResponse: `Here are our recommended ${prod}s for gaming`,
            expectedUI: 'product_carousel',
            expectedSuggestions: ['More details', 'Add to cart'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'getRecommendationsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot returns list of recommended items matching the criteria tag'
          }
        }
      ]
    });
  }

  // 7. CART (150 cases)
  const cartActions = [
    { query: 'add laptop to cart', intent: 'ADD_CART', action: 'ADD_TO_CART' },
    { query: 'view my shopping cart', intent: 'VIEW_CART', action: 'VIEW_CART' },
    { query: 'remove laptop from cart', intent: 'REMOVE_CART', action: 'REMOVE_FROM_CART' },
    { query: 'update quantity to 3', intent: 'UPDATE_CART_QUANTITY', action: 'UPDATE_CART_QUANTITY' },
    { query: 'clear my entire cart', intent: 'REMOVE_CART', action: 'REMOVE_FROM_CART' }
  ];
  for (let i = 0; i < 150; i++) {
    const act = cartActions[i % cartActions.length];
    cases.push({
      id: `CART_${String(i + 1).padStart(3, '0')}`,
      category: 'cart',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: act.query,
          expectedBot: {
            intent: act.intent,
            messageContains: ['cart', 'success', 'update', 'remove'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: act.action,
            expectedResponse: 'Cart updated successfully.',
            expectedUI: 'cart_view',
            expectedSuggestions: ['View cart', 'Checkout'],
            expectedDatabaseChange: 'cart_record_update',
            expectedAPICall: 'updateCartAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Cart operation executed and returns confirmation message'
          }
        }
      ]
    });
  }

  // 8. WISHLIST (100 cases)
  const wishlistActions = [
    { query: 'save phone to wishlist', intent: 'WISHLIST_ADD', action: 'UPDATE_WISHLIST' },
    { query: 'show my wishlist', intent: 'WISHLIST_VIEW', action: 'UPDATE_WISHLIST' },
    { query: 'remove item from wishlist', intent: 'WISHLIST_REMOVE', action: 'UPDATE_WISHLIST' }
  ];
  for (let i = 0; i < 100; i++) {
    const act = wishlistActions[i % wishlistActions.length];
    cases.push({
      id: `WISHLIST_${String(i + 1).padStart(3, '0')}`,
      category: 'wishlist',
      priority: 'medium',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: act.query,
          expectedBot: {
            intent: act.intent,
            messageContains: ['wishlist', 'saved', 'items'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: act.action,
            expectedResponse: 'Wishlist action completed successfully.',
            expectedUI: 'wishlist_view',
            expectedSuggestions: ['Move to cart', 'Continue shopping'],
            expectedDatabaseChange: 'wishlist_record_update',
            expectedAPICall: 'updateWishlistAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Wishlist modified correctly and returns current wishlist items'
          }
        }
      ]
    });
  }

  // 9. CHECKOUT (150 cases)
  for (let i = 0; i < 150; i++) {
    cases.push({
      id: `CHECKOUT_${String(i + 1).padStart(3, '0')}`,
      category: 'checkout',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true, cartNotEmpty: true },
      conversation: [
        {
          user: 'checkout my items now',
          expectedBot: {
            intent: 'CHECKOUT',
            messageContains: ['checkout', 'confirm address', 'select payment'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'CHECKOUT',
            expectedResponse: 'Proceeding to checkout. Please verify your address and choose payment method.',
            expectedUI: 'checkout_form',
            expectedSuggestions: ['Pay now', 'Cancel checkout'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'initiateCheckoutAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot initiates checkout process and displays address/payment fields'
          }
        }
      ]
    });
  }

  // 10. PAYMENTS (150 cases)
  const paymentActions = [
    { query: 'retry my failed payment', intent: 'RETRY_PAYMENT', response: 'Retrying payment transaction...' },
    { query: 'my payment failed', intent: 'CHECK_PAYMENT_STATUS', response: 'Let me check your transaction status...' },
    { query: 'wallet balance', intent: 'VIEW_WALLET', response: 'Your wallet balance is $450.00.' },
    { query: 'apply coupon promo100', intent: 'APPLY_COUPON', response: 'Coupon applied! You saved $10.' }
  ];
  for (let i = 0; i < 150; i++) {
    const act = paymentActions[i % paymentActions.length];
    cases.push({
      id: `PAYMENTS_${String(i + 1).padStart(3, '0')}`,
      category: 'payments',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: act.query,
          expectedBot: {
            intent: act.intent,
            messageContains: ['payment', 'balance', 'coupon', 'status', 'retry'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: act.response,
            expectedUI: 'payment_status',
            expectedSuggestions: ['View orders', 'Help'],
            expectedDatabaseChange: 'payment_transaction_record',
            expectedAPICall: 'processPaymentAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Payment intent resolved and appropriate response printed'
          }
        }
      ]
    });
  }

  // 11. ORDERS (200 cases)
  const orderQueries = [
    { query: 'where is my order #1024', intent: 'TRACK_ORDER', response: 'Order status: Shipped. Tracking ID: TRK-SHIP77.' },
    { query: 'track my package', intent: 'TRACK_ORDER', response: 'Let me fetch your order status...' },
    { query: 'cancel order #1025', intent: 'CANCEL_ORDER', response: 'Order has been successfully cancelled.' },
    { query: 'download invoice', intent: 'DOWNLOAD_INVOICE', response: 'Generating invoice PDF. Download starting...' }
  ];
  for (let i = 0; i < 200; i++) {
    const oq = orderQueries[i % orderQueries.length];
    cases.push({
      id: `ORDERS_${String(i + 1).padStart(3, '0')}`,
      category: 'orders',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: oq.query,
          expectedBot: {
            intent: oq.intent,
            messageContains: ['order', 'status', 'cancel', 'invoice', 'track'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: oq.response,
            expectedUI: 'order_status_card',
            expectedSuggestions: ['Contact support', 'Back to profile'],
            expectedDatabaseChange: 'order_record_modified',
            expectedAPICall: 'fetchOrderDetailsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Order actions successfully requested and displayed'
          }
        }
      ]
    });
  }

  // 12. RETURNS (150 cases)
  for (let i = 0; i < 150; i++) {
    cases.push({
      id: `RETURNS_${String(i + 1).padStart(3, '0')}`,
      category: 'returns',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: 'I want to return my order #2050',
          expectedBot: {
            intent: 'RETURN_ORDER',
            messageContains: ['return', 'reason', 'refund'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'RETURN_ORDER',
            expectedResponse: 'Return initiated. Please select the reason for return:',
            expectedUI: 'return_reasons_dropdown',
            expectedSuggestions: ['Defective item', 'Wrong size', 'Changed mind'],
            expectedDatabaseChange: 'return_request_created',
            expectedAPICall: 'createReturnRequestAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot opens return request flow and prompts for reasons'
          }
        }
      ]
    });
  }

  // 13. EXCHANGES (100 cases)
  for (let i = 0; i < 100; i++) {
    cases.push({
      id: `EXCHANGES_${String(i + 1).padStart(3, '0')}`,
      category: 'exchanges',
      priority: 'medium',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: 'I want to exchange my order #2060 for a different size',
          expectedBot: {
            intent: 'EXCHANGE_ORDER',
            messageContains: ['exchange', 'size', 'color', 'options'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'EXCHANGE_ORDER',
            expectedResponse: 'Exchange initiated. Choose your replacement size:',
            expectedUI: 'exchange_size_selector',
            expectedSuggestions: ['S', 'M', 'L', 'XL'],
            expectedDatabaseChange: 'exchange_request_created',
            expectedAPICall: 'createExchangeRequestAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot initiates exchange process and shows available replacement variants'
          }
        }
      ]
    });
  }

  // 14. PROFILE (150 cases)
  const profileQueries = [
    { query: 'update email address', intent: 'UPDATE_PROFILE', response: 'Please enter your new email address:' },
    { query: 'change my theme to dark mode', intent: 'UPDATE_PROFILE', response: 'Theme updated to dark mode successfully.' },
    { query: 'change password', intent: 'CHANGE_PASSWORD', response: 'Please enter your new password:' },
    { query: 'delete my account', intent: 'GDPR_DELETE', response: 'Are you sure you want to delete your account?' }
  ];
  for (let i = 0; i < 150; i++) {
    const pq = profileQueries[i % profileQueries.length];
    cases.push({
      id: `PROFILE_${String(i + 1).padStart(3, '0')}`,
      category: 'profile',
      priority: 'medium',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: pq.query,
          expectedBot: {
            intent: pq.intent,
            messageContains: ['profile', 'email', 'theme', 'password', 'delete', 'confirm'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: pq.response,
            expectedUI: 'profile_dashboard',
            expectedSuggestions: ['View profile', 'Logout'],
            expectedDatabaseChange: 'profile_updated',
            expectedAPICall: 'updateUserProfileAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Profile changes applied successfully'
          }
        }
      ]
    });
  }

  // 15. ADDRESS (150 cases)
  const addressQueries = [
    { query: 'add shipping address', intent: 'ADD_ADDRESS', response: 'Let\'s add a new address. Please enter the Full Name:' },
    { query: 'view saved addresses', intent: 'ADDRESS_MANAGE', response: 'Here are your saved addresses:' },
    { query: 'delete address #1', intent: 'DELETE_ADDRESS', response: 'Address has been deleted.' }
  ];
  for (let i = 0; i < 150; i++) {
    const aq = addressQueries[i % addressQueries.length];
    cases.push({
      id: `ADDRESS_${String(i + 1).padStart(3, '0')}`,
      category: 'address',
      priority: 'medium',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: aq.query,
          expectedBot: {
            intent: aq.intent,
            messageContains: ['address', 'saved', 'shipping', 'billing', 'name'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: aq.response,
            expectedUI: 'address_list',
            expectedSuggestions: ['Add new address', 'Back to profile'],
            expectedDatabaseChange: 'addresses_updated',
            expectedAPICall: 'manageAddressesAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Shipping/Billing addresses successfully managed'
          }
        }
      ]
    });
  }

  // 16. NOTIFICATIONS (100 cases)
  for (let i = 0; i < 100; i++) {
    cases.push({
      id: `NOTIFICATIONS_${String(i + 1).padStart(3, '0')}`,
      category: 'notifications',
      priority: 'low',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: 'manage my alert preferences',
          expectedBot: {
            intent: 'NOTIFICATION_PREF',
            messageContains: ['notification', 'preferences', 'email', 'sms'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: 'Here are your notification settings. Select what alerts you want:',
            expectedUI: 'notification_toggles',
            expectedSuggestions: ['Save settings', 'Cancel'],
            expectedDatabaseChange: 'preferences_updated',
            expectedAPICall: 'updateNotificationPrefsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Alert/Notification toggles correctly displayed and saved'
          }
        }
      ]
    });
  }

  // 17. SUPPORT (150 cases)
  const supportQueries = [
    { query: 'raise support ticket', intent: 'CREATE_TICKET', response: 'Let\'s open a support ticket. What is the subject?' },
    { query: 'view my tickets', intent: 'VIEW_TICKETS', response: 'Here are your active support tickets:' }
  ];
  for (let i = 0; i < 150; i++) {
    const sq = supportQueries[i % supportQueries.length];
    cases.push({
      id: `SUPPORT_${String(i + 1).padStart(3, '0')}`,
      category: 'support',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: sq.query,
          expectedBot: {
            intent: sq.intent,
            messageContains: ['ticket', 'support', 'status', 'history', 'subject'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: sq.response,
            expectedUI: 'ticket_dashboard',
            expectedSuggestions: ['Create ticket', 'Contact representative'],
            expectedDatabaseChange: 'ticket_created_or_read',
            expectedAPICall: 'manageTicketsAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot opens ticket creation flow or displays ticket history'
          }
        }
      ]
    });
  }

  // 18. LIVE AGENT (100 cases)
  const agentQueries = [
    'connect me to a live agent', 'Can I talk to a human support representative?', 'live chat now please', 'talk to agent', 'human agent please'
  ];
  for (let i = 0; i < 100; i++) {
    const aq = agentQueries[i % agentQueries.length];
    cases.push({
      id: `LIVE_AGENT_${String(i + 1).padStart(3, '0')}`,
      category: 'live_agent',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: aq,
          expectedBot: {
            intent: 'LIVE_AGENT',
            messageContains: ['human', 'agent', 'connecting', 'chat'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: 'Connecting to human support. All agents are currently busy. You are in queue.',
            expectedUI: 'live_chat_window',
            expectedSuggestions: ['Cancel request', 'Check queue status'],
            expectedDatabaseChange: 'livechat_session_created',
            expectedAPICall: 'startLiveChatSessionAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'System spawns live chat session and redirects to queue'
          }
        }
      ]
    });
  }

  // 19. VENDOR (150 cases)
  const vendorQueries = [
    { query: 'manage my vendor products', intent: 'VENDOR_PRODUCTS', response: 'Navigating to Vendor Dashboard...' },
    { query: 'view vendor settlements', intent: 'VENDOR_SETTLEMENTS', response: 'Vendor Settlement Report: total earnings $1,890.' }
  ];
  for (let i = 0; i < 150; i++) {
    const vq = vendorQueries[i % vendorQueries.length];
    cases.push({
      id: `VENDOR_${String(i + 1).padStart(3, '0')}`,
      category: 'vendor',
      priority: 'high',
      userType: 'vendor',
      preConditions: { isLoggedIn: true, roles: ['Vendor'] },
      conversation: [
        {
          user: vq.query,
          expectedBot: {
            intent: vq.intent,
            messageContains: ['vendor', 'dashboard', 'settlement', 'earnings', 'products'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NAVIGATE',
            expectedResponse: vq.response,
            expectedUI: 'vendor_dashboard_panel',
            expectedSuggestions: ['Add product', 'Settlements list'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'fetchVendorReportAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Dashboard or settlements successfully loaded for Vendor account'
          }
        }
      ]
    });
  }

  // 20. ADMIN (150 cases)
  const adminQueries = [
    { query: 'manage all products list', intent: 'ADMIN_PRODUCTS', response: 'Navigating to Admin Products Panel...' },
    { query: 'view system coupons panel', intent: 'ADMIN_COUPONS', response: 'Admin Coupons Panel successfully loaded.' }
  ];
  for (let i = 0; i < 150; i++) {
    const aq = adminQueries[i % adminQueries.length];
    cases.push({
      id: `ADMIN_${String(i + 1).padStart(3, '0')}`,
      category: 'admin',
      priority: 'high',
      userType: 'admin',
      preConditions: { isLoggedIn: true, roles: ['Admin'] },
      conversation: [
        {
          user: aq.query,
          expectedBot: {
            intent: aq.intent,
            messageContains: ['admin', 'dashboard', 'panel', 'coupons', 'products'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NAVIGATE',
            expectedResponse: aq.response,
            expectedUI: 'admin_dashboard_panel',
            expectedSuggestions: ['Manage orders', 'Manage users'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'fetchAdminDashboardAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Admin panels successfully loaded with complete controls'
          }
        }
      ]
    });
  }

  // 21. MULTI INTENT (100 cases)
  const multiIntentList = [
    { query: 'track order and change delivery address', intent: 'TRACK_ORDER', action: 'NOTIFY' },
    { query: 'cancel order and refund my payment', intent: 'CANCEL_ORDER', action: 'NOTIFY' },
    { query: 'compare products and recommend the best one', intent: 'COMPARE', action: 'COMPARE' },
    { query: 'add keyboard to cart and go to checkout', intent: 'ADD_CART', action: 'ADD_TO_CART' },
    { query: 'show my profile info and edit my email address', intent: 'UPDATE_PROFILE', action: 'NOTIFY' }
  ];
  for (let i = 0; i < 100; i++) {
    const mi = multiIntentList[i % multiIntentList.length];
    cases.push({
      id: `MULTI_${String(i + 1).padStart(3, '0')}`,
      category: 'multi_intent',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: mi.query,
          expectedBot: {
            intent: mi.intent,
            messageContains: ['order', 'cancel', 'compare', 'cart', 'profile', 'email', 'checkout'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: mi.action,
            expectedResponse: 'Resolving multi-intent request...',
            expectedUI: 'dashboard_cards',
            expectedSuggestions: ['Proceed', 'Help'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'resolveMultiIntentAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Both intents detected and multi-turn workflow prepared'
          }
        }
      ]
    });
  }

  // 22. FOLLOW UP (200 cases)
  for (let i = 0; i < 200; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    cases.push({
      id: `FOLLOW_UP_${String(i + 1).padStart(3, '0')}`,
      category: 'follow_up',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: `need a new ${prod}`,
          expectedBot: {
            intent: 'SEARCH_PRODUCT',
            messageContains: [prod],
            showSuggestions: true,
            expectedEntities: { productType: prod },
            expectedAction: 'SEARCH_PRODUCT',
            expectedResponse: `Found several ${prod}s. What brand do you prefer?`,
            expectedUI: 'suggestion_list',
            expectedSuggestions: [brand, 'Other brands'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'searchProductsAPI',
            expectedFollowUp: 'brand_clarification',
            expectedSuccessCriteria: 'Bot identifies product category and follows up on brand'
          }
        },
        {
          user: `Show me ${brand}`,
          expectedBot: {
            intent: 'SEARCH_PRODUCT',
            messageContains: [brand.toLowerCase(), prod],
            showSuggestions: true,
            expectedEntities: { brand, productType: prod },
            expectedAction: 'SEARCH_PRODUCT',
            expectedResponse: `Here are the matching ${brand} ${prod}s`,
            expectedUI: 'product_carousel',
            expectedSuggestions: ['Put it in my cart', 'Check return policy'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'searchProductsAPI',
            expectedFollowUp: 'action_clarification',
            expectedSuccessCriteria: 'Bot refines search by brand and lists products'
          }
        },
        {
          user: 'What is the return policy?',
          expectedBot: {
            intent: 'GET_PRODUCT',
            messageContains: ['return', 'policy', 'days'],
            showSuggestions: true,
            expectedEntities: { brand, productType: prod, infoType: 'return policy' },
            expectedAction: 'GET_PRODUCT',
            expectedResponse: `Our return policy for ${brand} ${prod} is 30 days.`,
            expectedUI: 'text_box',
            expectedSuggestions: ['Put it in my cart', 'Continue shopping'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'getProductPolicyAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Bot returns correct policy based on selected product in context'
          }
        },
        {
          user: 'Put it in my cart',
          expectedBot: {
            intent: 'ADD_CART',
            messageContains: ['added', 'cart'],
            showSuggestions: true,
            expectedEntities: { brand, productType: prod },
            expectedAction: 'ADD_TO_CART',
            expectedResponse: `Added ${brand} ${prod} to cart.`,
            expectedUI: 'cart_view',
            expectedSuggestions: ['Go to checkout', 'View cart'],
            expectedDatabaseChange: 'cart_updated',
            expectedAPICall: 'addToCartAPI',
            expectedFollowUp: 'checkout_prompt',
            expectedSuccessCriteria: 'Bot correctly resolves the pronoun "it" to the product in context and adds it to the cart'
          }
        },
        {
          user: 'Go to checkout',
          expectedBot: {
            intent: 'CHECKOUT',
            messageContains: ['checkout', 'confirm'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'CHECKOUT',
            expectedResponse: 'Proceeding to checkout.',
            expectedUI: 'checkout_wizard',
            expectedSuggestions: ['Complete payment', 'Cancel'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'initiateCheckoutAPI',
            expectedFollowUp: 'payment_completion',
            expectedSuccessCriteria: 'Bot proceeds to checkout flow using contextual user details'
          }
        }
      ]
    });
  }

  // 23. TYPOS (200 cases)
  const typoScenarios = [
    { typo: 'smasung phone', original: 'samsung phone', intent: 'SEARCH_PRODUCT' },
    { typo: 'iphon details', original: 'iphone details', intent: 'GET_PRODUCT' },
    { typo: 'retrn my ordr', original: 'return my order', intent: 'RETURN_ORDER' },
    { typo: 'paymnt failed', original: 'payment failed', intent: 'CHECK_PAYMENT_STATUS' },
    { typo: 'add to crat', original: 'add to cart', intent: 'ADD_CART' },
    { typo: 'view my orderss', original: 'view my orders', intent: 'VIEW_ORDERS' },
    { typo: 'compere dell vs hp', original: 'compare dell vs hp', intent: 'COMPARE' },
    { typo: 'where is my pakage', original: 'where is my package', intent: 'TRACK_ORDER' },
    { typo: 'support tickt', original: 'support ticket', intent: 'CREATE_TICKET' },
    { typo: 'human agentt', original: 'human agent', intent: 'LIVE_AGENT' }
  ];
  for (let i = 0; i < 200; i++) {
    const sc = typoScenarios[i % typoScenarios.length];
    cases.push({
      id: `TYPOS_${String(i + 1).padStart(3, '0')}`,
      category: 'typos',
      priority: 'medium',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: `${sc.typo} ${i}`,
          expectedBot: {
            intent: sc.intent,
            messageContains: [],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: `Handling your request for ${sc.original}...`,
            expectedUI: 'text_box',
            expectedSuggestions: ['Yes', 'No'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'processIntentAPI',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Typo corrected and correct intent resolved'
          }
        }
      ]
    });
  }

  // 24. EMOTIONAL USERS (100 cases)
  for (let i = 0; i < 100; i++) {
    const emotion = EMOTIONS[i % EMOTIONS.length];
    cases.push({
      id: `EMOTIONAL_${String(i + 1).padStart(3, '0')}`,
      category: 'emotional_users',
      priority: 'high',
      userType: 'registered',
      preConditions: { isLoggedIn: true },
      conversation: [
        {
          user: `I am extremely ${emotion} about my late order! This is ridiculous!`,
          expectedBot: {
            intent: 'TRACK_ORDER',
            messageContains: ['sorry', 'apologize', 'understand', 'frustrated', 'status', 'help'],
            showSuggestions: true,
            expectedEntities: { emotionalState: emotion },
            expectedAction: 'NOTIFY',
            expectedResponse: 'I sincerely apologize for the delay. Let me check the status of your order immediately.',
            expectedUI: 'empathetic_status_card',
            expectedSuggestions: ['Connect to live agent', 'Create support ticket'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'fetchOrderDetailsAPI',
            expectedFollowUp: 'support_handoff',
            expectedSuccessCriteria: 'Bot detects high emotion, injects an empathetic apology prefix, and queries order details'
          }
        }
      ]
    });
  }

  // 25. AMBIGUOUS QUERIES (100 cases)
  const ambiguousQueries = [
    'need something', 'show me', 'help', 'anything', 'whatever', 'not sure', 'something nice', 'do something', 'go', 'bot options'
  ];
  for (let i = 0; i < 100; i++) {
    const q = ambiguousQueries[i % ambiguousQueries.length];
    cases.push({
      id: `AMBIGUOUS_${String(i + 1).padStart(3, '0')}`,
      category: 'ambiguous_queries',
      priority: 'medium',
      userType: 'guest',
      preConditions: {},
      conversation: [
        {
          user: q,
          expectedBot: {
            intent: 'HELP',
            messageContains: ['understand', 'clarify', 'options', 'try'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'HELP',
            expectedResponse: 'I didn\'t quite catch that. Would you like to search products or manage your orders?',
            expectedUI: 'clarification_prompt_box',
            expectedSuggestions: ['Search products', 'View cart', 'Track order', 'Create ticket'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'none',
            expectedFollowUp: 'clarification_loop',
            expectedSuccessCriteria: 'Bot asks for clarification and shows capability suggestions'
          }
        }
      ]
    });
  }

  // 26. EDGE CASES (200 cases)
  const edgeScenarios = [
    { query: 'view admin products panel', intent: 'ADMIN_PRODUCTS', userType: 'guest', role: 'Guest', response: '⚠️ This action requires Admin access. Please login.' },
    { query: 'track order #9999', intent: 'TRACK_ORDER', userType: 'registered', role: 'Customer', response: '❌ Order #9999 not found.' },
    { query: 'manage all products list', intent: 'ADMIN_PRODUCTS', userType: 'vendor', role: 'Vendor', response: '⚠️ This action requires Admin access.' },
    { query: 'apply coupon EXPIRED50', intent: 'APPLY_COUPON', userType: 'registered', role: 'Customer', response: '❌ This coupon code is expired.' }
  ];
  for (let i = 0; i < 200; i++) {
    const sc = edgeScenarios[i % edgeScenarios.length];
    cases.push({
      id: `EDGE_CASES_${String(i + 1).padStart(3, '0')}`,
      category: 'edge_cases',
      priority: 'high',
      userType: sc.userType,
      preConditions: { isLoggedIn: sc.userType !== 'guest', roles: [sc.role] },
      conversation: [
        {
          user: sc.query,
          expectedBot: {
            intent: sc.intent,
            messageContains: ['requires', 'not found', 'expired', 'login', 'access'],
            showSuggestions: true,
            expectedEntities: {},
            expectedAction: 'NOTIFY',
            expectedResponse: sc.response,
            expectedUI: 'error_or_warning_card',
            expectedSuggestions: ['Go back', 'Login'],
            expectedDatabaseChange: 'none',
            expectedAPICall: 'none',
            expectedFollowUp: 'none',
            expectedSuccessCriteria: 'Permission block or validation error message successfully shown'
          }
        }
      ]
    });
  }

  return cases;
}

function main() {
  console.log('Generating production-grade chatbot test dataset...');
  const testCases = generateAllCases();
  console.log(`Generated ${testCases.length} total test cases across 26 categories.`);

  const outputObject = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    testCases
  };

  const outputPath = path.join(__dirname, '..', 'chatbot-test-dataset.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputObject, null, 2), 'utf-8');
  console.log(`Successfully generated and saved to: ${path.resolve(outputPath)}`);
}

main();
