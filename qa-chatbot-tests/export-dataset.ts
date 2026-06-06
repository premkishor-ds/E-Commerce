import * as fs from 'fs';
import * as path from 'path';
import { generateDataset } from './dataset';

function main() {
  console.log('Generating chatbot use cases dataset...');
  const dataset = generateDataset();
  console.log(`Generated ${dataset.length} test cases successfully.`);

  const outputPath = path.join(__dirname, 'reports', 'test-cases.json');
  
  // Ensure reports directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');
  console.log(`Successfully exported dataset to: ${outputPath}`);
}

main();
