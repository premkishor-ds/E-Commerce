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
  priceAlerts: Array<{
    productId: string;
    targetPrice: number;
    notified: boolean;
    type?: string;
  }>;

  @Prop({ type: [Object], default: [] })
  savedCart: Array<{
    productId: string;
    quantity: number;
    variantKey?: string;
  }>;
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
  stock: number; // Available stock

  @Prop({ required: true, default: 0 })
  reservedStock: number;

  @Prop({ required: true, default: 0 })
  incomingStock: number;

  @Prop({ required: true, default: 0 })
  damagedStock: number;

  @Prop({ required: true, default: 0 })
  preorderStock: number;

  @Prop({ type: Object, default: { 'Primary Warehouse': 0 } })
  warehouseStock: Record<string, number>;

  @Prop({ required: true, default: 5 })
  lowStockThreshold: number;

  @Prop({ default: 'Primary Warehouse' })
  warehouseName: string;

  @Prop({ type: [Object], default: [] })
  logs: Array<{
    quantityChanged: number;
    reason: string;
    timestamp: Date;
    warehouse?: string;
  }>;

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

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: true })
  isActive: boolean;
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
  status: string; // Pending, Approved, Rejected, Flagged

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ type: [Types.ObjectId], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({
    type: [
      {
        senderId: { type: Types.ObjectId, ref: 'User', required: true },
        reply: { type: String, required: true },
        repliedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  replies: Array<{ senderId: Types.ObjectId; reply: string; repliedAt: Date }>;

  @Prop({ default: 0 })
  reportsCount: number;

  @Prop({ default: 'Neutral' })
  sentiment: string; // Positive, Negative, Neutral

  @Prop({ default: 0 })
  fakeScore: number; // 0 to 100 percentage likelihood of being fake

  @Prop({ default: '' })
  summary: string;
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

  @Prop({ required: true })
  companyLegalName: string;

  @Prop({ required: true })
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

  @Prop({
    required: true,
    enum: ['Home', 'Office', 'Billing', 'Shipping', 'Other'],
  })
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

  @Prop({
    required: true,
    enum: ['Credit', 'Debit', 'Refund', 'Cashback', 'Bonus'],
  })
  transactionType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'Completed' })
  status: string;
}
export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);

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

// --- REFUND TRANSACTION ---
@Schema({ timestamps: true })
export class RefundTransaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Payment', required: true, index: true })
  paymentId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'Stripe' })
  provider: string; // Stripe, Razorpay, Wallet

  @Prop({ required: true })
  refundTransactionId: string;

  @Prop({ required: true, default: 'Completed' })
  status: string; // Pending, Completed, Failed

  @Prop({ default: '' })
  reason: string;
}
export const RefundTransactionSchema =
  SchemaFactory.createForClass(RefundTransaction);

// --- PAYMENT AUDIT LOG ---
@Schema({ timestamps: true })
export class PaymentAuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', default: null })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  action: string; // IntentCreated, PaymentConfirmed, RefundInitiated, etc.

  @Prop({ required: true })
  status: string; // Success, Failed

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;
}
export const PaymentAuditLogSchema =
  SchemaFactory.createForClass(PaymentAuditLog);

// --- PAYMENT WEBHOOK LOG ---
@Schema({ timestamps: true })
export class PaymentWebhookLog extends Document {
  @Prop({ required: true })
  provider: string; // Stripe, Razorpay

  @Prop({ required: true })
  eventType: string;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ required: true, default: 'Processed' })
  status: string; // Received, Processed, VerificationFailed

  @Prop({ default: '' })
  error: string;
}
export const PaymentWebhookLogSchema =
  SchemaFactory.createForClass(PaymentWebhookLog);

// --- AGENT STATUS ---
@Schema({ timestamps: true })
export class AgentStatus extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  agentId: Types.ObjectId;

  @Prop({ required: true, default: 'Offline' })
  status: string; // Online, Offline, Busy

  @Prop({ default: 0 })
  activeQueueCount: number;

  @Prop({ type: [String], default: [] })
  notes: string[];

  @Prop({ type: [String], default: [] })
  skills: string[]; // e.g., 'refunds', 'tech_support', 'billing'

  @Prop({ default: 3 })
  maxCapacity: number;

  @Prop({ type: [Types.ObjectId], ref: 'LiveChatSession', default: [] })
  assignedSessions: Types.ObjectId[];
}
export const AgentStatusSchema = SchemaFactory.createForClass(AgentStatus);

// --- LIVE CHAT SESSION ---
@Schema({ timestamps: true })
export class LiveChatSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  assignedAgentId: Types.ObjectId;

  @Prop({ required: true, default: 'Active' })
  status: string; // Active, Closed, ForceClosed

  @Prop({
    type: [
      {
        senderId: { type: Types.ObjectId, ref: 'User', required: true },
        senderName: { type: String, required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        attachmentUrl: { type: String, default: '' },
      },
    ],
    default: [],
  })
  messages: Array<{
    senderId: Types.ObjectId;
    senderName: string;
    message: string;
    sentAt: Date;
    attachmentUrl?: string;
  }>;

  @Prop({ default: 0 })
  rating: number; // 1 to 5 stars

  @Prop({ default: '' })
  transcript: string;

  @Prop({ required: true, default: 'Regular' })
  queueType: string; // Regular, Priority, VIP

  @Prop({ default: 0 })
  estimatedWaitTime: number; // in seconds

  @Prop({ default: 0 })
  priorityScore: number;
}
export const LiveChatSessionSchema =
  SchemaFactory.createForClass(LiveChatSession);

// --- LEDGER ENTRY (Double Entry Bookkeeping) ---
@Schema({ timestamps: true })
export class LedgerEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number; // Positive for Debit, Negative for Credit

  @Prop({ required: true, enum: ['Debit', 'Credit'] })
  entryType: string;

  @Prop({ required: true })
  accountName: string; // e.g., 'Cash', 'Revenue', 'Refunds', 'Wallet'

  @Prop({ required: true, index: true })
  transactionId: string; // References OrderId or Payment ID

  @Prop({ default: '' })
  description: string;
}
export const LedgerEntrySchema = SchemaFactory.createForClass(LedgerEntry);

// --- WAREHOUSE ---
@Schema({ timestamps: true })
export class Warehouse extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: true })
  isActive: boolean;
}
export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

// --- FILE METADATA ---
@Schema({ timestamps: true })
export class FileMetadata extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  sizeBytes: number;

  @Prop({ default: 'Pending' })
  scanStatus: string; // Pending, Safe, Infected, Failed

  @Prop({ default: '' })
  sha256: string;

  @Prop({ default: '' })
  storageUrl: string;
}
export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);

// --- ADMIN SESSION ---
@Schema({ timestamps: true })
export class AdminSession extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  os: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isSuspicious: boolean;

  @Prop({ type: Date, default: Date.now })
  lastActiveAt: Date;
}
export const AdminSessionSchema = SchemaFactory.createForClass(AdminSession);

// --- SYSTEM SETTING ---
@Schema({ timestamps: true })
export class SystemSetting extends Document {
  @Prop({ required: true, unique: true, index: true })
  category: string; // general, theme, localization, email, sms, notification, storage, api

  @Prop({ type: Object, required: true })
  settings: Record<string, any>;
}
export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);

// --- AUDIT LOG ---
@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  resource: string;

  @Prop({ default: '' })
  details: string;

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  device: string;
}
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// --- SEARCH LOG ---
@Schema({ timestamps: true })
export class SearchLog extends Document {
  @Prop({ default: '' })
  keyword: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ default: 'Guest' })
  userRole: string;

  @Prop({ default: 'All' })
  category: string;

  @Prop({ default: 'web' })
  source: string;

  @Prop({ default: 0 })
  resultsCount: number;
}
export const SearchLogSchema = SchemaFactory.createForClass(SearchLog);

// --- ACTIVITY LOG ---
@Schema({ timestamps: true })
export class ActivityLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  action: string;

  @Prop({ default: '' })
  details: string;

  @Prop({ required: true, index: true })
  category: string; // Login, Logout, Profile, Order, Product, Customer, Seller, Vendor, Settings
}
export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// --- CHATBOT LOG ---
@Schema({ timestamps: true })
export class ChatbotLog extends Document {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  query: string;

  @Prop({ required: true })
  primaryGoal: string;

  @Prop({ default: '' })
  secondaryGoal: string;

  @Prop({ required: true })
  confidence: number;

  @Prop({ type: Object, default: {} })
  entities: Record<string, any>;

  @Prop({ default: false })
  needsClarification: boolean;

  @Prop({ default: false })
  isFallback: boolean;
}
export const ChatbotLogSchema = SchemaFactory.createForClass(ChatbotLog);

// --- ANALYTICS CACHE ---
@Schema({ timestamps: true })
export class AnalyticsCache extends Document {
  @Prop({ required: true, index: true })
  metricName: string;

  @Prop({ required: true, index: true })
  dateKey: string; // e.g. YYYY-MM-DD

  @Prop({ required: true })
  value: number;

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;
}
export const AnalyticsCacheSchema = SchemaFactory.createForClass(AnalyticsCache);

// --- API LOG ---
@Schema({ timestamps: true })
export class ApiLog extends Document {
  @Prop({ required: true, index: true })
  endpoint: string;

  @Prop({ required: true, index: true })
  method: string;

  @Prop({ required: true })
  requestTime: Date;

  @Prop({ required: true })
  responseTime: Date;

  @Prop({ required: true })
  latencyMs: number;

  @Prop({ required: true, index: true })
  status: number;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  userId: Types.ObjectId | null;

  @Prop({ default: 'Guest' })
  userRole: string;

  @Prop({ default: 'Guest' })
  userType: string;

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ default: '' })
  device: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: 0 })
  requestSize: number;

  @Prop({ default: 0 })
  responseSize: number;
}
export const ApiLogSchema = SchemaFactory.createForClass(ApiLog);

// --- SECURITY LOG ---
@Schema({ timestamps: true })
export class SecurityLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true, index: true })
  action: string;

  @Prop({ default: '' })
  details: string;

  @Prop({ default: 'Medium' })
  severity: string; // Low, Medium, High, Critical

  @Prop({ default: '', index: true })
  ipAddress: string;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ default: '' })
  device: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: 'Alert', index: true })
  status: string; // Blocked, Alert, Logged
}
export const SecurityLogSchema = SchemaFactory.createForClass(SecurityLog);

// --- LOGIN LOG ---
@Schema({ timestamps: true })
export class LoginLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ default: 'Customer' })
  userRole: string;

  @Prop({ required: true, index: true })
  status: string; // Success, Failed, Locked, Unlocked

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  device: string;

  @Prop({ default: '' })
  os: string;

  @Prop({ default: '' })
  failureReason: string;

  @Prop({ default: false })
  mfaUsed: boolean;
}
export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);

// --- IMPORT LOG ---
@Schema({ timestamps: true })
export class ImportLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true, index: true })
  module: string; // Customer, Seller, Product, Order, etc.

  @Prop({ required: true })
  fileName: string;

  @Prop({ default: 0 })
  fileSize: number;

  @Prop({ default: 0 })
  totalRecords: number;

  @Prop({ default: 0 })
  successRecords: number;

  @Prop({ default: 0 })
  failedRecords: number;

  @Prop({ default: 'Success', index: true })
  status: string;
}
export const ImportLogSchema = SchemaFactory.createForClass(ImportLog);

// --- EXPORT LOG ---
@Schema({ timestamps: true })
export class ExportLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  exportType: string; // CSV, JSON

  @Prop({ required: true, index: true })
  exportModule: string; // Customer, Seller, Product, Order

  @Prop({ default: 'csv' })
  fileFormat: string;

  @Prop({ default: 0 })
  numberOfRecords: number;

  @Prop({ default: 'Success', index: true })
  status: string;
}
export const ExportLogSchema = SchemaFactory.createForClass(ExportLog);

// --- GUEST LOG ---
@Schema({ timestamps: true })
export class GuestLog extends Document {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ default: '', index: true })
  ipAddress: string;

  @Prop({ default: '' })
  device: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  state: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  landingPage: string;

  @Prop({ default: '' })
  exitPage: string;

  @Prop({ type: [String], default: [] })
  pagesVisited: string[];

  @Prop({ type: [String], default: [] })
  searchQueries: string[];

  @Prop({ default: 0 })
  timeOnSite: number; // in seconds
}
export const GuestLogSchema = SchemaFactory.createForClass(GuestLog);

// --- CHANGE HISTORY ---
@Schema({ timestamps: true })
export class ChangeHistory extends Document {
  @Prop({ required: true, index: true })
  entityType: string; // User, Product, Vendor, SystemSetting, Order, Coupon, Review, etc.

  @Prop({ required: true, index: true })
  entityId: string;

  @Prop({ required: true, index: true })
  changedField: string;

  @Prop({ default: '' })
  previousValue: string;

  @Prop({ default: '' })
  newValue: string;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, default: null })
  changedBy: Types.ObjectId | null;

  @Prop({ default: '' })
  changedByName: string; // operator email/name

  @Prop({ default: '' })
  changedRole: string;
}
export const ChangeHistorySchema = SchemaFactory.createForClass(ChangeHistory);


// --- FEEDBACK TICKET ---
@Schema({ timestamps: true })
export class FeedbackTicket extends Document {
  @Prop({ required: true, unique: true, index: true })
  ticketId: string; // e.g. FDB-12345

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  userId: Types.ObjectId | null;

  @Prop({ required: true, default: 'Guest', index: true })
  userRole: string; // Guest, Customer, Seller, Vendor, Admin, Support Agent

  @Prop({ required: true, index: true })
  type: string; // Feedback, Suggestion, Bug Report, Feature Request, Complaint, Security Report

  @Prop({ required: true, index: true })
  category: string; // General Feedback, Bug Reports, Feature Requests, Complaint Reports, Security Reports, etc.

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 'Medium', index: true })
  priority: string; // Low, Medium, High, Critical, Emergency

  @Prop({ required: true, default: 'Medium' })
  severity: string; // Low, Medium, High, Critical, Emergency

  @Prop({ required: true, default: 'New', index: true })
  status: string; // New, Open, In Review, Assigned, In Progress, Awaiting Response, Testing, Resolved, Closed, Rejected

  @Prop({ default: 'Support Team', index: true })
  assignedTo: string; // Support Team, QA Team, Development Team, Product Team

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  assignedAgentId: Types.ObjectId | null;

  @Prop({ default: '' })
  url: string;

  @Prop({ default: '' })
  referrerUrl: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  device: string;

  @Prop({ default: '' })
  os: string;

  @Prop({ default: '' })
  screenResolution: string;

  @Prop({ default: '' })
  sessionID: string;

  @Prop({ default: '' })
  ipAddress: string;

  @Prop({ default: false, index: true })
  isConfidential: boolean; // True for Security Reports

  @Prop({ default: 'none', index: true })
  roadmapStatus: string; // none, Planned, Under Development, Released, Rejected

  @Prop({ default: 0 })
  votesCount: number;

  @Prop({ default: 0 })
  rating: number; // 1-5 Stars

  @Prop({ default: '' })
  surveyComment: string;
}
export const FeedbackTicketSchema = SchemaFactory.createForClass(FeedbackTicket);

// --- FEEDBACK COMMENT ---
@Schema({ timestamps: true })
export class FeedbackComment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'FeedbackTicket', required: true, index: true })
  feedbackId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: false, index: true })
  isPrivate: boolean; // Internal notes visible to admins only
}
export const FeedbackCommentSchema = SchemaFactory.createForClass(FeedbackComment);

// --- FEEDBACK ATTACHMENT ---
@Schema({ timestamps: true })
export class FeedbackAttachment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'FeedbackTicket', required: true, index: true })
  feedbackId: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  uploadedBy: Types.ObjectId | null;
}
export const FeedbackAttachmentSchema = SchemaFactory.createForClass(FeedbackAttachment);

// --- FEEDBACK VOTE ---
@Schema({ timestamps: true })
export class FeedbackVote extends Document {
  @Prop({ type: Types.ObjectId, ref: 'FeedbackTicket', required: true, index: true })
  feedbackId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
}
export const FeedbackVoteSchema = SchemaFactory.createForClass(FeedbackVote);

// --- FEEDBACK ACTIVITY LOG ---
@Schema({ timestamps: true })
export class FeedbackActivityLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'FeedbackTicket', required: true, index: true })
  feedbackId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userRole: string;

  @Prop({ required: true })
  action: string;

  @Prop({ default: '' })
  oldValue: string;

  @Prop({ default: '' })
  newValue: string;
}
export const FeedbackActivityLogSchema = SchemaFactory.createForClass(FeedbackActivityLog);




