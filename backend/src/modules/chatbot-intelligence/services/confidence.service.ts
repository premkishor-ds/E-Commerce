import { Injectable } from '@nestjs/common';

export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';

@Injectable()
export class ConfidenceService {
  getTier(score: number): ConfidenceTier {
    if (score >= 0.7) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  }
}
