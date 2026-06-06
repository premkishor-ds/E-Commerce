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
Received string:    "[Live Agent Active] Message sent to support representative.03:41 PM"
```

# Test source

```ts
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
  209 |     await sendChatMessage(page, 'apply coupon SAVE20');
  210 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
> 211 |     expect(botReply).toContain('valid');
      |                      ^ Error: expect(received).toContain(expected) // indexOf
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
  238 |     
  239 |     // Verify UI cart total cleared
  240 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  241 |     expect(botReply).toContain('Placed Successfully');
  242 |     
  243 |     reportResults.capabilities.checkout = 'Pass';
  244 |     reportResults.capabilities.orders = 'Pass';
  245 |     reportResults.capabilities.payment = 'Pass';
  246 |   });
  247 | 
  248 |   test('Track order status', async ({ page }) => {
  249 |     await sendChatMessage(page, 'Track my latest order');
  250 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  251 |     expect(botReply).toContain('Status');
  252 |   });
  253 | 
  254 |   test('Create support ticket via Chatbot', async ({ page }) => {
  255 |     await sendChatMessage(page, 'Open a support ticket');
  256 |     await sendChatMessage(page, 'Delay in shipment');
  257 |     await sendChatMessage(page, 'My order has not arrived yet.');
  258 |     
  259 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  260 |     expect(botReply).toContain('Created');
  261 |   });
  262 | 
  263 |   test('Wishlist actions via Chatbot', async ({ page }) => {
  264 |     await sendChatMessage(page, 'my wishlist');
  265 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  266 |     await assertNotTextOnly(botReply, 'Wishlist View');
  267 |     
  268 |     reportResults.capabilities.wishlist = 'Pass';
  269 |   });
  270 | 
  271 |   test('Memory context test (Add and add one more)', async ({ page }) => {
  272 |     await sendChatMessage(page, 'Add headphones to cart');
  273 |     await sendChatMessage(page, 'Add one more');
  274 |     
  275 |     const botReply = await page.locator('div.rounded-tl-none').last().textContent() || '';
  276 |     expect(botReply).toContain('Added to Cart');
  277 |     
  278 |     reportResults.capabilities.memory = 'Pass';
  279 |   });
  280 | });
  281 | 
```