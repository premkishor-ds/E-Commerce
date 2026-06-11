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
  RefundTransaction,
  PaymentAuditLog,
  PaymentWebhookLog,
  AgentStatus,
  LiveChatSession,
  LedgerEntry,
  Warehouse,
  FileMetadata,
  AdminSession,
  SystemSetting,
  AuditLog,
  SearchLog,
  ActivityLog,
  ChatbotLog,
  AnalyticsCache,
  ApiLog,
  SecurityLog,
  LoginLog,
  ImportLog,
  ExportLog,
  GuestLog,
  ChangeHistory,
  FeedbackTicket,
  FeedbackComment,
  FeedbackAttachment,
  FeedbackVote,
  FeedbackActivityLog,
  RolePermission,
  UserRole,
  CmsPage,
  BlogPost,
  FaqCategory,
  FaqItem,
  MediaFolder,
  Announcement,
  FeatureFlag,
  Experiment,
  ExperimentResult,
  Webhook,
  WebhookLog,
  Integration,
  SeoSetting,
  Sitemap,
  RedirectRule,
  TaxRule,
  CommissionRule,
  FraudCase,
  InventoryForecast,
  Translation,
  Currency,
  PrivacyRequest,
  RetentionPolicy,
  BackupLog,
  CronLog,
  QueueLog,
  SystemHealthLog,
  AiUsageLog,
  AiFeedback,
  BulkJob,
  KnowledgeBaseArticle,
  RoadmapItem,
  Seller,
  SellerSettlement,
  OrderLog,
} from '../schemas/schemas';

@Injectable()
export class SellerRepository extends BaseRepository<Seller> {
  constructor(@InjectModel(Seller.name) model: Model<Seller>) {
    super(model);
  }
}

@Injectable()
export class SellerSettlementRepository extends BaseRepository<SellerSettlement> {
  constructor(@InjectModel(SellerSettlement.name) model: Model<SellerSettlement>) {
    super(model);
  }
}




@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }
}

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(@InjectModel(UserRole.name) model: Model<UserRole>) {
    super(model);
  }
}

// --- NEW SAAS ENTERPRISE MODULES (PHASE 21) REPOSITORIES ---

@Injectable()
export class FaqCategoryRepository extends BaseRepository<FaqCategory> {
  constructor(@InjectModel(FaqCategory.name) model: Model<FaqCategory>) { super(model); }
}

@Injectable()
export class FaqItemRepository extends BaseRepository<FaqItem> {
  constructor(@InjectModel(FaqItem.name) model: Model<FaqItem>) { super(model); }
}

@Injectable()
export class MediaFolderRepository extends BaseRepository<MediaFolder> {
  constructor(@InjectModel(MediaFolder.name) model: Model<MediaFolder>) { super(model); }
}

@Injectable()
export class AnnouncementRepository extends BaseRepository<Announcement> {
  constructor(@InjectModel(Announcement.name) model: Model<Announcement>) { super(model); }
}

@Injectable()
export class FeatureFlagRepository extends BaseRepository<FeatureFlag> {
  constructor(@InjectModel(FeatureFlag.name) model: Model<FeatureFlag>) { super(model); }
}

@Injectable()
export class ExperimentRepository extends BaseRepository<Experiment> {
  constructor(@InjectModel(Experiment.name) model: Model<Experiment>) { super(model); }
}

@Injectable()
export class ExperimentResultRepository extends BaseRepository<ExperimentResult> {
  constructor(@InjectModel(ExperimentResult.name) model: Model<ExperimentResult>) { super(model); }
}

@Injectable()
export class WebhookRepository extends BaseRepository<Webhook> {
  constructor(@InjectModel(Webhook.name) model: Model<Webhook>) { super(model); }
}

@Injectable()
export class WebhookLogRepository extends BaseRepository<WebhookLog> {
  constructor(@InjectModel(WebhookLog.name) model: Model<WebhookLog>) { super(model); }
}

@Injectable()
export class IntegrationRepository extends BaseRepository<Integration> {
  constructor(@InjectModel(Integration.name) model: Model<Integration>) { super(model); }
}

@Injectable()
export class SeoSettingRepository extends BaseRepository<SeoSetting> {
  constructor(@InjectModel(SeoSetting.name) model: Model<SeoSetting>) { super(model); }
}

@Injectable()
export class SitemapRepository extends BaseRepository<Sitemap> {
  constructor(@InjectModel(Sitemap.name) model: Model<Sitemap>) { super(model); }
}

@Injectable()
export class RedirectRuleRepository extends BaseRepository<RedirectRule> {
  constructor(@InjectModel(RedirectRule.name) model: Model<RedirectRule>) { super(model); }
}

@Injectable()
export class TaxRuleRepository extends BaseRepository<TaxRule> {
  constructor(@InjectModel(TaxRule.name) model: Model<TaxRule>) { super(model); }
}

@Injectable()
export class CommissionRuleRepository extends BaseRepository<CommissionRule> {
  constructor(@InjectModel(CommissionRule.name) model: Model<CommissionRule>) { super(model); }
}

@Injectable()
export class FraudCaseRepository extends BaseRepository<FraudCase> {
  constructor(@InjectModel(FraudCase.name) model: Model<FraudCase>) { super(model); }
}

@Injectable()
export class InventoryForecastRepository extends BaseRepository<InventoryForecast> {
  constructor(@InjectModel(InventoryForecast.name) model: Model<InventoryForecast>) { super(model); }
}

@Injectable()
export class TranslationRepository extends BaseRepository<Translation> {
  constructor(@InjectModel(Translation.name) model: Model<Translation>) { super(model); }
}

@Injectable()
export class CurrencyRepository extends BaseRepository<Currency> {
  constructor(@InjectModel(Currency.name) model: Model<Currency>) { super(model); }
}

@Injectable()
export class PrivacyRequestRepository extends BaseRepository<PrivacyRequest> {
  constructor(@InjectModel(PrivacyRequest.name) model: Model<PrivacyRequest>) { super(model); }
}

@Injectable()
export class RetentionPolicyRepository extends BaseRepository<RetentionPolicy> {
  constructor(@InjectModel(RetentionPolicy.name) model: Model<RetentionPolicy>) { super(model); }
}

@Injectable()
export class BackupLogRepository extends BaseRepository<BackupLog> {
  constructor(@InjectModel(BackupLog.name) model: Model<BackupLog>) { super(model); }
}

@Injectable()
export class CronLogRepository extends BaseRepository<CronLog> {
  constructor(@InjectModel(CronLog.name) model: Model<CronLog>) { super(model); }
}

@Injectable()
export class QueueLogRepository extends BaseRepository<QueueLog> {
  constructor(@InjectModel(QueueLog.name) model: Model<QueueLog>) { super(model); }
}

@Injectable()
export class SystemHealthLogRepository extends BaseRepository<SystemHealthLog> {
  constructor(@InjectModel(SystemHealthLog.name) model: Model<SystemHealthLog>) { super(model); }
}

@Injectable()
export class AiUsageLogRepository extends BaseRepository<AiUsageLog> {
  constructor(@InjectModel(AiUsageLog.name) model: Model<AiUsageLog>) { super(model); }
}

@Injectable()
export class AiFeedbackRepository extends BaseRepository<AiFeedback> {
  constructor(@InjectModel(AiFeedback.name) model: Model<AiFeedback>) { super(model); }
}

@Injectable()
export class BulkJobRepository extends BaseRepository<BulkJob> {
  constructor(@InjectModel(BulkJob.name) model: Model<BulkJob>) { super(model); }
}

@Injectable()
export class KnowledgeBaseArticleRepository extends BaseRepository<KnowledgeBaseArticle> {
  constructor(@InjectModel(KnowledgeBaseArticle.name) model: Model<KnowledgeBaseArticle>) { super(model); }
}

@Injectable()
export class RoadmapItemRepository extends BaseRepository<RoadmapItem> {
  constructor(@InjectModel(RoadmapItem.name) model: Model<RoadmapItem>) { super(model); }
}

@Injectable()
export class CmsPageRepository extends BaseRepository<CmsPage> {
  constructor(@InjectModel(CmsPage.name) model: Model<CmsPage>) {
    super(model);
  }
}

@Injectable()
export class BlogPostRepository extends BaseRepository<BlogPost> {
  constructor(@InjectModel(BlogPost.name) model: Model<BlogPost>) {
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
  constructor(
    @InjectModel(WalletTransaction.name) model: Model<WalletTransaction>,
  ) {
    super(model);
  }
}

@Injectable()
export class ReferralRepository extends BaseRepository<Referral> {
  constructor(@InjectModel(Referral.name) model: Model<Referral>) {
    super(model);
  }
}

@Injectable()
export class RefundTransactionRepository extends BaseRepository<RefundTransaction> {
  constructor(
    @InjectModel(RefundTransaction.name) model: Model<RefundTransaction>,
  ) {
    super(model);
  }
}

@Injectable()
export class PaymentAuditLogRepository extends BaseRepository<PaymentAuditLog> {
  constructor(
    @InjectModel(PaymentAuditLog.name) model: Model<PaymentAuditLog>,
  ) {
    super(model);
  }
}

@Injectable()
export class PaymentWebhookLogRepository extends BaseRepository<PaymentWebhookLog> {
  constructor(
    @InjectModel(PaymentWebhookLog.name) model: Model<PaymentWebhookLog>,
  ) {
    super(model);
  }
}

@Injectable()
export class AgentStatusRepository extends BaseRepository<AgentStatus> {
  constructor(@InjectModel(AgentStatus.name) model: Model<AgentStatus>) {
    super(model);
  }
}

@Injectable()
export class LiveChatSessionRepository extends BaseRepository<LiveChatSession> {
  constructor(
    @InjectModel(LiveChatSession.name) model: Model<LiveChatSession>,
  ) {
    super(model);
  }
}

@Injectable()
export class LedgerEntryRepository extends BaseRepository<LedgerEntry> {
  constructor(@InjectModel(LedgerEntry.name) model: Model<LedgerEntry>) {
    super(model);
  }
}

@Injectable()
export class WarehouseRepository extends BaseRepository<Warehouse> {
  constructor(@InjectModel(Warehouse.name) model: Model<Warehouse>) {
    super(model);
  }
}

@Injectable()
export class FileMetadataRepository extends BaseRepository<FileMetadata> {
  constructor(@InjectModel(FileMetadata.name) model: Model<FileMetadata>) {
    super(model);
  }
}

@Injectable()
export class AdminSessionRepository extends BaseRepository<AdminSession> {
  constructor(@InjectModel(AdminSession.name) model: Model<AdminSession>) {
    super(model);
  }
}

@Injectable()
export class SystemSettingRepository extends BaseRepository<SystemSetting> {
  constructor(@InjectModel(SystemSetting.name) model: Model<SystemSetting>) {
    super(model);
  }
}

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(@InjectModel(AuditLog.name) model: Model<AuditLog>) {
    super(model);
  }
}

@Injectable()
export class SearchLogRepository extends BaseRepository<SearchLog> {
  constructor(@InjectModel(SearchLog.name) model: Model<SearchLog>) {
    super(model);
  }
}

@Injectable()
export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor(@InjectModel(ActivityLog.name) model: Model<ActivityLog>) {
    super(model);
  }
}

@Injectable()
export class ChatbotLogRepository extends BaseRepository<ChatbotLog> {
  constructor(@InjectModel(ChatbotLog.name) model: Model<ChatbotLog>) {
    super(model);
  }
}

@Injectable()
export class AnalyticsCacheRepository extends BaseRepository<AnalyticsCache> {
  constructor(@InjectModel(AnalyticsCache.name) model: Model<AnalyticsCache>) {
    super(model);
  }
}

@Injectable()
export class ApiLogRepository extends BaseRepository<ApiLog> {
  constructor(@InjectModel(ApiLog.name) model: Model<ApiLog>) {
    super(model);
  }
}

@Injectable()
export class SecurityLogRepository extends BaseRepository<SecurityLog> {
  constructor(@InjectModel(SecurityLog.name) model: Model<SecurityLog>) {
    super(model);
  }
}

@Injectable()
export class LoginLogRepository extends BaseRepository<LoginLog> {
  constructor(@InjectModel(LoginLog.name) model: Model<LoginLog>) {
    super(model);
  }
}

@Injectable()
export class ImportLogRepository extends BaseRepository<ImportLog> {
  constructor(@InjectModel(ImportLog.name) model: Model<ImportLog>) {
    super(model);
  }
}

@Injectable()
export class ExportLogRepository extends BaseRepository<ExportLog> {
  constructor(@InjectModel(ExportLog.name) model: Model<ExportLog>) {
    super(model);
  }
}

@Injectable()
export class GuestLogRepository extends BaseRepository<GuestLog> {
  constructor(@InjectModel(GuestLog.name) model: Model<GuestLog>) {
    super(model);
  }
}

@Injectable()
export class ChangeHistoryRepository extends BaseRepository<ChangeHistory> {
  constructor(@InjectModel(ChangeHistory.name) model: Model<ChangeHistory>) {
    super(model);
  }
}

@Injectable()
export class FeedbackTicketRepository extends BaseRepository<FeedbackTicket> {
  constructor(@InjectModel(FeedbackTicket.name) model: Model<FeedbackTicket>) {
    super(model);
  }
}

@Injectable()
export class FeedbackCommentRepository extends BaseRepository<FeedbackComment> {
  constructor(@InjectModel(FeedbackComment.name) model: Model<FeedbackComment>) {
    super(model);
  }
}

@Injectable()
export class FeedbackAttachmentRepository extends BaseRepository<FeedbackAttachment> {
  constructor(@InjectModel(FeedbackAttachment.name) model: Model<FeedbackAttachment>) {
    super(model);
  }
}

@Injectable()
export class FeedbackVoteRepository extends BaseRepository<FeedbackVote> {
  constructor(@InjectModel(FeedbackVote.name) model: Model<FeedbackVote>) {
    super(model);
  }
}

@Injectable()
export class FeedbackActivityLogRepository extends BaseRepository<FeedbackActivityLog> {
  constructor(@InjectModel(FeedbackActivityLog.name) model: Model<FeedbackActivityLog>) {
    super(model);
  }
}

@Injectable()
export class OrderLogRepository extends BaseRepository<OrderLog> {
  constructor(@InjectModel(OrderLog.name) model: Model<OrderLog>) {
    super(model);
  }
}



