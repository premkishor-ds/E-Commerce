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
  LedgerEntryRepository,
  OrderLogRepository,
} from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';
import { createHash } from 'crypto';

function safeObjectId(id: string | Types.ObjectId): Types.ObjectId {
  if (!id) return new Types.ObjectId();
  if (id instanceof Types.ObjectId) return id;
  if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
  const hash = createHash('md5').update(String(id)).digest('hex').substring(0, 24);
  return new Types.ObjectId(hash);
}

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
    private readonly ledgerEntryRepository: LedgerEntryRepository,
    private readonly orderLogRepository: OrderLogRepository,
  ) {}

  // CART
  private async logOrderAction(orderId: string, action: string, performedBy: string, details: any = {}, session?: any) {
    const data = {
      orderId: new Types.ObjectId(orderId),
      action,
      performedBy,
      details,
    };
    if (session) {
      await this.orderLogRepository['model'].create([data], { session });
    } else {
      await this.orderLogRepository.create(data);
    }
  }

  async getCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      userId: safeObjectId(userId),
    });
    if (!cart) {
      cart = await this.cartRepository.create({
        userId: safeObjectId(userId),
        items: [],
      });
    }
    console.log(`[DEBUG_CART] getCart: userId=${userId} items=${JSON.stringify(cart.items)}`);
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    console.log(`[DEBUG_CART] addToCart: before itemIndex=${itemIndex} quantity=${quantity} items=${JSON.stringify(cart.items)}`);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.markModified('items');
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }
    const saved = await cart.save();
    console.log(`[DEBUG_CART] addToCart: after saved items=${JSON.stringify(saved.items)}`);
    return saved;
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    return cart.save();
  }

  async updateCartQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) throw new NotFoundException('Item not in cart');
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.markModified('items');
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
      variantKey: i.variantKey || '',
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
        const product = await this.productRepository.findById(
          item.productId.toString(),
        );
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
      } catch {
        /* ignore */
      }
    }
    const total = populated.reduce((sum, i) => sum + i.subtotal, 0);
    return { items: populated, total, itemCount: populated.length };
  }

  // WISHLIST
  async getWishlist(userId: string) {
    let wishlist = await this.wishlistRepository.findOne({
      userId: safeObjectId(userId),
    });
    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({
        userId: safeObjectId(userId),
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
      } catch {
        /* ignore */
      }
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
        const product = await this.productRepository.findById(
          productId.toString(),
        );
        if (product) populated.push(product);
      } catch {
        /* ignore */
      }
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
    let session: any = null;
    try {
      session = await this.orderRepository['model'].db.startSession();
      session.startTransaction();
    } catch (e) {
      // Fallback if transaction is not supported (e.g. single node dev server)
      console.warn('MongoDB session/transaction not supported on this instance. Running without transaction.');
    }

    try {
      // dto contains: items: [{productId, quantity}], shippingAddress, couponCode (optional), guestId (optional)
      let discount = 0;
      let subtotal = 0;
      const itemsWithPrices = [];

      for (const item of dto.items) {
        let productQuery = this.productRepository['model'].findById(item.productId);
        if (session && typeof productQuery.session === 'function') {
          productQuery = productQuery.session(session);
        }
        const product = await productQuery.exec();
        if (!product)
          throw new NotFoundException(`Product ${item.productId} not found`);

        // Check Inventory stock
        let inventoryQuery = this.inventoryRepository['model'].findOne({
          sku: product.sku,
        });
        if (session && typeof inventoryQuery.session === 'function') {
          inventoryQuery = inventoryQuery.session(session);
        }
        const inventory = await inventoryQuery.exec();
        if (!inventory || inventory.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.title}`,
          );
        }

        // Reserve Stock
        inventory.stock -= item.quantity;
        inventory.reservedStock = (inventory.reservedStock || 0) + item.quantity;
        inventory.logs.push({
          quantityChanged: -item.quantity,
          reason: 'Order Placement - Stock Reserved',
          timestamp: new Date(),
        });
        
        if (session && typeof inventory.save === 'function') {
          await inventory.save({ session });
        } else {
          await inventory.save();
        }

        subtotal += product.price * item.quantity;
        itemsWithPrices.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        // Track vendor commission calculation triggers
        if (product.vendorId) {
          let vendorQuery = this.vendorRepository['model'].findOne({
            userId: product.vendorId,
          });
          if (session && typeof vendorQuery.session === 'function') {
            vendorQuery = vendorQuery.session(session);
          }
          const vendor = await vendorQuery.exec();
          if (vendor) {
            const settlementAmount =
              product.price * item.quantity * (1 - vendor.commissionRate / 100);
            const settlementData = {
              vendorId: vendor._id,
              amount: settlementAmount,
              status: 'Pending',
              processedAt: new Date(),
            };
            if (session && typeof this.settlementRepository['model'].create === 'function') {
              await this.settlementRepository['model'].create([settlementData], { session });
            } else {
              await this.settlementRepository.create(settlementData);
            }
          }
        }
      }

      if (dto.couponCode) {
        try {
          let couponQuery = this.couponRepository['model'].findOne({
            code: dto.couponCode,
            isActive: true,
          });
          if (session && typeof couponQuery.session === 'function') {
            couponQuery = couponQuery.session(session);
          }
          const coupon = await couponQuery.exec();
          if (!coupon || coupon.expiresAt < new Date() || subtotal < coupon.minPurchase) {
            throw new Error();
          }
          if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.value) / 100;
          } else if (coupon.discountType === 'fixed') {
            discount = coupon.value;
          }
        } catch {
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
        orderData.userId = safeObjectId(userId);
      } else if (dto.guestId) {
        orderData.guestId = dto.guestId;
        orderData.isGuestOrder = true;
      }

      let order: any;
      if (session && typeof this.orderRepository['model'].create === 'function') {
        const orders = await this.orderRepository['model'].create([orderData], { session });
        order = orders[0];
      } else {
        order = await this.orderRepository.create(orderData);
      }

      // Create payment entry
      const paymentData = {
        orderId: order._id,
        amount: total,
        provider: dto.paymentProvider || 'Stripe',
        status: 'Pending',
        transactionId:
          'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      };
      if (session && typeof this.paymentRepository['model'].create === 'function') {
        await this.paymentRepository['model'].create([paymentData], { session });
      } else {
        await this.paymentRepository.create(paymentData);
      }

      // Empty User/Guest Cart if logged in or guest
      const ownerId = userId || dto.guestId;
      if (ownerId) {
        let cartQuery = this.cartRepository['model'].findOneAndUpdate(
          { userId: safeObjectId(ownerId) },
          { $set: { items: [] } }
        );
        if (session && typeof cartQuery.session === 'function') {
          cartQuery = cartQuery.session(session);
        }
        await cartQuery.exec();
      }

      // Log order creation
      await this.logOrderAction(
        order._id.toString(),
        'Created',
        userId || 'Guest',
        { totalPrice: total },
        session
      );

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      return order;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }

  async getOrders(userId: string) {
    return this.orderRepository.find({ userId: safeObjectId(userId) });
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
    const saved = await order.save();
    await this.logOrderAction(id, 'Status_Updated', 'System', { status, note });
    await this.updateProductSalesStats(id);
    return saved;
  }

  private async updateProductSalesStats(orderId: string) {
    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) return;
      for (const item of order.items) {
        const product = await this.productRepository.findById(item.productId.toString());
        if (product) {
          // Aggregate all paid/delivered/shipped orders containing this product to get real units sold
          const orderList = await this.orderRepository.find({
            'items.productId': product._id,
            status: { $in: ['Paid', 'Delivered', 'Shipped'] },
          });
          const totalUnitsSold = orderList.reduce((sum: number, o: any) => {
            const match = o.items.find((i: any) => i.productId.toString() === product._id.toString());
            return sum + (match ? match.quantity : 0);
          }, 0);

          await this.productRepository.update(product._id.toString(), {
            totalUnitsSold,
            salesCount: totalUnitsSold,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to update product sales stats:', err.message);
    }
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.getOrderById(id);
    if (String((order as any).userId) !== userId)
      throw new BadRequestException('Unauthorized');
    if (!['Pending', 'Paid'].includes(order.status)) {
      throw new BadRequestException(
        `Order in ${order.status} state cannot be cancelled`,
      );
    }

    let session: any = null;
    try {
      session = await this.orderRepository['model'].db.startSession();
      session.startTransaction();
    } catch (e) {
      console.warn('MongoDB session/transaction not supported on this instance. Running without transaction.');
    }

    try {
      const orderModel = this.orderRepository['model'];
      const paymentModel = this.paymentRepository['model'];
      const ledgerModel = this.ledgerEntryRepository['model'];

      let currentOrder = await orderModel.findById(id);
      if (session) {
        currentOrder = await orderModel.findById(id).session(session);
      }
      if (!currentOrder) {
        throw new NotFoundException('Order not found');
      }

      const previousStatus = currentOrder.status;
      currentOrder.status = 'Cancelled';
      currentOrder.statusHistory.push({
        status: 'Cancelled',
        changedAt: new Date(),
        note: 'Cancelled by customer via chatbot',
      });

      if (session) {
        await currentOrder.save({ session });
      } else {
        await currentOrder.save();
      }

      if (previousStatus === 'Paid') {
        let paymentQuery = paymentModel.findOne({ orderId: currentOrder._id });
        if (session) {
          paymentQuery = paymentQuery.session(session);
        }
        const payment = await paymentQuery.exec();
        const provider = payment?.provider || 'Cash';
        const toAccount = provider === 'Wallet' ? 'Wallet' : 'Cash';
        const txnId = payment?.transactionId || `TXN-CANCEL-${currentOrder._id}`;
        const amount = currentOrder.totalPrice;

        const ledgerDataDebit = {
          userId: new Types.ObjectId(userId),
          amount: Math.abs(amount),
          entryType: 'Debit',
          accountName: toAccount,
          transactionId: txnId,
          description: `Reversal for Cancelled Order #${currentOrder._id.toString().slice(-6)}`,
        };
        const ledgerDataCredit = {
          userId: new Types.ObjectId(userId),
          amount: -Math.abs(amount),
          entryType: 'Credit',
          accountName: 'Revenue',
          transactionId: txnId,
          description: `Reversal for Cancelled Order #${currentOrder._id.toString().slice(-6)}`,
        };

        if (session) {
          await ledgerModel.create([ledgerDataDebit, ledgerDataCredit], { session });
        } else {
          await this.ledgerEntryRepository.create(ledgerDataDebit);
          await this.ledgerEntryRepository.create(ledgerDataCredit);
        }
      }

      await this.logOrderAction(
        id,
        'Cancelled',
        userId,
        { note: 'Cancelled by customer via chatbot' },
        session
      );

      // Restore/release stock on cancellation
      const productModel = this.productRepository['model'];
      const inventoryModel = this.inventoryRepository['model'];
      for (const item of currentOrder.items) {
        let product = await productModel.findById(item.productId);
        if (session) {
          product = await productModel.findById(item.productId).session(session);
        }
        if (!product) continue;

        let inventory = await inventoryModel.findOne({ sku: product.sku });
        if (session) {
          inventory = await inventoryModel.findOne({ sku: product.sku }).session(session);
        }
        if (inventory) {
          if (previousStatus === 'Pending') {
            inventory.stock += item.quantity;
            inventory.reservedStock = Math.max(0, (inventory.reservedStock || 0) - item.quantity);
            inventory.logs.push({
              quantityChanged: item.quantity,
              reason: `Order Cancelled - Reservation Released for Order #${currentOrder._id.toString().slice(-6)}`,
              timestamp: new Date(),
            });
          } else if (previousStatus === 'Paid') {
            inventory.stock += item.quantity;
            inventory.logs.push({
              quantityChanged: item.quantity,
              reason: `Order Cancelled - Stock Returned for Order #${currentOrder._id.toString().slice(-6)}`,
              timestamp: new Date(),
            });
          }
          if (session) {
            await inventory.save({ session });
          } else {
            await inventory.save();
          }
        }
      }

      await this.updateProductSalesStats(id);

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }
      return currentOrder;
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      throw error;
    }
  }

  async updateOrderAddress(orderId: string, userId: string, newAddress: any) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId)
      throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException(
        'Can only change address for Pending orders',
      );
    }
    (order as any).shippingAddress = newAddress;
    const saved = await (order as any).save();
    await this.logOrderAction(orderId, 'Address_Changed', userId, { newAddress });
    return saved;
  }

  async updateOrderDeliverySlot(orderId: string, userId: string, slot: string) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId)
      throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException(
        'Can only change delivery slot for Pending orders',
      );
    }
    order.deliverySlot = slot;
    const saved = await order.save();
    await this.logOrderAction(orderId, 'DeliverySlot_Changed', userId, { slot });
    return saved;
  }

  async updateOrderPaymentMethod(
    orderId: string,
    userId: string,
    paymentMethod: string,
  ) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId)
      throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException(
        'Can only change payment method for Pending orders',
      );
    }
    const payment = await this.paymentRepository.findOne({
      orderId: new Types.ObjectId(orderId),
    });
    if (payment) {
      payment.provider = paymentMethod;
      await payment.save();
    }
    const saved = await order.save();
    await this.logOrderAction(orderId, 'PaymentMethod_Changed', userId, { paymentMethod });
    return saved;
  }

  async updateOrderItemQuantity(
    orderId: string,
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const order = await this.getOrderById(orderId);
    if (String((order as any).userId) !== userId)
      throw new BadRequestException('Unauthorized');
    if (order.status !== 'Pending') {
      throw new BadRequestException('Can only modify items for Pending orders');
    }

    const itemIndex = order.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1)
      throw new NotFoundException('Item not found in order');

    const item = order.items[itemIndex];
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const qtyDiff = quantity - item.quantity;

    if (qtyDiff !== 0) {
      const inventory = await this.inventoryRepository.findOne({
        sku: product.sku,
      });
      if (inventory) {
        if (qtyDiff > 0 && inventory.stock < qtyDiff) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.title}`,
          );
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
      order.statusHistory.push({
        status: 'Cancelled',
        changedAt: new Date(),
        note: 'Order cancelled due to item removal.',
      });
    } else {
      order.tax = subtotal * 0.08;
      order.totalPrice = subtotal + order.tax - (order.discount || 0);
      if (order.totalPrice < 0) order.totalPrice = 0;
    }

    const payment = await this.paymentRepository.findOne({
      orderId: new Types.ObjectId(orderId),
    });
    if (payment) {
      payment.amount = order.totalPrice;
      if (order.items.length === 0) {
        payment.status = 'Failed';
      }
      await payment.save();
    }

    const saved = await order.save();
    await this.logOrderAction(orderId, 'Item_Modified', userId, { productId, quantity });
    return saved;
  }

  async getAllOrders(filters: any = {}) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    return this.orderRepository.find(query);
  }

  // REVIEWS
  async createReview(
    userId: string,
    dto: {
      productId: string;
      rating: number;
      comment: string;
      images?: string[];
      videos?: string[];
    },
  ) {
    // Basic AI sentiment check
    const commentLower = (dto.comment || '').toLowerCase();
    let sentiment = 'Neutral';
    if (/great|good|excellent|amazing|love|perfect|best/i.test(commentLower))
      sentiment = 'Positive';
    if (/bad|worst|awful|broke|terrible|waste|poor/i.test(commentLower))
      sentiment = 'Negative';

    // AI Fake review detection simulation
    let fakeScore = 10; // low default
    if (
      commentLower.length < 10 ||
      /click here|buy this now|cheap price/i.test(commentLower)
    ) {
      fakeScore = 80; // suspicious spam
    }

    // Verified purchase check: check if user has a paid or delivered order containing this product
    const orders = await this.orderRepository.find({
      userId: new Types.ObjectId(userId),
      status: { $in: ['Paid', 'Delivered', 'Shipped'] },
    });
    const verifiedPurchase = orders.some((order) =>
      order.items.some((item) => item.productId.toString() === dto.productId),
    );

    if (!verifiedPurchase) {
      throw new BadRequestException(
        'You can only review products that you have purchased and paid for.',
      );
    }

    const existing = await this.reviewRepository.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(dto.productId),
    });

    if (existing) {
      existing.rating = dto.rating;
      existing.comment = dto.comment;
      existing.images = dto.images || [];
      existing.videos = dto.videos || [];
      existing.sentiment = sentiment;
      existing.fakeScore = fakeScore;
      existing.verifiedPurchase = verifiedPurchase;
      const saved = await existing.save();
      await this.updateProductReviewStats(dto.productId);
      return saved;
    }

    const review = await this.reviewRepository.create({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(dto.productId),
      rating: dto.rating,
      comment: dto.comment,
      verifiedPurchase,
      status: fakeScore > 75 ? 'Flagged' : 'Approved',
      images: dto.images || [],
      videos: dto.videos || [],
      sentiment,
      fakeScore,
      likesCount: 0,
      likedBy: [],
      replies: [],
      reportsCount: 0,
    });

    await this.updateProductReviewStats(dto.productId);
    return review;
  }

  private async updateProductReviewStats(productId: string) {
    try {
      const reviews = await this.reviewRepository.find({
        productId: new Types.ObjectId(productId),
        status: 'Approved',
      });
      const reviewCount = reviews.length;
      const averageRating = reviewCount > 0
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10
        : 0;
      await this.productRepository.update(productId, {
        averageRating,
        reviewCount,
      });
    } catch (err) {
      console.warn('Failed to update product review stats:', err.message);
    }
  }

  async getProductReviews(
    productId: string,
    filters: { rating?: number; verified?: boolean; filter?: string },
  ) {
    const query: any = {
      productId: new Types.ObjectId(productId),
      status: 'Approved',
    };
    if (filters.rating) query.rating = filters.rating;
    if (filters.verified) query.verifiedPurchase = true;
    if (filters.filter === 'positive') query.rating = { $gte: 4 };
    if (filters.filter === 'negative') query.rating = { $lte: 2 };
    return this.reviewRepository.find(query);
  }

  async likeReview(reviewId: string, userId: string) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const uId = new Types.ObjectId(userId);
    const hasLiked = review.likedBy.some((id) => id.toString() === userId);

    if (hasLiked) {
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId);
      review.likesCount = Math.max(0, review.likesCount - 1);
    } else {
      review.likedBy.push(uId);
      review.likesCount += 1;
    }
    return review.save();
  }

  async replyToReview(reviewId: string, senderId: string, reply: string) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.replies.push({
      senderId: new Types.ObjectId(senderId),
      reply,
      repliedAt: new Date(),
    });
    return review.save();
  }

  async reportReview(reviewId: string) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.reportsCount += 1;
    if (review.reportsCount >= 5) {
      review.status = 'Flagged';
    }
    const saved = await review.save();
    await this.updateProductReviewStats(review.productId.toString());
    return saved;
  }

  async moderateReview(reviewId: string, status: 'Approved' | 'Rejected') {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.status = status;
    const saved = await review.save();
    await this.updateProductReviewStats(review.productId.toString());
    return saved;
  }

  async getReviewSummary(productId: string) {
    const reviews = await this.reviewRepository.find({
      productId: new Types.ObjectId(productId),
      status: 'Approved',
    });
    if (reviews.length === 0) return { summary: 'No approved reviews yet.' };

    const total = reviews.length;
    const positive = reviews.filter((r) => r.sentiment === 'Positive').length;
    const negative = reviews.filter((r) => r.sentiment === 'Negative').length;

    const positivePercent = Math.round((positive / total) * 100);
    const summaryText = `Based on ${total} customer reviews, the product has a ${positivePercent}% positive sentiment. Customers frequently praise the build quality and design, while ${negative} reviewers noted issues with shipping or package damage. Overall, highly recommended.`;

    return {
      summary: summaryText,
      totalReviews: total,
      positiveCount: positive,
      negativeCount: negative,
    };
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
    const todayOrders = orders.filter(
      (o: any) => new Date(o.createdAt) >= today && o.status !== 'Cancelled',
    );
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = orders.filter(
      (o: any) =>
        new Date(o.createdAt) >= monthStart && o.status !== 'Cancelled',
    );
    const todayRevenue = todayOrders.reduce(
      (s, o) => s + (o.totalPrice || 0),
      0,
    );
    const monthRevenue = monthOrders.reduce(
      (s, o) => s + (o.totalPrice || 0),
      0,
    );
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
        if (p)
          topProducts.push(`${(p as any).title} (${productSales[id]} sold)`);
      } catch {
        /* ignore */
      }
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
    const vendor = await this.vendorRepository.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!vendor)
      return {
        settlements: [],
        totalEarnings: 0,
        commissionDeducted: 0,
        pendingSettlement: 0,
      };
    const settlements = await this.settlementRepository.find({
      vendorId: vendor._id,
    });
    const totalEarnings = settlements.reduce(
      (sum, s) => sum + (s.amount || 0),
      0,
    );
    const pendingSettlement = settlements
      .filter((s) => s.status === 'Pending')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      settlements,
      totalEarnings,
      commissionDeducted: totalEarnings * (vendor.commissionRate / 100),
      pendingSettlement,
    };
  }

  async checkPriceAndStockAlerts(
    productId: string,
    currentPrice: number,
    currentStock: number,
  ) {
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

          if (
            (!alert.type || alert.type === 'drop') &&
            currentPrice <= alert.targetPrice
          ) {
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
