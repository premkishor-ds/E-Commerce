import { Injectable } from '@nestjs/common';
import { SemanticSearchService } from './semantic-search.service';

export interface GoalDetectionResult {
  primaryGoal: string;
  primaryIntent: string;
  secondaryGoal?: string;
  secondaryIntent?: string;
  confidence: number;
}

@Injectable()
export class GoalDetectionService {
  constructor(private readonly semanticSearch: SemanticSearchService) {}

  detectGoals(query: string): GoalDetectionResult {
    // Check for conjunctions to detect multi-intent
    const conjoiningRegex = /\b(and|then|also|plus|but)\b/i;
    if (conjoiningRegex.test(query)) {
      const parts = query.split(conjoiningRegex).map(p => p.trim()).filter(p => p.length > 2);
      if (parts.length >= 2) {
        const firstMatch = this.semanticSearch.search(parts[0], 1)[0];
        const secondMatch = this.semanticSearch.search(parts[1], 1)[0];

        if (firstMatch && secondMatch && firstMatch.goal !== secondMatch.goal) {
          return {
            primaryGoal: firstMatch.goal,
            primaryIntent: firstMatch.intent,
            secondaryGoal: secondMatch.goal,
            secondaryIntent: secondMatch.intent,
            confidence: (firstMatch.score + secondMatch.score) / 2,
          };
        }
      }
    }

    const matches = this.semanticSearch.search(query, 2);
    if (matches.length > 0) {
      return {
        primaryGoal: matches[0].goal,
        primaryIntent: matches[0].intent,
        confidence: matches[0].score,
        secondaryGoal: matches[1] && matches[1].score > 0.3 ? matches[1].goal : undefined,
        secondaryIntent: matches[1] && matches[1].score > 0.3 ? matches[1].intent : undefined,
      };
    }

    return {
      primaryGoal: 'HELP',
      primaryIntent: 'HELP',
      confidence: 0,
    };
  }
}
