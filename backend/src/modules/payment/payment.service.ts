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
} from '../../repositories/concrete.repositories';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly refundTransactionRepository: RefundTransactionRepository,
    private readonly paymentAuditLogRepository: PaymentAuditLogRepository,
    private readonly paymentWebhookLogRepository: PaymentWebhookLogRepository,
    private readonly userRepository: UserRepository,
    private readonly walletTransactionRepository: WalletTransactionRepository,
  ) {}

  // MOCK LOG HELPER
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

    const clientSecret = `pi_${Math.random().toString(36).substring(2, 12)}_secret_${Math.random().toString(36).substring(2, 8)}`;
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
      status: 'Pending',
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

    const refundTxId = `re_${Math.random().toString(36).substring(2, 12)}`;
    await this.refundTransactionRepository.create({
      orderId: payment.orderId,
      paymentId: payment._id,
      amount: refundAmount,
      provider: 'Stripe',
      refundTransactionId: refundTxId,
      status: 'Completed',
      reason: reason || 'Customer request',
    });

    payment.status =
      refundAmount === payment.amount ? 'Refunded' : 'Partially Refunded';
    await payment.save();

    await this.orderRepository.update(orderId, { status: 'Returned' });
    await this.logAudit(
      userId || null,
      orderId,
      'StripePaymentRefunded',
      'Success',
      { refundTxId, amount: refundAmount },
    );

    return { success: true, refundTransactionId: refundTxId, refundAmount };
  }

  async syncStripeStatus(transactionId: string) {
    const payment = await this.paymentRepository.findOne({ transactionId });
    if (!payment) throw new NotFoundException('Payment not found');
    return { transactionId, provider: 'Stripe', status: payment.status };
  }

  async verifyStripeWebhook(signature: string, payload: any) {
    await this.paymentWebhookLogRepository.create({
      provider: 'Stripe',
      eventType: payload.type || 'unknown',
      payload,
      status: 'Processed',
    });

    if (payload.type === 'payment_intent.succeeded') {
      const intentId = payload.data?.object?.id;
      if (intentId) {
        await this.confirmStripePayment(intentId, null);
      }
    }
    return { verified: true };
  }

  // --- RAZORPAY INTEGRATION ---

  async createRazorpayOrder(orderId: string, userId: string | null) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;
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
    // Simulated cryptographic signature check
    const isValid = signature && signature.length > 10;
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
    const refundTxId = `rfnd_${Math.random().toString(36).substring(2, 12)}`;

    await this.refundTransactionRepository.create({
      orderId: payment.orderId,
      paymentId: payment._id,
      amount: refundAmount,
      provider: 'Razorpay',
      refundTransactionId: refundTxId,
      status: 'Completed',
      reason: reason || 'Customer request',
    });

    payment.status =
      refundAmount === payment.amount ? 'Refunded' : 'Partially Refunded';
    await payment.save();

    await this.orderRepository.update(orderId, { status: 'Returned' });
    await this.logAudit(userId || null, orderId, 'RazorpayRefund', 'Success', {
      refundTxId,
      amount: refundAmount,
    });

    return { success: true, refundTransactionId: refundTxId };
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

    await this.walletTransactionRepository.create({
      userId: user._id,
      amount: -amount,
      transactionType: 'Debit',
      description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
      status: 'Completed',
    });

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

    // Create a new retry payment txn
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
