import { Injectable } from '@nestjs/common';
import { GoalDetectionService } from './goal-detection.service';
import { EntityExtractionService } from './entity-extraction.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { ClarificationService } from './clarification.service';
import { ConfidenceService } from './confidence.service';
import { FallbackService } from './fallback.service';
import { ConversationRecoveryService } from './conversation-recovery.service';
import { ActionPlannerService } from './action-planner.service';

export interface IntelligenceResult {
  primaryGoal: string;
  secondaryGoal?: string;
  confidence: number;
  entities: Record<string, string>;
  needsClarification: boolean;
  clarificationQuestion?: string;
  intent: string;
  isFallback: boolean;
  fallbackQuestion?: string;
  fallbackSuggestions?: string[];
}

@Injectable()
export class ChatbotIntelligenceService {
  constructor(
    private readonly goalDetection: GoalDetectionService,
    private readonly entityExtraction: EntityExtractionService,
    private readonly memory: ConversationMemoryService,
    private readonly clarification: ClarificationService,
    private readonly confidence: ConfidenceService,
    private readonly fallback: FallbackService,
    private readonly recovery: ConversationRecoveryService,
    private readonly planner: ActionPlannerService,
  ) {}

  processQuery(sessionId: string, query: string): IntelligenceResult {
    // 1. Goal Detection
    const detection = this.goalDetection.detectGoals(query);
    const tier = this.confidence.getTier(detection.confidence);

    // 2. Conversation Recovery & Context Memory
    let context = this.memory.getContext(sessionId);
    const recoveryRes = this.recovery.handleRecovery(query, context);
    if (recoveryRes.recovered) {
      context = recoveryRes.updatedContext || context;
      this.memory.updateContext(sessionId, context);
    }

    // 3. Entity Extraction & context update
    const newlyExtracted = this.entityExtraction.extract(query, detection.primaryGoal);
    this.memory.updateContext(sessionId, newlyExtracted);
    const fullContext = this.memory.getContext(sessionId);

    // 4. Handle Low Confidence (Fallback)
    if (tier === 'LOW') {
      const fallbackResult = this.fallback.suggestGoals(query);
      return {
        primaryGoal: 'HELP',
        confidence: detection.confidence,
        entities: newlyExtracted,
        needsClarification: false,
        intent: 'HELP',
        isFallback: true,
        fallbackQuestion: fallbackResult.question,
        fallbackSuggestions: fallbackResult.suggestions,
      };
    }

    // 5. Clarification Engine
    const clarificationCheck = this.clarification.checkClarification(detection.primaryGoal, fullContext);
    if (clarificationCheck.needsClarification && tier === 'MEDIUM') {
      return {
        primaryGoal: detection.primaryGoal,
        secondaryGoal: detection.secondaryGoal,
        confidence: detection.confidence,
        entities: fullContext,
        needsClarification: true,
        clarificationQuestion: clarificationCheck.question,
        intent: 'HELP',
        isFallback: false,
      };
    }

    // 6. Action Planning
    const plan = this.planner.planAction(detection.primaryGoal, fullContext);

    return {
      primaryGoal: detection.primaryGoal,
      secondaryGoal: detection.secondaryGoal,
      confidence: detection.confidence,
      entities: plan.entities,
      needsClarification: false,
      intent: plan.intent,
      isFallback: false,
    };
  }

  clearMemory(sessionId: string) {
    this.memory.clearContext(sessionId);
  }

  getContext(sessionId: string): Record<string, any> {
    return this.memory.getContext(sessionId);
  }
}
