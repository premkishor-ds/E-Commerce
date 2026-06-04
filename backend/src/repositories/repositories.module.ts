import { Module, Global } from '@nestjs/common';
import { SchemasModule } from '../schemas/schemas.module';
import {
  UserRepository,
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  ProductRepository,
  CartRepository,
  WishlistRepository,
  CouponRepository,
  OrderRepository,
  PaymentRepository,
  ReviewRepository,
  TicketRepository,
  NotificationRepository,
  LogRepository,
  VendorRepository,
  SettlementRepository,
  AnalyticsRepository,
  AddressRepository,
  PaymentMethodRepository,
  WalletTransactionRepository,
  ReferralRepository,
} from './concrete.repositories';

const REPOSITORIES = [
  UserRepository,
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  ProductRepository,
  CartRepository,
  WishlistRepository,
  CouponRepository,
  OrderRepository,
  PaymentRepository,
  ReviewRepository,
  TicketRepository,
  NotificationRepository,
  LogRepository,
  VendorRepository,
  SettlementRepository,
  AnalyticsRepository,
  AddressRepository,
  PaymentMethodRepository,
  WalletTransactionRepository,
  ReferralRepository,
];

@Global()
@Module({
  imports: [SchemasModule],
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class RepositoriesModule {}
