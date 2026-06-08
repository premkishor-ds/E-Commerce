import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SalesModule } from '../sales/sales.module';
import { CatalogModule } from '../catalog/catalog.module';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { ChatSession, ChatSessionSchema } from '../agent/agent.schemas';

@Module({
  imports: [
    SalesModule,
    CatalogModule,
    RepositoriesModule,
    MongooseModule.forFeature([{ name: ChatSession.name, schema: ChatSessionSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AppAdminModule {}
