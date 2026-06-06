# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\chatbot.spec.ts >> Chatbot Authenticated User Actions >> Apply Coupon via Chatbot
- Location: tests\chatbot.spec.ts:208:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "valid"
Received string:    "🏷️ To apply a coupon, type: **\"apply coupon [CODE]\"**·
Example: *\"apply coupon SAVE20\"*·
Active codes you can try:
• **SAVE20** — 20% off your order04:19 PM"
```

# Test source

```ts
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
  137 |     expect(botReply).toContain('Apex Sound-Pro ANC Headphones');
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
  209 |     await sendChatMessage(page, 'Add headphones to cart');
  210 |     await sendChatMessage(page, 'apply coupon SAVE20');
  211 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
> 212 |     expect(botReply).toContain('valid');
      |                      ^ Error: expect(received).toContain(expected) // indexOf
  213 |   });
  214 | 
  215 |   test('Complete Checkout & Order Placement via Chatbot', async ({ page }) => {
  216 |     // Make sure we have items in cart
  217 |     await sendChatMessage(page, 'Add headphones to cart');
  218 |     
  219 |     await sendChatMessage(page, 'Checkout now');
  220 |     await sendChatMessage(page, 'John Doe');
  221 |     await sendChatMessage(page, '123 Test Road');
  222 |     await sendChatMessage(page, 'New York, 10001');
  223 |     await sendChatMessage(page, 'COD');
  224 |     
  225 |     // Confirm order placement
  226 |     await sendChatMessage(page, 'confirm');
  227 |     
  228 |     // Verify DB state
  229 |     const db = mongoClient.db();
  230 |     const ordersCol = db.collection('orders');
  231 |     const userDoc = await db.collection('users').findOne({ email: 'john.doe@example.com' });
  232 |     expect(userDoc).not.toBeNull();
  233 |     
  234 |     const dbOrder = await ordersCol.findOne(
  235 |       { userId: userDoc!._id },
  236 |       { sort: { createdAt: -1 } }
  237 |     );
  238 |     expect(dbOrder).not.toBeNull();
  239 |     expect(dbOrder!.status).toBe('Pending');
  240 |     
  241 |     // Verify UI cart total cleared
  242 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  243 |     expect(botReply).toContain('Placed Successfully');
  244 |     
  245 |     reportResults.capabilities.checkout = 'Pass';
  246 |     reportResults.capabilities.orders = 'Pass';
  247 |     reportResults.capabilities.payment = 'Pass';
  248 |   });
  249 | 
  250 |   test('Track order status', async ({ page }) => {
  251 |     await sendChatMessage(page, 'Track my latest order');
  252 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  253 |     expect(botReply).toContain('Status');
  254 |   });
  255 | 
  256 |   test('Create support ticket via Chatbot', async ({ page }) => {
  257 |     await sendChatMessage(page, 'Open a support ticket');
  258 |     await sendChatMessage(page, 'Delay in shipment');
  259 |     await sendChatMessage(page, 'My order has not arrived yet.');
  260 |     
  261 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  262 |     expect(botReply).toContain('Created');
  263 |   });
  264 | 
  265 |   test('Wishlist actions via Chatbot', async ({ page }) => {
  266 |     await sendChatMessage(page, 'my wishlist');
  267 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  268 |     await assertNotTextOnly(botReply, 'Wishlist View');
  269 |     
  270 |     reportResults.capabilities.wishlist = 'Pass';
  271 |   });
  272 | 
  273 |   test('Memory context test (Add and add one more)', async ({ page }) => {
  274 |     await sendChatMessage(page, 'Add headphones to cart');
  275 |     await sendChatMessage(page, 'Add one more');
  276 |     
  277 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  278 |     expect(botReply).toContain('Added to Cart');
  279 |     
  280 |     reportResults.capabilities.memory = 'Pass';
  281 |   });
  282 | });
  283 | 
```