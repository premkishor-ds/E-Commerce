# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\chatbot.spec.ts >> Chatbot Authenticated User Actions >> Track order status
- Location: tests\chatbot.spec.ts:250:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Status"
Received string:    "👋 Hello back! I'm the **ApexStore AI Assistant**.·
I can help you:
• 🔍 Search & compare products
• 🛒 Manage your cart & wishlist
• 📦 Track & manage orders
• 🎫 Create support tickets
• 🔐 Manage your account·
💡 Based on your recent searches, you might be interested in looking at products related to **\"Samsung\", \"retrn ordr 12\"**.
📦 **Order status update**: Your last order **#CD519038** is currently **Pending**.·
What can I help you with today?04:19 PM"
```

# Test source

```ts
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
  212 |     expect(botReply).toContain('valid');
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
> 253 |     expect(botReply).toContain('Status');
      |                      ^ Error: expect(received).toContain(expected) // indexOf
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