import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSession, GuestProfile, UserMemory } from './agent.schemas';

@Injectable()
export class AgentMemoryService {
  constructor(
    @InjectModel(ChatSession.name)
    private readonly sessionModel: Model<ChatSession>,
    @InjectModel(GuestProfile.name)
    private readonly guestModel: Model<GuestProfile>,
    @InjectModel(UserMemory.name)
    private readonly memoryModel: Model<UserMemory>,
  ) {}

  // ─── SESSION ───────────────────────────────────────────────────────────────

  async getOrCreateSession(
    sessionId: string,
    userId?: string,
    guestId?: string,
  ): Promise<ChatSession> {
    let session = await this.sessionModel.findOne({ sessionId });
    if (!session) {
      try {
        session = await this.sessionModel.create({
          sessionId,
          userId: userId || null,
          guestId: guestId || '',
          messages: [],
          searchHistory: [],
          viewedProducts: [],
        });
      } catch (err: any) {
        if (err.code === 11000) {
          const fallback = await this.sessionModel.findOne({ sessionId });
          if (fallback) return fallback;
        }
        throw err;
      }
    }
    return session;
  }

  async appendMessage(
    sessionId: string,
    role: 'user' | 'bot',
    text: string,
    intent = '',
    actions: string[] = [],
  ): Promise<void> {
    await this.sessionModel.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: { role, text, intent, actions, timestamp: new Date() },
        },
      },
    );
  }

  async getRecentHistory(
    sessionId: string,
    limit = 10,
  ): Promise<{ role: string; text: string }[]> {
    const session = await this.sessionModel.findOne({ sessionId });
    if (!session) return [];
    return session.messages
      .slice(-limit)
      .map((m) => ({ role: m.role, text: m.text }));
  }

  async addSearchToSession(sessionId: string, query: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate(
      { sessionId },
      { $addToSet: { searchHistory: query } },
    );
  }

  async addViewedProduct(sessionId: string, productId: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate(
      { sessionId },
      { $addToSet: { viewedProducts: productId } },
    );
  }

  async getSessionSearchHistory(sessionId: string): Promise<string[]> {
    const session = await this.sessionModel.findOne({ sessionId });
    return session?.searchHistory || [];
  }

  // ─── GUEST PROFILE ─────────────────────────────────────────────────────────

  async getOrCreateGuest(guestId: string): Promise<GuestProfile> {
    let guest = await this.guestModel.findOne({ guestId });
    if (!guest) {
      try {
        guest = await this.guestModel.create({ guestId });
      } catch (err: any) {
        if (err.code === 11000) {
          const fallback = await this.guestModel.findOne({ guestId });
          if (fallback) return fallback;
        }
        throw err;
      }
    }
    return guest;
  }

  async trackGuestSession(guestId: string, sessionId: string): Promise<void> {
    await this.guestModel.findOneAndUpdate(
      { guestId },
      { $addToSet: { sessionIds: sessionId } },
    );
  }

  async updateGuestCart(
    guestId: string,
    cart: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    await this.guestModel.findOneAndUpdate({ guestId }, { cart });
  }

  async addGuestSearch(guestId: string, query: string): Promise<void> {
    await this.guestModel.findOneAndUpdate(
      { guestId },
      { $addToSet: { searchHistory: query } },
    );
  }

  // ─── USER MEMORY ───────────────────────────────────────────────────────────

  async getOrCreateMemory(userId: string): Promise<UserMemory> {
    const { Types } = await import('mongoose');
    const uObjectId = new Types.ObjectId(userId);
    let memory = await this.memoryModel.findOne({
      userId: uObjectId,
    });
    if (!memory) {
      try {
        memory = await this.memoryModel.create({
          userId: uObjectId,
        });
      } catch (err: any) {
        if (err.code === 11000) {
          const fallback = await this.memoryModel.findOne({ userId: uObjectId });
          if (fallback) return fallback;
        }
        throw err;
      }
    }
    return memory;
  }

  async updateUserSearchHistory(userId: string, query: string): Promise<void> {
    const { Types } = await import('mongoose');
    await this.memoryModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $addToSet: { searchHistory: query } },
      { upsert: true },
    );
  }

  async updateViewedProduct(userId: string, productId: string): Promise<void> {
    const { Types } = await import('mongoose');
    await this.memoryModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $addToSet: { viewedProducts: productId } },
      { upsert: true },
    );
  }

  async getUserMemory(userId: string): Promise<UserMemory | null> {
    const { Types } = await import('mongoose');
    return this.memoryModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  // ─── ACCOUNT MERGE ─────────────────────────────────────────────────────────

  async mergeGuestToUser(guestId: string, userId: string): Promise<void> {
    const { Types } = await import('mongoose');
    const mongoose = await import('mongoose');
    const guest = await this.guestModel.findOne({ guestId });
    if (!guest) return;

    const userObjectId = new Types.ObjectId(userId);

    // Merge sessions
    await this.sessionModel.updateMany(
      { guestId },
      { $set: { userId: userObjectId } },
    );

    // Merge search history into user memory
    for (const query of guest.searchHistory) {
      await this.updateUserSearchHistory(userId, query);
    }

    // Merge viewed products
    for (const prodId of guest.viewedProducts) {
      await this.updateViewedProduct(userId, prodId);
    }

    // Merge Cart
    if (guest.cart && guest.cart.length > 0) {
      try {
        const CartModel = mongoose.model('Cart');
        let userCart = await CartModel.findOne({ userId: userObjectId });
        if (!userCart) {
          userCart = await CartModel.create({
            userId: userObjectId,
            items: [],
          });
        }
        for (const guestItem of guest.cart) {
          const existing = userCart.items.find(
            (i: any) => String(i.productId) === String(guestItem.productId),
          );
          if (existing) {
            existing.quantity += guestItem.quantity;
          } else {
            userCart.items.push({
              productId: new Types.ObjectId(guestItem.productId),
              quantity: guestItem.quantity,
            });
          }
        }
        await userCart.save();
      } catch (e) {
        // Log or handle dynamic model load error
      }
    }

    // Merge Wishlist
    if (guest.wishlist && guest.wishlist.length > 0) {
      try {
        const WishlistModel = mongoose.model('Wishlist');
        let userWish = await WishlistModel.findOne({ userId: userObjectId });
        if (!userWish) {
          userWish = await WishlistModel.create({
            userId: userObjectId,
            products: [],
          });
        }
        for (const prodId of guest.wishlist) {
          const pObj = new Types.ObjectId(prodId);
          if (
            !userWish.products.some((p: any) => String(p) === String(prodId))
          ) {
            userWish.products.push(pObj);
          }
        }
        await userWish.save();
      } catch (e) {
        // Log or handle
      }
    }

    // Record merge in user memory
    await this.memoryModel.findOneAndUpdate(
      { userId: userObjectId },
      { $addToSet: { mergedGuestIds: guestId } },
      { upsert: true },
    );
  }

  // ─── CONTEXT RETRIEVAL ─────────────────────────────────────────────────────

  async getFullContext(
    sessionId: string,
    userId?: string,
    guestId?: string,
  ): Promise<{
    recentMessages: { role: string; text: string }[];
    searchHistory: string[];
    viewedProducts: string[];
    userMemory: UserMemory | null;
  }> {
    const [recentMessages, sessionHistory] = await Promise.all([
      this.getRecentHistory(sessionId, 8),
      this.sessionModel.findOne({ sessionId }),
    ]);

    let userMemory: UserMemory | null = null;
    if (userId) {
      userMemory = await this.getUserMemory(userId);
    }

    return {
      recentMessages,
      searchHistory: sessionHistory?.searchHistory || [],
      viewedProducts: sessionHistory?.viewedProducts || [],
      userMemory,
    };
  }
}
