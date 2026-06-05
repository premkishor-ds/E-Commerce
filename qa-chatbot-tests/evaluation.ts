import { TestCase } from './dataset';

export interface TestResult {
  testId: string;
  category: string;
  query: string;
  expectedGoal: string;
  expectedAction?: string;
  actualResponse: string;
  actualIntent: string;
  actualActions: any[];
  intentMatch: boolean;
  actionMatch: boolean;
  relevanceMatch: boolean;
  empathyMatch: boolean;
  contextMaintained: boolean;
  result: 'PASS' | 'PARTIAL' | 'FAIL';
  analysis: string;
  confidenceScore: number;
}

export function evaluateResponse(
  testCase: TestCase,
  botResponse: { reply: string; intent: string; confidence?: number; actions?: any[] }
): TestResult {
  const actualResponse = botResponse.reply || '';
  const actualIntent = botResponse.intent || 'UNKNOWN';
  const actualActions = botResponse.actions || [];
  
  // 1. Intent Match
  const intentMatch = actualIntent.toUpperCase() === testCase.expectedGoal.toUpperCase();

  // 2. Action Match
  let actionMatch = true;
  if (testCase.expectedAction) {
    actionMatch = actualActions.some(
      (act) => act.type.toUpperCase() === testCase.expectedAction?.toUpperCase()
    );
  }

  // 3. Relevance Match
  let relevanceMatch = true;
  if (testCase.expectedKeywords) {
    relevanceMatch = testCase.expectedKeywords.every(
      (kw) => actualResponse.toLowerCase().includes(kw)
    );
  }
  // Make sure we don't have fallback replies
  const lowerReply = actualResponse.toLowerCase();
  const isFallback = 
    lowerReply.includes("don't understand") || 
    lowerReply.includes("sorry, i couldn't") ||
    lowerReply.includes("unrecognized command") ||
    lowerReply.includes("error occurred");
  if (isFallback) {
    relevanceMatch = false;
  }

  // 4. Empathy Check
  let empathyMatch = true;
  const emotionalKeywords = ['ridiculous', 'disappointed', 'upset', 'annoyed', 'angry', 'frustrated', 'terrible', 'worst', 'still here', 'delay'];
  const hasEmotion = emotionalKeywords.some(w => testCase.query.toLowerCase().includes(w));
  if (hasEmotion) {
    const empathyWords = ['sorry', 'apologize', 'understand', 'resolve', 'help', 'pardon', 'sincere'];
    empathyMatch = empathyWords.some(w => lowerReply.includes(w));
  }

  // 5. Context Maintenance (Multi-turn verification)
  let contextMaintained = true;
  if (testCase.isMultiTurn && testCase.stepIndex && testCase.stepIndex > 1) {
    // If it's a follow up turn, verify that the intent isn't lost or fallback isn't hit
    if (actualIntent === 'FALLBACK' || isFallback) {
      contextMaintained = false;
    }
  }

  // Determine Overall Pass / Fail
  let result: 'PASS' | 'PARTIAL' | 'FAIL' = 'PASS';
  let analysis = 'The chatbot understood the user intent and responded appropriately.';
  let confidenceScore = botResponse.confidence ?? 100;

  if (!intentMatch || !actionMatch || !relevanceMatch || !contextMaintained) {
    result = 'FAIL';
    analysis = `Failed because of the following: ` + [
      !intentMatch ? `Intent mismatch (Expected: [${testCase.expectedGoal}], Got: [${actualIntent}])` : '',
      !actionMatch ? `Action mismatch (Expected: [${testCase.expectedAction || 'None'}], Got: ${JSON.stringify(actualActions)})` : '',
      !relevanceMatch ? 'Relevance mismatch (fallback or missing keywords)' : '',
      !contextMaintained ? 'Context maintenance failure' : ''
    ].filter(Boolean).join(', ');
    confidenceScore = 0;
  } else if (hasEmotion && !empathyMatch) {
    result = 'PARTIAL';
    analysis = 'Intent matched, but failed to express empathy to the emotional user query.';
    confidenceScore = Math.max(70, confidenceScore - 10);
  }

  return {
    testId: testCase.id,
    category: testCase.category,
    query: testCase.query,
    expectedGoal: testCase.expectedGoal,
    expectedAction: testCase.expectedAction,
    actualResponse,
    actualIntent,
    actualActions,
    intentMatch,
    actionMatch,
    relevanceMatch,
    empathyMatch,
    contextMaintained,
    result,
    analysis,
    confidenceScore
  };
}
