import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ChatbotQaRunner } from './runner';

async function bootstrap() {
  console.log('Bootstrapping NestJS context for Chatbot QA CLI...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const runner = app.get(ChatbotQaRunner);
  
  try {
    const report = await runner.executeRegression();
    console.log('=== QA Sweep Report ===');
    console.log(`Run ID: ${report.runId}`);
    console.log(`Total Tests Executed: ${report.totalTests}`);
    console.log(`Passed: ${report.passedTests}`);
    console.log(`Failed: ${report.failedTests}`);
    console.log(`Pass Rate: ${report.passRate.toFixed(2)}%`);
    console.log(`Average Quality Score: ${report.averageScore.toFixed(2)}/10`);
    console.log(`Average Latency: ${report.latencyAvgMs.toFixed(2)} ms`);
    console.log('========================');
  } catch (error) {
    console.error('QA Sweep execution failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
