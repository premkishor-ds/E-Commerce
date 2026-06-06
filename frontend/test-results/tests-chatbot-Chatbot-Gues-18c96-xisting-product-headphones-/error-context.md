# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\chatbot.spec.ts >> Chatbot Guest User Actions >> Search for existing product (headphones)
- Location: tests\chatbot.spec.ts:130:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Apex Sound-Pro ANC Headphones"
Received string:    "🔍 **Found 63 products** for \"headphones\":·
• **Microsoft Headphones - BLUE (L)** — $95.00 ⭐4.6
• **Microsoft Headphone - ORANGE (12)** — $49900.00 ⭐4.1
• **Nvidia Headphones - BLUE (L)** — $50000.00 ⭐4
• **Nvidia Headphone - ORANGE (12)** — $20000.00 ⭐4.5·
Type the **product name** to see details, or **\"add [name] to cart\"** to purchase!03:38 PM"
```

# Test source

```ts
  37  |   reportResults.totalTests++;
  38  |   if (testInfo.status === 'passed') {
  39  |     reportResults.passed++;
  40  |   } else {
  41  |     reportResults.failed++;
  42  |     if (testInfo.error) {
  43  |       reportResults.failures.push(`${testInfo.title} failed: ${testInfo.error.message}`);
  44  |     }
  45  |   }
  46  | });
  47  | 
  48  | test.afterAll(async () => {
  49  |   await mongoClient.close();
  50  |   
  51  |   // Save final report to the workspace and brain artifacts
  52  |   const reportContent = JSON.stringify(reportResults, null, 2);
  53  |   const reportsDir = path.join(__dirname, '../../artifacts');
  54  |   if (!fs.existsSync(reportsDir)) {
  55  |     fs.mkdirSync(reportsDir, { recursive: true });
  56  |   }
  57  |   
  58  |   fs.writeFileSync(path.join(__dirname, '../chatbot-test-report.json'), reportContent);
  59  |   fs.writeFileSync(path.join(__dirname, '../../artifacts/chatbot-test-report.json'), reportContent);
  60  |   console.log('📊 Generated Playwright Test Report successfully.');
  61  | });
  62  | 
  63  | // Helper: open chatbot widget
  64  | async function openChatbot(page: Page) {
  65  |   const bubble = page.locator('button[aria-label="Open AI Agent chat"]');
  66  |   await expect(bubble).toBeVisible();
  67  |   await bubble.click();
  68  |   const chatHeader = page.locator('h3:has-text("ApexStore AI Agent")');
  69  |   await expect(chatHeader).toBeVisible();
  70  | }
  71  | 
  72  | // Helper: send message to chatbot and wait for loader to disappear
  73  | async function sendChatMessage(page: Page, message: string) {
  74  |   const chatbotForm = page.locator('form:has(button[aria-label="Send message"])');
  75  |   const input = chatbotForm.locator('textarea');
  76  |   await input.fill(message);
  77  |   const sendBtn = chatbotForm.locator('button[aria-label="Send message"]');
  78  |   
  79  |   // Wait for response of this specific message
  80  |   const [response] = await Promise.all([
  81  |     page.waitForResponse(res => 
  82  |       res.url().includes('/api/v1/agent/message') && 
  83  |       res.status() === 200 &&
  84  |       res.request().postData()?.includes(message)
  85  |     ),
  86  |     sendBtn.click()
  87  |   ]);
  88  |   
  89  |   // Wait for processing loader to disappear (just in case)
  90  |   const loader = page.locator('text=Processing...');
  91  |   await loader.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {});
  92  |   
  93  |   return response;
  94  | }
  95  | 
  96  | // Helper: verify if chatbot response contains only text instructions
  97  | async function assertNotTextOnly(replyText: string, actionName: string) {
  98  |   const lowercaseReply = replyText.toLowerCase();
  99  |   const instructionsKeywords = ['should navigate', 'please go to', 'manually', 'go to profile', 'visit the page', 'navigate to'];
  100 |   const isInstructionOnly = instructionsKeywords.some(kw => lowercaseReply.includes(kw));
  101 |   
  102 |   if (isInstructionOnly) {
  103 |     throw new Error(`${actionName} failed: Chatbot only returned instructions instead of executing action.`);
  104 |   }
  105 | }
  106 | 
  107 | // ─── GUEST USER TESTS ────────────────────────────────────────────────────────
  108 | 
  109 | test.describe('Chatbot Guest User Actions', () => {
  110 | 
  111 |   test.beforeEach(async ({ page }) => {
  112 |     await page.goto(BASE_URL);
  113 |     await openChatbot(page);
  114 |   });
  115 | 
  116 |   test('Search for non-existing product (iPhone)', async ({ page }) => {
  117 |     const response = await sendChatMessage(page, 'Search for iPhone');
  118 |     const results = await response.json();
  119 |     expect(results.intent).toBe('SEARCH_PRODUCT');
  120 |     
  121 |     // Check UI has routed to search page
  122 |     await page.waitForURL(url => url.pathname === '/search' && !!url.searchParams.get('q')?.toLowerCase().includes('phone'));
  123 |     
  124 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  125 |     await assertNotTextOnly(botReply, 'Search for iPhone');
  126 |     
  127 |     reportResults.capabilities.search = 'Pass';
  128 |   });
  129 | 
  130 |   test('Search for existing product (headphones)', async ({ page }) => {
  131 |     const response = await sendChatMessage(page, 'search for headphones');
  132 |     const results = await response.json();
  133 |     expect(results.intent).toBe('SEARCH_PRODUCT');
  134 |     expect(results.data?.products?.length).toBeGreaterThan(0);
  135 |     
  136 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
> 137 |     expect(botReply).toContain('Apex Sound-Pro ANC Headphones');
      |                      ^ Error: expect(received).toContain(expected) // indexOf
  138 |     
  139 |     reportResults.capabilities.search = 'Pass';
  140 |   });
  141 | 
  142 |   test('Guest Add to Cart (should prevent and ask to login)', async ({ page }) => {
  143 |     await sendChatMessage(page, 'Add headphones to cart');
  144 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  145 |     expect(botReply).toContain('login');
  146 |     
  147 |     reportResults.capabilities.cart = 'Pass';
  148 |   });
  149 | 
  150 |   test('Login workflow via Chatbot', async ({ page }) => {
  151 |     await sendChatMessage(page, 'login');
  152 |     await sendChatMessage(page, 'john.doe@example.com');
  153 |     await sendChatMessage(page, 'Password123!');
  154 |     
  155 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  156 |     expect(botReply).toContain('Logged in successfully');
  157 |     
  158 |     // Verify UI has logged-in state (user profile button visible)
  159 |     const profileBtn = page.locator('a[href="/profile"]');
  160 |     await expect(profileBtn).toBeVisible();
  161 |   });
  162 | });
  163 | 
  164 | // ─── AUTHENTICATED USER TESTS ────────────────────────────────────────────────
  165 | 
  166 | test.describe('Chatbot Authenticated User Actions', () => {
  167 | 
  168 |   test.beforeEach(async ({ page }) => {
  169 |     await page.goto(BASE_URL);
  170 |     await openChatbot(page);
  171 |     
  172 |     // Authenticate
  173 |     await sendChatMessage(page, 'login');
  174 |     await sendChatMessage(page, 'john.doe@example.com');
  175 |     await sendChatMessage(page, 'Password123!');
  176 |   });
  177 | 
  178 |   test('Profile Name and Email edit instruction check', async ({ page }) => {
  179 |     await sendChatMessage(page, 'Change my name to John Doe');
  180 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  181 |     await assertNotTextOnly(botReply, 'Change Profile Name');
  182 |     
  183 |     reportResults.capabilities.profile = 'Pass';
  184 |   });
  185 | 
  186 |   test('Address Management - add/view address', async ({ page }) => {
  187 |     await sendChatMessage(page, 'my address');
  188 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  189 |     await assertNotTextOnly(botReply, 'Address Management');
  190 |     
  191 |     reportResults.capabilities.address = 'Pass';
  192 |   });
  193 | 
  194 |   test('Add existing product to cart (headphones)', async ({ page }) => {
  195 |     await sendChatMessage(page, 'Add headphones to cart');
  196 |     
  197 |     // Verify chatbot message bubble is visible
  198 |     const cartAddedBubble = page.locator('div.rounded-tl-none:has-text("Added to Cart")');
  199 |     await expect(cartAddedBubble.last()).toBeVisible();
  200 |     
  201 |     // Verify UI state cart badge contains '1'
  202 |     const badge = page.locator('span.absolute.bg-indigo-600');
  203 |     await expect(badge).toHaveText('1');
  204 |     
  205 |     reportResults.capabilities.cart = 'Pass';
  206 |   });
  207 | 
  208 |   test('Apply Coupon via Chatbot', async ({ page }) => {
  209 |     await sendChatMessage(page, 'apply coupon SAVE20');
  210 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  211 |     expect(botReply).toContain('valid');
  212 |   });
  213 | 
  214 |   test('Complete Checkout & Order Placement via Chatbot', async ({ page }) => {
  215 |     // Make sure we have items in cart
  216 |     await sendChatMessage(page, 'Add headphones to cart');
  217 |     
  218 |     await sendChatMessage(page, 'Checkout now');
  219 |     await sendChatMessage(page, 'John Doe');
  220 |     await sendChatMessage(page, '123 Test Road');
  221 |     await sendChatMessage(page, 'New York, 10001');
  222 |     
  223 |     // Confirm order placement
  224 |     await sendChatMessage(page, 'confirm');
  225 |     
  226 |     // Verify DB state
  227 |     const db = mongoClient.db();
  228 |     const ordersCol = db.collection('orders');
  229 |     const userDoc = await db.collection('users').findOne({ email: 'john.doe@example.com' });
  230 |     expect(userDoc).not.toBeNull();
  231 |     
  232 |     const dbOrder = await ordersCol.findOne(
  233 |       { userId: userDoc!._id },
  234 |       { sort: { createdAt: -1 } }
  235 |     );
  236 |     expect(dbOrder).not.toBeNull();
  237 |     expect(dbOrder!.status).toBe('Pending');
```