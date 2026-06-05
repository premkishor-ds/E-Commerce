import { Injectable } from '@nestjs/common';
import { IntelligenceLoaderService } from './intelligence-loader.service';

@Injectable()
export class SemanticSearchService {
  constructor(private readonly loader: IntelligenceLoaderService) {}

  search(query: string, limit = 5): { goal: string; score: number; intent: string }[] {
    const utterances = this.loader.getAllUtterances();
    const cleanQuery = this.normalize(query);
    const queryTokens = new Set(cleanQuery.split(/\s+/).filter((t) => t.length > 1));

    if (queryTokens.size === 0) return [];

    const scores = new Map<string, { score: number; intent: string }>();

    for (const u of utterances) {
      // 1. Exact match
      if (u.text === cleanQuery) {
        const current = scores.get(u.goal) || { score: 0, intent: u.intent };
        scores.set(u.goal, { score: Math.max(current.score, 1.0), intent: u.intent });
        continue;
      }

      // 2. Token overlap
      const utTokens = u.text.split(/\s+/).filter((t) => t.length > 1);
      let intersection = 0;
      for (const t of utTokens) {
        if (queryTokens.has(t)) {
          intersection++;
        }
      }

      if (intersection > 0) {
        const jaccard = intersection / (queryTokens.size + utTokens.length - intersection);
        // Boost score if the query contains the utterance as substring
        const isSubstring = cleanQuery.includes(u.text) || u.text.includes(cleanQuery);
        const score = jaccard * (isSubstring ? 1.5 : 1.0);

        const current = scores.get(u.goal) || { score: 0, intent: u.intent };
        scores.set(u.goal, { score: Math.max(current.score, score), intent: u.intent });
      }
    }

    // Convert to sorted array
    return Array.from(scores.entries())
      .map(([goal, val]) => ({ goal, score: val.score, intent: val.intent }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}
