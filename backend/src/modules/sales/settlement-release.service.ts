import { Injectable, OnModuleInit } from '@nestjs/common';
import { SettlementRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class SettlementReleaseService implements OnModuleInit {
  constructor(
    private readonly settlementRepository: SettlementRepository,
  ) {}

  onModuleInit() {
    // Run initial release check on startup, then poll hourly
    this.releaseSettlements().catch((e) =>
      console.error('Initial auto-release escrow settlements failed:', e),
    );

    setInterval(() => {
      this.releaseSettlements().catch((e) =>
        console.error('Error auto-releasing escrow settlements:', e),
      );
    }, 3600000);
  }

  async releaseSettlements() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const pendingSettlements = await this.settlementRepository.find({ status: 'Pending' });
    let count = 0;

    for (const settlement of pendingSettlements) {
      if (settlement.createdAt && settlement.createdAt < sevenDaysAgo) {
        settlement.status = 'Completed';
        await settlement.save();
        count++;
      }
    }

    if (count > 0) {
      console.log(`[Escrow Release] Automatically completed ${count} pending escrow settlements.`);
    }
  }
}
