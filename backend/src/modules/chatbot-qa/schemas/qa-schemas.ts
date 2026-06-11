import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ChatbotQaRun extends Document {
  @Prop({ required: true })
  runId: string;

  @Prop({ required: true })
  modelUsed: string;

  @Prop({ required: true })
  totalTests: number;

  @Prop({ required: true })
  passedTests: number;

  @Prop({ required: true })
  failedTests: number;

  @Prop({ required: true })
  passRate: number;

  @Prop({ required: true })
  averageScore: number;

  @Prop({ required: true })
  latencyAvgMs: number;

  @Prop({ required: true })
  errorCount: number;

  @Prop({ required: true })
  timeoutCount: number;

  @Prop({ required: true })
  securityFailureCount: number;
}

export const ChatbotQaRunSchema = SchemaFactory.createForClass(ChatbotQaRun);

@Schema({ timestamps: true })
export class ChatbotQaResult extends Document {
  @Prop({ required: true })
  runId: string;

  @Prop({ required: true })
  testCaseId: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  query: string;

  @Prop({ required: true })
  response: string;

  @Prop({ required: true })
  expectedResponse: string;

  @Prop({ type: Object })
  evalScores: {
    relevance: number;
    accuracy: number;
    completeness: number;
    contextRetention: number;
    safety: number;
    helpfulness: number;
    productMatching: number;
    overall: number;
  };

  @Prop()
  status: 'PASS' | 'FAIL';

  @Prop()
  latencyMs: number;

  @Prop()
  failureReason?: string;
}

export const ChatbotQaResultSchema = SchemaFactory.createForClass(ChatbotQaResult);

@Schema({ timestamps: true })
export class ChatbotQaLoadtest extends Document {
  @Prop({ required: true })
  loadtestId: string;

  @Prop({ required: true })
  concurrentUsers: number;

  @Prop({ required: true })
  totalRequests: number;

  @Prop({ required: true })
  successRequests: number;

  @Prop({ required: true })
  failedRequests: number;

  @Prop({ required: true })
  averageLatencyMs: number;

  @Prop({ required: true })
  p95LatencyMs: number;

  @Prop({ required: true })
  p99LatencyMs: number;

  @Prop({ required: true })
  throughputPerSecond: number;

  @Prop({ required: true })
  errorRate: number;

  @Prop({ required: true })
  cpuUsagePercent: number;

  @Prop({ required: true })
  memoryUsageMb: number;
}

export const ChatbotQaLoadtestSchema = SchemaFactory.createForClass(ChatbotQaLoadtest);
