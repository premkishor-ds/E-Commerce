import { Injectable, NotFoundException } from '@nestjs/common';
import {
  NotificationRepository,
  UserRepository,
} from '../../repositories/concrete.repositories';
import * as nodemailer from 'nodemailer';
import twilio from 'twilio';


@Injectable()
export class NotificationService {
  private mailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: any = null;

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {
    // Setup SMTP Transporter if environment values are present
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      this.mailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort ? parseInt(smtpPort) : 587,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    // Setup Twilio SMS Client
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    if (twilioSid && twilioAuthToken && twilioSid !== 'mock_key') {
      this.twilioClient = twilio(twilioSid, twilioAuthToken);
    }
  }

  private readonly templates: Record<string, (name: string, param: string) => string> = {
    ORDER_CREATED: (name: string, id: string) =>
      `Hello ${name}, your order #${id} has been created successfully!`,
    ORDER_SHIPPED: (name: string, id: string) =>
      `Great news ${name}, your order #${id} has been shipped!`,
    ORDER_DELIVERED: (name: string, id: string) =>
      `Hello ${name}, your order #${id} has been delivered. Thank you for shopping!`,
    PAYMENT_SUCCESS: (name: string, amt: string) =>
      `Payment of $${amt} succeeded. Thank you, ${name}!`,
    PAYMENT_FAILED: (name: string, amt: string) =>
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

    const templateFn = this.templates[type];
    const message = templateFn
      ? templateFn(user.firstName || 'Customer', String(payload.param || ''))
      : payload.message || 'Notification';

    let delivered = false;
    let attempts = 0;
    let lastError = '';

    // Retry Engine with Exponential Backoff (3 attempts)
    while (!delivered && attempts < 3) {
      attempts++;
      try {
        if (channel === 'Email') {
          if (this.mailTransporter && user.email) {
            await this.mailTransporter.sendMail({
              from: process.env.SMTP_FROM || '"ApexStore" <noreply@apexstore.com>',
              to: user.email,
              subject: type.replace('_', ' '),
              text: message,
            });
          }
          delivered = true;
        } else if (channel === 'SMS') {
          if (this.twilioClient && user.phone) {
            await this.twilioClient.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
              to: user.phone,
            });
          }
          delivered = true;
        } else {
          // In-App, Push or WhatsApp mock delivery
          delivered = true;
        }
      } catch (err: any) {
        lastError = err.message;
        // Wait before next retry
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 100));
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
      success: delivered,
      notificationId: notification._id,
      channel,
      attempts,
      deliveredAt: delivered ? new Date() : null,
      error: lastError || null,
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
