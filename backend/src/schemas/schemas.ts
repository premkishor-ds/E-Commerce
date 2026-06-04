import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// --- USER & AUTH ---
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  otpCode: string;

  @Prop({ type: Date, default: null })
  otpExpiresAt: Date | null;

  @Prop({ type: [String], default: ['Customer'] })
  roles: string[]; // Super Admin, Admin, Manager, Customer Support, Seller, Vendor, Customer

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop({ default: '' })
  mfaSecret: string;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ type: Date, default: null })
  lockoutUntil: Date | null;

  @Prop({ type: [String], default: [] })
  refreshTokens: string[];

  @Prop({ type: [Object], default: [] })
  devices: Array<{
    deviceId: string;
    os: string;
    browser: string;
    lastLogin: Date;
  }>;

  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '' })
  displayName: string;

  @Prop({ default: '', index: true })
  username: string;

  @Prop({ default: '' })
  alternatePhone: string;

  @Prop({ type: Date, default: null })
  dob: Date | null;

  @Prop({ default: '' })
  gender: string;

  @Prop({ default: '' })
  profilePhoto: string;

  @Prop({ default: 'en' })
  languagePreference: string;

  @Prop({ default: 'USD' })
  currencyPreference: string;

  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ default: 'Silver' })
  membershipLevel: string;

  @Prop({ default: 0 })
  rewardPoints: number;

  @Prop({ default: 0 })
  walletBalance: number;

  @Prop({ default: 'Active' })
  accountStatus: string;

  @Prop({ default: false })
  verificationStatus: boolean;

  @Prop({ type: Date, default: null })
  lastLogin: Date | null;

  @Prop({ default: true })
  marketingEmails: boolean;

  @Prop({ default: true })
  productRecommendations: boolean;

  @Prop({ default: true })
  newsletterSubscriptions: boolean;

  @Prop({ default: '' })
  referralCode: string;

  @Prop({ type: String, default: null })
  referredBy: string | null;

  @Prop({ default: 0 })
  referralEarnings: number;

  @Prop({ default: 'Free' })
  subscriptionPlan: string;

  @Prop({ default: 'Monthly' })
  billingCycle: string;

  @Prop({ type: Date, default: null })
  nextRenewal: Date | null;

  @Prop({ type: [String], default: [] })
  backupCodes: string[];

  @Prop({ type: [Object], default: [] })
  priceAlerts: Array<{ productId: string; targetPrice: number; notified: boolean; type?: string }>;

  @Prop({ type: [Object], default: [] })
  savedCart: Array<{ productId: string; quantity: number; variantKey?: string }>;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });

// --- CATEGORY ---
@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentId: Types.ObjectId;

  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

// --- BRAND ---
@Schema({ timestamps: true })
export class Brand extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  description: string;
}
export const BrandSchema = SchemaFactory.createForClass(Brand);

// --- INVENTORY ---
@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true, unique: true, index: true })
  sku: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, default: 5 })
  lowStockThreshold: number;

  @Prop({ default: 'Primary Warehouse' })
  warehouseName: string;

  @Prop({ type: [Object], default: [] })
  logs: Array<{ quantityChanged: number; reason: string; timestamp: Date }>;

  @Prop({ type: Date, default: null })
  restockDate: Date | null;

  @Prop({ default: false })
  allowPreorder: boolean;

  @Prop({ default: false })
  allowBackorder: boolean;
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);

// --- PRODUCT ---
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({ required: true, index: true })
  sku: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  variants: Record<string, any>;

  @Prop({ type: [Object], default: [] })
  specifications: Array<{ name: string; value: string }>;

  @Prop({ type: [Object], default: [] })
  faqs: Array<{ question: string; answer: string }>;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  vendorId: Types.ObjectId;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1, category: 1 });

// --- CART ---
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    default: [],
  })
  items: Array<{ productId: Types.ObjectId; quantity: number }>;
}
export const CartSchema = SchemaFactory.createForClass(Cart);

// --- WISHLIST ---
@Schema({ timestamps: true })
export class Wishlist extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  products: Types.ObjectId[];
}
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

// --- COUPON ---
@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true, enum: ['percentage', 'fixed', 'free_shipping'] })
  discountType: string;

  @Prop({ required: true, default: 0 })
  value: number;

  @Prop({ default: 0 })
  minPurchase: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);

// --- ORDER ---
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
    index: true,
  })
  userId: Types.ObjectId | null;

  @Prop({ default: '' })
  guestId: string;

  @Prop({ default: false })
  isGuestOrder: boolean;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: Array<{ productId: Types.ObjectId; quantity: number; price: number }>;

  @Prop({ required: true, default: 'Pending' })
  status: string; // Pending, Paid, Shipped, Delivered, Cancelled, Returned

  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: '' })
  trackingCode: string;

  @Prop({ type: [Object], default: [] })
  statusHistory: Array<{ status: string; changedAt: Date; note: string }>;

  @Prop({ default: '' })
  deliverySlot: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, createdAt: -1 });

// --- PAYMENT ---
@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  provider: string; // Stripe, PayPal, Razorpay, Wallet

  @Prop({ required: true, default: 'Pending' })
  status: string; // Pending, Completed, Failed, Refunded

  @Prop({ required: true })
  transactionId: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);

// --- REVIEW ---
@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: false })
  verifiedPurchase: boolean;

  @Prop({ default: 'Approved' })
  status: string; // Pending, Approved, Rejected
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ productId: 1, rating: -1 });

// --- TICKET & MESSAGE ---
@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true, default: 'Open' })
  status: string; // Open, In Progress, Resolved, Closed

  @Prop({ required: true, default: 'Medium' })
  priority: string; // Low, Medium, High, Urgent

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedAgentId: Types.ObjectId;

  @Prop({
    type: [
      {
        senderId: { type: Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  messages: Array<{ senderId: Types.ObjectId; message: string; sentAt: Date }>;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);

// --- NOTIFICATION ---
@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ required: true })
  type: string; // OrderUpdate, Promo, Security, Alert
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// --- LOG & AUDIT ---
@Schema({ timestamps: true })
export class Log extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  details: string;

  @Prop({ required: true })
  type: string; // Security, Audit, API, Error, Performance
}
export const LogSchema = SchemaFactory.createForClass(Log);

// --- VENDOR & SETTLEMENT ---
@Schema({ timestamps: true })
export class Vendor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  shopName: string;

  @Prop({ default: 'Pending' })
  status: string; // Pending, Approved, Suspended

  @Prop({ required: true, default: 10 })
  commissionRate: number; // e.g., 10%

  @Prop({ default: '' })
  companyLegalName: string;

  @Prop({ default: '' })
  businessPhone: string;

  @Prop({ type: Object, default: null })
  bankAccountDetails: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    isDefault: boolean;
  } | null;
}
export const VendorSchema = SchemaFactory.createForClass(Vendor);

@Schema({ timestamps: true })
export class Settlement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'Pending' })
  status: string; // Pending, Completed, Failed

  @Prop({ required: true })
  processedAt: Date;
}
export const SettlementSchema = SchemaFactory.createForClass(Settlement);

// --- ANALYTICS ---
@Schema({ timestamps: true })
export class Analytics extends Document {
  @Prop({ required: true, index: true })
  metricName: string; // Revenue, SalesCount, ActiveUsers, PageView

  @Prop({ required: true })
  value: number;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;
}
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

// --- ADDRESS ---
@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ default: '' })
  alternateMobile: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: '' })
  area: string;

  @Prop({ required: true })
  street: string;

  @Prop({ default: '' })
  landmark: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true, enum: ['Home', 'Office', 'Billing', 'Shipping', 'Other'] })
  addressType: string;

  @Prop({ default: false })
  isDefault: boolean;
}
export const AddressSchema = SchemaFactory.createForClass(Address);

// --- PAYMENT METHOD ---
@Schema({ timestamps: true })
export class PaymentMethod extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  type: string; // card, upi, wallet

  @Prop({ type: Object, default: null })
  cardDetails: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    token: string;
  } | null;

  @Prop({ type: Object, default: null })
  upiDetails: {
    vpa: string;
  } | null;

  @Prop({ type: Object, default: null })
  walletDetails: {
    provider: string;
  } | null;

  @Prop({ default: false })
  isDefault: boolean;
}
export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

// --- WALLET TRANSACTION ---
@Schema({ timestamps: true })
export class WalletTransaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['Credit', 'Debit', 'Refund', 'Cashback', 'Bonus'] })
  transactionType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'Completed' })
  status: string;
}
export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);

// --- REFERRAL ---
@Schema({ timestamps: true })
export class Referral extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  referrerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  referredUserId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  earnings: number;

  @Prop({ default: 'Pending' })
  status: string; // Pending, Completed
}
export const ReferralSchema = SchemaFactory.createForClass(Referral);
