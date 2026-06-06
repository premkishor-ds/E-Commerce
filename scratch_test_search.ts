import { NestFactory } from '@nestjs/core';
import { AppModule } from './backend/src/app.module';
import { SemanticSearchService } from './backend/src/modules/chatbot-intelligence/services/semantic-search.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const searchService = app.get(SemanticSearchService);
  const results = searchService.search("Show me some Asus cameras", 5);
  console.log("SEARCH RESULTS:", JSON.stringify(results, null, 2));
  await app.close();
}

main().catch(console.error);
