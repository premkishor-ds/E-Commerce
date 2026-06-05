import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, UploadService],
  exports: [CatalogService, UploadService],
})
export class CatalogModule {}

