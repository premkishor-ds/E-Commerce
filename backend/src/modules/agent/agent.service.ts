import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentMemoryService } from './agent.memory.service';
import {
  classifyIntent,
  extractEntities,
  hasPermission,
  INTENT_PERMISSIONS,
} from './agent.intent.engine';
import { AuthService } from '../auth/auth.service';
import { SalesService } from '../sales/sales.service';
import { SupportService } from '../support/support.service';
import { CatalogService } from '../catalog/catalog.service';
import { ProfileService } from '../profile/profile.service';

export interface AgentRequest {
  message: string;
  sessionId: string;
  guestId?: string;
  userId?: string;
  userRoles?: string[];
  userJwt?: string;
  // State from frontend for active step flows
  activeStep?: string;
  stepData?: Record<string, any>;
}

export interface AgentResponse {
  reply: string;
  intent: string;
  confidence: number;
  actions: AgentAction[];
  nextStep?: string;
  stepData?: Record<string, any>;
  data?: any;
  needsAuth?: boolean;
  suggestions?: string[];
}

export interface AgentAction {
  type:
    | 'ADD_TO_CART'
    | 'REMOVE_FROM_CART'
    | 'NAVIGATE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'CLEAR_CART'
    | 'UPDATE_WISHLIST'
    | 'NOTIFY';
  payload: Record<string, any>;
}

@Injectable()
export class AgentService {
  constructor(
    private readonly memory: AgentMemoryService,
    private readonly authService: AuthService,
    private readonly salesService: SalesService,
    private readonly supportService: SupportService,
    private readonly catalogService: CatalogService,
    private readonly profileService: ProfileService,
  ) {}

  // ─── LOCAL GEMMA INTEGRATION ──────────────────────────────────────────────
  private async callLocalGemma(prompt: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Fast 1.5s timeout
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma',
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) return null;
      const data = await response.json();
      return data.response || null;
    } catch {
      return null;
    }
  }

  private async classifyIntentWithGemma(
    message: string,
  ): Promise<string | null> {
    const prompt = `Classify the user message into exactly one of these intents: GREET, REGISTER, LOGIN, LOGOUT, RESET_PASSWORD, CHANGE_PASSWORD, OTP_VERIFY, EMAIL_VERIFY, ADDRESS_MANAGE, VIEW_PROFILE, UPDATE_PROFILE, VIEW_LOYALTY, VIEW_WALLET, NOTIFICATION_PREF, SEARCH_PRODUCT, GET_PRODUCT, COMPARE, RECOMMEND, ADD_CART, REMOVE_CART, VIEW_CART, APPLY_COUPON, REMOVE_COUPON, CHECKOUT, VIEW_ORDERS, TRACK_ORDER, CANCEL_ORDER, RETURN_ORDER, REFUND, REORDER, DOWNLOAD_INVOICE, WISHLIST_ADD, WISHLIST_VIEW, WISHLIST_REMOVE, CREATE_TICKET, VIEW_TICKETS, ESCALATE, REVIEW_PRODUCT, BROWSE_CATEGORY, INVENTORY_CHECK, ADMIN_PRODUCTS, ADMIN_ORDERS, ADMIN_USERS, ADMIN_COUPONS, ADMIN_ANALYTICS, VENDOR_PRODUCTS, VENDOR_ANALYTICS, VENDOR_SETTLEMENTS, HELP. Respond with ONLY the intent name in uppercase, nothing else.
User Message: "${message}"
Intent:`;
    const res = await this.callLocalGemma(prompt);
    if (res) {
      const cleaned = res.trim().toUpperCase();
      if (
        cleaned in INTENT_PERMISSIONS ||
        [
          'GREET',
          'HELP',
          'THANKS',
          'BYE',
          'RECOMMEND',
          'SEARCH_PRODUCT',
        ].includes(cleaned)
      ) {
        return cleaned;
      }
    }
    return null;
  }

  private async enhanceReplyWithGemma(
    reply: string,
    contextPrompt?: string,
  ): Promise<string> {
    const prompt = `You are the ApexStore AI Assistant. Enhance the following system reply to be friendly, helpful, and conversational. Do not add details not present in the system reply. Keep markdown formatting and hyperlinks as they are.
System Reply:
${reply}
${contextPrompt ? `Context: ${contextPrompt}` : ''}
Enhanced Reply:`;
    const gemmaResponse = await this.callLocalGemma(prompt);
    return gemmaResponse ? gemmaResponse.trim() : reply;
  }

  async processMessage(req: AgentRequest): Promise<AgentResponse> {
    const {
      message,
      sessionId,
      guestId,
      userId,
      userRoles = [],
      activeStep,
      stepData = {},
    } = req;

    // Ensure session exists
    await this.memory.getOrCreateSession(sessionId, userId, guestId);
    if (guestId) await this.memory.trackGuestSession(guestId, sessionId);

    // Hybrid Intent engine
    let intent = 'UNKNOWN';
    let score = 1.0;
    const ruleMatch = classifyIntent(message);
    const entities = ruleMatch.entities;

    const gemmaIntent = await this.classifyIntentWithGemma(message);
    if (gemmaIntent) {
      intent = gemmaIntent;
      score = 10.0;
    } else {
      intent = ruleMatch.intent;
      score = ruleMatch.score;
    }

    // Save user message to database history
    await this.memory.appendMessage(sessionId, 'user', message, intent);

    // Intercept checkout as guest commands directly
    const textMsg = message.toLowerCase().trim();
    if (textMsg === 'checkout as guest' || textMsg === 'guest checkout') {
      const reply = `📦 **Guest Checkout Selected**\n\nPlease enter the **Full Name** of the recipient to begin checkout:`;
      const response: AgentResponse = {
        reply,
        intent: 'CHECKOUT',
        confidence: 10,
        actions: [],
        nextStep: 'CHECKOUT_NAME',
        stepData: { isGuest: true, guestId: guestId || sessionId },
      };
      await this.memory.appendMessage(sessionId, 'bot', reply, 'CHECKOUT');
      return response;
    }

    // Get conversation context
    const ctx = await this.memory.getFullContext(sessionId, userId, guestId);

    // ─── ACTIVE STEP FLOWS ──────────────────────────────────────────────────
    // Skip login/register steps entirely if the user is already authenticated —
    // this prevents a stale frontend activeStep from hijacking new messages.
    const AUTH_STEPS = ['LOGIN_EMAIL', 'LOGIN_PASSWORD', 'REGISTER_EMAIL', 'REGISTER_PASSWORD'];
    const isStaleAuthStep = activeStep && AUTH_STEPS.includes(activeStep) && !!userId;

    if (activeStep && !isStaleAuthStep) {
      const stepResult = await this.handleActiveStep(
        message,
        activeStep,
        stepData,
        userId,
        userRoles,
        sessionId,
        entities,
      );
      if (stepResult) {
        stepResult.reply = await this.enhanceReplyWithGemma(
          stepResult.reply,
          `Active workflow: ${activeStep}`,
        );
        await this.memory.appendMessage(
          sessionId,
          'bot',
          stepResult.reply,
          stepResult.intent || intent,
          stepResult.actions.map((a) => a.type),
        );
        return stepResult;
      }
    }

    // ─── PERMISSION CHECK ────────────────────────────────────────────────────
    const evaluatedRoles = userRoles.length ? userRoles : ['Guest'];
    if (!hasPermission(intent, evaluatedRoles)) {
      const reply = `⚠️ You need to be logged in as **${this.getRequiredRole(intent)}** to perform this action. Type **"login"** to sign in.`;
      await this.memory.appendMessage(sessionId, 'bot', reply, intent);
      return {
        reply,
        intent,
        confidence: score,
        actions: [],
        needsAuth: true,
        suggestions: ['Login', 'Register new account'],
      };
    }

    // ─── DISPATCH INTENT ────────────────────────────────────────────────────
    const response = await this.dispatchIntent(
      intent,
      entities,
      message,
      userId,
      evaluatedRoles,
      sessionId,
      ctx,
      guestId,
    );
    response.reply = await this.enhanceReplyWithGemma(
      response.reply,
      `User says: ${message}`,
    );
    await this.memory.appendMessage(
      sessionId,
      'bot',
      response.reply,
      intent,
      response.actions.map((a) => a.type),
    );

    // Update memory from entities
    if (userId) {
      if (entities.productType || entities.brand || entities.category) {
        const searchTerm =
          entities.productType || entities.brand || entities.category || '';
        await this.memory.updateUserSearchHistory(userId, searchTerm);
      }
    } else if (guestId) {
      const searchTerm =
        entities.productType || entities.brand || entities.category || '';
      if (searchTerm) await this.memory.addGuestSearch(guestId, searchTerm);
    }

    return response;
  }

  // ─── ACTIVE STEP HANDLER ────────────────────────────────────────────────────

  private async handleActiveStep(
    message: string,
    step: string,
    data: Record<string, any>,
    userId: string | undefined,
    roles: string[],
    sessionId: string,
    entities: Record<string, string>,
  ): Promise<AgentResponse | null> {
    const q = message.toLowerCase().trim();

    switch (step) {
      case 'REGISTER_EMAIL':
        if (!message.includes('@') || !message.includes('.')) {
          return this.buildReply(
            'Please enter a valid **email address**:',
            'REGISTER',
            0,
            [],
            'REGISTER_EMAIL',
            data,
          );
        }
        return this.buildReply(
          `Got it! Now choose a **password** (min 6 characters):`,
          'REGISTER',
          8,
          [],
          'REGISTER_PASSWORD',
          { ...data, email: message.trim() },
        );

      case 'REGISTER_PASSWORD':
        if (message.length < 6) {
          return this.buildReply(
            'Password must be at least **6 characters**. Please try again:',
            'REGISTER',
            0,
            [],
            'REGISTER_PASSWORD',
            data,
          );
        }
        try {
          const result = await this.authService.register({
            email: data.email,
            password: message,
          });
          return {
            reply: `🎉 **Account Created!**\nWelcome **${data.email}**! You are now registered and logged in.\n\nWhat would you like to do next?`,
            intent: 'REGISTER',
            confidence: 10,
            actions: [
              {
                type: 'LOGIN',
                payload: { user: result.user, token: result.accessToken },
              },
            ],
            suggestions: ['Browse products', 'View cart', 'My profile'],
          };
        } catch (err: any) {
          return this.buildReply(
            `❌ Registration failed: ${err.message}. Try a different email.`,
            'REGISTER',
            0,
            [],
          );
        }

      case 'LOGIN_EMAIL':
        if (!message.includes('@')) {
          return this.buildReply(
            'Please enter a valid email address:',
            'LOGIN',
            0,
            [],
            'LOGIN_EMAIL',
            data,
          );
        }
        return this.buildReply(
          `Enter your **password** for **${message}**:`,
          'LOGIN',
          8,
          [],
          'LOGIN_PASSWORD',
          { ...data, email: message.trim() },
        );

      case 'LOGIN_PASSWORD':
        try {
          const result = await this.authService.login({
            email: data.email,
            password: message,
          });
          return {
            reply: `🔑 **Logged in successfully!**\nWelcome back, **${data.email}**! You are signed in as **${result.user.roles?.join(', ') || 'Customer'}**.\n\nHow can I help you today?`,
            intent: 'LOGIN',
            confidence: 10,
            actions: [
              {
                type: 'LOGIN',
                payload: { user: result.user, token: result.accessToken },
              },
            ],
            suggestions: ['My orders', 'Browse products', 'My cart'],
          };
        } catch {
          return this.buildReply(
            `❌ Invalid email or password. Please try again or type **"reset password"** to recover your account.`,
            'LOGIN',
            0,
            [],
            'LOGIN_EMAIL',
            {},
          );
        }

      case 'OTP_VERIFY_STEP':
        if (data.phone) {
          try {
            const result = await this.authService.verifyOtp(
              data.phone,
              message.trim(),
            );
            return {
              reply: `✅ **OTP Verified Successfully!**\nWelcome back. You are signed in.`,
              intent: 'OTP_VERIFY',
              confidence: 10,
              actions: [
                {
                  type: 'LOGIN',
                  payload: { user: result.user, token: result.accessToken },
                },
              ],
              suggestions: ['My profile', 'Browse products'],
            };
          } catch (err: any) {
            return this.buildReply(
              `❌ Invalid or expired OTP. Please try again:`,
              'OTP_VERIFY',
              0,
              [],
              'OTP_VERIFY_STEP',
              data,
            );
          }
        }
        return this.buildReply('Phone context missing.', 'OTP_VERIFY', 0, []);

      case 'CHANGE_PASSWORD_STEP':
        if (message.length < 6) {
          return this.buildReply(
            'Password must be at least **6 characters**. Please try again:',
            'CHANGE_PASSWORD',
            0,
            [],
            'CHANGE_PASSWORD_STEP',
            data,
          );
        }
        return this.buildReply(
          `✅ **Password Updated!**\nYour password has been changed.`,
          'CHANGE_PASSWORD',
          10,
          [],
        );

      case 'CREATE_TICKET_SUBJECT':
        return this.buildReply(
          `Got it! Please describe the **issue in detail**:`,
          'CREATE_TICKET',
          8,
          [],
          'CREATE_TICKET_MESSAGE',
          { ...data, subject: message },
        );

      case 'CREATE_TICKET_MESSAGE':
        if (userId) {
          try {
            const ticket = await this.supportService.createTicket(userId, {
              subject: data.subject,
              message,
            });
            return {
              reply: `✅ **Support Ticket Created!**\nYour ticket **#${ticket._id?.toString().slice(-6).toUpperCase() || 'XXXX'}** has been submitted.\n\n• **Subject**: ${data.subject}\n• **Status**: Open\n• **Priority**: Medium\n\nOur team will respond within 24 hours.`,
              intent: 'CREATE_TICKET',
              confidence: 10,
              actions: [],
              suggestions: ['View my tickets', 'Track order', 'Home'],
            };
          } catch {
            return this.buildReply(
              'Failed to create ticket. Please try again.',
              'CREATE_TICKET',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          'Please **login** to create a support ticket.',
          'CREATE_TICKET',
          0,
          [],
          undefined,
          undefined,
          true,
        );

      case 'REVIEW_RATING':
        const num = parseInt(q.replace(/\D/g, ''));
        if (isNaN(num) || num < 1 || num > 5) {
          return this.buildReply(
            'Please enter a number between **1 and 5** stars:',
            'REVIEW_PRODUCT',
            0,
            [],
            'REVIEW_RATING',
            data,
          );
        }
        return this.buildReply(
          `${num} stars! Now type your **review comment**:`,
          'REVIEW_PRODUCT',
          8,
          [],
          'REVIEW_COMMENT',
          { ...data, rating: num },
        );

      case 'REVIEW_COMMENT':
        return {
          reply: `⭐ **Review Submitted!**\n\nThank you for rating **${data.productTitle || 'the product'}** **${data.rating}/5** stars!\n\n*"${message}"*\n\nYour review helps other shoppers!`,
          intent: 'REVIEW_PRODUCT',
          confidence: 10,
          actions: [],
          data: {
            productId: data.productId,
            rating: data.rating,
            comment: message,
          },
          suggestions: ['Browse similar products', 'My orders'],
        };

      case 'CHECKOUT_NAME':
        return this.buildReply(
          `Thanks **${message}**! Please enter your **shipping address**:`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_ADDRESS',
          { ...data, fullName: message },
        );

      case 'CHECKOUT_ADDRESS':
        return this.buildReply(
          `Got it! Enter your **City** and **ZIP Code** (format: City, ZIP):`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_CITY_ZIP',
          { ...data, address: message },
        );

      case 'CHECKOUT_CITY_ZIP': {
        const parts = message.split(',');
        const city = parts[0]?.trim() || message;
        const zip = parts[1]?.trim() || '';
        const updatedData: Record<string, any> = {
          ...data,
          city,
          zipCode: zip,
        };
        const cartSummary = data.cartItems
          ? data.cartItems
              .map((i: any) => `• ${i.title} ×${i.quantity}`)
              .join('\n')
          : 'Your cart items';
        return this.buildReply(
          `📦 **Order Summary:**\n\n${cartSummary}\n\n**Deliver to**: ${updatedData['fullName']}, ${updatedData['address']}, ${updatedData['city']} ${updatedData['zipCode']}\n**Total**: $${(data.total || 0).toFixed(2)}\n\nType **"confirm"** to place the order or **"cancel"** to abort.`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_CONFIRM',
          updatedData,
          false,
          ['✅ Confirm order', '❌ Cancel'],
        );
      }

      case 'CHECKOUT_CONFIRM':
        if (q === 'confirm' || q === 'yes' || q === 'place order' || q.includes('confirm order') || q === 'ok' || q === 'okay' || q === 'sure') {
          if (data.cartItems?.length > 0) {
            try {
              const order = await this.salesService.placeOrder(userId || null, {
                items: data.cartItems.map((i: any) => ({
                  productId: i.id,
                  quantity: i.quantity,
                })),
                shippingAddress: {
                  fullName: data.fullName,
                  addressLine1: data.address,
                  city: data.city,
                  postalCode: data.zipCode,
                  country: 'US',
                  state: '',
                  phone: '',
                },
                guestId: data.guestId,
                paymentProvider: 'Stripe',
              });
              return {
                reply: `🎉 **Order Placed Successfully!**\n\nYour order **#${String(order._id).slice(-8).toUpperCase()}** is confirmed!\n\n• **Status**: Pending\n• **Total**: $${data.total?.toFixed(2)}\n• **Delivery**: ${data.fullName}, ${data.city}\n\nYou can track this guest order via Order Tracking inside the chat using its ID!`,
                intent: 'CHECKOUT',
                confidence: 10,
                actions: [{ type: 'CLEAR_CART', payload: {} }],
                suggestions: ['Track my order', 'Cancel order', 'Continue shopping'],
              };
            } catch (err: any) {
              return this.buildReply(
                `❌ Order failed: ${err.message}`,
                'CHECKOUT',
                0,
                [],
              );
            }
          }
          return {
            reply: `🎉 **Order Placed Successfully!**\n\nYour order has been confirmed!\n\n• **Deliver to**: ${data.fullName}, ${data.city}\n• **Total**: $${data.total?.toFixed(2)}\n\nType **"track my orders"** to check status!`,
            intent: 'CHECKOUT',
            confidence: 10,
            actions: [{ type: 'CLEAR_CART', payload: {} }],
            suggestions: ['Track my order', 'Cancel order', 'Continue shopping'],
          };
        }
        return this.buildReply(
          'Order cancelled. You can continue browsing whenever you are ready!',
          'CHECKOUT',
          8,
          [],
        );

      case 'CANCEL_ORDER_CONFIRM':
        if (q === 'confirm' || q === 'yes') {
          try {
            await this.salesService.updateOrderStatus(
              data.orderId,
              'Cancelled',
              'Cancelled by user via Chatbot',
            );
            return {
              reply: `✅ **Order #${data.orderId.slice(-8).toUpperCase()} Cancelled Successfully.**\nYour order has been cancelled and a refund has been initiated.`,
              intent: 'CANCEL_ORDER',
              confidence: 10,
              actions: [],
              suggestions: ['Browse products', 'My orders'],
            };
          } catch (err: any) {
            return this.buildReply(
              `❌ Cancellation failed: ${err.message}`,
              'CANCEL_ORDER',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          'Cancellation aborted. Your order is still active.',
          'CANCEL_ORDER',
          8,
          [],
        );


      // ── Return / Refund flow ──────────────────────────────────────────────
      case 'RETURN_ORDER_ID': {
        let orderId = '';
        if (/my latest|last order|most recent/i.test(message) && userId) {
          try {
            const orders = await this.salesService.getOrders(userId);
            if (orders?.[0]) orderId = `ORD-${String(orders[0]._id).slice(-8).toUpperCase()}`;
          } catch {}
        } else {
          const idMatch = message.match(/[A-Z0-9\-]{6,}/i);
          if (idMatch) orderId = idMatch[0].toUpperCase();
        }
        if (!orderId) {
          return this.buildReply(
            '⚠️ Please provide a valid Order ID (e.g. *ORD-A1B2C3D4*) or say **"my latest order"**:',
            'RETURN_ORDER', 0, [], 'RETURN_ORDER_ID', data,
          );
        }
        // Auto-create return ticket
        try {
          await this.supportService.createTicket(userId || 'guest', {
            subject: `Return Request: ${orderId}`,
            message: `Customer is requesting a return/refund for order ${orderId}. Initiated via AI Chatbot.`,
            priority: 'High',
          });
          return {
            reply: `✅ **Return Ticket Created!**\n\n📋 A return request for order **${orderId}** has been submitted.\n\n• **Subject**: Return Request: ${orderId}\n• **Priority**: High\n• **Status**: Open\n\nOur team will review and send a pre-paid return label within **24 hours**.`,
            intent: 'RETURN_ORDER',
            confidence: 10,
            actions: [],
            suggestions: ['View my tickets', 'Track order', 'Continue shopping'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to create return ticket: ${e.message}. Please try again.`,
            'RETURN_ORDER', 0, [],
          );
        }
      }
      // ─────────────────────────────────────────────────────────────────────
      case 'PROFILE_UPDATE_NAME': {
        const newName = message.trim();
        if (!newName || newName.length < 2) {
          return this.buildReply(
            '⚠️ Please enter a valid name (at least 2 characters):',
            'UPDATE_PROFILE',
            0,
            [],
            'PROFILE_UPDATE_NAME',
            data,
            false,
            [],
          );
        }
        return this.buildReply(
          `✏️ Got it! Shall I update your display name to **"${newName}"**?`,
          'UPDATE_PROFILE',
          9,
          [],
          'PROFILE_UPDATE_CONFIRM',
          { ...data, value: newName },
          false,
          ['✅ Yes, update it', '❌ Cancel'],
        );
      }

      case 'PROFILE_UPDATE_CONFIRM': {
        if (q === 'yes' || q.includes('yes') || q.includes('confirm') || q.includes('update it') || q === 'ok' || q === 'sure') {
          if (!userId) {
            return this.buildReply('Please **login** to update your profile.', 'UPDATE_PROFILE', 5, [], undefined, undefined, true);
          }
          try {
            await this.profileService.updateProfile(userId, {
              displayName: data.value,
              firstName: data.value.split(' ')[0] || data.value,
              lastName: data.value.split(' ').slice(1).join(' ') || '',
            });
            return {
              reply: `✅ **Profile updated!**\n\nYour display name has been changed to **"${data.value}"** successfully!`,
              intent: 'UPDATE_PROFILE',
              confidence: 10,
              actions: [{ type: 'NOTIFY', payload: { message: `Name updated to "${data.value}"` } }],
              suggestions: ['View profile', 'Change password', 'My orders'],
            };
          } catch (err: any) {
            return this.buildReply(
              `❌ Failed to update name: ${err.message || 'Unknown error'}. Please try again.`,
              'UPDATE_PROFILE',
              0,
              [],
            );
          }
        }
        // User said cancel or anything else
        return this.buildReply(
          '❌ Name update cancelled. Your profile is unchanged.',
          'UPDATE_PROFILE',
          8,
          [],
          undefined,
          undefined,
          false,
          ['View profile', 'My orders'],
        );
      }
      // ─────────────────────────────────────────────────────────────────────────

      default:
        return null;
    }
  }

  // ─── MAIN INTENT DISPATCHER ─────────────────────────────────────────────────

  private async dispatchIntent(
    intent: string,
    entities: Record<string, string>,
    message: string,
    userId: string | undefined,
    roles: string[],
    sessionId: string,
    ctx: any,
    guestId?: string,
  ): Promise<AgentResponse> {
    const q = message.toLowerCase().trim();

    switch (intent) {
      case 'GREET': {
        const name = userId ? `back` : '';

        // Retrieve dynamic contexts
        let personalization = '';
        let dynamicSuggestions = [
          'Search headphones',
          'My orders',
          'Create ticket',
          'Help',
        ];

        // Build personalization context from past user activity
        if (userId && ctx.userMemory) {
          const history = ctx.userMemory.searchHistory || [];
          if (history.length > 0) {
            personalization += `\n\n💡 Based on your recent searches, you might be interested in looking at products related to **"${history.slice(-2).join('", "')}"**.`;
            dynamicSuggestions = [
              `Search ${history[history.length - 1]}`,
              ...dynamicSuggestions.slice(1),
            ];
          }

          // Check order history
          try {
            const userOrders = await this.salesService.getOrders(userId);
            if (userOrders && userOrders.length > 0) {
              const latestOrder = userOrders[0];
              const displayId = String(latestOrder._id).slice(-8).toUpperCase();
              personalization += `\n📦 **Order status update**: Your last order **#${displayId}** is currently **${latestOrder.status}**.`;
              dynamicSuggestions.push(`Track order ORD-${displayId}`);
            }
          } catch (e) {}

          // Check support tickets
          try {
            const userTickets =
              await this.supportService.getCustomerTickets(userId);
            const openTickets =
              userTickets?.filter(
                (t) => t.status === 'Open' || t.status === 'Pending',
              ) || [];
            if (openTickets.length > 0) {
              personalization += `\n🎫 **Support Alert**: You have **${openTickets.length} open support ticket(s)**. Our team is looking into them.`;
            }
          } catch (e) {}
        } else if (guestId) {
          // Fallback guest personalization
          try {
            const guest = await this.memory.getOrCreateGuest(guestId);
            const history = guest.searchHistory || [];
            if (history.length > 0) {
              personalization += `\n\n💡 Looking for more **"${history[history.length - 1]}"**? Let me search our catalog for you!`;
              dynamicSuggestions = [
                `Search ${history[history.length - 1]}`,
                ...dynamicSuggestions.slice(1),
              ];
            }
          } catch (e) {}
        }

        return this.buildReply(
          `👋 Hello ${name}! I'm the **ApexStore AI Assistant**.\n\nI can help you:\n• 🔍 Search & compare products\n• 🛒 Manage your cart & wishlist\n• 📦 Track & manage orders\n• 🎫 Create support tickets\n• 🔐 Manage your account${personalization}\n\nWhat can I help you with today?`,
          intent,
          10,
          [],
          undefined,
          undefined,
          false,
          Array.from(new Set(dynamicSuggestions)).slice(0, 5),
        );
      }

      case 'REGISTER':
        return this.buildReply(
          `Let's create your ApexStore account! 🎉\n\nPlease enter your **email address**:`,
          intent,
          8,
          [],
          'REGISTER_EMAIL',
          {},
        );

      case 'LOGIN':
        if (userId) {
          return this.buildReply(
            `You are already signed in! Type **"my profile"** to view your account or **"logout"** to sign out.`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            ['My profile', 'My orders', 'Logout'],
          );
        }

        // ── One-shot login: email + password provided in the same message ──
        {
          const emailInMsg = message.match(
            /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
          );
          // Match password after keywords like "password", "pass", "pwd" followed by optional :-/=/space
          const passInMsg = message.match(
            /(?:password|pass|pwd)\s*(?::-|:|-|=)?\s*(\S+)/i,
          );
          if (emailInMsg && passInMsg) {
            const email = emailInMsg[0];
            const password = passInMsg[1];
            try {
              const result = await this.authService.login({ email, password });
              return {
                reply: `🔑 **Logged in successfully!**\nWelcome back, **${email}**! You are signed in as **${result.user.roles?.join(', ') || 'Customer'}**.\n\nHow can I help you today?`,
                intent: 'LOGIN',
                confidence: 10,
                actions: [
                  {
                    type: 'LOGIN',
                    payload: { user: result.user, token: result.accessToken },
                  },
                ],
                suggestions: ['My orders', 'Browse products', 'My cart'],
              };
            } catch {
              return this.buildReply(
                `❌ Invalid email or password for **${email}**. Please try again or type **"reset password"** to recover your account.`,
                intent,
                0,
                [],
                'LOGIN_EMAIL',
                {},
              );
            }
          }
        }
        // ──────────────────────────────────────────────────────────────────

        return this.buildReply(
          `Welcome back! Please enter your **email address**:`,
          intent,
          8,
          [],
          'LOGIN_EMAIL',
          {},
        );

      case 'LOGOUT':
        return {
          reply: `👋 **Logged out successfully!**\nYou've been signed out. See you next time!\n\nType **"login"** or **"register"** to sign back in.`,
          intent,
          confidence: 10,
          actions: [{ type: 'LOGOUT', payload: {} }],
          suggestions: ['Login', 'Register', 'Browse products'],
        };

      case 'RESET_PASSWORD':
        return this.buildReply(
          `🔑 To reset your password:\n\n1. Go to the [Login page](/auth)\n2. Click **"Forgot Password"**\n3. Enter your registered email\n4. Check your inbox for the reset link\n\nAlternatively, I can take you directly to the auth page right now!`,
          intent,
          8,
          [{ type: 'NAVIGATE', payload: { path: '/auth' } }],
          undefined,
          undefined,
          false,
          ['Go to login page', 'Contact support'],
        );

      case 'CHANGE_PASSWORD':
        if (!userId)
          return this.buildReply(
            'Please **login** to change your password.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          'Please enter your **new password** (min 6 characters):',
          intent,
          8,
          [],
          'CHANGE_PASSWORD_STEP',
          {},
        );

      case 'OTP_VERIFY':
        return this.buildReply(
          'Please enter your **phone number** to receive a one-time verification code:',
          intent,
          8,
          [],
          'OTP_VERIFY_STEP',
          {},
        );

      case 'EMAIL_VERIFY':
        return this.buildReply(
          '📧 Email verification link has been sent to your inbox. Please check your email to verify your account.',
          intent,
          10,
          [],
        );

      case 'VIEW_PROFILE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your profile details.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const profile = await this.profileService.getProfile(userId);
          const name = profile.displayName || `${profile.firstName} ${profile.lastName}`.trim() || 'Valued Customer';
          return this.buildReply(
            `👤 **My Account Profile Details:**\n\n• **Email**: ${profile.email}\n• **Name**: ${name}\n• **Phone**: ${profile.phone || 'Not provided'}\n• **Account Status**: ${profile.accountStatus}\n• **Tier**: ${profile.membershipLevel} Member\n• **Points**: ${profile.rewardPoints} Loyalty Points\n• **Wallet Balance**: $${(profile.walletBalance || 0).toFixed(2)}\n• **Plan**: ${profile.subscriptionPlan}\n• **GDPR Options**: You can type *"export my data"* or *"delete my account"* anytime.`,
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
            undefined,
            undefined,
            false,
            ['View wallet', 'My addresses', 'Change password', 'Logout'],
          );
        } catch {
          return this.buildReply(
            'Unable to load profile details. Please visit your [profile page](/profile).',
            intent,
            5,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
          );
        }
      }

      case 'UPDATE_PROFILE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to update your profile.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }

        // ── Photo / avatar update — still navigate to profile page ──
        if (q.includes('picture') || q.includes('photo') || q.includes('avatar') || q.includes('image')) {
          return this.buildReply(
            '🖼️ **Change Profile Picture / Photo:**\n\nTo update your profile avatar:\n1. Go to the [Profile Page](/profile)\n2. Click on your current avatar\n3. Paste a new image URL to update it instantly!',
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
            undefined,
            undefined,
            false,
            ['View profile', 'Change password'],
          );
        }

        // ── Name change — start multi-step conversational flow ──
        // If a new name was provided inline (e.g. "change my name to John Smith")
        const inlineName = message.match(
          /(?:change|update|set|rename)\s+(?:my\s+)?name\s+(?:to|as|:)\s+(.+)/i,
        );
        if (inlineName && inlineName[1]?.trim()) {
          const newName = inlineName[1].trim();
          return this.buildReply(
            `✏️ Got it! You want to change your name to **"${newName}"**.\n\nShall I update it now?`,
            intent,
            9,
            [],
            'PROFILE_UPDATE_CONFIRM',
            { field: 'displayName', value: newName },
            false,
            ['✅ Yes, update it', '❌ Cancel'],
          );
        }

        // Otherwise ask for the new name
        return this.buildReply(
          `✏️ What would you like your **new display name** to be?\n\nJust type your new name and I'll update it for you!`,
          intent,
          9,
          [],
          'PROFILE_UPDATE_NAME',
          { field: 'displayName' },
          false,
          [],
        );
      }

      case 'GDPR_EXPORT': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to export your profile data.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const data = await this.profileService.exportData(userId);
          return this.buildReply(
            `📄 **GDPR Right to Portability Export:**\n\nWe have generated your full personal data snapshot. You can download the JSON file below:\n\n• **Format**: JSON Data Snapshot\n• **Exported At**: ${new Date().toLocaleDateString()}\n\n[Click here to download your exported data](/api/v1/profile/export)`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(`Failed to export data: ${e.message}`, intent, 5, []);
        }
      }

      case 'GDPR_DELETE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to request account deletion.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          await this.profileService.requestDeletion(userId);
          return this.buildReply(
            `⚠️ **GDPR Right to Be Forgotten: Account Scheduled for Deletion**\n\nYour account deletion request has been submitted. Your profile is now set to "Pending Deletion" and all data will be purged within the standard processing timeframe.`,
            intent,
            10,
            [{ type: 'LOGOUT', payload: {} }],
          );
        } catch (e: any) {
          return this.buildReply(`Failed to schedule deletion: ${e.message}`, intent, 5, []);
        }
      }

      case 'ADDRESS_MANAGE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to manage your shipping addresses.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const addresses = await this.profileService.getAddresses(userId);
          const addressList = addresses
            .map((a: any) => `• **${a.fullName}** — ${a.street}, ${a.city}, ${a.pincode} ${a.isDefault ? '(Default)' : ''}`)
            .join('\n');
          return this.buildReply(
            `🏠 **Saved Shipping Addresses:**\n\n${addressList || 'No saved addresses found.'}\n\nYou can manage all shipping addresses inside your [profile settings](/profile).`,
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
            undefined,
            undefined,
            false,
            ['View profile', 'Checkout now'],
          );
        } catch {
          return this.buildReply(
            'Unable to fetch addresses. Please visit your [profile page](/profile).',
            intent,
            5,
            [],
          );
        }
      }

      case 'VIEW_LOYALTY': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your loyalty points.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const profile = await this.profileService.getProfile(userId);
          
          if (q.includes('convert') || q.includes('exchange') || q.includes('redeem')) {
            const pointsMatch = q.match(/(?:convert|exchange|redeem)\s+(\d+)\s*(?:points)?/);
            if (pointsMatch) {
              const points = parseInt(pointsMatch[1]);
              const res = await this.profileService.convertPoints(userId, points);
              return this.buildReply(
                `🏆 **Points Converted Successfully!**\n\n✅ Converted **${points} points** to **$${(points / 100).toFixed(2)}** wallet credit.\n• **New Loyalty Points**: ${res.rewardPoints}\n• **New Wallet Balance**: $${res.walletBalance.toFixed(2)}`,
                intent,
                10,
                [],
              );
            } else {
              return this.buildReply(
                `🏆 To convert loyalty points to wallet credit, type: **"convert [number] points"**\n\nExample: *"convert 100 points"*`,
                intent,
                8,
                [],
              );
            }
          }

          const usdValue = (profile.rewardPoints || 0) / 100;
          return this.buildReply(
            `🏆 **ApexStore Loyalty Rewards:**\n\n• **Current Loyalty Points**: ${profile.rewardPoints || 0} Points\n• **Membership Tier**: ${profile.membershipLevel} Status\n• **Convertible Credit**: $${usdValue.toFixed(2)} store credit\n\nWould you like to **convert your reward points** into shopping credit? Type *"convert [number] points"* to do so.`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            [`Convert ${Math.min(profile.rewardPoints || 0, 100)} points`, 'View wallet', 'My profile'],
          );
        } catch (e: any) {
          return this.buildReply(
            `Unable to fetch loyalty details: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'VIEW_WALLET': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your wallet balance.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          if (q.includes('add') || q.includes('load') || q.includes('deposit')) {
            const amountMatch = q.match(/(?:add|load|deposit)\s+[\$₹£€]?\s*(\d+(?:\.\d+)?)/);
            if (amountMatch) {
              const amount = parseFloat(amountMatch[1]);
              const res = await this.profileService.addWalletFunds(userId, amount, 'Added via AI Chatbot');
              return this.buildReply(
                `💳 **Wallet Funds Added Successfully!**\n\n✅ Added **$${amount.toFixed(2)}** to your store wallet.\n• **New Wallet Balance**: $${res.walletBalance.toFixed(2)}`,
                intent,
                10,
                [],
                undefined,
                undefined,
                false,
                ['View wallet transactions', 'My profile'],
              );
            } else {
              return this.buildReply(
                `💳 To add funds to your wallet via chatbot, please type: **"add [amount] to wallet"**\n\nExample: *"add 50 to wallet"*`,
                intent,
                8,
                [],
              );
            }
          }

          const profile = await this.profileService.getProfile(userId);
          const txs = await this.profileService.getWalletTransactions(userId);
          const txList = txs
            .slice(0, 3)
            .map((t: any) => `• $${t.amount.toFixed(2)} (${t.transactionType}) — ${t.description}`)
            .join('\n') || 'No transactions yet.';
          return this.buildReply(
            `💳 **My Store Wallet:**\n\n• **Available Balance**: $${(profile.walletBalance || 0).toFixed(2)}\n• **Account Status**: Active\n\n**Recent Transactions:**\n${txList}\n\nType **"add [amount] to wallet"** to add mock funds!`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Add 50 to wallet', 'My profile', 'View loyalty points'],
          );
        } catch (e: any) {
          return this.buildReply(
            `Unable to load wallet: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'NOTIFICATION_PREF':
        return this.buildReply(
          '🔔 **Notification Settings**\n\n• **Order Updates**: Email & Push (Enabled)\n• **Promotional Deals**: SMS (Disabled)\n• **Security Alerts**: Email (Enabled)\n\nAdjust your notification preferences inside your account profile settings.',
          intent,
          10,
          [],
        );

      case 'SEARCH_PRODUCT': {
        const query =
          entities.productType || entities.brand || entities.category || '';
        const searchQuery =
          query ||
          message
            .replace(/show|find|search|looking for|get me|i want|need/gi, '')
            .trim();

        try {
          const results = await this.catalogService.getProducts({
            search: searchQuery,
            category: entities.category,
            brand: entities.brand,
          });

          if (!results || !results.length) {
            return this.buildReply(
              `🔍 No products found for **"${searchQuery}"**.\n\nTry searching for:\n• Electronics, Fashion, Kitchen, Fitness\n• Specific brands like ApexTech, NexaHome\n• Or browse all products on the [Search page](/search)`,
              intent,
              7,
              [
                {
                  type: 'NAVIGATE',
                  payload: {
                    path: `/search?q=${encodeURIComponent(searchQuery)}`,
                  },
                },
              ],
              undefined,
              undefined,
              false,
              ['Browse Electronics', 'Browse Fashion', 'Best sellers'],
            );
          }

          const maxPrice = entities.maxPrice
            ? parseFloat(entities.maxPrice)
            : Infinity;
          let filtered = results.filter((p: any) => p.price <= maxPrice);
          if (entities.sort === 'price_asc')
            filtered = filtered.sort((a: any, b: any) => a.price - b.price);
          if (entities.sort === 'price_desc')
            filtered = filtered.sort((a: any, b: any) => b.price - a.price);
          if (entities.sort === 'rating_desc')
            filtered = filtered.sort(
              (a: any, b: any) => b.averageRating - a.averageRating,
            );

          const top = filtered.slice(0, 4);
          const list = top
            .map(
              (p: any) =>
                `• **${p.title}** — $${p.price.toFixed(2)} ⭐${p.averageRating || 'N/A'}`,
            )
            .join('\n');
          const ids = top.map((p: any) => String(p._id || p.id));

          if (userId)
            await this.memory.updateUserSearchHistory(userId, searchQuery);

          return {
            reply: `🔍 **Found ${filtered.length} products** for "${searchQuery}":\n\n${list}\n\nType the **product name** to see details, or **"add [name] to cart"** to purchase!`,
            intent,
            confidence: 8,
            actions: [],
            data: { products: top, ids },
            suggestions: top
              .slice(0, 2)
              .map(
                (p: any) =>
                  `Add ${p.title.split(' ').slice(0, 2).join(' ')} to cart`,
              ),
          };
        } catch {
          return this.buildReply(
            `🔍 Search for **"${searchQuery}"** — [Click here to view all results](/search?q=${encodeURIComponent(searchQuery)})`,
            intent,
            5,
            [
              {
                type: 'NAVIGATE',
                payload: {
                  path: `/search?q=${encodeURIComponent(searchQuery)}`,
                },
              },
            ],
          );
        }
      }

      case 'RECOMMEND': {
        const memory = userId ? await this.memory.getUserMemory(userId) : null;
        const history = memory?.searchHistory || ctx.searchHistory;
        const categories = memory?.preferredCategories || [];

        try {
          const params: any = {};
          if (categories.length) params.category = categories[0];
          if (entities.category) params.category = entities.category;
          if (entities.productType) params.search = entities.productType;

          const results = await this.catalogService.getProducts(params);
          const top = (results || [])
            .sort(
              (a: any, b: any) =>
                (b.averageRating || 0) - (a.averageRating || 0),
            )
            .slice(0, 3);
          const list = top
            .map(
              (p: any) =>
                `• **${p.title}** — $${p.price.toFixed(2)} ⭐${p.averageRating || 'N/A'}`,
            )
            .join('\n');

          const personalized =
            history.length > 0
              ? `\n\n💡 Based on your searches for: *${history.slice(-2).join(', ')}*`
              : '';

          return this.buildReply(
            `✨ **Top Recommendations for you:**${personalized}\n\n${list || 'No recommendations available right now. Browse our [catalog](/)!'}\n\nType any product name to add it to your cart!`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            top
              .slice(0, 2)
              .map(
                (p: any) =>
                  `Add ${p.title.split(' ').slice(0, 2).join(' ')} to cart`,
              ),
          );
        } catch {
          return this.buildReply(
            'Browse our **[full catalog](/)** for top-rated products!',
            intent,
            5,
            [{ type: 'NAVIGATE', payload: { path: '/' } }],
          );
        }
      }

      case 'ADD_CART': {
        let productName =
          entities.productType ||
          message
            .replace(/add|to cart|buy|purchase|get|i'll take/gi, '')
            .trim();

        // ── Contextual / pronoun reference detection ──────────────────────────
        // Detect when the extracted name is a pronoun/filler rather than a real
        // product name (e.g. "buy it", "buy for me", "buy that", "get the one").
        const CONTEXTUAL_PATTERN =
          /^(?:it|this|that|the one|that one|this one|for me|it for me|the product|the item|the same|same|yes please|ok|okay|sure|go ahead|do it|do that|one more|another|another one|more)$/i;

        const isContextual =
          CONTEXTUAL_PATTERN.test(productName.trim()) ||
          !productName.trim() ||
          productName.trim().split(/\s+/).length <= 2 && CONTEXTUAL_PATTERN.test(productName.trim());

        if (isContextual && ctx && ctx.recentMessages) {
          // Strategy 1: scan recent BOT messages for the last ADD_CART reply and extract the product title.
          // Bot reply format: "✅ **ProductTitle** ($price) has been added to your cart."
          for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
            const msg = ctx.recentMessages[i];
            if (msg.role === 'bot' && msg.text.includes('Added to Cart')) {
              const titleMatch = msg.text.match(/\*\*([^*]+)\*\*\s*\(\$[\d.]+\)/);
              if (titleMatch && titleMatch[1]) {
                productName = titleMatch[1].trim();
                break;
              }
            }
          }

          // Strategy 2: scan recent BOT SEARCH_PRODUCT replies for the first listed product.
          // Bot search reply format: "• **ProductTitle** — $price ⭐rating"
          if (isContextual && CONTEXTUAL_PATTERN.test(productName.trim())) {
            for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
              const msg = ctx.recentMessages[i];
              if (msg.role === 'bot' && (msg.text.includes('Found') || msg.text.includes('products'))) {
                const listMatch = msg.text.match(/•\s+\*\*([^*]+)\*\*/);
                if (listMatch && listMatch[1]) {
                  productName = listMatch[1].trim();
                  break;
                }
              }
            }
          }

          // Strategy 3: fallback — scan user messages for the last meaningful product mention
          if (isContextual && CONTEXTUAL_PATTERN.test(productName.trim())) {
            for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
              const msg = ctx.recentMessages[i];
              if (msg.role === 'user' && msg.text.toLowerCase().trim() !== message.toLowerCase().trim()) {
                const prevEntities = extractEntities(msg.text);
                const prevProduct = prevEntities.productType || prevEntities.brand || prevEntities.category;
                if (prevProduct) {
                  productName = prevProduct;
                  break;
                }
                const cleanPrev = msg.text
                  .replace(/add|to cart|buy|purchase|get|i'll take|i want|show me|search for/gi, '')
                  .trim();
                if (cleanPrev && !CONTEXTUAL_PATTERN.test(cleanPrev)) {
                  productName = cleanPrev;
                  break;
                }
              }
            }
          }
        }
        // ─────────────────────────────────────────────────────────────────────

        try {
          const results = await this.catalogService.getProducts({
            search: productName,
          });
          const product = results?.[0];
          if (!product) {
            return this.buildReply(
              `❌ Couldn't find **"${productName}"** in our catalog. Try a different name or [search for it](/search).`,
              intent,
              5,
              [],
              undefined,
              undefined,
              false,
              ['Search headphones', 'Browse catalog'],
            );
          }

          const action: AgentAction = {
            type: 'ADD_TO_CART',
            payload: {
              id: String((product as any)._id),
              title: product.title,
              price: product.price,
              image: (product as any).images?.[0] || '',
            },
          };

          return {
            reply: `🛒 **Added to Cart!**\n\n✅ **${product.title}** ($${product.price.toFixed(2)}) has been added to your cart.\n\nWould you like to **checkout now** or continue shopping?`,
            intent,
            confidence: 9,
            actions: [action],
            data: { product },
            suggestions: ['Checkout now', 'Continue shopping', 'View cart'],
          };
        } catch {
          return this.buildReply(
            `I'll help you add products to cart! Please [search for the product](/search) first.`,
            intent,
            4,
            [{ type: 'NAVIGATE', payload: { path: '/search' } }],
          );
        }
      }

      case 'REMOVE_CART': {
        const productName =
          entities.productType ||
          message.replace(/remove|from cart|delete|clear/gi, '').trim();

        // If they want to clear the entire cart
        if (/clear|empty|remove all/i.test(message)) {
          return {
            reply: `🗑️ **Cart cleared!** All items have been removed from your cart.`,
            intent,
            confidence: 9,
            actions: [{ type: 'CLEAR_CART', payload: {} }],
            suggestions: ['Browse products', 'Search headphones'],
          };
        }

        // Try to find the specific product
        if (productName && productName.length > 1) {
          try {
            const results = await this.catalogService.getProducts({ search: productName });
            const product = results?.[0];
            if (product) {
              return {
                reply: `🗑️ **Removed from Cart!**\n\n❌ **${product.title}** has been removed from your cart.`,
                intent,
                confidence: 9,
                actions: [{ type: 'REMOVE_FROM_CART', payload: { id: String((product as any)._id) } }],
                suggestions: ['View cart', 'Checkout', 'Continue shopping'],
              };
            }
          } catch {}
        }

        return this.buildReply(
          `🗑️ Which item would you like to remove? Tell me the product name and I'll remove it.\n\nOr say **"clear cart"** to remove everything.`,
          intent,
          6,
          [],
          undefined,
          undefined,
          false,
          ['Clear cart', 'View cart', 'Checkout'],
        );
      }

      case 'VIEW_CART':
        return this.buildReply(
          `🛒 Your cart is accessible via the **cart icon** in the top right corner.\n\nYour current cart shows all added items with quantities and prices.\n\nWould you like to **checkout now**?`,
          intent,
          7,
          [],
          undefined,
          undefined,
          false,
          ['Checkout now', 'Clear cart', 'Browse products'],
        );

      case 'APPLY_COUPON': {
        const code = entities.couponCode;
        if (!code) {
          return this.buildReply(
            `🏷️ To apply a coupon, type: **"apply coupon [CODE]"**\n\nExample: *"apply coupon SAVE20"*\n\nActive codes you can try:\n• **SAVE20** — 20% off your order`,
            intent,
            6,
            [],
            undefined,
            undefined,
            false,
            ['Apply coupon SAVE20'],
          );
        }
        try {
          const result = await this.salesService.validateCoupon(code, 100);
          return {
            reply: `✅ **Coupon "${code}" is valid!**\n\n• **Discount**: ${result.discountType === 'percentage' ? `${result.value}% off` : `$${result.value} off`}\n• **Min Purchase**: $${result.minPurchase}\n\nThis coupon will be applied at checkout!`,
            intent,
            confidence: 9,
            actions: [],
            data: { coupon: result },
            suggestions: ['Checkout now', 'View cart'],
          };
        } catch (err: any) {
          return this.buildReply(
            `❌ Coupon **"${code}"** is invalid or expired.\n\nTry **SAVE20** for 20% off!`,
            intent,
            7,
            [],
          );
        }
      }

      case 'REMOVE_COUPON':
        return this.buildReply(
          '🏷️ Coupon removed successfully from your order.',
          intent,
          10,
          [{ type: 'CLEAR_CART', payload: { clearCouponOnly: true } }],
        );

      case 'CHECKOUT':
        if (!userId) {
          return this.buildReply(
            `🛒 **Checkout options:**\n\nYou are not logged in. Would you like to **Login/Register** to save your order details, or proceed to **Checkout as Guest**?`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            ['Checkout as Guest', 'Login', 'Register'],
          );
        }
        return this.buildReply(
          `📦 Let's place your order!\n\nPlease enter the **Full Name** of the recipient:`,
          intent,
          8,
          [],
          'CHECKOUT_NAME',
          {},
        );

      case 'VIEW_ORDERS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view your orders.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          if (!orders?.length) {
            return this.buildReply(
              '📦 You have **no orders** yet!\n\nBrowse our catalog to start shopping.',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Browse products', 'Search headphones'],
            );
          }
          const orderList = orders
            .slice(0, 5)
            .map(
              (o: any) =>
                `• **#${String(o._id).slice(-8).toUpperCase()}** — ${o.status} — $${o.totalPrice?.toFixed(2)} (${new Date(o.createdAt).toLocaleDateString()})`,
            )
            .join('\n');
          return this.buildReply(
            `📦 **Your Orders** (${orders.length} total):\n\n${orderList}\n\nType **"track order #ID"** for details on any order.`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            ['Track last order', 'Return order', 'Contact support'],
          );
        } catch {
          return this.buildReply(
            'Unable to fetch orders right now. Please try again or visit your [dashboard](/).',
            intent,
            4,
            [],
          );
        }
      }

      case 'TRACK_ORDER': {
        const orderId = entities.orderId;
        try {
          if (orderId) {
            // Find by matching order ID (supports both logged-in and guest order IDs)
            const cleanId = orderId.replace('ORD-', '').trim();
            const order = await this.salesService
              .getOrderById(cleanId)
              .catch(() => null);
            if (order) {
              // Ensure order belongs to this user or guest
              const matchesUser =
                userId && String(order.userId) === String(userId);
              const matchesGuest = guestId && order.guestId === guestId;
              const matchesExplicitOrder = cleanId.length >= 8; // If they provided the exact order ID, allow tracking details directly

              if (matchesUser || matchesGuest || matchesExplicitOrder) {
                return this.buildReply(
                  `📍 **Order Tracking: #${String(order._id).slice(-8).toUpperCase()}**\n\n• **Status**: ${order.status}\n• **Total**: $${order.totalPrice?.toFixed(2)}\n• **Placed**: ${new Date((order as any).createdAt).toLocaleDateString()}\n• **Tracking Code**: ${(order as any).trackingCode || 'Pending Dispatch'}`,
                  intent,
                  9,
                  [],
                );
              }
            }
          }

          if (!userId) {
            return this.buildReply(
              'Please **login** to track your orders, or type **"track order ORD-[ID]"** with your exact Guest Order ID.',
              intent,
              5,
              [],
              undefined,
              undefined,
              false,
              ['Login', 'Register'],
            );
          }

          const orders = await this.salesService.getOrders(userId);
          const latest = orders?.[0];
          if (!latest)
            return this.buildReply('No orders found to track.', intent, 7, []);
          return this.buildReply(
            `📍 **Latest Order Status:**\n\n• **Order**: #${String(latest._id).slice(-8).toUpperCase()}\n• **Status**: ${latest.status}\n• **Total**: $${latest.totalPrice?.toFixed(2)}\n• **Placed**: ${new Date((latest as any).createdAt).toLocaleDateString()}`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            ['Cancel order', 'Return order', 'Contact support'],
          );
        } catch {
          return this.buildReply(
            'Could not retrieve tracking information. Please verify your order ID or check your [orders dashboard](/).',
            intent,
            4,
            [],
          );
        }
      }

      case 'CANCEL_ORDER': {
        if (!userId)
          return this.buildReply(
            'Please **login** to cancel orders.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const orderId = entities.orderId;
        if (!orderId) {
          return this.buildReply(
            'Please specify your **Order ID** to cancel it.\nExample: *"cancel order ORD-123456"*',
            intent,
            6,
            [],
          );
        }
        try {
          const orders = await this.salesService.getOrders(userId);
          const matchId = orderId.replace('ORD-', '');
          const order = orders?.find((o: any) =>
            String(o._id).includes(matchId),
          );
          if (!order) {
            return this.buildReply(
              `❌ Order **${orderId}** not found in your account.`,
              intent,
              5,
              [],
            );
          }
          if (order.status !== 'Pending') {
            return this.buildReply(
              `⚠️ Order **${orderId}** is already **${order.status}** and cannot be cancelled directly. Please contact support.`,
              intent,
              7,
              [],
            );
          }
          return this.buildReply(
            `⚠️ **Are you sure you want to cancel order ${orderId}?**\n\nType **"confirm"** or **"yes"** to cancel this order:`,
            intent,
            8,
            [],
            'CANCEL_ORDER_CONFIRM',
            { orderId: String(order._id) },
          );
        } catch {
          return this.buildReply(
            'Could not fetch order details. Please try again.',
            intent,
            4,
            [],
          );
        }
      }

      case 'RETURN_ORDER':
      case 'REFUND': {
        if (!userId) {
          return this.buildReply('Please **login** to request a return or refund.', intent, 5, [], undefined, undefined, true);
        }
        // Auto-create a return ticket via the multi-step flow
        return this.buildReply(
          `🔄 **Return & Refund Request**\n\nI'll create a return support ticket for you right now!\n\nWhich **Order ID** would you like to return? (e.g. *ORD-A1B2C3D4*)\n\nOr type **"my latest order"** to return your most recent order:`,
          intent,
          8,
          [],
          'RETURN_ORDER_ID',
          {},
          false,
          ['My latest order', 'View my orders'],
        );
      }

      case 'REORDER':
        if (!userId)
          return this.buildReply(
            'Please **login** to view orders for reordering.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          const latest = orders?.[0];
          if (!latest || latest.items.length === 0)
            return this.buildReply(
              'No previous orders found to reorder.',
              intent,
              7,
              [],
            );
          // Re-add to cart actions
          const actions: AgentAction[] = latest.items.map((i: any) => ({
            type: 'ADD_TO_CART',
            payload: {
              id: String(i.productId),
              title: 'Product Name',
              price: i.price,
              quantity: i.quantity,
            },
          }));
          return this.buildReply(
            `🛒 **Items from order #${String(latest._id).slice(-8).toUpperCase()} have been added to your cart!**`,
            intent,
            9,
            actions,
          );
        } catch {
          return this.buildReply(
            'Unable to reorder. Please check your cart.',
            intent,
            4,
            [],
          );
        }

      case 'DOWNLOAD_INVOICE':
        return this.buildReply(
          '📄 **Invoice Generation:**\n\nInvoice is ready. [Click here to download invoice PDF](/api/v1/sales/orders/invoice/mock)',
          intent,
          10,
          [],
        );

      case 'WISHLIST_ADD': {
        const productName =
          entities.productType ||
          message.replace(/add|to wishlist|save|favourite|wishlist/gi, '').trim();

        if (!userId) {
          return this.buildReply('Please **login** to save items to your wishlist.', intent, 5, [], undefined, undefined, true);
        }

        if (productName && productName.length > 1) {
          try {
            const results = await this.catalogService.getProducts({ search: productName });
            const product = results?.[0];
            if (product) {
              return {
                reply: `💜 **Added to Wishlist!**\n\n❤️ **${product.title}** ($${product.price.toFixed(2)}) has been saved to your wishlist.`,
                intent,
                confidence: 9,
                actions: [{ type: 'UPDATE_WISHLIST', payload: { productId: String((product as any)._id), action: 'add' } }],
                suggestions: ['View my wishlist', 'Add to cart', 'Continue shopping'],
              };
            }
          } catch {}
        }

        return this.buildReply(
          `💜 Which product would you like to add to your wishlist? Tell me the product name!`,
          intent, 6, [], undefined, undefined, false,
          ['View my wishlist', 'Browse products'],
        );
      }

      case 'WISHLIST_VIEW': {
        if (!userId) {
          return this.buildReply('Please **login** to view your wishlist.', intent, 5, [], undefined, undefined, true);
        }
        try {
          const profile = await this.profileService.getProfile(userId);
          const wishlistIds: string[] = (profile as any).wishlist || [];
          if (!wishlistIds.length) {
            return this.buildReply(
              `💜 Your **Wishlist** is empty!\n\nBrowse products and add items by saying **"add [product] to wishlist"**.`,
              intent, 8, [], undefined, undefined, false,
              ['Browse products', 'Search headphones'],
            );
          }
          // Fetch product details for wishlist items
          const items: string[] = [];
          for (const id of wishlistIds.slice(0, 5)) {
            try {
              const res = await this.catalogService.getProducts({ search: id });
              if (res?.[0]) items.push(`• **${res[0].title}** — $${res[0].price.toFixed(2)}`);
            } catch {}
          }
          const list = items.length > 0 ? items.join('\n') : wishlistIds.map(id => `• Product ID: ${id}`).join('\n');
          return this.buildReply(
            `💜 **Your Wishlist** (${wishlistIds.length} items):\n\n${list}\n\nType **"add [product] to cart"** to purchase any item!`,
            intent, 9,
            [{ type: 'NAVIGATE', payload: { path: '/wishlist' } }],
            undefined, undefined, false,
            ['Add to cart', 'Clear wishlist'],
          );
        } catch {
          return this.buildReply(
            `💜 Your **Wishlist** is at [/wishlist](/wishlist).`,
            intent, 7, [{ type: 'NAVIGATE', payload: { path: '/wishlist' } }],
          );
        }
      }

      case 'CREATE_TICKET':
        if (!userId)
          return this.buildReply(
            'Please **login** to create a support ticket.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          `🎫 Let's create a support ticket!\n\nPlease enter a **subject** for your issue:`,
          intent,
          8,
          [],
          'CREATE_TICKET_SUBJECT',
          {},
        );

      case 'VIEW_TICKETS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view your support tickets.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const tickets = await this.supportService.getCustomerTickets(userId);
          if (!tickets?.length) {
            return this.buildReply(
              '📋 You have **no support tickets** yet.',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Create ticket', 'Contact support'],
            );
          }
          const list = tickets
            .slice(0, 5)
            .map(
              (t: any) =>
                `• **${t.subject}** — ${t.status} (${t.priority} priority)`,
            )
            .join('\n');
          return this.buildReply(
            `📋 **Your Support Tickets:**\n\n${list}`,
            intent,
            9,
            [],
          );
        } catch {
          return this.buildReply(
            'Could not load tickets. Try again later.',
            intent,
            4,
            [],
          );
        }
      }

      case 'ESCALATE':
        if (!userId)
          return this.buildReply(
            'Please **login** to connect with a support agent.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          `🧑‍💼 **Connecting to Human Support...**\n\nI'll create an urgent ticket for you right now.\n\nWhat is the subject of your issue?`,
          intent,
          8,
          [],
          'CREATE_TICKET_SUBJECT',
          { priority: 'Urgent' },
        );

      case 'REVIEW_PRODUCT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to submit a review.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const productName =
          entities.productType ||
          message.replace(/review|rate|rating|feedback/gi, '').trim();
        return this.buildReply(
          `⭐ Let's submit your review for **${productName || 'the product'}**!\n\nWhat **star rating** would you give it? (1-5):`,
          intent,
          8,
          [],
          'REVIEW_RATING',
          { productTitle: productName },
        );
      }

      case 'BROWSE_CATEGORY': {
        const cat = entities.category || '';
        const catMap: Record<string, string> = {
          electronics: '/search?category=electronics',
          fashion: '/search?category=fashion',
          kitchen: '/search?category=home-kitchen',
          fitness: '/search?category=fitness-sports',
        };
        const path = catMap[cat] || '/';
        return this.buildReply(
          `🗂️ Browsing **${cat || 'all'} products**!\n\nClick the link to explore the full catalog:`,
          intent,
          7,
          [{ type: 'NAVIGATE', payload: { path } }],
          undefined,
          undefined,
          false,
          ['Electronics', 'Fashion', 'Home & Kitchen', 'Fitness & Sports'],
        );
      }

      case 'INVENTORY_CHECK': {
        const productName =
          entities.productType ||
          message.replace(/in stock|available|stock/gi, '').trim();
        return this.buildReply(
          `📦 Stock availability for **${productName}** is shown on each product page with live indicators.\n\n[Search for the product](/search?q=${encodeURIComponent(productName)}) to check real-time stock!`,
          intent,
          6,
          [
            {
              type: 'NAVIGATE',
              payload: { path: `/search?q=${encodeURIComponent(productName)}` },
            },
          ],
        );
      }

      case 'ADMIN_PRODUCTS':
      case 'ADMIN_ORDERS':
      case 'ADMIN_USERS':
      case 'ADMIN_COUPONS':
        if (!roles.some((r) => ['Admin', 'Super Admin'].includes(r))) {
          return this.buildReply(
            '⚠️ This action requires **Admin** permissions.',
            intent,
            5,
            [],
          );
        }
        return this.buildReply(
          `🛡️ Navigating to **Admin Dashboard**...`,
          intent,
          9,
          [{ type: 'NAVIGATE', payload: { path: '/admin' } }],
          undefined,
          undefined,
          false,
          ['View products', 'View orders', 'View customers'],
        );

      case 'ADMIN_ANALYTICS':
        if (!roles.some((r) => ['Admin', 'Super Admin'].includes(r))) {
          return this.buildReply(
            '⚠️ This action requires **Admin** permissions.',
            intent,
            5,
            [],
          );
        }
        return this.buildReply(
          `🛡️ **Admin Live Statistics:**\n\n• **Active Sessions**: 14 users\n• **Today's Revenue**: $4,210.50\n• **Open Tickets**: 3 tickets\n• **Processing Orders**: 8 orders\n\nHead to the [Admin Panel](/admin) for complete analytics.`,
          intent,
          10,
          [],
        );

      case 'VENDOR_PRODUCTS':
      case 'VENDOR_ANALYTICS':
        if (
          !roles.some((r) =>
            ['Vendor', 'Seller', 'Admin', 'Super Admin'].includes(r),
          )
        ) {
          return this.buildReply(
            '⚠️ This action requires **Vendor** access.',
            intent,
            5,
            [],
          );
        }
        return this.buildReply(
          `🏪 Navigating to **Vendor Dashboard**...`,
          intent,
          9,
          [{ type: 'NAVIGATE', payload: { path: '/vendor' } }],
        );

      case 'VENDOR_SETTLEMENTS':
        if (
          !roles.some((r) =>
            ['Vendor', 'Seller', 'Admin', 'Super Admin'].includes(r),
          )
        ) {
          return this.buildReply(
            '⚠️ This action requires **Vendor** access.',
            intent,
            5,
            [],
          );
        }
        return this.buildReply(
          `🏪 **Vendor Settlement Report:**\n\n• **Total Earnings**: $1,890.00\n• **Commission Deducted**: $210.00\n• **Pending Settlement**: $450.00\n• **Status**: Next payout scheduled for tomorrow.`,
          intent,
          10,
          [],
        );

      case 'HELP':
        return this.buildReply(
          `🤖 **ApexStore AI Assistant — What I Can Do:**\n\n🔍 **Search**: "Show gaming laptops", "Find headphones under $200"\n🛒 **Cart**: "Add headphones to cart", "View my cart"\n📦 **Orders**: "My orders", "Track my order", "Cancel order"\n💜 **Wishlist**: "Add to wishlist", "View my wishlist"\n🎫 **Support**: "Create ticket", "View tickets"\n🏷️ **Coupons**: "Apply coupon SAVE20"\n⭐ **Reviews**: "Rate headphones"\n🔐 **Account**: "Login", "Register", "My profile", "Logout"\n\nJust type naturally and I'll understand!`,
          intent,
          10,
          [],
          undefined,
          undefined,
          false,
          ['Search headphones', 'My orders', 'Create ticket', 'Login'],
        );

      case 'THANKS':
        return this.buildReply(
          `😊 You're welcome! Is there anything else I can help you with?`,
          intent,
          8,
          [],
          undefined,
          undefined,
          false,
          ['Browse products', 'My orders', 'Need help'],
        );

      case 'BYE':
        return this.buildReply(
          `👋 Goodbye! Come back soon for great deals at ApexStore!`,
          intent,
          8,
          [],
        );

      default: {
        const recentSearches = ctx.searchHistory.slice(-2);
        const hint =
          recentSearches.length > 0
            ? `\n\nBased on your recent activity, you might be looking for: **${recentSearches.join(', ')}**`
            : '';
        return this.buildReply(
          `🤔 I'm not sure I understood that.${hint}\n\nType **"help"** to see everything I can do, or try:\n• "Search [product name]"\n• "My orders"\n• "Create support ticket"`,
          intent,
          2,
          [],
          undefined,
          undefined,
          false,
          ['Help', 'Search headphones', 'My orders', 'Contact support'],
        );
      }
    }
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  private buildReply(
    reply: string,
    intent: string,
    confidence: number,
    actions: AgentAction[],
    nextStep?: string,
    stepData?: Record<string, any>,
    needsAuth = false,
    suggestions?: string[],
  ): AgentResponse {
    return {
      reply,
      intent,
      confidence,
      actions,
      nextStep,
      stepData,
      needsAuth,
      suggestions,
    };
  }

  private getRequiredRole(intent: string): string {
    const roleMap: Record<string, string> = {
      ADMIN_PRODUCTS: 'Admin',
      ADMIN_ORDERS: 'Admin',
      ADMIN_USERS: 'Admin',
      ADMIN_ANALYTICS: 'Admin',
      VENDOR_PRODUCTS: 'Vendor',
      VENDOR_ANALYTICS: 'Vendor',
      VENDOR_SETTLEMENTS: 'Vendor',
    };
    return roleMap[intent] || 'Customer';
  }
}
