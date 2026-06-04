import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// --- CHAT SESSION ---
@Schema({ timestamps: true })
export class ChatSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ default: '' })
  guestId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({
    type: [
      {
        role: { type: String, enum: ['user', 'bot'], required: true },
        text: { type: String, required: true },
        intent: { type: String, default: '' },
        actions: { type: [String], default: [] },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  messages: Array<{
    role: 'user' | 'bot';
    text: string;
    intent: string;
    actions: string[];
    timestamp: Date;
  }>;

  @Prop({ type: [String], default: [] })
  searchHistory: string[];

  @Prop({ type: [String], default: [] })
  viewedProducts: string[];
}
export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ guestId: 1 });
ChatSessionSchema.index({ sessionId: 1 }, { unique: true });

// --- GUEST PROFILE ---
@Schema({ timestamps: true })
export class GuestProfile extends Document {
  @Prop({ required: true, unique: true, index: true })
  guestId: string;

  @Prop({ default: '' })
  fingerprint: string;

  @Prop({ type: [Object], default: [] })
  cart: Array<{ productId: string; quantity: number }>;

  @Prop({ type: [String], default: [] })
  wishlist: string[];

  @Prop({ type: [String], default: [] })
  searchHistory: string[];

  @Prop({ type: [String], default: [] })
  viewedProducts: string[];

  @Prop({ type: [String], default: [] })
  sessionIds: string[];
}
export const GuestProfileSchema = SchemaFactory.createForClass(GuestProfile);

// --- USER PREFERENCES & MEMORY ---
@Schema({ timestamps: true })
export class UserMemory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  searchHistory: string[];

  @Prop({ type: [String], default: [] })
  viewedProducts: string[];

  @Prop({ type: [String], default: [] })
  preferredCategories: string[];

  @Prop({ type: [String], default: [] })
  preferredBrands: string[];

  @Prop({ default: 0 })
  avgOrderValue: number;

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;

  @Prop({ type: [String], default: [] })
  mergedGuestIds: string[];
}
export const UserMemorySchema = SchemaFactory.createForClass(UserMemory);
