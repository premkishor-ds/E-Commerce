import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  OrderRepository,
  PaymentRepository,
  RefundTransactionRepository,
  PaymentAuditLogRepository,
  PaymentWebhookLogRepository,
  UserRepository,
  WalletTransactionRepository,
  LedgerEntryRepository,
  ProductRepository,
  InventoryRepository,
} from '../../repositories/concrete.repositories';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private stripe: any = null;
  private razorpay: any = null;


  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly refundTransactionRepository: RefundTransactionRepository,
    private readonly paymentAuditLogRepository: PaymentAuditLogRepository,
    private readonly paymentWebhookLogRepository: PaymentWebhookLogRepository,
    private readonly userRepository: UserRepository,
    private readonly walletTransactionRepository: WalletTransactionRepository,
    private readonly ledgerEntryRepository: LedgerEntryRepository,
    private readonly productRepository: ProductRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {
    // Instantiate Stripe if key is provided and not mocked
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey !== 'mock_key' && !stripeKey.startsWith('pi_')) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
    }

    // Instantiate Razorpay if key is provided and not mocked
    const rzpId = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
    if (rzpId && rzpId !== 'mock_key' && rzpSecret && rzpSecret !== 'mock_secret') {
      this.razorpay = new Razorpay({
        key_id: rzpId,
        key_secret: rzpSecret,
      });
    }
  }

  // --- LEDGER DOUBLE ENTRY SYSTEM ---
  private async recordDoubleEntry(
    userId: string,
    transactionId: string,
    amount: number,
    fromAccount: string,
    toAccount: string,
    description: string,
    session?: any,
  ) {
    const userObjectId = new Types.ObjectId(userId);
    // 1. Debit Entry (Adding money to target account, or reducing cash)
    const debitData = {
      userId: userObjectId,
      amount: Math.abs(amount),
      entryType: 'Debit',
      accountName: toAccount,
      transactionId,
      description,
    };
    // 2. Credit Entry (Reducing money from source account)
    const creditData = {
      userId: userObjectId,
      amount: -Math.abs(amount),
      entryType: 'Credit',
      accountName: fromAccount,
      transactionId,
      description,
    };

    if (session) {
      await this.ledgerEntryRepository['model'].create([debitData, creditData], { session });
    } else {
      await this.ledgerEntryRepository.create(debitData);
      await this.ledgerEntryRepository.create(creditData);
    }
  }

  // COMMIT STOCK RESERVATION ON PAYMENT
  private async commitReservation(orderId: string, session?: any) {
    const orderModel = this.orderRepository['model'];
    const productModel = this.productRepository['model'];
    const inventoryModel = this.inventoryRepository['model'];

    let order = await orderModel.findById(orderId);
    if (session) {
      order = await orderModel.findById(orderId).session(session);
    }
    if (!order) return;

    for (const item of order.items) {
      let product = await productModel.findById(item.productId);
      if (session) {
        product = await productModel.findById(item.productId).session(session);
      }
      if (!product) continue;

      // Increment sales count and total units sold
      product.salesCount = (product.salesCount || 0) + item.quantity;
      product.totalUnitsSold = (product.totalUnitsSold || 0) + item.quantity;
      if (session) {
        await product.save({ session });
      } else {
        await product.save();
      }

      let inventory = await inventoryModel.findOne({ sku: product.sku });
      if (session) {
        inventory = await inventoryModel.findOne({ sku: product.sku }).session(session);
      }
      if (inventory) {
        inventory.reservedStock = Math.max(0, (inventory.reservedStock || 0) - item.quantity);
        inventory.logs.push({
          quantityChanged: 0,
          reason: `Payment Confirmed - Reservation Committed for Order #${orderId.slice(-6)}`,
          timestamp: new Date(),
        });
        if (session) {
          await inventory.save({ session });
        } else {
          await inventory.save();
        }
      }
    }
  }

  // AUDIT LOG HELPER
  private async logAudit(
    userId: string | null,
    orderId: string | null,
    action: string,
    status: string,
    details: any,
  ) {
    await this.paymentAuditLogRepository.create({
      userId: userId ? new Types.ObjectId(userId) : null,
      orderId: orderId ? new Types.ObjectId(orderId) : null,
      action,
      status,
      details,
    });
  }

  // --- STRIPE INTEGRATION ---
  async createStripePaymentIntent(orderId: string, userId: string | null) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    let clientSecret = '';
    let status = 'Pending';
    const amountInCents = Math.round(order.totalPrice * 100);

    if (this.stripe) {
      try {
        const intent = await this.stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          metadata: { orderId, userId: userId || '' },
        });
        clientSecret = intent.client_secret || '';
      } catch (err: any) {
        await this.logAudit(userId, orderId, 'StripeIntentCreationFailed', 'Failed', { error: err.message });
        throw new BadRequestException(`Stripe Error: ${err.message}`);
      }
    } else {
      // Fallback Mock mode
      clientSecret = `pi_${Math.random().toString(36).substring(2, 12)}_secret_${Math.random().toString(36).substring(2, 8)}`;
    }

    await this.paymentRepository.create({
      orderId: order._id,
      amount: order.totalPrice,
      provider: 'Stripe',
      status: 'Pending',
      transactionId: clientSecret,
    });

    await this.logAudit(userId, orderId, 'StripeIntentCreated', 'Success', {
      clientSecret,
      amount: order.totalPrice,
    });

    return {
      clientSecret,
      amount: order.totalPrice,
      currency: 'usd',
      status,
    };
  }

  async confirmStripePayment(transactionId: string, userId: string | null) {
    const payment = await this.paymentRepository.findOne({ transactionId });
    if (!payment) throw new NotFoundException('Payment transaction not found');

    payment.status = 'Completed';
    await payment.save();

    await this.orderRepository.update(payment.orderId.toString(), {
      status: 'Paid',
    });

    await this.commitReservation(payment.orderId.toString());

    // Double entry accounting recording: Debit Cash (Asset), Credit Revenue (Equity/Income)
    if (userId) {
      await this.recordDoubleEntry(
        userId,
        transactionId,
        payment.amount,
        'Cash',
        'Revenue',
        `Stripe Payment Confirmation for Order #${payment.orderId.toString().slice(-6)}`
      );
    }

    await this.logAudit(
      userId,
      payment.orderId.toString(),
      'StripePaymentConfirmed',
      'Success',
      { transactionId },
    );

    return { success: true, status: 'Completed', orderId: payment.orderId };
  }

  async refundStripePayment(
    orderId: string,
    amount?: number,
    reason?: string,
    userId?: string,
  ) {
    const payment = await this.paymentRepository.findOne({
      orderId: new Types.ObjectId(orderId),
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount exceeds transaction amount');
    }

    let refundTxId = '';
    if (this.stripe && !payment.transactionId.startsWith('pi_mock')) {
      try {
        const refund = await this.stripe.refunds.create({
          payment_intent: payment.transactionId,
          amount: Math.round(refundAmount * 100),
        });
        refundTxId = refund.id;
      } catch (err: any) {
        throw new BadRequestException(`Stripe Refund Error: ${err.message}`);
      }
    } else {
      refundTxId = `re_${Math.random().toString(36).substring(2, 12)}`;
    }

    let session: any = null;
    try {
      session = await this.orderRepository['model'].db.startSession();
      session.startTransaction();
    } catch (e) {
      // Fallback
    }

    try {
      const refundData = {
        orderId: payment.orderId,
        paymentId: payment._id,
        amount: refundAmount,
        provider: 'Stripe',
        refundTransactionId: refundTxId,
        status: 'Completed',
        reason: reason || 'Customer request',
      };

      if (session) {
        await this.refundTransactionRepository['model'].create([refundData], { session });
      } else {
        await this.refundTransactionRepository.create(refundData);
      }

      payment.status =
        refundAmount === payment.amount ? 'Refunded' : 'Partially Refunded';

      if (session) {
        await payment.save({ session });
      } else {
        await payment.save();
      }

      if (session) {
        await this.orderRepository['model'].findByIdAndUpdate(orderId, { status: 'Returned' }).session(session);
      } else {
        await this.orderRepository.update(orderId, { status: 'Returned' });
      }

      // Ledger record: Debit Revenue (reversal), Credit Cash (Refund payout)
      if (userId) {
        await this.recordDoubleEntry(
          userId,
          refundTxId,
          refundAmount,
          'Revenue',
          'Cash',
          `Stripe Refund for Order #${orderId.slice(-6)}`,
          session
        );
      }

      await this.logAudit(
        userId || null,
        orderId,
        'StripePaymentRefunded',
        'Success',
        { refundTxId, amount: refundAmount },
      );

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      return { success: true, refundTransactionId: refundTxId, refundAmount };
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }

  async syncStripeStatus(transactionId: string) {
    const payment = await this.paymentRepository.findOne({ transactionId });
    if (!payment) throw new NotFoundException('Payment not found');
    return { transactionId, provider: 'Stripe', status: payment.status };
  }

  async verifyStripeWebhook(signature: string, payload: any) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    await this.paymentWebhookLogRepository.create({
      provider: 'Stripe',
      eventType: payload.type || 'unknown',
      payload,
      status: 'Processed',
    });

    if (this.stripe && webhookSecret) {
      try {
        const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const event = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        );
        payload = event;
      } catch (err: any) {
        await this.logAudit(null, null, 'StripeWebhookVerificationFailed', 'Failed', { error: err.message });
        throw new BadRequestException(`Stripe Webhook Signature Verification Failed: ${err.message}`);
      }
    } else {
      if (!signature || !signature.includes('t=') || !signature.includes('v1=')) {
        throw new BadRequestException('Invalid or missing Stripe webhook signature');
      }
    }

    if (payload.type === 'payment_intent.succeeded') {
      const intentId = payload.data?.object?.id;
      if (intentId) {
        await this.confirmStripePayment(intentId, null);
      }
    }
    return { verified: true };
  }

  async verifyRazorpayWebhook(signature: string, payload: any) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    await this.paymentWebhookLogRepository.create({
      provider: 'Razorpay',
      eventType: payload.event || 'unknown',
      payload,
      status: 'Processed',
    });

    if (webhookSecret && webhookSecret !== 'mock_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
        .digest('hex');
      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid Razorpay webhook signature');
      }
    } else {
      if (!signature || signature.length < 10) {
        throw new BadRequestException('Invalid or missing Razorpay webhook signature');
      }
    }

    if (payload.event === 'payment.captured') {
      const orderId = payload.payload?.payment?.entity?.order_id;
      const paymentId = payload.payload?.payment?.entity?.id;
      if (orderId && paymentId) {
        const payment = await this.paymentRepository.findOne({ transactionId: orderId });
        if (payment) {
          payment.status = 'Completed';
          payment.transactionId = paymentId;
          await payment.save();

          await this.orderRepository.update(payment.orderId.toString(), {
            status: 'Paid',
          });

          await this.commitReservation(payment.orderId.toString());
        }
      }
    }
    return { verified: true };
  }

  // --- RAZORPAY INTEGRATION ---
  async createRazorpayOrder(orderId: string, userId: string | null) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    let razorpayOrderId = '';
    const amountInPaise = Math.round(order.totalPrice * 100);

    if (this.razorpay) {
      try {
        const rzpOrder = await this.razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${orderId}`,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err: any) {
        throw new BadRequestException(`Razorpay Error: ${err.message}`);
      }
    } else {
      razorpayOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;
    }

    await this.paymentRepository.create({
      orderId: order._id,
      amount: order.totalPrice,
      provider: 'Razorpay',
      status: 'Pending',
      transactionId: razorpayOrderId,
    });

    await this.logAudit(userId, orderId, 'RazorpayOrderCreated', 'Success', {
      razorpayOrderId,
      amount: order.totalPrice,
    });

    return {
      id: razorpayOrderId,
      amount: order.totalPrice * 100,
      currency: 'INR',
    };
  }

  async verifyRazorpaySignature(
    orderId: string,
    razorpayPaymentId: string,
    signature: string,
    userId: string | null,
  ) {
    let isValid = false;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';

    const hmac = crypto.createHmac('sha256', rzpSecret);
    hmac.update(`${orderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');
    isValid = generatedSignature === signature;

    if (!isValid) {
      await this.logAudit(
        userId,
        orderId,
        'RazorpaySignatureVerification',
        'Failed',
        { razorpayPaymentId },
      );
      throw new BadRequestException('Invalid Razorpay signature');
    }

    const payment = await this.paymentRepository.findOne({
      transactionId: orderId,
    });
    if (!payment) throw new NotFoundException('Razorpay transaction not found');

    payment.status = 'Completed';
    payment.transactionId = razorpayPaymentId;
    await payment.save();

    await this.orderRepository.update(payment.orderId.toString(), {
      status: 'Paid',
    });

    await this.commitReservation(payment.orderId.toString());

    // Accounting Record: Debit Cash (Asset), Credit Revenue (Equity)
    if (userId) {
      await this.recordDoubleEntry(
        userId,
        razorpayPaymentId,
        payment.amount,
        'Cash',
        'Revenue',
        `Razorpay Payment Confirmation for Order #${payment.orderId.toString().slice(-6)}`
      );
    }

    await this.logAudit(
      userId,
      payment.orderId.toString(),
      'RazorpaySignatureVerification',
      'Success',
      { razorpayPaymentId },
    );

    return { success: true, status: 'Completed' };
  }

  async refundRazorpayPayment(
    orderId: string,
    amount?: number,
    reason?: string,
    userId?: string,
  ) {
    const payment = await this.paymentRepository.findOne({
      orderId: new Types.ObjectId(orderId),
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const refundAmount = amount || payment.amount;
    let refundTxId = '';

    if (this.razorpay && !payment.transactionId.startsWith('order_mock')) {
      try {
        const refund = await this.razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(refundAmount * 100),
          notes: { reason: reason || 'Customer request' },
        });
        refundTxId = refund.id;
      } catch (err: any) {
        throw new BadRequestException(`Razorpay Refund Error: ${err.message}`);
      }
    } else {
      refundTxId = `rfnd_${Math.random().toString(36).substring(2, 12)}`;
    }

    let session: any = null;
    try {
      session = await this.orderRepository['model'].db.startSession();
      session.startTransaction();
    } catch (e) {
      // Fallback
    }

    try {
      const refundData = {
        orderId: payment.orderId,
        paymentId: payment._id,
        amount: refundAmount,
        provider: 'Razorpay',
        refundTransactionId: refundTxId,
        status: 'Completed',
        reason: reason || 'Customer request',
      };

      if (session) {
        await this.refundTransactionRepository['model'].create([refundData], { session });
      } else {
        await this.refundTransactionRepository.create(refundData);
      }

      payment.status =
        refundAmount === payment.amount ? 'Refunded' : 'Partially Refunded';

      if (session) {
        await payment.save({ session });
      } else {
        await payment.save();
      }

      if (session) {
        await this.orderRepository['model'].findByIdAndUpdate(orderId, { status: 'Returned' }).session(session);
      } else {
        await this.orderRepository.update(orderId, { status: 'Returned' });
      }

      // Ledger Entry: Debit Revenue, Credit Cash
      if (userId) {
        await this.recordDoubleEntry(
          userId,
          refundTxId,
          refundAmount,
          'Revenue',
          'Cash',
          `Razorpay Refund for Order #${orderId.slice(-6)}`,
          session
        );
      }

      await this.logAudit(userId || null, orderId, 'RazorpayRefund', 'Success', {
        refundTxId,
        amount: refundAmount,
      });

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      return { success: true, refundTransactionId: refundTxId };
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }

  // --- WALLET & HYBRID PAYMENTS ---
  async validateWalletBalance(userId: string, amount: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return (user.walletBalance || 0) >= amount;
  }

  async processWalletPayment(orderId: string, userId: string, amount: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const balance = user.walletBalance || 0;
    if (balance < amount)
      throw new BadRequestException('Insufficient wallet balance');

    user.walletBalance = balance - amount;
    await user.save();

    const txn = await this.walletTransactionRepository.create({
      userId: user._id,
      amount: -amount,
      transactionType: 'Debit',
      description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
      status: 'Completed',
    });

    // Ledger recording: Debit Wallet (Liability), Credit Revenue (Equity)
    await this.recordDoubleEntry(
      userId,
      txn._id.toString(),
      amount,
      'Wallet',
      'Revenue',
      `Wallet Payment for Order #${orderId.slice(-6)}`
    );

    await this.logAudit(userId, orderId, 'WalletPaymentProcessed', 'Success', {
      amount,
    });
    return { success: true, newBalance: user.walletBalance };
  }

  async processHybridPayment(
    orderId: string,
    userId: string,
    walletAmount: number,
    gatewayAmount: number,
    gatewayProvider: 'Stripe' | 'Razorpay',
  ) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    if (walletAmount + gatewayAmount < order.totalPrice) {
      throw new BadRequestException(
        'Total payment amount is less than order price',
      );
    }

    // Deduct Wallet
    await this.processWalletPayment(orderId, userId, walletAmount);

    // Create Gateway intent for remainder
    let gatewayDetails: any = {};
    if (gatewayProvider === 'Stripe') {
      gatewayDetails = await this.createStripePaymentIntent(orderId, userId);
    } else {
      gatewayDetails = await this.createRazorpayOrder(orderId, userId);
    }

    await this.logAudit(userId, orderId, 'HybridPaymentInitiated', 'Success', {
      walletAmount,
      gatewayAmount,
      gatewayProvider,
    });
    return { success: true, walletAmount, gatewayAmount, gatewayDetails };
  }

  // --- COD ELIGIBILITY ---
  async checkCodEligibility(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const limit = 500; // COD max limit
    const charge = 5.0; // COD processing charge

    const eligible = order.totalPrice <= limit;
    const reason = eligible
      ? 'Eligible'
      : `COD is not available for orders above $${limit}`;

    return { eligible, limit, charge, reason };
  }

  // --- HISTORY & UTILS ---
  async getPaymentHistory(userId: string) {
    const orders = await this.orderRepository.find({
      userId: new Types.ObjectId(userId),
    });
    const orderIds = orders.map((o) => o._id);
    return this.paymentRepository.find({ orderId: { $in: orderIds } });
  }

  async retryPayment(orderId: string, provider: string, userId: string | null) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const transactionId =
      'TXN-RETRY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const payment = await this.paymentRepository.create({
      orderId: order._id,
      amount: order.totalPrice,
      provider,
      status: 'Pending',
      transactionId,
    });

    await this.logAudit(userId, orderId, 'PaymentRetry', 'Success', {
      transactionId,
      provider,
    });
    return { success: true, transactionId, payment };
  }
}
