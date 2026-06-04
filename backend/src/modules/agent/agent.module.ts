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
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentMemoryService],
  exports: [AgentService, AgentMemoryService],
})
export class AgentModule {}
