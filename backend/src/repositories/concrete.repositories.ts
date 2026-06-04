import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import {
  User,
  Category,
  Brand,
  Inventory,
  Product,
  Cart,
  Wishlist,
  Coupon,
  Order,
  Payment,
  Review,
  Ticket,
  Notification,
  Log,
  Vendor,
  Settlement,
  Analytics,
  Address,
  PaymentMethod,
  WalletTransaction,
  Referral,
} from '../schemas/schemas';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }
}

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(@InjectModel(Category.name) model: Model<Category>) {
    super(model);
  }
}

@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(@InjectModel(Brand.name) model: Model<Brand>) {
    super(model);
  }
}

@Injectable()
export class InventoryRepository extends BaseRepository<Inventory> {
  constructor(@InjectModel(Inventory.name) model: Model<Inventory>) {
    super(model);
  }
}

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@InjectModel(Product.name) model: Model<Product>) {
    super(model);
  }
}

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
  constructor(@InjectModel(Cart.name) model: Model<Cart>) {
    super(model);
  }
}

@Injectable()
export class WishlistRepository extends BaseRepository<Wishlist> {
  constructor(@InjectModel(Wishlist.name) model: Model<Wishlist>) {
    super(model);
  }
}

@Injectable()
export class CouponRepository extends BaseRepository<Coupon> {
  constructor(@InjectModel(Coupon.name) model: Model<Coupon>) {
    super(model);
  }
}

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(@InjectModel(Order.name) model: Model<Order>) {
    super(model);
  }
}

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(@InjectModel(Payment.name) model: Model<Payment>) {
    super(model);
  }
}

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(@InjectModel(Review.name) model: Model<Review>) {
    super(model);
  }
}

@Injectable()
export class TicketRepository extends BaseRepository<Ticket> {
  constructor(@InjectModel(Ticket.name) model: Model<Ticket>) {
    super(model);
  }
}

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(@InjectModel(Notification.name) model: Model<Notification>) {
    super(model);
  }
}

@Injectable()
export class LogRepository extends BaseRepository<Log> {
  constructor(@InjectModel(Log.name) model: Model<Log>) {
    super(model);
  }
}

@Injectable()
export class VendorRepository extends BaseRepository<Vendor> {
  constructor(@InjectModel(Vendor.name) model: Model<Vendor>) {
    super(model);
  }
}

@Injectable()
export class SettlementRepository extends BaseRepository<Settlement> {
  constructor(@InjectModel(Settlement.name) model: Model<Settlement>) {
    super(model);
  }
}

@Injectable()
export class AnalyticsRepository extends BaseRepository<Analytics> {
  constructor(@InjectModel(Analytics.name) model: Model<Analytics>) {
    super(model);
  }
}

@Injectable()
export class AddressRepository extends BaseRepository<Address> {
  constructor(@InjectModel(Address.name) model: Model<Address>) {
    super(model);
  }
}

@Injectable()
export class PaymentMethodRepository extends BaseRepository<PaymentMethod> {
  constructor(@InjectModel(PaymentMethod.name) model: Model<PaymentMethod>) {
    super(model);
  }
}

@Injectable()
export class WalletTransactionRepository extends BaseRepository<WalletTransaction> {
  constructor(@InjectModel(WalletTransaction.name) model: Model<WalletTransaction>) {
    super(model);
  }
}

@Injectable()
export class ReferralRepository extends BaseRepository<Referral> {
  constructor(@InjectModel(Referral.name) model: Model<Referral>) {
    super(model);
  }
}
