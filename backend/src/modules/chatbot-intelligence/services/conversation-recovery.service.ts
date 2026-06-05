import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationRecoveryService {
  handleRecovery(query: string, context: Record<string, any>): { recovered: boolean; updatedContext?: Record<string, any> } {
    const lower = query.toLowerCase();

    if (lower === 'no' || lower === 'not that' || lower === 'different one') {
      // Clear product specific details or selections to retry
      const updated = { ...context };
      delete updated.productId;
      delete updated.product;
      return { recovered: true, updatedContext: updated };
    }

    if (lower.includes('cheaper') || lower.includes('less price')) {
      const updated = { ...context };
      updated.sort = 'cheapest';
      if (updated.budget) {
        updated.budget = String(Math.floor(Number(updated.budget) * 0.8));
      }
      return { recovered: true, updatedContext: updated };
    }

    if (lower.includes('better camera') || lower.includes('camera')) {
      const updated = { ...context };
      updated.feature = 'camera';
      return { recovered: true, updatedContext: updated };
    }

    if (lower.includes('show more') || lower.includes('other options') || lower.includes('more')) {
      const updated = { ...context };
      updated.page = String((Number(updated.page) || 1) + 1);
      return { recovered: true, updatedContext: updated };
    }

    return { recovered: false };
  }
}
