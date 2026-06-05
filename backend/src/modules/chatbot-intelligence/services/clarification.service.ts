import { Injectable } from '@nestjs/common';
import { IntelligenceLoaderService } from './intelligence-loader.service';

@Injectable()
export class ClarificationService {
  constructor(private readonly loader: IntelligenceLoaderService) {}

  checkClarification(goal: string, context: Record<string, any>): { needsClarification: boolean; question?: string } {
    const goalDef = this.loader.getGoal(goal);
    if (!goalDef || goalDef.clarificationRules.length === 0) {
      return { needsClarification: false };
    }

    for (const rule of goalDef.clarificationRules) {
      const missingEntity = rule.missingEntity.toLowerCase();

      // Check if this rule applies (e.g. "Brand only, no type" -> check if we have brand but not type)
      if (missingEntity.includes('brand only') && context.brand && !context.productType) {
        return {
          needsClarification: true,
          question: rule.clarification.replace('[brand]', context.brand),
        };
      }

      if (missingEntity.includes('no budget') && !context.budget) {
        return {
          needsClarification: true,
          question: rule.clarification,
        };
      }

      if (missingEntity.includes('vague query') && Object.keys(context).length === 0) {
        return {
          needsClarification: true,
          question: rule.clarification,
        };
      }
    }

    return { needsClarification: false };
  }
}
