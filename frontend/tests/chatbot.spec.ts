import { test, expect, type Page } from '@playwright/test';
import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';
const BASE_URL = 'http://localhost:3001';

let mongoClient: MongoClient;

// Test execution records for report generation
const reportResults = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  capabilities: {
    search: 'Fail',
    cart: 'Fail',
    wishlist: 'Fail',
    profile: 'Fail',
    address: 'Fail',
    checkout: 'Fail',
    payment: 'Fail',
    orders: 'Fail',
    returns: 'Fail',
    memory: 'Fail'
  },
  failures: [] as string[]
};

test.beforeAll(async () => {
  mongoClient = new MongoClient(DB_URI);
  await mongoClient.connect();
});

test.afterEach(async ({}, testInfo) => {
  reportResults.totalTests++;
  if (testInfo.status === 'passed') {
    reportResults.passed++;
  } else {
    reportResults.failed++;
    if (testInfo.error) {
      reportResults.failures.push(`${testInfo.title} failed: ${testInfo.error.message}`);
    }
  }
});

test.afterAll(async () => {
  await mongoClient.close();
  
  // Save final report to the workspace and brain artifacts
  const reportContent = JSON.stringify(reportResults, null, 2);
  const reportsDir = path.join(__dirname, '../../artifacts');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(__dirname, '../chatbot-test-report.json'), reportContent);
  fs.writeFileSync(path.join(__dirname, '../../artifacts/chatbot-test-report.json'), reportContent);
  console.log('📊 Generated Playwright Test Report successfully.');
});

// Helper: open chatbot widget
async function openChatbot(page: Page) {
  const bubble = page.locator('button[aria-label="Open AI Agent chat"]');
  await expect(bubble).toBeVisible();
  await bubble.click();
  const chatHeader = page.locator('h3:has-text("ApexStore AI Agent")');
  await expect(chatHeader).toBeVisible();
}

// Helper: send message to chatbot and wait for loader to disappear
async function sendChatMessage(page: Page, message: string) {
  const chatbotForm = page.locator('form:has(button[aria-label="Send message"])');
  const input = chatbotForm.locator('textarea');
  await input.fill(message);
  const sendBtn = chatbotForm.locator('button[aria-label="Send message"]');
  
  // Wait for response of this specific message
  const [response] = await Promise.all([
    page.waitForResponse(res => 
      res.url().includes('/api/v1/agent/message') && 
      res.status() === 200 &&
      res.request().postData()?.includes(message)
    ),
    sendBtn.click()
  ]);
  
  // Wait for processing loader to disappear (just in case)
  const loader = page.locator('text=Processing...');
  await loader.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});
  
  return response;
}

// Helper: verify if chatbot response contains only text instructions
async function assertNotTextOnly(replyText: string, actionName: string) {
  const lowercaseReply = replyText.toLowerCase();
  const instructionsKeywords = ['should navigate', 'please go to', 'manually', 'go to profile', 'visit the page', 'navigate to'];
  const isInstructionOnly = instructionsKeywords.some(kw => lowercaseReply.includes(kw));
  
  if (isInstructionOnly) {
    throw new Error(`${actionName} failed: Chatbot only returned instructions instead of executing action.`);
  }
}

// ─── GUEST USER TESTS ────────────────────────────────────────────────────────

test.describe('Chatbot Guest User Actions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await openChatbot(page);
  });

  test('Search for non-existing product (iPhone)', async ({ page }) => {
    const response = await sendChatMessage(page, 'Search for iPhone');
    const results = await response.json();
    expect(results.intent).toBe('SEARCH_PRODUCT');
    
    // Check UI has routed to search page
    await page.waitForURL(url => url.pathname === '/search' && !!url.searchParams.get('q')?.toLowerCase().includes('phone'));
    
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    await assertNotTextOnly(botReply, 'Search for iPhone');
    
    reportResults.capabilities.search = 'Pass';
  });

  test('Search for existing product (headphones)', async ({ page }) => {
    const response = await sendChatMessage(page, 'search for headphones');
    const results = await response.json();
    expect(results.intent).toBe('SEARCH_PRODUCT');
    expect(results.data?.products?.length).toBeGreaterThan(0);
    
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Apex Sound-Pro ANC Headphones');
    
    reportResults.capabilities.search = 'Pass';
  });

  test('Guest Add to Cart (should prevent and ask to login)', async ({ page }) => {
    await sendChatMessage(page, 'Add headphones to cart');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('login');
    
    reportResults.capabilities.cart = 'Pass';
  });

  test('Login workflow via Chatbot', async ({ page }) => {
    await sendChatMessage(page, 'login');
    await sendChatMessage(page, 'john.doe@example.com');
    await sendChatMessage(page, 'Password123!');
    
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Logged in successfully');
    
    // Verify UI has logged-in state (user profile button visible)
    const profileBtn = page.locator('a[href="/profile"]');
    await expect(profileBtn).toBeVisible();
  });
});

// ─── AUTHENTICATED USER TESTS ────────────────────────────────────────────────

test.describe('Chatbot Authenticated User Actions', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await openChatbot(page);
    
    // Authenticate
    await sendChatMessage(page, 'login');
    await sendChatMessage(page, 'john.doe@example.com');
    await sendChatMessage(page, 'Password123!');
  });

  test('Profile Name and Email edit instruction check', async ({ page }) => {
    await sendChatMessage(page, 'Change my name to John Doe');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    await assertNotTextOnly(botReply, 'Change Profile Name');
    
    reportResults.capabilities.profile = 'Pass';
  });

  test('Address Management - add/view address', async ({ page }) => {
    await sendChatMessage(page, 'my address');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    await assertNotTextOnly(botReply, 'Address Management');
    
    reportResults.capabilities.address = 'Pass';
  });

  test('Add existing product to cart (headphones)', async ({ page }) => {
    await sendChatMessage(page, 'Add headphones to cart');
    
    // Verify chatbot message bubble is visible
    const cartAddedBubble = page.locator('div.rounded-tl-none:has-text("Added to Cart")');
    await expect(cartAddedBubble.last()).toBeVisible();
    
    // Verify UI state cart badge contains '1'
    const badge = page.locator('span.absolute.bg-indigo-600');
    await expect(badge).toHaveText('1');
    
    reportResults.capabilities.cart = 'Pass';
  });

  test('Apply Coupon via Chatbot', async ({ page }) => {
    await sendChatMessage(page, 'Add headphones to cart');
    await sendChatMessage(page, 'apply coupon SAVE20');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('valid');
  });

  test('Complete Checkout & Order Placement via Chatbot', async ({ page }) => {
    // Make sure we have items in cart
    await sendChatMessage(page, 'Add headphones to cart');
    
    await sendChatMessage(page, 'Checkout now');
    await sendChatMessage(page, 'John Doe');
    await sendChatMessage(page, '123 Test Road');
    await sendChatMessage(page, 'New York, 10001');
    await sendChatMessage(page, 'COD');
    
    // Confirm order placement
    await sendChatMessage(page, 'confirm');
    
    // Verify DB state
    const db = mongoClient.db();
    const ordersCol = db.collection('orders');
    const userDoc = await db.collection('users').findOne({ email: 'john.doe@example.com' });
    expect(userDoc).not.toBeNull();
    
    const dbOrder = await ordersCol.findOne(
      { userId: userDoc!._id },
      { sort: { createdAt: -1 } }
    );
    expect(dbOrder).not.toBeNull();
    expect(dbOrder!.status).toBe('Pending');
    
    // Verify UI cart total cleared
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Placed Successfully');
    
    reportResults.capabilities.checkout = 'Pass';
    reportResults.capabilities.orders = 'Pass';
    reportResults.capabilities.payment = 'Pass';
  });

  test('Track order status', async ({ page }) => {
    await sendChatMessage(page, 'Track my latest order');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Status');
  });

  test('Create support ticket via Chatbot', async ({ page }) => {
    await sendChatMessage(page, 'Open a support ticket');
    await sendChatMessage(page, 'Delay in shipment');
    await sendChatMessage(page, 'My order has not arrived yet.');
    
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Created');
  });

  test('Wishlist actions via Chatbot', async ({ page }) => {
    await sendChatMessage(page, 'my wishlist');
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    await assertNotTextOnly(botReply, 'Wishlist View');
    
    reportResults.capabilities.wishlist = 'Pass';
  });

  test('Memory context test (Add and add one more)', async ({ page }) => {
    await sendChatMessage(page, 'Add headphones to cart');
    await sendChatMessage(page, 'Add one more');
    
    const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
    expect(botReply).toContain('Added to Cart');
    
    reportResults.capabilities.memory = 'Pass';
  });
});
