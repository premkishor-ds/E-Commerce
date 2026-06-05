import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { RecoveryService } from './recovery.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, RecoveryService],
  exports: [SalesService, RecoveryService],
})
export class SalesModule {}
