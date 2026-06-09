import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { RecoveryService } from './recovery.service';
import { SettlementReleaseService } from './settlement-release.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, RecoveryService, SettlementReleaseService],
  exports: [SalesService, RecoveryService, SettlementReleaseService],
})
export class SalesModule {}
