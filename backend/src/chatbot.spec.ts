import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AgentService } from './modules/agent/agent.service';
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
        Object.assign(item, update);
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
      if (update.$push) {
        const pushKey = Object.keys(update.$push)[0];
        item[pushKey] = item[pushKey] || [];
        item[pushKey].push(update.$push[pushKey]);
      }
      if (update.$addToSet) {
        const setKey = Object.keys(update.$addToSet)[0];
        item[setKey] = item[setKey] || [];
        if (!item[setKey].includes(update.$addToSet[setKey])) {
          item[setKey].push(update.$addToSet[setKey]);
        }
      }
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
  });
});
