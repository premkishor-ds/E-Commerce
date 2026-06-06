import axios from 'axios';
import { generateDataset, TestCase } from './dataset';
import { evaluateResponse, TestResult } from './evaluation';
import { exportReports } from './reporter';
import * as path from 'path';

const BACKEND_URL = 'http://localhost:5001/api/v1/agent/message';

// Reduced batch size to prevent overwhelming NestJS connection pool
const BATCH_SIZE = 3;
// Inter-batch delay (ms) to allow NestJS to recover between concurrent bursts
const BATCH_DELAY_MS = 200;
// Max retries on network error
const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTestCase(testCase: TestCase, retryCount = 0): Promise<TestResult> {
  const sessionId = testCase.sessionId || `session-${testCase.id}`;
  console.log(`[RUNNER] Sending query: "${testCase.query}" (ID: ${testCase.id})`);
  
  try {
    const response = await axios.post(BACKEND_URL, {
      message: testCase.query,
      sessionId: sessionId,
      guestId: `guest-${sessionId}`
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 20000 // 20 seconds timeout
    });

    console.log(`[RUNNER] Got response for ID: ${testCase.id}`);
    return evaluateResponse(testCase, response.data);
  } catch (error: any) {
    const errorCode = error.code;
    const isRetryable = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'socket hang up'].some(
      code => errorCode === code || (error.message || '').includes(code)
    );

    if (isRetryable && retryCount < MAX_RETRIES) {
      const waitMs = 500 * Math.pow(2, retryCount); // exponential backoff
      console.log(`[RUNNER] Retrying ID: ${testCase.id} (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${waitMs}ms`);
      await sleep(waitMs);
      return runTestCase(testCase, retryCount + 1);
    }

    const errorMsg = error.response
      ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : (error.message || error.code || 'Unknown Error');

    console.log(`[RUNNER] Error for ID: ${testCase.id} -> ${errorMsg}`);

    return {
      testId: testCase.id,
      category: testCase.category,
      query: testCase.query,
      expectedGoal: testCase.expectedGoal,
      expectedAction: testCase.expectedAction,
      actualResponse: `Failed to contact Chatbot API: ${errorMsg}`,
      actualIntent: 'ERROR_OR_TIMEOUT',
      actualActions: [],
      intentMatch: false,
      actionMatch: false,
      relevanceMatch: false,
      empathyMatch: false,
      contextMaintained: false,
      result: 'FAIL',
      analysis: `Network or Server error: ${errorMsg}`,
      confidenceScore: 0
    };
  }
}

async function main() {
  console.log('==================================================');
  console.log('🤖 APEXSTORE CHATBOT QA TEST RUNNER');
  console.log('==================================================');
  
  console.log('Generating 1,100+ Test Cases across 11 categories...');
  const dataset = generateDataset();
  console.log(`Generated ${dataset.length} test cases successfully.\n`);

  console.log(`Starting execution against: ${BACKEND_URL}`);
  console.log(`Throttling execution with Batch Size = ${BATCH_SIZE}, Delay = ${BATCH_DELAY_MS}ms\n`);

  const results: TestResult[] = [];
  const startTime = Date.now();

  // We must execute multi-turn followups sequentially within their respective sessions to maintain state correctly
  // Let's divide dataset into:
  // - Multi-turn followups (need to run in correct order per session)
  // - Single-turn general queries
  const multiTurnGroups: Record<string, TestCase[]> = {};
  const singleTurnCases: TestCase[] = [];

  for (const tc of dataset) {
    if (tc.isMultiTurn && tc.sessionId) {
      if (!multiTurnGroups[tc.sessionId]) {
        multiTurnGroups[tc.sessionId] = [];
      }
      multiTurnGroups[tc.sessionId].push(tc);
    } else {
      singleTurnCases.push(tc);
    }
  }

  // Sort multi-turn cases by stepIndex to guarantee execution sequence
  for (const sessionKey in multiTurnGroups) {
    multiTurnGroups[sessionKey].sort((a, b) => (a.stepIndex || 0) - (b.stepIndex || 0));
  }

  const outputDir = path.join(__dirname, 'reports');

  console.log(`Processing ${singleTurnCases.length} single-turn scenarios...`);
  // Run single-turn cases in batches
  for (let i = 0; i < singleTurnCases.length; i += BATCH_SIZE) {
    const batch = singleTurnCases.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(tc => runTestCase(tc));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Write reports in real time
    exportReports(results, outputDir);

    // Small delay between batches to avoid overwhelming NestJS
    if (i + BATCH_SIZE < singleTurnCases.length) {
      await sleep(BATCH_DELAY_MS);
    }

    if ((i + BATCH_SIZE) % 100 === 0 || i + BATCH_SIZE >= singleTurnCases.length) {
      const progress = Math.min(100, Math.round(((i + batch.length) / singleTurnCases.length) * 100));
      console.log(`  Single-turn Progress: ${progress}% (${results.length}/${singleTurnCases.length} done)`);
    }
  }

  console.log(`\nProcessing ${Object.keys(multiTurnGroups).length} multi-turn conversational scenarios...`);
  // Run multi-turn sessions. We can run multiple sessions in parallel, but steps inside a session MUST run sequentially.
  const sessions = Object.values(multiTurnGroups);
  
  // We can process sessions in batches
  for (let i = 0; i < sessions.length; i += BATCH_SIZE) {
    const sessionBatch = sessions.slice(i, i + BATCH_SIZE);
    
    // Process this batch of sessions concurrently
    await Promise.all(sessionBatch.map(async (sessionCases) => {
      // Execute steps in this session sequentially
      for (const tc of sessionCases) {
        const res = await runTestCase(tc);
        results.push(res);
      }
    }));

    // Write reports in real time
    exportReports(results, outputDir);

    const progress = Math.min(100, Math.round(((i + sessionBatch.length) / sessions.length) * 100));
    console.log(`  Multi-turn Progress: ${progress}% (${i + sessionBatch.length}/${sessions.length} sessions completed)`);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nExecution finished in ${durationSec} seconds.`);
  console.log(`Total tests run: ${results.length}`);

  const passed = results.filter(r => r.result === 'PASS').length;
  const partial = results.filter(r => r.result === 'PARTIAL').length;
  const failed = results.filter(r => r.result === 'FAIL').length;

  console.log('==================================================');
  console.log('📊 TEST SUMMARY RESULTS:');
  console.log('==================================================');
  console.log(`PASSED : ${passed} (${((passed / results.length) * 100).toFixed(1)}%)`);
  console.log(`PARTIAL: ${partial} (${((partial / results.length) * 100).toFixed(1)}%)`);
  console.log(`FAILED : ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
  console.log('==================================================');
  console.log(`Detailed HTML report saved to: ${path.join(outputDir, 'chatbot-test-report.html')}`);
  console.log(`JSON dataset logs saved to: ${path.join(outputDir, 'chatbot-test-report.json')}`);
  console.log(`CSV report logs saved to: ${path.join(outputDir, 'chatbot-test-report.csv')}`);
  console.log('==================================================');
}

main().catch(err => {
  console.error('Test Suite Runner Fatal Error:', err);
});
