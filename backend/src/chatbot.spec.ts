import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AgentService } from './modules/agent/agent.service';
import { ChatbotIntelligenceService } from './modules/chatbot-intelligence/services/chatbot-intelligence.service';
import { IntelligenceLoaderService } from './modules/chatbot-intelligence/services/intelligence-loader.service';
import { SemanticSearchService } from './modules/chatbot-intelligence/services/semantic-search.service';
import { GoalDetectionService } from './modules/chatbot-intelligence/services/goal-detection.service';
import { EntityExtractionService } from './modules/chatbot-intelligence/services/entity-extraction.service';
import { ConversationMemoryService } from './modules/chatbot-intelligence/services/conversation-memory.service';
import { ClarificationService } from './modules/chatbot-intelligence/services/clarification.service';
import { ConfidenceService } from './modules/chatbot-intelligence/services/confidence.service';
import { FallbackService } from './modules/chatbot-intelligence/services/fallback.service';
import { ConversationRecoveryService } from './modules/chatbot-intelligence/services/conversation-recovery.service';
import { ActionPlannerService } from './modules/chatbot-intelligence/services/action-planner.service';
import { CatalogService } from './modules/catalog/catalog.service';
import { SalesService } from './modules/sales/sales.service';
import { ProfileService } from './modules/profile/profile.service';
import { AuthService } from './modules/auth/auth.service';
import { SupportService } from './modules/support/support.service';
import { AgentMemoryService } from './modules/agent/agent.memory.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  UserRepository,
  ProductRepository,
  InventoryRepository,
  CartRepository,
  WishlistRepository,
  OrderRepository,
  PaymentRepository,
  CouponRepository,
  VendorRepository,
  SettlementRepository,
  ReviewRepository,
  NotificationRepository,
  CategoryRepository,
  BrandRepository,
  AddressRepository,
  PaymentMethodRepository,
  WalletTransactionRepository,
  ReferralRepository,
  TicketRepository,
  LogRepository,
  RefundTransactionRepository,
  PaymentAuditLogRepository,
  PaymentWebhookLogRepository,
  AgentStatusRepository,
  LiveChatSessionRepository,
  LedgerEntryRepository,
  WarehouseRepository,
  FileMetadataRepository,
} from './repositories/concrete.repositories';



import { PaymentService } from './modules/payment/payment.service';
import { RecoveryService } from './modules/sales/recovery.service';
import { VoiceService } from './modules/voice/voice.service';
import { NotificationService } from './modules/notification/notification.service';
import { SupportGateway } from './modules/support/support.gateway';
import { UploadService } from './modules/catalog/upload.service';

function createQuery(result: any) {
  const query = {
    exec: async () => result,
    sort: function () {
      return this;
    },
    then: function (resolve: any, reject: any) {
      return Promise.resolve(result).then(resolve, reject);
    },
    catch: function (reject: any) {
      return Promise.resolve(result).catch(reject);
    },
  };
  return query;
}

function applyMockUpdate(item: any, update: any) {
  if (!item || !update) return;
  for (const key of Object.keys(update)) {
    if (!key.startsWith('$')) {
      item[key] = update[key];
    }
  }
  if (update.$set) {
    for (const key of Object.keys(update.$set)) {
      item[key] = update.$set[key];
    }
  }
  if (update.$push) {
    for (const key of Object.keys(update.$push)) {
      item[key] = item[key] || [];
      if (Array.isArray(item[key])) {
        const val = update.$push[key];
        if (val && typeof val === 'object' && '$each' in val && Array.isArray(val.$each)) {
          item[key].push(...val.$each);
        } else {
          item[key].push(val);
        }
      }
    }
  }
  if (update.$addToSet) {
    for (const key of Object.keys(update.$addToSet)) {
      item[key] = item[key] || [];
      if (Array.isArray(item[key])) {
        const val = update.$addToSet[key];
        if (val && typeof val === 'object' && '$each' in val && Array.isArray(val.$each)) {
          for (const subItem of val.$each) {
            if (!item[key].includes(subItem)) {
              item[key].push(subItem);
            }
          }
        } else {
          if (!item[key].includes(val)) {
            item[key].push(val);
          }
        }
      }
    }
  }
}

function createMockModel() {
  return class {
    static list: any[] = [];
    _id: string;
    messages: any[] = [];

    constructor(doc: any) {
      Object.assign(this, doc);
      if (!this._id) this._id = new Types.ObjectId().toHexString();
      if (!this.messages) this.messages = [];
      if (!this.logs) this.logs = [];
    }

    save() {
      const existingIdx = (this.constructor as any).list.findIndex(
        (i: any) => String(i._id) === String(this._id),
      );
      if (existingIdx > -1) {
        (this.constructor as any).list[existingIdx] = this;
      } else {
        (this.constructor as any).list.push(this);
      }
      return Promise.resolve(this);
    }

    markModified() {}

    static find(filter: any = {}) {
      const items = this.list.filter((item) => {
        for (const key of Object.keys(filter)) {
          if (key === '$text') {
            const searchVal = filter.$text.$search.toLowerCase();
            const matchesSearch =
              (item.title && item.title.toLowerCase().includes(searchVal)) ||
              (item.description &&
                item.description.toLowerCase().includes(searchVal)) ||
              (item.sku && item.sku.toLowerCase().includes(searchVal));
            if (!matchesSearch) return false;
            continue;
          }
          if (key.includes('.')) {
            const parts = key.split('.');
            const val = item[parts[0]];
            if (Array.isArray(val)) {
              if (
                !val.some(
                  (subItem) =>
                    String(subItem[parts[1]]) === String(filter[key]),
                )
              )
                return false;
            } else {
              return false;
            }
            continue;
          }
          if (String(item[key]) !== String(filter[key])) return false;
        }
        return true;
      });
      return createQuery(items);
    }

    static findOne(filter: any = {}) {
      const item = this.list.find((i) => {
        for (const key of Object.keys(filter)) {
          if (key === '$text') {
            const searchVal = filter.$text.$search.toLowerCase();
            const matchesSearch =
              (i.title && i.title.toLowerCase().includes(searchVal)) ||
              (i.description &&
                i.description.toLowerCase().includes(searchVal)) ||
              (i.sku && i.sku.toLowerCase().includes(searchVal));
            if (!matchesSearch) return false;
            continue;
          }
          if (key.includes('.')) {
            const parts = key.split('.');
            const val = i[parts[0]];
            if (Array.isArray(val)) {
              return val.some(
                (subItem) => String(subItem[parts[1]]) === String(filter[key]),
              );
            }
            return false;
          }
          if (String(i[key]) !== String(filter[key])) return false;
        }
        return true;
      });
      return createQuery(item || null);
    }

    static findById(id: any) {
      const item = this.list.find((i) => String(i._id) === String(id));
      return createQuery(item || null);
    }

    static create(doc: any) {
      const item = new this(doc);
      this.list.push(item);
      return Promise.resolve(item);
    }

    static findByIdAndUpdate(id: any, update: any) {
      const item = this.list.find((i) => String(i._id) === String(id));
      if (item) {
        applyMockUpdate(item, update);
      }
      return createQuery(item);
    }

    static findOneAndUpdate(filter: any, update: any) {
      let item = this.list.find((i) => {
        for (const key of Object.keys(filter)) {
          if (String(i[key]) !== String(filter[key])) return false;
        }
        return true;
      });
      if (!item) {
        item = new this(filter);
        this.list.push(item);
      }
      applyMockUpdate(item, update);
      return createQuery(item);
    }
  };
}

describe('Chatbot Conversational Flows (e2e)', () => {
  let app: INestApplication;
  let agentService: AgentService;
  let catalogService: CatalogService;
  let salesService: SalesService;
  let profileService: ProfileService;
  let authService: AuthService;

  beforeAll(async () => {
    // Generate mock model classes for Mongoose tokens
    const mockModels: Record<string, any> = {};
    const schemas = [
      'User',
      'Category',
      'Brand',
      'Inventory',
      'Product',
      'Cart',
      'Wishlist',
      'Coupon',
      'Order',
      'Payment',
      'Review',
      'Ticket',
      'Notification',
      'Log',
      'Vendor',
      'Settlement',
      'Analytics',
      'Address',
      'PaymentMethod',
      'WalletTransaction',
      'Referral',
      'ChatSession',
      'GuestProfile',
      'UserMemory',
      'RefundTransaction',
      'PaymentAuditLog',
      'PaymentWebhookLog',
      'AgentStatus',
      'LiveChatSession',
      'LedgerEntry',
      'Warehouse',
      'FileMetadata',
    ];

    const providers: any[] = [
      AgentService,
      ChatbotIntelligenceService,
      IntelligenceLoaderService,
      SemanticSearchService,
      GoalDetectionService,
      EntityExtractionService,
      ConversationMemoryService,
      ClarificationService,
      ConfidenceService,
      FallbackService,
      ConversationRecoveryService,
      ActionPlannerService,
      CatalogService,
      SalesService,
      ProfileService,
      AuthService,
      SupportService,
      AgentMemoryService,
      PaymentService,
      RecoveryService,
      VoiceService,
      NotificationService,
      SupportGateway,
      UploadService,
      UserRepository,
      ProductRepository,
      InventoryRepository,
      CartRepository,
      WishlistRepository,
      OrderRepository,
      PaymentRepository,
      CouponRepository,
      VendorRepository,
      SettlementRepository,
      ReviewRepository,
      NotificationRepository,
      CategoryRepository,
      BrandRepository,
      AddressRepository,
      PaymentMethodRepository,
      WalletTransactionRepository,
      ReferralRepository,
      TicketRepository,
      LogRepository,
      RefundTransactionRepository,
      PaymentAuditLogRepository,
      PaymentWebhookLogRepository,
      AgentStatusRepository,
      LiveChatSessionRepository,
      LedgerEntryRepository,
      WarehouseRepository,
      FileMetadataRepository,
    ];



    for (const schema of schemas) {
      mockModels[schema] = createMockModel();
      providers.push({
        provide: getModelToken(schema),
        useValue: mockModels[schema],
      });
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers,
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

  describe('Contextual Follow-up Search Flows', () => {
    beforeAll(async () => {
      await catalogService.createProduct({
        title: 'Super Phone A',
        description: 'An advanced smartphone',
        price: 15000,
        sku: 'SKU-PH-A',
        variants: { color: ['Black'] },
      });
      await catalogService.createProduct({
        title: 'Premium Phone B',
        description: 'Flagship phone',
        price: 25000,
        sku: 'SKU-PH-B',
        variants: { color: ['White'] },
      });
    });

    it('should merge search context on follow-up questions', async () => {
      const sessionId = 'follow-up-session';

      // 1. Search for phone
      const res1 = await agentService.processMessage({
        message: 'I want to buy phone',
        sessionId,
      });
      expect(res1.reply).toContain('Found 2 products');
      expect(res1.reply).toContain('for "phone"');

      // 2. Follow up with price constraint
      const res2 = await agentService.processMessage({
        message: 'under 20000',
        sessionId,
      });
      expect(res2.reply).toContain('Found 1 products');
      expect(res2.reply).toContain('for "phone"');
      expect(res2.reply).toContain('under $20000.00');
      expect(res2.reply).toContain('Super Phone A');
      expect(res2.reply).not.toContain('Premium Phone B');
    });
  });

  describe('Advanced E-Commerce Flows (Cart, Checkout, Alerts & Modifications)', () => {
    let testUser: any;
    let testProduct: any;
    let userId: string;

    beforeAll(async () => {
      const email = `chatbot.e2e.${Date.now()}@example.com`;
      const pass = 'password123';
      const registerRes = await authService.register({ email, password: pass });
      testUser = registerRes.user;
      userId = String(testUser.id);

      const userDoc = await (authService as any).userRepository.findById(
        userId,
      );
      userDoc.walletBalance = 1000;
      userDoc.rewardPoints = 500;
      await userDoc.save();

      await profileService.addAddress(userId, {
        fullName: 'Jane Doe',
        phone: '1234567890',
        addressLine1: '456 Elm St',
        city: 'Metropolis',
        state: 'NY',
        postalCode: '10001',
        addressType: 'Home',
      });

      testProduct = await catalogService.createProduct({
        title: 'Apex Gaming Mouse',
        description: 'High performance gaming mouse',
        price: 80,
        sku: 'SKU-GM-1234',
        variants: {
          color: ['Black', 'White'],
        },
      });

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
        userRoles: ['Customer'],
      });
      expect(res.nextStep).toBe('VARIANT_SELECT');
      expect(res.reply).toContain(
        'Which variant of Apex Gaming Mouse would you like?',
      );
    });

    it('should add to cart when variant is selected', async () => {
      const res = await agentService.processMessage({
        message: '1',
        sessionId: 'session-cart-1',
        userId,
        userRoles: ['Customer'],
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
      const step1 = await agentService.processMessage({
        message: 'checkout',
        sessionId: 'session-checkout-1',
        userId,
        userRoles: ['Customer'],
      });
      expect(step1.nextStep).toBe('CHECKOUT_ADDRESS_SELECT');

      const step2 = await agentService.processMessage({
        message: '1',
        sessionId: 'session-checkout-1',
        userId,
        userRoles: ['Customer'],
        activeStep: 'CHECKOUT_ADDRESS_SELECT',
        stepData: step1.stepData,
      });
      expect(step2.nextStep).toBe('CHECKOUT_PAYMENT_SELECT');

      const step3 = await agentService.processMessage({
        message: 'Wallet',
        sessionId: 'session-checkout-1',
        userId,
        userRoles: ['Customer'],
        activeStep: 'CHECKOUT_PAYMENT_SELECT',
        stepData: step2.stepData,
      });
      expect(step3.nextStep).toBe('CHECKOUT_CONFIRM');

      const step4 = await agentService.processMessage({
        message: 'confirm',
        sessionId: 'session-checkout-1',
        userId,
        userRoles: ['Customer'],
        activeStep: 'CHECKOUT_CONFIRM',
        stepData: step3.stepData,
      });
      expect(step4.reply).toContain('Order Placed Successfully!');
    });

    it('should set price and stock alerts and evaluate them', async () => {
      const alertRes = await agentService.processMessage({
        message: 'notify me when Apex Gaming Mouse price drops to 50',
        sessionId: 'session-alert-1',
        userId,
        userRoles: ['Customer'],
      });
      expect(alertRes.reply).toContain('Price Alert Set!');

      const userDoc = await (authService as any).userRepository.findById(
        userId,
      );
      const matchingAlert = userDoc.priceAlerts.find(
        (a: any) => a.productId === String(testProduct._id),
      );
      expect(matchingAlert).toBeDefined();
      expect(matchingAlert?.targetPrice).toBe(50);

      await catalogService.updateProduct(String(testProduct._id), {
        price: 45,
      });

      const notifications = await (
        salesService as any
      ).notificationRepository.find({ userId: testUser.id });
      const alertNotification = notifications.find(
        (n: any) => n.type === 'Alert',
      );
      expect(alertNotification).toBeDefined();
      expect(alertNotification.message).toContain('Price Drop!');
    });

    it('should manage order modifications', async () => {
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

      const modifyRes = await agentService.processMessage({
        message: '2',
        sessionId: 'session-modify-1',
        userId,
        userRoles: ['Customer'],
        activeStep: 'MODIFY_ORDER_OPTION',
        stepData: { orderId: String(order._id) },
      });
      expect(modifyRes.nextStep).toBe('MODIFY_ORDER_SLOT_SELECT');

      const modifyConfirm = await agentService.processMessage({
        message: 'Evening',
        sessionId: 'session-modify-1',
        userId,
        userRoles: ['Customer'],
        activeStep: 'MODIFY_ORDER_SLOT_SELECT',
        stepData: { orderId: String(order._id) },
      });
      expect(modifyConfirm.reply).toContain('updated to "Evening"');

      const updatedOrder = await salesService.getOrderById(String(order._id));
      expect(updatedOrder.deliverySlot).toBe('Evening');
    });

    it('should handle real voice STT and TTS', async () => {
      const voiceService = new (require('./modules/voice/voice.service').VoiceService)();
      
      // Test dynamic WAV generation (TTS)
      const tts = await voiceService.textToSpeech('Test Audio Synthesis', 'en');
      expect(tts.base64Audio).toBeDefined();
      expect(tts.base64Audio.length).toBeGreaterThan(100);
      expect(tts.audioUrl).toContain('synth_en_');

      // Test real audio stream parsing (STT)
      const stt = await voiceService.speechToText(tts.base64Audio, 'en');
      expect(stt.text).toBeDefined();
      expect(stt.intent).toBeDefined();
    });

    it('should verify payment webhook signatures strictly', async () => {
      const paymentService = new (require('./modules/payment/payment.service').PaymentService)(
        null, null, null, null, null, null, null, null
      );
      
      // Stripe Webhook check
      await expect(
        paymentService.verifyStripeWebhook('invalid_sig', { type: 'payment_intent.succeeded' })
      ).rejects.toThrow();

      // Razorpay Signature Check
      await expect(
        paymentService.verifyRazorpaySignature('order_123', 'pay_123', 'invalid_sig', null)
      ).rejects.toThrow();
    });

    it('should intercept messages during active live agent session', async () => {
      const activeSes = {
        _id: new Types.ObjectId(),
        status: 'Active',
        messages: [{ senderId: new Types.ObjectId(), senderName: 'Agent', message: 'Hello' }],
        save: async function() { return this; }
      };
      const supportService = new (require('./modules/support/support.service').SupportService)(
        null, null, {
          findOne: async () => activeSes,
          findById: async () => activeSes
        }
      );
      
      const localAgentService = new (require('./modules/agent/agent.service').AgentService)(
        { getOrCreateSession: async () => {}, trackGuestSession: async () => {} },
        null, null, supportService, null, null, null, null, null, null, null, null
      );

      const res = await localAgentService.processMessage({
        message: 'help me please',
        sessionId: 'session-live-1',
        userId: new Types.ObjectId().toHexString(),
        userRoles: ['Customer']
      });

      expect(res.reply).toContain('[Live Agent Active]');
      expect(res.intent).toBe('LIVE_AGENT_MESSAGE');
    });

    it('should process CSV bulk import and update existing product details', async () => {
      const category = await catalogService.createCategory({ name: 'BulkGeneral', slug: 'bulk-general' });
      const brand = await catalogService.createBrand({ name: 'BulkBrand' });

      const testSku = `SKU-BULK-${Date.now()}`;
      
      // Import 1: Create Product
      const csvData1 = `Title,Price,SKU,Stock\nBulk Mouse,15.99,${testSku},100`;
      const importRes1 = await catalogService.bulkImportCsv(csvData1);
      expect(importRes1.success).toBe(true);
      expect(importRes1.count).toBe(1);

      // Verify created product details
      const products1 = await catalogService.getProducts({ search: testSku });
      expect(products1[0].price).toBe(15.99);

      // Import 2: Update Existing Product (Bulk price/stock update)
      const csvData2 = `Title,Price,SKU,Stock\nBulk Mouse,12.50,${testSku},250`;
      const importRes2 = await catalogService.bulkImportCsv(csvData2);
      expect(importRes2.success).toBe(true);
      expect(importRes2.count).toBe(1);

      // Verify updated product details
      const products2 = await catalogService.getProducts({ search: testSku });
      expect(products2[0].price).toBe(12.50);
      
      const inventory = await salesService.getInventoryByProductId(String(products2[0]._id));
      expect(inventory.stock).toBe(250);
    });

    it('should update vendor product variants and link images conversationally', async () => {
      // Set testProduct vendorId to current test user
      const prod = await catalogService.getProductById(String(testProduct._id));
      prod.vendorId = new Types.ObjectId(userId);
      await prod.save();

      // 1. Update Variants
      const variantRes = await agentService.processMessage({
        message: 'Red, Blue, Green',
        sessionId: 'session-vendor-var',
        userId,
        userRoles: ['Vendor'],
        activeStep: 'VENDOR_UPDATE_VARIANTS_VAL',
        stepData: { productId: String(testProduct._id), variantKey: 'color' }
      });
      expect(variantRes.reply).toContain('Variants updated successfully');

      const productWithVariants = await catalogService.getProductById(String(testProduct._id));
      expect((productWithVariants as any).variants.color).toContain('Red');

      // 2. Link Uploaded Image
      const imageRes = await agentService.processMessage({
        message: 'https://apexstore.com/images/mouse.png',
        sessionId: 'session-vendor-img',
        userId,
        userRoles: ['Vendor'],
        activeStep: 'UPLOAD_FILE_INPUT',
        stepData: { productId: String(testProduct._id), fileType: 'image' }
      });
      expect(imageRes.reply).toContain('Image successfully associated');

      const productWithImage = await catalogService.getProductById(String(testProduct._id));
      expect((productWithImage as any).images[0]).toContain('_mouse.png');
    });

    it('should generate personalized, similar and bought together recommendations', async () => {
      // Setup order history context to seed collaborative filtering
      await salesService.placeOrder(userId, {
        items: [{ productId: String(testProduct._id), quantity: 1 }],
        shippingAddress: {
          fullName: 'Jane Doe',
          addressLine1: '456 Elm St',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '1234567890',
        },
        paymentProvider: 'Wallet',
      });

      // Update search history in memory
      await agentService.processMessage({
        message: 'Apex Gaming Mouse',
        sessionId: 'session-rec-1',
        userId,
        userRoles: ['Customer']
      });

      // Test general recommendation intent
      const recGeneral = await agentService.processMessage({
        message: 'recommend products',
        sessionId: 'session-rec-1',
        userId,
        userRoles: ['Customer']
      });
      expect(recGeneral.reply).toContain('Recommendations');

      // Test Frequently Bought Together intent
      const recFbt = await agentService.processMessage({
        message: 'what is frequently bought together with it',
        sessionId: 'session-rec-1',
        userId,
        userRoles: ['Customer']
      });
      expect(recFbt.reply).toContain('Frequently Bought Together');

      // Test Similar Products intent
      const recSimilar = await agentService.processMessage({
        message: 'show me similar products',
        sessionId: 'session-rec-1',
        userId,
        userRoles: ['Customer']
      });
      expect(recSimilar.reply).toContain('Products Similar to');
    });
  });
});
