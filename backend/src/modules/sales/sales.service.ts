import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CartRepository,
  WishlistRepository,
  CouponRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
  InventoryRepository,
  SettlementRepository,
  VendorRepository,
  ReviewRepository,
  UserRepository,
  NotificationRepository,
} from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';

@Injectable()
export class SalesService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly wishlistRepository: WishlistRepository,
    private readonly couponRepository: CouponRepository,
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly productRepository: ProductRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly settlementRepository: SettlementRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  // CART
  async getCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!cart) {
      cart = await this.cartRepository.create({
        userId: new Types.ObjectId(userId),
        items: [],
      });
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }
    return cart.save();
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    return cart.save();
  }

  async updateCartQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) throw new NotFoundException('Item not in cart');
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    return cart.save();
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    cart.items = [];
    return cart.save();
  }

  async saveCartForLater(userId: string) {
    const cart = await this.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty, cannot save for later.');
    }
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    (user as any).savedCart = cart.items.map((i: any) => ({
      productId: i.productId.toString(),
      quantity: i.quantity,
      variantKey: (i as any).variantKey || '',
    }));
    await (user as any).save();
    cart.items = [];
    await cart.save();
    return { success: true, message: 'Cart saved for later successfully.' };
  }

  async restoreSavedCart(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const saved = (user as any).savedCart || [];
    if (saved.length === 0) {
      throw new BadRequestException('No saved cart found to restore.');
    }
    const cart = await this.getCart(userId);
    for (const item of saved) {
      const idx = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId,
      );
      if (idx > -1) {
        cart.items[idx].quantity += item.quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity,
          variantKey: item.variantKey || '',
        } as any);
      }
    }
    await cart.save();
    (user as any).savedCart = [];
    await (user as any).save();
    return { success: true, message: 'Saved cart restored successfully.' };
  }

  async getCartWithProducts(userId: string) {
    const cart = await this.getCart(userId);
    const populated: any[] = [];
    for (const item of cart.items) {
      try {
        const product = await this.productRepository.findById(item.productId.toString());
        if (product) {
          populated.push({
            productId: item.productId.toString(),
            quantity: item.quantity,
            title: product.title,
            price: product.price,
            image: (product as any).images?.[0] || '',
            subtotal: product.price * item.quantity,
          });
        }
      } catch {}
    }
    const total = populated.reduce((sum, i) => sum + i.subtotal, 0);
    return { items: populated, total, itemCount: populated.length };
  }

  // WISHLIST
  async getWishlist(userId: string) {
    let wishlist = await this.wishlistRepository.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({
        userId: new Types.ObjectId(userId),
        products: [],
      });
    }
    return wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);
    const prodId = new Types.ObjectId(productId);
    if (!wishlist.products.some((id) => id.toString() === productId)) {
      wishlist.products.push(prodId);
      await wishlist.save();
    }
    return wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );
    return wishlist.save();
  }

  async clearWishlist(userId: string) {
    const wishlist = await this.getWishlist(userId);
    wishlist.products = [];
    return wishlist.save();
  }

  async moveToCart(userId: string, productId: string) {
    // Add to cart, then remove from wishlist
    await this.addToCart(userId, productId, 1);
    await this.removeFromWishlist(userId, productId);
    const product = await this.productRepository.findById(productId);
    return product;
  }

  async moveAllToCart(userId: string) {
    const wishlist = await this.getWishlist(userId);
    const addedItems: string[] = [];
    for (const productId of wishlist.products) {
      try {
        await this.addToCart(userId, productId.toString(), 1);
        addedItems.push(productId.toString());
      } catch {}
    }
    // Clear wishlist after moving
    wishlist.products = [];
    await wishlist.save();
    return { movedCount: addedItems.length };
  }

  async getWishlistWithProducts(userId: string) {
    const wishlist = await this.getWishlist(userId);
    const populated: any[] = [];
    for (const productId of wishlist.products) {
      try {
        const product = await this.productRepository.findById(productId.toString());
        if (product) populated.push(product);
      } catch {}
    }
    return populated;
  }

  // COUPONS
  async createCoupon(dto: any) {
    return this.couponRepository.create(dto);
  }

  async validateCoupon(code: string, amount: number) {
    const coupon = await this.couponRepository.findOne({
      code,
      isActive: true,
    });
    if (!coupon) throw new NotFoundException('Coupon not found or inactive');
    if (coupon.expiresAt < new Date())
      throw new BadRequestException('Coupon has expired');
    if (amount < coupon.minPurchase)
      throw new BadRequestException(
        `Minimum purchase amount is $${coupon.minPurchase}`,
      );
    return coupon;
  }

  // ORDERS & CHECKOUT
  async placeOrder(userId: string | null, dto: any) {
    // dto contains: items: [{productId, quantity}], shippingAddress, couponCode (optional), guestId (optional)
    let discount = 0;
    let subtotal = 0;
    const itemsWithPrices = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);

      // Check Inventory stock
      const inventory = await this.inventoryRepository.findOne({
        sku: product.sku,
      });
      if (!inventory || inventory.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.title}`,
        );
      }

      // Deduct Stock
      inventory.stock -= item.quantity;
      inventory.logs.push({
        quantityChanged: -item.quantity,
        reason: 'Order Placement',
        timestamp: new Date(),
      });
      await inventory.save();

      subtotal += product.price * item.quantity;
      itemsWithPrices.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Track vendor commission calculation triggers
      if (product.vendorId) {
        const vendor = await this.vendorRepository.findOne({
          userId: product.vendorId,
        });
        if (vendor) {
          const settlementAmount =
            product.price * item.quantity * (1 - vendor.commissionRate / 100);
          await this.settlementRepository.create({
            vendorId: vendor._id,
            amount: settlementAmount,
            status: 'Pending',
            processedAt: new Date(),
          });
        }
      }
    }

    if (dto.couponCode) {
      try {
        const coupon = await this.validateCoupon(dto.couponCode, subtotal);
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.value) / 100;
        } else if (coupon.discountType === 'fixed') {
          discount = coupon.value;
        }
      } catch {
        // Log coupon invalidity, but let checkout continue or fail depending on business rule. Here, we enforce validation.
        throw new BadRequestException('Invalid coupon code applied');
      }
    }

    const tax = subtotal * 0.08; // 8% sales tax
    const total = subtotal + tax - discount;

    const orderData: any = {
      items: itemsWithPrices,
      shippingAddress: dto.shippingAddress,
      totalPrice: total,
      tax,
      discount,
      status: 'Pending',
      statusHistory: [
        { status: 'Pending', changedAt: new Date(), note: 'Order created' },
      ],
    };

    if (userId) {
      orderData.userId = new Types.ObjectId(userId);
    } else if (dto.guestId) {
      orderData.guestId = dto.guestId;
      orderData.isGuestOrder = true;
    }

    const order = await this.orderRepository.create(orderData);

    // Create payment entry
    await this.paymentRepository.create({
      orderId: order._id,
      amount: total,
      provider: dto.paymentProvider || 'Stripe',
      status: 'Pending',
      transactionId:
        'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });

    // Empty User Cart if logged in
    if (userId) {
      const cart = await this.getCart(userId);
      cart.items = [];
      await cart.save();
    }

    return order;
  }

  async getOrders(userId: string) {
    return this.orderRepository.find({ userId: new Types.ObjectId(userId) });
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: string, status: string, note: string) {
    const order = await this.getOrderById(id);
    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date(), note });
    return order.save();
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.getOrderById(id);
    if (String((order as any).userId) !== userId) throw new BadRequestException('Unauthorized');
    if (!['Pending', 'Paid'].includes(order.status)) {
      throw new BadRequestException(`Order in ${order.status} state cannot be cancelled`);
    }
    return this.updateOrderStatus(id, 'Cancelled', 'Cancelled by customer via chatbot');
  }

  async updateOrderAddress(orderId: string, userId: string, newAddress: any) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId) throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only change address for Pending orders');
    }
    (order as any).shippingAddress = newAddress;
    return (order as any).save();
  }

  async updateOrderDeliverySlot(orderId: string, userId: string, slot: string) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId) throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only change delivery slot for Pending orders');
    }
    order.deliverySlot = slot;
    return order.save();
  }

  async updateOrderPaymentMethod(orderId: string, userId: string, paymentMethod: string) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId) throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only change payment method for Pending orders');
    }
    const payment = await this.paymentRepository.findOne({ orderId: new Types.ObjectId(orderId) });
    if (payment) {
      payment.provider = paymentMethod;
      await payment.save();
    }
    return order.save();
  }

  async updateOrderItemQuantity(orderId: string, userId: string, productId: string, quantity: number) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId) throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only modify items for Pending orders');
    }

    const itemIndex = order.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) throw new NotFoundException('Item not found in order');

    const item = order.items[itemIndex];
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const qtyDiff = quantity - item.quantity;

    if (qtyDiff !== 0) {
      const inventory = await this.inventoryRepository.findOne({ sku: product.sku });
      if (inventory) {
        if (qtyDiff > 0 && inventory.stock < qtyDiff) {
          throw new BadRequestException(`Insufficient stock for product: ${product.title}`);
        }
        inventory.stock -= qtyDiff;
        inventory.logs.push({
          quantityChanged: -qtyDiff,
          reason: 'Order Item Modification',
          timestamp: new Date(),
        });
        await inventory.save();
      }
    }

    if (quantity <= 0) {
      order.items.splice(itemIndex, 1);
    } else {
      item.quantity = quantity;
    }

    let subtotal = 0;
    for (const orderItem of order.items) {
      subtotal += orderItem.price * orderItem.quantity;
    }

    if (order.items.length === 0) {
      order.status = 'Cancelled';
      order.statusHistory.push({ status: 'Cancelled', changedAt: new Date(), note: 'Order cancelled due to item removal.' });
    } else {
      order.tax = subtotal * 0.08;
      order.totalPrice = subtotal + order.tax - (order.discount || 0);
      if (order.totalPrice < 0) order.totalPrice = 0;
    }

    const payment = await this.paymentRepository.findOne({ orderId: new Types.ObjectId(orderId) });
    if (payment) {
      payment.amount = order.totalPrice;
      if (order.items.length === 0) {
        payment.status = 'Failed';
      }
      await payment.save();
    }

    return order.save();
  }

  async getAllOrders(filters: any = {}) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    return this.orderRepository.find(query);
  }

  // REVIEWS
  async createReview(userId: string, dto: { productId: string; rating: number; comment: string }) {
    // Check if user already reviewed this product
    const existing = await this.reviewRepository.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(dto.productId),
    });
    if (existing) {
      existing.rating = dto.rating;
      (existing as any).comment = dto.comment;
      return (existing as any).save();
    }
    const review = await this.reviewRepository.create({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(dto.productId),
      rating: dto.rating,
      comment: dto.comment,
      verifiedPurchase: false,
      status: 'Approved',
    });
    // Update product average rating
    try {
      const reviews = await this.reviewRepository.find({ productId: new Types.ObjectId(dto.productId) });
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await this.productRepository.update(dto.productId, { averageRating: Math.round(avg * 10) / 10 });
    } catch {}
    return review;
  }

  async getProductReviews(productId: string, filters: { rating?: number; verified?: boolean; filter?: string }) {
    const query: any = { productId: new Types.ObjectId(productId), status: 'Approved' };
    if (filters.rating) query.rating = filters.rating;
    if (filters.verified) query.verifiedPurchase = true;
    if (filters.filter === 'positive') query.rating = { $gte: 4 };
    if (filters.filter === 'negative') query.rating = { $lte: 2 };
    return this.reviewRepository.find(query);
  }

  async getInventoryByProductId(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return this.inventoryRepository.findOne({ sku: (product as any).sku });
  }

  async getRecentAnalytics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const orders = await this.orderRepository.find({});
    const todayOrders = orders.filter((o: any) => new Date(o.createdAt) >= today && o.status !== 'Cancelled');
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = orders.filter((o: any) => new Date(o.createdAt) >= monthStart && o.status !== 'Cancelled');
    const todayRevenue = todayOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const monthRevenue = monthOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    // Top products by sales count
    const productSales: Record<string, number> = {};
    for (const order of orders) {
      for (const item of order.items) {
        const pid = item.productId.toString();
        productSales[pid] = (productSales[pid] || 0) + item.quantity;
      }
    }
    const topProductIds = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
    const topProducts: string[] = [];
    for (const id of topProductIds) {
      try {
        const p = await this.productRepository.findById(id);
        if (p) topProducts.push(`${(p as any).title} (${productSales[id]} sold)`);
      } catch {}
    }
    return {
      todayOrderCount: todayOrders.length,
      todayRevenue,
      monthRevenue,
      totalOrders: orders.length,
      cancelledOrders: orders.filter((o) => o.status === 'Cancelled').length,
      topProducts,
    };
  }

  async getVendorSettlements(userId: string) {
    const vendor = await this.vendorRepository.findOne({ userId: new Types.ObjectId(userId) });
    if (!vendor) return { settlements: [], totalEarnings: 0, commissionDeducted: 0, pendingSettlement: 0 };
    const settlements = await this.settlementRepository.find({ vendorId: vendor._id });
    const totalEarnings = settlements.reduce((sum, s) => sum + (s.amount || 0), 0);
    const pendingSettlement = settlements.filter(s => s.status === 'Pending').reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      settlements,
      totalEarnings,
      commissionDeducted: totalEarnings * (vendor.commissionRate / 100),
      pendingSettlement,
    };
  }

  async checkPriceAndStockAlerts(productId: string, currentPrice: number, currentStock: number) {
    const users = await this.userRepository.find({
      'priceAlerts.productId': productId,
    });
    for (const user of users) {
      let updated = false;
      const alerts = (user as any).priceAlerts || [];
      for (const alert of alerts) {
        if (alert.productId === productId && !alert.notified) {
          let trigger = false;
          let msg = '';
          const product = await this.productRepository.findById(productId);
          if (!product) continue;

          if ((!alert.type || alert.type === 'drop') && currentPrice <= alert.targetPrice) {
            trigger = true;
            msg = `Price Drop! The price of **${product.title}** has dropped to $${currentPrice.toFixed(2)}.`;
          }
          if (alert.type === 'restock' && currentStock > 0) {
            trigger = true;
            msg = `Back in stock! **${product.title}** is now available.`;
          }

          if (trigger) {
            alert.notified = true;
            updated = true;
            await this.notificationRepository.create({
              userId: user._id,
              title: 'Price & Stock Alert',
              message: msg,
              isRead: false,
              type: 'Alert',
            });
          }
        }
      }
      if (updated) {
        user.markModified('priceAlerts');
        await user.save();
      }
    }
  }
}
