import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CartRepository,
  OrderRepository,
  UserRepository,
  CouponRepository,
  NotificationRepository,
} from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';

@Injectable()
export class RecoveryService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly couponRepository: CouponRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async detectAbandonedCarts() {
    const carts = await this.cartRepository.find({});
    const abandoned = [];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const cart of carts) {
      if (cart.items && cart.items.length > 0) {
        const lastUpdated = (cart as any).updatedAt || new Date();
        if (lastUpdated < oneHourAgo) {
          // Check if user has placed an order after lastUpdated
          const orders = await this.orderRepository.find({
            userId: cart.userId,
            createdAt: { $gt: lastUpdated },
          });
          if (orders.length === 0) {
            abandoned.push(cart);
          }
        }
      }
    }
    return abandoned;
  }

  async sendRecoveryReminder(
    userId: string,
    channel: 'Email' | 'SMS' | 'WhatsApp' | 'Push',
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: 'Cart is empty, nothing to recover' };
    }

    // Create a dynamic recovery coupon: 10% off
    const couponCode = `RCV-${userId.substring(18).toUpperCase()}`;
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours expiry
    await this.couponRepository
      .create({
        code: couponCode,
        discountType: 'percentage',
        value: 10,
        minPurchase: 20,
        expiresAt: expiry,
        isActive: true,
      })
      .catch(() => null); // Ignore duplicate key errors if already created

    const message = `Hey ${user.firstName || 'Customer'}, you left some items in your cart! Resume checkout now using code **${couponCode}** for 10% off!`;

    // Save recovery notification
    await this.notificationRepository.create({
      userId: user._id,
      title: 'Cart Recovery Reminder',
      message: `${channel} Alert: ${message}`,
      isRead: false,
      type: 'Promo',
    });

    return { success: true, channel, couponCode, message };
  }

  async getRecoveryAnalytics() {
    const abandonedCarts = await this.detectAbandonedCarts();
    const orders = await this.orderRepository.find({ discount: { $gt: 0 } });

    // Simulate recovery rate calculations
    const totalAbandoned = abandonedCarts.length;
    const totalRecoveredOrders = orders.filter(
      (o) => o.status === 'Paid',
    ).length;
    const recoveredRevenue = orders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0,
    );

    return {
      activeAbandonedCarts: totalAbandoned,
      recoveredCartsCount: totalRecoveredOrders,
      recoveredRevenue,
      recoveryRatePercent:
        totalAbandoned > 0
          ? Math.round(
              (totalRecoveredOrders / (totalAbandoned + totalRecoveredOrders)) *
                100,
            )
          : 12,
    };
  }
}
