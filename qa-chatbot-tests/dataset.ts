export interface TestCase {
  id: string;
  category: string;
  query: string;
  expectedGoal: string; // The primary intent we expect
  expectedAction?: string; // The expected action name (e.g., ADD_CART, SEARCH_PRODUCT)
  passRule: string; // The evaluation rule / expected outcome description
  expectedKeywords?: string[]; // Keywords that should appear in the bot response
  isMultiTurn?: boolean;
  sessionId?: string;
  stepIndex?: number;
}

// Data sources for generating diverse test cases
const PRODUCTS = [
  'laptop', 'phone', 'headphones', 'keyboard', 'mouse', 'monitor', 'camera', 
  'smartwatch', 'speaker', 'tablet', 'charger', 'cable', 'backpack', 'desk lamp', 
  'router', 'microphone', 'projector', 'earbuds', 'hard drive', 'graphics card'
];

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Logitech', 
  'Bose', 'LG', 'Intel', 'AMD', 'Nvidia', 'Xiaomi', 'OnePlus', 'Microsoft'
];

const CATEGORIES = [
  'electronics', 'fashion', 'home appliances', 'sports', 'books', 'fitness', 
  'kitchenware', 'office supplies', 'gaming', 'audio'
];

const EMOTIONS = [
  'annoyed', 'angry', 'frustrated', 'disappointed', 'upset', 'impatient'
];

// Helper to generate exactly 100 test cases for a category
export function generateDataset(): TestCase[] {
  const dataset: TestCase[] = [];

  // 1. PRODUCT SEARCH (100 cases)
  for (let i = 0; i < 100; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    const queryTemplates = [
      `I want to buy a ${brand} ${prod}`,
      `Show me some ${brand} ${prod}s`,
      `Find a cheap ${prod} made by ${brand}`,
      `Looking for a ${brand} ${prod}`,
      `Search for ${brand} ${prod} on your store`,
    ];
    const query = queryTemplates[i % queryTemplates.length];
    dataset.push({
      id: `SEARCH_${String(i + 1).padStart(3, '0')}`,
      category: 'Product Search',
      query,
      expectedGoal: 'SEARCH_PRODUCT',
      passRule: 'Bot should perform a product search or show listings matching keywords',
      expectedKeywords: [prod.toLowerCase()]
    });
  }

  // 2. PRODUCT DETAILS (100 cases)
  for (let i = 0; i < 100; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    const queryTemplates = [
      `What are the specs of the ${brand} ${prod}?`,
      `Show details for ${brand} ${prod}`,
      `Tell me about ${brand} ${prod}`,
      `What features does the ${brand} ${prod} have?`,
      `Give me specifications of ${brand} ${prod}`,
    ];
    const query = queryTemplates[i % queryTemplates.length];
    dataset.push({
      id: `DETAILS_${String(i + 1).padStart(3, '0')}`,
      category: 'Product Details',
      query,
      expectedGoal: 'GET_PRODUCT',
      passRule: 'Bot should show details, features, or specifications for the product',
      expectedKeywords: [prod.toLowerCase()]
    });
  }

  // 3. COMPARISON (100 cases)
  for (let i = 0; i < 100; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand1 = BRANDS[i % BRANDS.length];
    const brand2 = BRANDS[(i + 1) % BRANDS.length];
    const queryTemplates = [
      `Compare ${brand1} ${prod} vs ${brand2} ${prod}`,
      `Which is better: ${brand1} ${prod} or ${brand2} ${prod}?`,
      `Show me the difference between ${brand1} and ${brand2} ${prod}`,
      `Comparison of ${brand1} ${prod} versus ${brand2} ${prod}`,
      `Should I buy ${brand1} ${prod} or ${brand2} ${prod}?`,
    ];
    const query = queryTemplates[i % queryTemplates.length];
    dataset.push({
      id: `COMPARE_${String(i + 1).padStart(3, '0')}`,
      category: 'Comparison',
      query,
      expectedGoal: 'COMPARE',
      passRule: 'Bot should provide a comparison structure comparing the two brands/products',
      // Bot returns a comparison table; it doesn't repeat the word 'compare' in the reply
      expectedKeywords: [brand1.toLowerCase(), brand2.toLowerCase()]
    });
  }

  // 4. CART (100 cases)
  for (let i = 0; i < 100; i++) {
    const prod = PRODUCTS[i % PRODUCTS.length];
    const brand = BRANDS[i % BRANDS.length];
    const qty = (i % 5) + 1;
    const queryTemplates = [
      `Add ${brand} ${prod} to my cart`,
      `Put the ${brand} ${prod} in cart`,
      `Remove ${brand} ${prod} from cart`,
      `Update quantity of ${brand} ${prod} to ${qty}`,
      `Change qty of ${prod} to ${qty}`,
      `Show my cart items`,
      `View my shopping cart`,
      `Clear my entire cart`,
      `Empty the cart`,
    ];
    const templateIdx = i % queryTemplates.length;
    const query = queryTemplates[templateIdx];
    
    let expectedGoal = 'ADD_CART';
    let expectedAction = 'ADD_TO_CART';
    if (query.includes('Remove')) {
      expectedGoal = 'REMOVE_CART';
      expectedAction = 'REMOVE_FROM_CART';
    } else if (query.includes('Update') || query.includes('Change')) {
      expectedGoal = 'UPDATE_CART_QUANTITY';
      expectedAction = 'UPDATE_CART_QUANTITY';
    } else if (query.includes('Show') || query.includes('View')) {
      expectedGoal = 'VIEW_CART';
      expectedAction = 'VIEW_CART';
    } else if (query.includes('Clear') || query.includes('Empty')) {
      expectedGoal = 'REMOVE_CART'; // cleared or emptied matches clear/remove cart
      expectedAction = 'REMOVE_FROM_CART';
    }

    dataset.push({
      id: `CART_${String(i + 1).padStart(3, '0')}`,
      category: 'Cart',
      query,
      expectedGoal,
      expectedAction,
      passRule: `Bot should execute the proper cart operation: ${expectedGoal}`
    });
  }

  // 5. CHECKOUT (100 cases)
  for (let i = 0; i < 100; i++) {
    const queryTemplates = [
      `I want to checkout now`,
      `Place my order please`,
      `Proceed to checkout`,
      `Go to payment page`,
      `Complete my purchase`,
      `Start checkout process`,
    ];
    const query = `${queryTemplates[i % queryTemplates.length]} ${i}`;
    dataset.push({
      id: `CHECKOUT_${String(i + 1).padStart(3, '0')}`,
      category: 'Checkout',
      query,
      expectedGoal: 'CHECKOUT',
      expectedAction: 'CHECKOUT',
      passRule: 'Bot should initiate the checkout action and prompt the user to proceed'
    });
  }

  // 6. ORDERS (100 cases)
  for (let i = 0; i < 100; i++) {
    const orderNum = 1000 + i;
    const queryTemplates = [
      `Where is my order #${orderNum}?`,
      `Track my package #${orderNum}`,
      `Order status for #${orderNum}`,
      `Check status of order ${orderNum}`,
      `When will order #${orderNum} arrive?`,
    ];
    const query = queryTemplates[i % queryTemplates.length];
    dataset.push({
      id: `ORDERS_${String(i + 1).padStart(3, '0')}`,
      category: 'Orders',
      query,
      expectedGoal: 'TRACK_ORDER',
      passRule: 'Bot should detect track order intent and check the status of the order',
      // Bot replies with '📍 Latest Order Status:' — it says 'order' and 'status', not 'track'
      expectedKeywords: ['order', 'status']
    });
  }

  // 7. RETURNS (100 cases)
  for (let i = 0; i < 100; i++) {
    const orderNum = 2000 + i;
    const queryTemplates = [
      `I want to return my order #${orderNum}`,
      `Can I exchange order #${orderNum}?`,
      `Request refund for order #${orderNum}`,
      `Exchange size for order #${orderNum}`,
      `Send back order #${orderNum}`,
    ];
    const templateIdx = i % queryTemplates.length;
    const query = queryTemplates[templateIdx];

    let expectedGoal = 'RETURN_ORDER';
    if (query.includes('exchange') || query.includes('Exchange')) {
      expectedGoal = 'EXCHANGE_ORDER';
    } else if (query.includes('refund') || query.includes('Refund')) {
      expectedGoal = 'REFUND';
    }

    dataset.push({
      id: `RETURNS_${String(i + 1).padStart(3, '0')}`,
      category: 'Returns',
      query,
      expectedGoal,
      passRule: `Bot should handle returns/exchange/refund flow for ${expectedGoal}`
    });
  }

  // 8. SUPPORT (100 cases)
  for (let i = 0; i < 100; i++) {
    const queryTemplates = [
      `Create a support ticket for my broken item`,
      `I need to file a complaint about my delivery`,
      `Connect me to a live agent`,
      `Can I talk to a human support representative?`,
      `Escalate this to customer care`,
      `Open a customer service ticket`,
    ];
    const templateIdx = i % queryTemplates.length;
    const query = `${queryTemplates[templateIdx]} (Ref: ${i})`;

    let expectedGoal = 'CREATE_TICKET';
    if (query.includes('Escalate')) {
      expectedGoal = 'ESCALATE'; // 'Escalate' keyword maps to ESCALATE in intent engine
    } else if (query.includes('agent') || query.includes('human')) {
      expectedGoal = 'LIVE_AGENT'; // 'live agent' / 'talk to human' maps to LIVE_AGENT in intent engine
    }

    dataset.push({
      id: `SUPPORT_${String(i + 1).padStart(3, '0')}`,
      category: 'Support',
      query,
      expectedGoal,
      passRule: 'Bot should escalate to a human agent or offer support ticket options'
    });
  }

  // 9. TYPOS (100 cases)
  const typoPairs = [
    { query: 'smasung phone', goal: 'SEARCH_PRODUCT', keyword: 'samsung' },
    { query: 'iphon details', goal: 'GET_PRODUCT', keyword: 'iphone' },
    { query: 'retrn my ordr', goal: 'RETURN_ORDER', keyword: 'return' },
    { query: 'paymnt failed', goal: 'CHECKOUT', keyword: 'pay' },
    { query: 'add to crat', goal: 'ADD_CART', keyword: 'cart' },
    { query: 'view my orderss', goal: 'VIEW_ORDERS', keyword: 'order' },
    { query: 'compere dell vs hp', goal: 'COMPARE', keyword: 'compare' },
    { query: 'where is my pakage', goal: 'TRACK_ORDER', keyword: 'track' },
    { query: 'support tickt', goal: 'CREATE_TICKET', keyword: 'ticket' },
    { query: 'human agentt', goal: 'LIVE_AGENT', keyword: 'agent' }
  ];

  for (let i = 0; i < 100; i++) {
    const pair = typoPairs[i % typoPairs.length];
    dataset.push({
      id: `TYPOS_${String(i + 1).padStart(3, '0')}`,
      category: 'Typos',
      query: `${pair.query} ${i}`,
      expectedGoal: pair.goal,
      passRule: 'Bot should handle typos gracefully using robust keyword mapping'
    });
  }

  // 10. FOLLOW-UPS (100 cases - 20 scenarios x 5 turns)
  for (let scenario = 0; scenario < 20; scenario++) {
    const sessionId = `followup-session-${scenario}`;
    const brand = BRANDS[scenario % BRANDS.length];
    const prod = PRODUCTS[scenario % PRODUCTS.length];
    
    // Turn 1
    dataset.push({
      id: `FOLLOW_UP_${String(scenario * 5 + 1).padStart(3, '0')}`,
      category: 'Follow-Ups',
      query: `I need a new ${prod}`,
      expectedGoal: 'SEARCH_PRODUCT',
      sessionId,
      stepIndex: 1,
      isMultiTurn: true,
      passRule: 'Understand product request'
    });

    // Turn 2
    dataset.push({
      id: `FOLLOW_UP_${String(scenario * 5 + 2).padStart(3, '0')}`,
      category: 'Follow-Ups',
      query: `Show me ${brand}`,
      expectedGoal: 'SEARCH_PRODUCT',
      sessionId,
      stepIndex: 2,
      isMultiTurn: true,
      passRule: 'Refine search with brand preference, keeping the product context'
    });

    // Turn 3
    dataset.push({
      id: `FOLLOW_UP_${String(scenario * 5 + 3).padStart(3, '0')}`,
      category: 'Follow-Ups',
      query: `What is the return policy?`,
      expectedGoal: 'RETURN_ORDER',  // 'return' keyword triggers RETURN_ORDER in the intent engine
      sessionId,
      stepIndex: 3,
      isMultiTurn: true,
      passRule: 'Handle return policy query'
    });

    // Turn 4
    dataset.push({
      id: `FOLLOW_UP_${String(scenario * 5 + 4).padStart(3, '0')}`,
      category: 'Follow-Ups',
      query: `Put it in my cart`,
      expectedGoal: 'ADD_CART',
      sessionId,
      stepIndex: 4,
      isMultiTurn: true,
      passRule: 'Add contextual product to cart'
    });

    // Turn 5
    dataset.push({
      id: `FOLLOW_UP_${String(scenario * 5 + 5).padStart(3, '0')}`,
      category: 'Follow-Ups',
      query: `Go to checkout`,
      expectedGoal: 'CHECKOUT',
      sessionId,
      stepIndex: 5,
      isMultiTurn: true,
      passRule: 'Trigger checkout action'
    });
  }

  // 11. MULTI INTENT (100 cases)
  const multiTemplates = [
    { q: 'Track my order and change delivery address', goals: ['TRACK_ORDER', 'MODIFY_ORDER'] },
    { q: 'Cancel order and refund my payment', goals: ['CANCEL_ORDER', 'REFUND'] },
    { q: 'Compare products and recommend the best one', goals: ['COMPARE', 'RECOMMEND'] },
    { q: 'Add keyboard to cart and go to checkout', goals: ['ADD_CART', 'CHECKOUT'] },
    { q: 'Show my profile info and edit my email address', goals: ['VIEW_PROFILE', 'UPDATE_PROFILE'] }
  ];

  for (let i = 0; i < 100; i++) {
    const item = multiTemplates[i % multiTemplates.length];
    dataset.push({
      id: `MULTI_${String(i + 1).padStart(3, '0')}`,
      category: 'Multi Intent',
      query: `${item.q} (Ref ${i})`,
      expectedGoal: item.goals[0], // First primary intent
      passRule: 'Bot should detect and respond to multi-intent requests, possibly handling both'
    });
  }

  return dataset;
}
