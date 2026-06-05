import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentMemoryService } from './agent.memory.service';
import {
  ChatSession,
  ChatSessionSchema,
  GuestProfile,
  GuestProfileSchema,
  UserMemory,
  UserMemorySchema,
} from './agent.schemas';
import { AuthModule } from '../auth/auth.module';
import { SalesModule } from '../sales/sales.module';
import { SupportModule } from '../support/support.module';
import { CatalogModule } from '../catalog/catalog.module';
import { ProfileModule } from '../profile/profile.module';
import { PaymentModule } from '../payment/payment.module';
import { VoiceModule } from '../voice/voice.module';
import { NotificationModule } from '../notification/notification.module';
import { ChatbotIntelligenceModule } from '../chatbot-intelligence/chatbot-intelligence.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
      { name: GuestProfile.name, schema: GuestProfileSchema },
      { name: UserMemory.name, schema: UserMemorySchema },
    ]),
    AuthModule,
    SalesModule,
    SupportModule,
    CatalogModule,
    ProfileModule,
    PaymentModule,
    VoiceModule,
    NotificationModule,
    ChatbotIntelligenceModule,
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentMemoryService],
  exports: [AgentService, AgentMemoryService],
})
export class AgentModule {}

