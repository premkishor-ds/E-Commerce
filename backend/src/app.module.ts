import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemasModule } from './schemas/schemas.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SalesModule } from './modules/sales/sales.module';
import { SupportModule } from './modules/support/support.module';
import { SeoModule } from './modules/seo/seo.module';
// AdminJS module disabled — @adminjs/nestjs package.json is broken (ERR_PACKAGE_PATH_NOT_EXPORTED)
// import { AppAdminModule } from './modules/admin/admin.module';
import { AgentModule } from './modules/agent/agent.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PaymentModule } from './modules/payment/payment.module';
import { VoiceModule } from './modules/voice/voice.module';
import { NotificationModule } from './modules/notification/notification.module';

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
    // AppAdminModule, // Disabled — @adminjs/nestjs package has broken exports
    AgentModule,
    ProfileModule,
    PaymentModule,
    VoiceModule,
    NotificationModule,
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
  ],
})
export class AppModule {}
