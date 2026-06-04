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
}
