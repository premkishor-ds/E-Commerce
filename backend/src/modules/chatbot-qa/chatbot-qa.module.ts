import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotQaRunner } from './runner';
import { ResponseEvaluator } from './evaluators/evaluator';
import {
  ChatbotQaRun,
  ChatbotQaRunSchema,
  ChatbotQaResult,
  ChatbotQaResultSchema,
  ChatbotQaLoadtest,
  ChatbotQaLoadtestSchema,
} from './schemas/qa-schemas';
import { AgentModule } from '../agent/agent.module';
import { OllamaService } from './services/ollama.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChatbotQaRun', schema: ChatbotQaRunSchema },
      { name: 'ChatbotQaResult', schema: ChatbotQaResultSchema },
      { name: 'ChatbotQaLoadtest', schema: ChatbotQaLoadtestSchema },
    ]),
    AgentModule,
  ],
  providers: [ChatbotQaRunner, ResponseEvaluator, OllamaService],
  exports: [ChatbotQaRunner, ResponseEvaluator, OllamaService],
})
export class ChatbotQaModule {}
