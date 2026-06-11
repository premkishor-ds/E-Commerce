import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { RecoveryService } from './recovery.service';
import { SettlementReleaseService } from './settlement-release.service';
import { IntegrityService } from './integrity.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, RecoveryService, SettlementReleaseService, IntegrityService],
  exports: [SalesService, RecoveryService, SettlementReleaseService, IntegrityService],
})
export class SalesModule {}

