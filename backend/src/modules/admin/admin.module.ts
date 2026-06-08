import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SalesModule } from '../sales/sales.module';
import { CatalogModule } from '../catalog/catalog.module';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [SalesModule, CatalogModule, RepositoriesModule],
  controllers: [AdminController],
})
export class AppAdminModule {}
