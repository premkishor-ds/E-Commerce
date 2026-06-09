import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemasModule } from './schemas/schemas.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SalesModule } from './modules/sales/sales.module';
import { SupportModule } from './modules/support/support.module';
import { SeoModule } from './modules/seo/seo.module';
import { AppAdminModule } from './modules/admin/admin.module';
import { AgentModule } from './modules/agent/agent.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PaymentModule } from './modules/payment/payment.module';
import { VoiceModule } from './modules/voice/voice.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ApiLoggerMiddleware } from './modules/admin/api-logger.middleware';
import { XssSanitizerMiddleware } from './common/middleware/xss-sanitizer.middleware';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { AuditInterceptor } from './modules/admin/audit.interceptor';
import { RetryInterceptor } from './modules/admin/retry.interceptor';
import { CmsModule } from './modules/cms/cms.module';
import { BlogModule } from './modules/blog/blog.module';
import { MediaModule } from './modules/media/media.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { TaxModule } from './modules/tax/tax.module';
import { CommissionModule } from './modules/commission/commission.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { GdprModule } from './modules/gdpr/gdpr.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { SystemHealthModule } from './modules/system-health/system-health.module';
import { SellerProfileModule } from './modules/seller-profile/seller-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net',
      }),
      inject: [ConfigService],
    }),
    SchemasModule,
    RepositoriesModule,
    AuthModule,
    CatalogModule,
    SalesModule,
    SupportModule,
    SeoModule,
    AppAdminModule,
    AgentModule,
    ProfileModule,
    PaymentModule,
    VoiceModule,
    NotificationModule,
    FeedbackModule,
    RbacModule,
    CmsModule,
    BlogModule,
    MediaModule,
    AnnouncementsModule,
    FeatureFlagsModule,
    WebhooksModule,
    TaxModule,
    CommissionModule,
    FraudModule,
    GdprModule,
    RoadmapModule,
    KnowledgeBaseModule,
    SystemHealthModule,
    SellerProfileModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100000,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RetryInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiLoggerMiddleware, XssSanitizerMiddleware).forRoutes('*');
  }
}
