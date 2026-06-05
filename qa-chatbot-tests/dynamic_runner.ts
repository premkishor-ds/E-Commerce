import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

const BACKEND_URL = 'http://localhost:5001/api/v1/agent/message';
const BATCH_SIZE = 5;

// Data pools for generating unique queries
const PRODUCTS = [
  'laptop', 'phone', 'headphones', 'keyboard', 'mouse', 'monitor', 'camera', 
  'smartwatch', 'speaker', 'tablet', 'charger', 'cable', 'backpack', 'desk lamp', 
  'router', 'microphone', 'projector', 'earbuds', 'hard drive', 'graphics card'
];

const BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Logitech', 
  'Bose', 'LG', 'Intel', 'AMD', 'Nvidia', 'Xiaomi', 'OnePlus', 'Microsoft'
];

const REFUND_REASONS = [
  'damaged item', 'wrong color delivered', 'defective charger port', 'size fits too small', 'changed my mind'
];

interface SessionState {
  sessionId: string;
  category: string;
  lastProduct?: string;
  lastBrand?: string;
  lastOrderNumber?: string;
  lastTicketId?: string;
  turnCount: number;
  maxTurns: number;
}

interface TurnLog {
  turnIndex: number;
  query: string;
  expectedGoal: string;
  actualResponse: string;
  actualIntent: string;
  intentMatch: boolean;
  contextMaintained: boolean;
}

interface SessionResult {
  sessionId: string;
  category: string;
  maxTurns: number;
  turns: TurnLog[];
  passed: boolean;
}

function getInitialQuery(state: SessionState, index: number): { query: string; expectedGoal: string } {
  const brand = BRANDS[index % BRANDS.length];
  const prod = PRODUCTS[index % PRODUCTS.length];
  state.lastBrand = brand;
  state.lastProduct = prod;

  switch (state.category) {
    case 'Shopping Flow':
      return {
        query: `I am looking for a ${brand} ${prod}`,
        expectedGoal: 'SEARCH_PRODUCT'
      };
    case 'Order Management':
      const orderNum = 1000 + index;
      state.lastOrderNumber = `#ORD-${orderNum}`;
      return {
        query: `Track my order ${state.lastOrderNumber}`,
        expectedGoal: 'TRACK_ORDER'
      };
    case 'Support Flow':
      return {
        query: `Create a support ticket for my broken ${brand} ${prod}`,
        expectedGoal: 'CREATE_TICKET'
      };
    case 'Account & Profile':
      return {
        query: `Show my user profile details`,
        expectedGoal: 'VIEW_PROFILE'
      };
    case 'Cart & Checkout':
    default:
      return {
        query: `Add a ${brand} ${prod} to my cart`,
        expectedGoal: 'ADD_CART'
      };
  }
}

function getFollowUpQuery(state: SessionState, prevIntent: string, prevReply: string, turnIndex: number): { query: string; expectedGoal: string } {
  const lowerReply = prevReply.toLowerCase();
  
  // 1. Recover from fallbacks/errors
  if (prevIntent === 'FALLBACK' || lowerReply.includes("don't understand") || lowerReply.includes("sorry")) {
    return {
      query: `Let's search for a ${state.lastBrand} ${state.lastProduct} instead`,
      expectedGoal: 'SEARCH_PRODUCT'
    };
  }

  // 2. State/Intent based transitions
  if (prevIntent === 'SEARCH_PRODUCT') {
    // Choose between details, comparison, or cart additions
    if (turnIndex % 3 === 0) {
      return {
        query: `Show details and specifications for it`,
        expectedGoal: 'GET_PRODUCT'
      };
    } else if (turnIndex % 3 === 1) {
      const altBrand = BRANDS[(BRANDS.indexOf(state.lastBrand || 'Apple') + 1) % BRANDS.length];
      return {
        query: `Compare this with the ${altBrand} version`,
        expectedGoal: 'COMPARE'
      };
    } else {
      return {
        query: `Put it in my cart`,
        expectedGoal: 'ADD_CART'
      };
    }
  }

  if (prevIntent === 'GET_PRODUCT') {
    if (turnIndex % 2 === 0) {
      return {
        query: `Add this product to my shopping cart`,
        expectedGoal: 'ADD_CART'
      };
    } else {
      return {
        query: `What is the return policy for it?`,
        expectedGoal: 'GET_PRODUCT'
      };
    }
  }

  if (prevIntent === 'ADD_CART') {
    if (turnIndex % 2 === 0) {
      return {
        query: `Show my current shopping cart`,
        expectedGoal: 'VIEW_CART'
      };
    } else {
      return {
        query: `Let's go to checkout`,
        expectedGoal: 'CHECKOUT'
      };
    }
  }

  if (prevIntent === 'VIEW_CART') {
    return {
      query: `Proceed to checkout`,
      expectedGoal: 'CHECKOUT'
    };
  }

  if (prevIntent === 'CHECKOUT') {
    if (lowerReply.includes('payment') || lowerReply.includes('pay')) {
      return {
        query: `Pay with Visa credit card`,
        expectedGoal: 'CHECKOUT'
      };
    }
    return {
      query: `Apply discount code SAVE10`,
      expectedGoal: 'APPLY_COUPON'
    };
  }

  if (prevIntent === 'TRACK_ORDER') {
    if (turnIndex % 2 === 0) {
      return {
        query: `Can I change my delivery address?`,
        expectedGoal: 'ADDRESS_MANAGE'
      };
    } else {
      const reason = REFUND_REASONS[turnIndex % REFUND_REASONS.length];
      return {
        query: `I want to return this order because of a ${reason}`,
        expectedGoal: 'RETURN_ORDER'
      };
    }
  }

  if (prevIntent === 'CREATE_TICKET') {
    return {
      query: `Connect me to a live customer service agent`,
      expectedGoal: 'ESCALATE'
    };
  }

  if (prevIntent === 'VIEW_PROFILE') {
    return {
      query: `Update my delivery address details`,
      expectedGoal: 'ADDRESS_MANAGE'
    };
  }

  // Default fallback progression
  return {
    query: `Okay, what are the shipping options?`,
    expectedGoal: 'GET_PRODUCT'
  };
}

async function runSession(index: number): Promise<SessionResult> {
  const sessionId = `followup-session-${index}`;
  const categories = ['Shopping Flow', 'Order Management', 'Support Flow', 'Account & Profile', 'Cart & Checkout'];
  const category = categories[index % categories.length];
  const maxTurns = 5 + (index % 6); // 5 to 10 turns

  const state: SessionState = {
    sessionId,
    category,
    turnCount: 0,
    maxTurns
  };

  const turns: TurnLog[] = [];
  let passed = true;

  for (let turnIndex = 1; turnIndex <= maxTurns; turnIndex++) {
    let query = '';
    let expectedGoal = '';

    if (turnIndex === 1) {
      const initial = getInitialQuery(state, index);
      query = initial.query;
      expectedGoal = initial.expectedGoal;
    } else {
      const lastTurn = turns[turns.length - 1];
      const followup = getFollowUpQuery(state, lastTurn.actualIntent, lastTurn.actualResponse, turnIndex);
      query = followup.query;
      expectedGoal = followup.expectedGoal;
    }

    try {
      const response = await axios.post(BACKEND_URL, {
        message: query,
        sessionId: sessionId,
        guestId: `guest-${sessionId}`
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const reply = response.data.reply || '';
      const actualIntent = response.data.intent || 'UNKNOWN';

      const intentMatch = actualIntent.toUpperCase() === expectedGoal.toUpperCase() || 
                          (expectedGoal === 'GET_PRODUCT' && actualIntent === 'SEARCH_PRODUCT'); // Permissive details fallback
      
      const contextMaintained = !reply.toLowerCase().includes("don't understand") && 
                                !reply.toLowerCase().includes("sorry") && 
                                actualIntent !== 'FALLBACK';

      if (!contextMaintained || !intentMatch) {
        passed = false;
      }

      turns.push({
        turnIndex,
        query,
        expectedGoal,
        actualResponse: reply,
        actualIntent,
        intentMatch,
        contextMaintained
      });

    } catch (err: any) {
      const errorMsg = err.response ? `HTTP ${err.response.status}` : err.message;
      turns.push({
        turnIndex,
        query,
        expectedGoal,
        actualResponse: `Error: ${errorMsg}`,
        actualIntent: 'ERROR_OR_TIMEOUT',
        intentMatch: false,
        contextMaintained: false
      });
      passed = false;
      break; // Abort further turns if connection failed
    }
  }

  return {
    sessionId,
    category,
    maxTurns,
    turns,
    passed
  };
}

async function main() {
  console.log('==================================================');
  console.log('🤖 CHATBOT CONVERSATIONAL FOLLOW-UP TEST RUNNER');
  console.log('==================================================');
  console.log('Generating 1,000 unique conversation scenarios (5 to 10 turns each)...');

  const results: SessionResult[] = [];
  const startTime = Date.now();

  // Process sessions in throttled batches
  for (let i = 0; i < 1000; i += BATCH_SIZE) {
    const batchPromises: Promise<SessionResult>[] = [];
    for (let j = i; j < i + BATCH_SIZE && j < 1000; j++) {
      batchPromises.push(runSession(j));
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if ((i + BATCH_SIZE) % 100 === 0) {
      console.log(`  Progress: ${i + BATCH_SIZE}/1000 sessions completed...`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nExecution finished in ${durationSec} seconds.`);

  // Export reports
  const outputDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // JSON
  fs.writeFileSync(
    path.join(outputDir, 'dynamic-followup-test-report.json'),
    JSON.stringify(results, null, 2)
  );

  // CSV
  let csvContent = 'SessionID,Category,TurnsCount,Passed,TurnIndex,UserQuery,ExpectedGoal,ActualIntent,PassedTurn\n';
  for (const res of results) {
    for (const t of res.turns) {
      const escapedQuery = `"${t.query.replace(/"/g, '""')}"`;
      csvContent += `${res.sessionId},${res.category},${res.maxTurns},${res.passed ? 'PASS' : 'FAIL'},${t.turnIndex},${escapedQuery},${t.expectedGoal},${t.actualIntent},${t.contextMaintained ? 'YES' : 'NO'}\n`;
    }
  }
  fs.writeFileSync(path.join(outputDir, 'dynamic-followup-test-report.csv'), csvContent);

  // HTML Dashboard
  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  const passRate = ((passedCount / results.length) * 100).toFixed(1);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Conversational Follow-Up Test Dashboard</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f1f5f9; padding: 40px; margin: 0; }
    h1 { color: #38bdf8; font-size: 2.5em; margin-bottom: 20px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .card { background: #1e293b; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #334155; }
    .card h3 { margin: 0 0 10px 0; color: #94a3b8; font-size: 0.9em; text-transform: uppercase; }
    .card p { margin: 0; font-size: 2em; font-weight: bold; }
    .passed { color: #4ade80; }
    .failed { color: #f87171; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #334155; color: #38bdf8; font-weight: 600; }
    tr:hover { background: #1e293b; }
    .badge { padding: 5px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; }
    .badge-pass { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
    .badge-fail { background: rgba(248, 113, 113, 0.2); color: #f87171; }
  </style>
</head>
<body>
  <h1>🤖 Chatbot Conversational Follow-Up Audit</h1>
  <div class="stats">
    <div class="card"><h3>Total Sessions</h3><p>${results.length}</p></div>
    <div class="card"><h3>Passed Sessions</h3><p class="passed">${passedCount}</p></div>
    <div class="card"><h3>Failed Sessions</h3><p class="failed">${failedCount}</p></div>
    <div class="card"><h3>Pass Rate</h3><p style="color: #38bdf8">${passRate}%</p></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Session ID</th>
        <th>Category</th>
        <th>Total Turns</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(r => `
        <tr>
          <td>${r.sessionId}</td>
          <td>${r.category}</td>
          <td>${r.maxTurns}</td>
          <td><span class="badge ${r.passed ? 'badge-pass' : 'badge-fail'}">${r.passed ? 'PASS' : 'FAIL'}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `;
  fs.writeFileSync(path.join(outputDir, 'dynamic-followup-test-report.html'), htmlContent);

  console.log('==================================================');
  console.log('📊 CONVERSATIONAL TESTS SUMMARY:');
  console.log('==================================================');
  console.log(`PASSED SESSIONS: ${passedCount} (${passRate}%)`);
  console.log(`FAILED SESSIONS: ${failedCount}`);
  console.log('==================================================');
  console.log(`Reports saved in: ${outputDir}`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
});
