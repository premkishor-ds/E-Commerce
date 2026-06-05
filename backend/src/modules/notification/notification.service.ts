import { Injectable, NotFoundException } from '@nestjs/common';
import {
  NotificationRepository,
  UserRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private readonly templates = {
    ORDER_CREATED: (name: string, id: string) =>
      `Hello ${name}, your order #${id} has been created successfully!`,
    ORDER_SHIPPED: (name: string, id: string) =>
      `Great news ${name}, your order #${id} has been shipped!`,
    ORDER_DELIVERED: (name: string, id: string) =>
      `Hello ${name}, your order #${id} has been delivered. Thank you for shopping!`,
    PAYMENT_SUCCESS: (name: string, amt: number) =>
      `Payment of $${amt} succeeded. Thank you, ${name}!`,
    PAYMENT_FAILED: (name: string, amt: number) =>
      `Alert ${name}: Payment of $${amt} failed. Please retry.`,
  };

  async sendNotification(
    userId: string,
    type: string,
    channel: 'Email' | 'SMS' | 'Push' | 'WhatsApp' | 'In-App',
    payload: any,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Check preferences
    if (
      channel === 'Email' &&
      user.marketingEmails === false &&
      type === 'Promo'
    ) {
      return { sent: false, reason: 'Unsubscribed from promotional emails' };
    }

    const templateFn = (this.templates as any)[type];
    const message = templateFn
      ? templateFn(user.firstName || 'Customer', payload.param)
      : payload.message || 'Notification';

    // Simulate Retry Mechanism (3 attempts)
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
      // Mock sending status
      if (Math.random() > 0.05) {
        success = true;
      }
    }

    // Save in database
    const notification = await this.notificationRepository.create({
      userId: user._id,
      title: type.replace('_', ' '),
      message: `[${channel}] ${message}`,
      isRead: false,
      type:
        type.startsWith('ORDER') || type.startsWith('PAYMENT')
          ? 'OrderUpdate'
          : 'Promo',
    });

    return {
      success,
      notificationId: notification._id,
      channel,
      attempts,
      deliveredAt: success ? new Date() : null,
    };
  }

  async scheduleNotification(
    userId: string,
    type: string,
    channel: 'Email' | 'SMS' | 'Push' | 'WhatsApp' | 'In-App',
    payload: any,
    delayMs: number,
  ) {
    setTimeout(() => {
      this.sendNotification(userId, type, channel, payload).catch(() => {
        /* ignore */
      });
    }, delayMs);
    return { scheduled: true, delayMs };
  }

  async updatePreferences(
    userId: string,
    prefs: {
      marketingEmails?: boolean;
      productRecommendations?: boolean;
      newsletterSubscriptions?: boolean;
    },
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (prefs.marketingEmails !== undefined)
      user.marketingEmails = prefs.marketingEmails;
    if (prefs.productRecommendations !== undefined)
      user.productRecommendations = prefs.productRecommendations;
    if (prefs.newsletterSubscriptions !== undefined)
      user.newsletterSubscriptions = prefs.newsletterSubscriptions;

    await user.save();
    return {
      success: true,
      preferences: {
        marketingEmails: user.marketingEmails,
        productRecommendations: user.productRecommendations,
        newsletterSubscriptions: user.newsletterSubscriptions,
      },
    };
  }

  async getPreferences(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      marketingEmails: user.marketingEmails !== false,
      productRecommendations: user.productRecommendations !== false,
      newsletterSubscriptions: user.newsletterSubscriptions !== false,
    };
  }
}
