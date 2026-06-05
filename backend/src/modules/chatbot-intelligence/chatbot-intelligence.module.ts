import { Module } from '@nestjs/common';
import { IntelligenceLoaderService } from './services/intelligence-loader.service';
import { SemanticSearchService } from './services/semantic-search.service';
import { GoalDetectionService } from './services/goal-detection.service';
import { EntityExtractionService } from './services/entity-extraction.service';
import { ConversationMemoryService } from './services/conversation-memory.service';
import { ClarificationService } from './services/clarification.service';
import { ConfidenceService } from './services/confidence.service';
import { FallbackService } from './services/fallback.service';
import { ConversationRecoveryService } from './services/conversation-recovery.service';
import { ActionPlannerService } from './services/action-planner.service';
import { ChatbotIntelligenceService } from './services/chatbot-intelligence.service';

@Module({
  providers: [
    IntelligenceLoaderService,
    SemanticSearchService,
    GoalDetectionService,
    EntityExtractionService,
    ConversationMemoryService,
    ClarificationService,
    ConfidenceService,
    FallbackService,
    ConversationRecoveryService,
    ActionPlannerService,
    ChatbotIntelligenceService,
  ],
  exports: [ChatbotIntelligenceService, IntelligenceLoaderService],
})
export class ChatbotIntelligenceModule {}
