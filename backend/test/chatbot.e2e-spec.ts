import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AgentService } from '../src/modules/agent/agent.service';
import { CatalogService } from '../src/modules/catalog/catalog.service';
import { SalesService } from '../src/modules/sales/sales.service';
import { ProfileService } from '../src/modules/profile/profile.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { connection } from 'mongoose';

describe('Chatbot Conversational Flows (e2e)', () => {
  let app: INestApplication;
  let agentService: AgentService;
  let catalogService: CatalogService;
  let salesService: SalesService;
  let profileService: ProfileService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    agentService = moduleFixture.get<AgentService>(AgentService);
    catalogService = moduleFixture.get<CatalogService>(CatalogService);
    salesService = moduleFixture.get<SalesService>(SalesService);
    profileService = moduleFixture.get<ProfileService>(ProfileService);
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    // Clean database connections
    await connection.close();
    await app.close();
  });

  describe('Basic Conversational Flows & Greetings', () => {
    it('should respond to GREET intent', async () => {
      const res = await agentService.processMessage({
        message: 'hello',
        sessionId: 'session-123',
      });
      expect(res.reply).toContain('ApexStore');
      expect(res.intent).toBe('GREET');
    });

    it('should respond to HELP intent', async () => {
      const res = await agentService.processMessage({
        message: 'help me',
        sessionId: 'session-123',
      });
      expect(res.reply).toContain('ApexStore AI Assistant');
      expect(res.intent).toBe('HELP');
    });
  });

  describe('Language Auto-Detection & Translation Layer', () => {
    it('should auto-detect Hindi, set preference, and respond in Hindi', async () => {
      const res = await agentService.processMessage({
        message: 'namaste',
        sessionId: 'session-hi-1',
      });
      expect(res.reply).toContain('नमस्ते');
      expect(res.intent).toBe('GREET');
    });

    it('should auto-detect Telugu and respond in Telugu', async () => {
      const res = await agentService.processMessage({
        message: 'namaskaram',
        sessionId: 'session-te-1',
      });
      expect(res.reply).toContain('నమస్కారం');
      expect(res.intent).toBe('GREET');
    });
  });

  describe('Advanced E-Commerce Flows (Cart, Checkout, Alerts & Modifications)', () => {
    let testUser: any;
    let testProduct: any;
    let userId: string;

    beforeAll(async () => {
      // Create user
      const email = `chatbot.e2e.${Date.now()}@example.com`;
      const pass = 'password123';
      const registerRes = await authService.register({ email, password: pass });
      testUser = registerRes.user;
      userId = String(testUser._id);

      // Give loyalty points and wallet balance to make payments possible
      const profile = await profileService.getProfile(userId);
      profile.walletBalance = 1000;
      profile.rewardPoints = 500;
      await profile.save();

      // Add default shipping address
      await profileService.addAddress(userId, {
        fullName: 'Jane Doe',
        phone: '1234567890',
        addressLine1: '456 Elm St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        addressType: 'Home',
      });

      // Create test product with variants
      testProduct = await catalogService.createProduct({
        title: 'Apex Gaming Mouse',
        description: 'High performance gaming mouse',
        price: 80,
        sku: `SKU-GM-${Date.now()}`,
        variants: {
          color: ['Black', 'White'],
        },
        category:
          (await (catalogService as any).categoryRepository.findOne({}))?._id ||
          new connection.models.Category()._id,
        brand:
          (await (catalogService as any).brandRepository.findOne({}))?._id ||
          new connection.models.Brand()._id,
      });

      // Update inventory flags
      const inv = await salesService.getInventoryByProductId(
        String(testProduct._id),
      );
      if (inv) {
        inv.stock = 10;
        (inv as any).allowPreorder = true;
        (inv as any).restockDate = new Date(Date.now() + 86400000);
        await inv.save();
      }
    });

    it('should prompt user to select variant when unspecified', async () => {
      const res = await agentService.processMessage({
        message: 'add Apex Gaming Mouse to cart',
        sessionId: 'session-cart-1',
        userId,
      });
      expect(res.nextStep).toBe('VARIANT_SELECT');
      expect(res.reply).toContain(
        'Which variant of Apex Gaming Mouse would you like?',
      );
    });

    it('should add to cart when variant is selected', async () => {
      const res = await agentService.processMessage({
        message: '1', // Selecting first option (Black)
        sessionId: 'session-cart-1',
        userId,
        activeStep: 'VARIANT_SELECT',
        stepData: {
          productId: String(testProduct._id),
          combos: ['Black', 'White'],
        },
      });
      expect(res.reply).toContain('Added to Cart!');
      expect(res.reply).toContain('Apex Gaming Mouse (Black)');
    });

    it('should complete checkout using Wallet', async () => {
      // Step 1: Trigger checkout
      const step1 = await agentService.processMessage({
        message: 'checkout',
        sessionId: 'session-checkout-1',
        userId,
      });
      expect(step1.nextStep).toBe('CHECKOUT_ADDRESS_SELECT');

      // Step 2: Select shipping address
      const step2 = await agentService.processMessage({
        message: '1',
        sessionId: 'session-checkout-1',
        userId,
        activeStep: 'CHECKOUT_ADDRESS_SELECT',
        stepData: step1.stepData,
      });
      expect(step2.nextStep).toBe('CHECKOUT_PAYMENT_SELECT');

      // Step 3: Select payment method
      const step3 = await agentService.processMessage({
        message: 'Wallet',
        sessionId: 'session-checkout-1',
        userId,
        activeStep: 'CHECKOUT_PAYMENT_SELECT',
        stepData: step2.stepData,
      });
      expect(step3.nextStep).toBe('CHECKOUT_CONFIRM');

      // Step 4: Confirm order
      const step4 = await agentService.processMessage({
        message: 'confirm',
        sessionId: 'session-checkout-1',
        userId,
        activeStep: 'CHECKOUT_CONFIRM',
        stepData: step3.stepData,
      });
      expect(step4.reply).toContain('Order Placed Successfully!');
    });

    it('should set price and stock alerts and evaluate them', async () => {
      // Set alert
      const alertRes = await agentService.processMessage({
        message: 'notify me when Apex Gaming Mouse price drops to 50',
        sessionId: 'session-alert-1',
        userId,
      });
      expect(alertRes.reply).toContain('Price Alert Set!');

      // Check user profile alert list
      const profile = await profileService.getProfile(userId);
      const matchingAlert = profile.priceAlerts.find(
        (a) => a.productId === String(testProduct._id),
      );
      expect(matchingAlert).toBeDefined();
      expect(matchingAlert?.targetPrice).toBe(50);

      // Simulate price update to trigger alert
      await catalogService.updateProduct(String(testProduct._id), {
        price: 45,
      });

      // Verification: Check if notification was created
      const notifications = await (
        salesService as any
      ).notificationRepository.find({ userId: testUser._id });
      const alertNotification = notifications.find(
        (n: any) => n.type === 'Alert',
      );
      expect(alertNotification).toBeDefined();
      expect(alertNotification.message).toContain('Price Drop!');
    });

    it('should manage order modifications', async () => {
      // Create a pending order
      const order = await salesService.placeOrder(userId, {
        items: [{ productId: String(testProduct._id), quantity: 2 }],
        shippingAddress: {
          fullName: 'Jane Doe',
          addressLine1: '456 Elm St',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '1234567890',
        },
        paymentProvider: 'Stripe',
      });

      // Modify delivery slot
      const modifyRes = await agentService.processMessage({
        message: '2', // Option 2 is Delivery Slot
        sessionId: 'session-modify-1',
        userId,
        activeStep: 'MODIFY_ORDER_OPTION',
        stepData: { orderId: String(order._id) },
      });
      expect(modifyRes.nextStep).toBe('MODIFY_ORDER_SLOT_SELECT');

      const modifyConfirm = await agentService.processMessage({
        message: 'Evening',
        sessionId: 'session-modify-1',
        userId,
        activeStep: 'MODIFY_ORDER_SLOT_SELECT',
        stepData: { orderId: String(order._id) },
      });
      expect(modifyConfirm.reply).toContain('updated to "Evening"');

      // Verify slot in DB
      const updatedOrder = await salesService.getOrderById(String(order._id));
      expect(updatedOrder.deliverySlot).toBe('Evening');
    });
  });
});
