import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SemanticSearchService } from './src/modules/chatbot-intelligence/services/semantic-search.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const semanticSearch = app.get(SemanticSearchService);
  
  const matches = semanticSearch.search('Show me Dell', 5);
  console.log('Matches for "Show me Dell":', JSON.stringify(matches, null, 2));

  await app.close();
}

run().catch(console.error);
