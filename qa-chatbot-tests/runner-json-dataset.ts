import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

const BACKEND_URL = 'http://localhost:5001/api/v1/agent/message';
const BATCH_SIZE = 100;

interface ExpectedBot {
  intent: string;
  messageContains: string[];
  showSuggestions?: boolean;
  expectedEntities?: Record<string, string>;
  expectedAction?: string;
  expectedResponse?: string;
  expectedUI?: string;
  expectedButtons?: string[];
  expectedSuggestions?: string[];
  expectedDatabaseChange?: string;
  expectedAPICall?: string;
  expectedFollowUp?: string;
  expectedSuccessCriteria?: string;
}

interface TestCase {
  id: string;
  category: string;
  priority: string;
  userType: string;
  preConditions: Record<string, any>;
  conversation: {
    user: string;
    expectedBot: ExpectedBot;
  }[];
}

interface DatasetFile {
  version: string;
  generatedAt: string;
  testCases: TestCase[];
}

interface TestResult {
  testId: string;
  category: string;
  userQuery: string;
  expectedIntent: string;
  actualIntent: string;
  actualResponse: string;
  intentMatch: boolean;
  actionMatch: boolean;
  relevanceMatch: boolean;
  suggestionsMatch: boolean;
  passed: boolean;
  details: string;
}

async function runTestCase(testCase: TestCase): Promise<TestResult[]> {
  const sessionId = `dataset-run-${testCase.id}`;
  const results: TestResult[] = [];

  for (let tIndex = 0; tIndex < testCase.conversation.length; tIndex++) {
    const turn = testCase.conversation[tIndex];
    const userQuery = turn.user;
    const expected = turn.expectedBot;

    try {
      const response = await axios.post(BACKEND_URL, {
        message: userQuery,
        sessionId: sessionId,
        guestId: `guest-${sessionId}`
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      const actualResponse = response.data.reply || '';
      const actualIntent = response.data.intent || 'UNKNOWN';
      const actualActions = response.data.actions || [];
      const actualSuggestions = response.data.suggestions || [];

      // 1. Intent Match
      const intentMatch = actualIntent.toUpperCase() === expected.intent.toUpperCase();

      // 2. Action Match
      let actionMatch = true;
      if (expected.expectedAction && expected.expectedAction !== 'none') {
        actionMatch = actualActions.some(
          (act: any) => act.type.toUpperCase() === expected.expectedAction?.toUpperCase()
        );
      }

      // 3. Relevance (messageContains) Match
      let relevanceMatch = true;
      if (expected.messageContains && expected.messageContains.length > 0) {
        relevanceMatch = expected.messageContains.every(
          (kw) => actualResponse.toLowerCase().includes(kw.toLowerCase())
        );
      }

      // 4. Suggestions Match
      let suggestionsMatch = true;
      if (expected.expectedSuggestions && expected.expectedSuggestions.length > 0) {
        suggestionsMatch = expected.expectedSuggestions.every(
          (sug) => actualSuggestions.some((actSug: string) => actSug.toLowerCase().includes(sug.toLowerCase()))
        );
      }

      const passed = intentMatch && actionMatch && relevanceMatch;
      let details = '';
      if (!passed) {
        details = [
          !intentMatch ? `Intent mismatch (Expected: [${expected.intent}], Got: [${actualIntent}])` : '',
          !actionMatch ? `Action mismatch (Expected: [${expected.expectedAction}], Got: ${JSON.stringify(actualActions)})` : '',
          !relevanceMatch ? `Relevance mismatch (Missing keywords: ${JSON.stringify(expected.messageContains)})` : ''
        ].filter(Boolean).join(', ');
      }

      results.push({
        testId: `${testCase.id}_T${tIndex + 1}`,
        category: testCase.category,
        userQuery,
        expectedIntent: expected.intent,
        actualIntent,
        actualResponse,
        intentMatch,
        actionMatch,
        relevanceMatch,
        suggestionsMatch,
        passed,
        details: passed ? 'Pass' : details
      });

    } catch (error: any) {
      const errorMsg = error.response ? `HTTP ${error.response.status}` : error.message;
      results.push({
        testId: `${testCase.id}_T${tIndex + 1}`,
        category: testCase.category,
        userQuery,
        expectedIntent: expected.intent,
        actualIntent: 'ERROR_OR_TIMEOUT',
        actualResponse: `Failed to contact Chatbot: ${errorMsg}`,
        intentMatch: false,
        actionMatch: false,
        relevanceMatch: false,
        suggestionsMatch: false,
        passed: false,
        details: `Connection error: ${errorMsg}`
      });
    }
  }

  return results;
}

async function main() {
  const datasetPath = path.join(__dirname, '..', 'chatbot-test-dataset.json');
  if (!fs.existsSync(datasetPath)) {
    console.error(`❌ Dataset file not found at: ${datasetPath}`);
    process.exit(1);
  }

  console.log(`Loading dataset from: ${datasetPath}...`);
  const datasetContent = fs.readFileSync(datasetPath, 'utf-8');
  const dataset: DatasetFile = JSON.parse(datasetContent);
  console.log(`Loaded ${dataset.testCases.length} test cases.\n`);

  console.log('==================================================');
  console.log('🤖 RUNNING CHATBOT VALIDATION AGAINST DATASET');
  console.log('==================================================');

  const casesToRun = dataset.testCases;
  console.log(`Selected all ${casesToRun.length} test cases to execute.`);

  const results: TestResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < casesToRun.length; i += BATCH_SIZE) {
    const promises: Promise<TestResult[]>[] = [];
    for (let j = i; j < i + BATCH_SIZE && j < casesToRun.length; j++) {
      promises.push(runTestCase(casesToRun[j]));
    }
    const batchRes = await Promise.all(promises);
    for (const rList of batchRes) {
      results.push(...rList);
    }
    if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= casesToRun.length) {
      const progress = Math.min(i + BATCH_SIZE, casesToRun.length);
      console.log(`  Progress: ${progress}/${casesToRun.length} test cases executed...`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nExecution finished in ${durationSec} seconds.`);

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  const passRate = ((passedCount / results.length) * 100).toFixed(1);

  console.log('==================================================');
  console.log('📊 DATASET RUN SUMMARY RESULTS:');
  console.log('==================================================');
  console.log(`PASSED: ${passedCount} (${passRate}%)`);
  console.log(`FAILED: ${failedCount}`);
  console.log('==================================================');

  const outputDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON report
  fs.writeFileSync(
    path.join(outputDir, 'dataset-execution-report.json'),
    JSON.stringify({ summary: { passed: passedCount, failed: failedCount, total: results.length, passRate }, results }, null, 2)
  );

  // Write HTML report
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chatbot Dataset Validation Report</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f1f5f9; padding: 40px; }
    h1 { color: #38bdf8; }
    .stats { display: flex; gap: 20px; margin-bottom: 30px; }
    .card { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; flex: 1; }
    .card h3 { margin: 0; color: #94a3b8; font-size: 0.9em; text-transform: uppercase; }
    .card p { margin: 10px 0 0 0; font-size: 1.8em; font-weight: bold; }
    .pass { color: #4ade80; }
    .fail { color: #f87171; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #334155; color: #38bdf8; }
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.85em; font-weight: 600; }
    .badge-pass { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
    .badge-fail { background: rgba(248, 113, 113, 0.15); color: #f87171; }
  </style>
</head>
<body>
  <h1>📊 Chatbot Dataset Validation Report</h1>
  <div class="stats">
    <div class="card"><h3>Total Queries Executed</h3><p>${results.length}</p></div>
    <div class="card"><h3>Passed Queries</h3><p class="pass">${passedCount}</p></div>
    <div class="card"><h3>Failed Queries</h3><p class="fail">${failedCount}</p></div>
    <div class="card"><h3>Pass Rate</h3><p style="color: #38bdf8">${passRate}%</p></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Test ID</th>
        <th>Category</th>
        <th>User Query</th>
        <th>Expected Intent</th>
        <th>Actual Intent</th>
        <th>Result</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(r => `
        <tr>
          <td>${r.testId}</td>
          <td>${r.category}</td>
          <td><code>${r.userQuery}</code></td>
          <td>${r.expectedIntent}</td>
          <td>${r.actualIntent}</td>
          <td><span class="badge ${r.passed ? 'badge-pass' : 'badge-fail'}">${r.passed ? 'PASS' : 'FAIL'}</span></td>
          <td>${r.details}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `;
  fs.writeFileSync(path.join(outputDir, 'dataset-execution-report.html'), htmlContent);
  console.log(`HTML report generated at: ${path.join(outputDir, 'dataset-execution-report.html')}`);
}

main().catch(console.error);
