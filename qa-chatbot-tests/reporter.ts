import * as fs from 'fs';
import * as path from 'path';
import { TestResult } from './evaluation';

export function exportReports(results: TestResult[], outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Calculate Summary Metrics
  const total = results.length;
  const passed = results.filter((r) => r.result === 'PASS').length;
  const partial = results.filter((r) => r.result === 'PARTIAL').length;
  const failed = results.filter((r) => r.result === 'FAIL').length;

  const intentAcc = (results.filter((r) => r.intentMatch).length / total) * 100;
  const actionAcc = (results.filter((r) => r.actionMatch).length / total) * 100;
  const contextAcc = (results.filter((r) => r.contextMaintained).length / total) * 100;
  
  // Conversation quality is calculated based on empathy + relevance + success
  const qualityScore =
    (results.filter((r) => r.relevanceMatch && r.empathyMatch && r.result === 'PASS').length / total) * 100;

  // 2. Generate JSON Report
  const jsonReport = {
    summary: {
      totalTests: total,
      passed,
      partial,
      failed,
      intentAccuracyPercent: intentAcc.toFixed(2),
      actionAccuracyPercent: actionAcc.toFixed(2),
      contextAccuracyPercent: contextAcc.toFixed(2),
      conversationQualityPercent: qualityScore.toFixed(2),
    },
    results,
  };
  fs.writeFileSync(
    path.join(outputDir, 'chatbot-test-report.json'),
    JSON.stringify(jsonReport, null, 2)
  );

  // 3. Generate CSV Report
  let csvContent = 'Test ID,Category,User Query,Expected Goal,Expected Action,Actual Response,Actual Intent,Result,Confidence Score,Analysis\n';
  for (const r of results) {
    const cleanQuery = r.query.replace(/"/g, '""');
    const cleanResponse = r.actualResponse.replace(/"/g, '""');
    const cleanAnalysis = r.analysis.replace(/"/g, '""');
    csvContent += `"${r.testId}","${r.category}","${cleanQuery}","${r.expectedGoal}","${r.expectedAction || 'None'}","${cleanResponse}","${r.actualIntent}","${r.result}",${r.confidenceScore},"${cleanAnalysis}"\n`;
  }
  fs.writeFileSync(path.join(outputDir, 'chatbot-test-report.csv'), csvContent);

  // 4. Generate Capability Coverage Report
  const categoriesMap: Record<string, { total: number; passed: number; partial: number; failed: number }> = {};
  for (const r of results) {
    if (!categoriesMap[r.category]) {
      categoriesMap[r.category] = { total: 0, passed: 0, partial: 0, failed: 0 };
    }
    categoriesMap[r.category].total++;
    if (r.result === 'PASS') categoriesMap[r.category].passed++;
    else if (r.result === 'PARTIAL') categoriesMap[r.category].partial++;
    else categoriesMap[r.category].failed++;
  }

  // 5. Generate Failure Analysis
  const failures = results.filter((r) => r.result === 'FAIL' || r.result === 'PARTIAL');
  const failureAnalysisRows = failures.map((f) => {
    let rootCause = 'Intent mismatch or missing payload action.';
    let suggestedFix = 'Verify rules in agent.intent.engine.ts or ensure correct response actions are returned in agent.service.ts.';
    
    if (!f.intentMatch) {
      rootCause = `The Rule-Based Intent Engine misclassified this query. Expected [${f.expectedGoal}] but it matched keywords for [${f.actualIntent}].`;
      suggestedFix = `Add the unique terms in "${f.query}" to the INTENT_KEYWORDS dictionary for [${f.expectedGoal}] or decrease keyword overlap in [${f.actualIntent}].`;
    } else if (!f.actionMatch) {
      rootCause = `Intent [${f.expectedGoal}] matched correctly, but the NestJS backend did not return the expected action payload: [${f.expectedAction}].`;
      suggestedFix = `Update the handler in agent.service.ts for intent [${f.expectedGoal}] to append action payload with type: "${f.expectedAction}".`;
    } else if (!f.relevanceMatch) {
      rootCause = `Fallback response was triggered or key terms were missing in the reply, making the response irrelevant.`;
      suggestedFix = `Optimize the fallback responses in agent.service.ts or ensure variables are interpolated correctly.`;
    } else if (!f.empathyMatch) {
      rootCause = `Emotional markers detected in user query, but response did not contain empathetic keywords.`;
      suggestedFix = `Implement an empathy interceptor in agent.service.ts to prepend polite/empathetic disclaimers to disappointed/annoyed user messages.`;
    }

    return {
      testId: f.testId,
      category: f.category,
      query: f.query,
      expectedGoal: f.expectedGoal,
      expectedAction: f.expectedAction || 'None',
      actualResponse: f.actualResponse,
      actualIntent: f.actualIntent,
      rootCause,
      suggestedFix,
      result: f.result
    };
  });

  // 6. Generate HTML Report
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot Automated QA Test Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #09090b;
      --card-bg: #18181b;
      --card-border: #27272a;
      --text-main: #f4f4f5;
      --text-muted: #a1a1aa;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.15);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.1);
      --warning: #f59e0b;
      --warning-glow: rgba(245, 158, 11, 0.1);
      --danger: #ef4444;
      --danger-glow: rgba(239, 68, 68, 0.1);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 2rem;
      line-height: 1.5;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
    }

    .brand h1 {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #a5b4fc, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.2rem;
    }

    .brand p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .timestamp {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
      box-shadow: 0 8px 30px var(--primary-glow);
    }

    .stat-card.pass:hover {
      border-color: var(--success);
      box-shadow: 0 8px 30px var(--success-glow);
    }

    .stat-card.partial:hover {
      border-color: var(--warning);
      box-shadow: 0 8px 30px var(--warning-glow);
    }

    .stat-card.fail:hover {
      border-color: var(--danger);
      box-shadow: 0 8px 30px var(--danger-glow);
    }

    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stat-card.pass .stat-value { color: var(--success); }
    .stat-card.partial .stat-value { color: var(--warning); }
    .stat-card.fail .stat-value { color: var(--danger); }

    .stat-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Accuracy Bars */
    .accuracy-section {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 3rem;
    }

    .accuracy-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .accuracy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .metric-container {
      display: flex;
      flex-direction: column;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .metric-bar-bg {
      background-color: #27272a;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }

    .metric-bar-fill {
      height: 100%;
      border-radius: 6px;
      background: linear-gradient(90deg, var(--primary), #818cf8);
      transition: width 1s ease-out;
    }

    .metric-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
    }

    /* Tabs / Filter Controls */
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filters {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .filter-btn:hover, .filter-btn.active {
      background-color: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .search-box {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      min-width: 280px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .search-box:focus {
      border-color: var(--primary);
    }

    /* Content Layout */
    .layout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .table-card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      overflow: hidden;
      padding: 1.5rem;
    }

    .table-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th, td {
      padding: 1rem;
      border-bottom: 1px solid var(--card-border);
      font-size: 0.9rem;
    }

    th {
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge.pass { background-color: var(--success-glow); color: var(--success); }
    .badge.partial { background-color: var(--warning-glow); color: var(--warning); }
    .badge.fail { background-color: var(--danger-glow); color: var(--danger); }

    .query-text {
      font-weight: 500;
      color: var(--text-main);
    }

    .detail-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .detail-btn:hover {
      text-decoration: underline;
    }

    /* Coverage Section */
    .coverage-section {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 2rem;
      margin-top: 3rem;
    }

    /* Modal Styling */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(9, 9, 11, 0.85);
      backdrop-filter: blur(8px);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      width: 90%;
      max-width: 700px;
      padding: 2rem;
      position: relative;
    }

    .close-modal {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .close-modal:hover {
      color: var(--text-main);
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 0.5rem;
    }

    .detail-row {
      margin-bottom: 1rem;
    }

    .detail-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .detail-val {
      font-size: 0.95rem;
      background-color: #09090b;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <h1>ApexStore Chatbot QA Audit Report</h1>
        <p>Automated QA Evaluation Suite — 1,100 Conversational Scenarios Checked</p>
      </div>
      <div class="timestamp">
        Run Date: ${new Date().toLocaleString()}
      </div>
    </header>

    <!-- Metrics Summary -->
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-label">Total Scenarios</div>
        <div class="stat-value">${total}</div>
        <div class="stat-desc">Full customer agent simulation runs</div>
      </div>
      <div class="stat-card pass">
        <div class="stat-label">Passed</div>
        <div class="stat-value">${passed}</div>
        <div class="stat-desc">Full intent + action matching</div>
      </div>
      <div class="stat-card partial">
        <div class="stat-label">Partial Matches</div>
        <div class="stat-value">${partial}</div>
        <div class="stat-desc">Intent match but minor action/relevance miss</div>
      </div>
      <div class="stat-card fail">
        <div class="stat-label">Failed</div>
        <div class="stat-value">${failed}</div>
        <div class="stat-desc">Misclassification or action payload error</div>
      </div>
    </div>

    <!-- Accuracy Details -->
    <div class="accuracy-section">
      <div class="accuracy-title">System Accuracy & Capabilities Breakdown</div>
      <div class="accuracy-grid">
        <div class="metric-container">
          <div class="metric-header">
            <span>Intent Accuracy</span>
            <span>${intentAcc.toFixed(1)}%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" style="width: ${intentAcc}%"></div>
          </div>
          <div class="metric-desc">Correctly classified user requests</div>
        </div>

        <div class="metric-container">
          <div class="metric-header">
            <span>Action Dispatch Accuracy</span>
            <span>${actionAcc.toFixed(1)}%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" style="width: ${actionAcc}%"></div>
          </div>
          <div class="metric-desc">Appropriate payload triggers fired</div>
        </div>

        <div class="metric-container">
          <div class="metric-header">
            <span>Context Retention Accuracy</span>
            <span>${contextAcc.toFixed(1)}%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" style="width: ${contextAcc}%"></div>
          </div>
          <div class="metric-desc">Multi-turn thread context maintenance</div>
        </div>

        <div class="metric-container">
          <div class="metric-header">
            <span>Conversation Quality</span>
            <span>${qualityScore.toFixed(1)}%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" style="width: ${qualityScore}%"></div>
          </div>
          <div class="metric-desc">Empathy, relevance, and formatting checks</div>
        </div>
      </div>
    </div>

    <!-- Coverage Report Table -->
    <div class="table-card" style="margin-bottom: 3rem;">
      <div class="table-title">Chatbot Capability Coverage Report</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Scenarios Tested</th>
            <th>Passed</th>
            <th>Partial</th>
            <th>Failed</th>
            <th>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(categoriesMap).map(([cat, stats]) => {
            const rate = (stats.passed / stats.total) * 100;
            return `
              <tr>
                <td><strong>${cat}</strong></td>
                <td>${stats.total}</td>
                <td><span style="color: var(--success); font-weight:600;">${stats.passed}</span></td>
                <td><span style="color: var(--warning); font-weight:600;">${stats.partial}</span></td>
                <td><span style="color: var(--danger); font-weight:600;">${stats.failed}</span></td>
                <td><strong>${rate.toFixed(1)}%</strong></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Failure Analysis Report -->
    <div class="table-card" style="margin-bottom: 3rem;">
      <div class="table-title">Failure Analysis Report (Total: ${failures.length})</div>
      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Category</th>
            <th>Query</th>
            <th>Expected Goal</th>
            <th>Root Cause</th>
            <th>Suggested Fix</th>
          </tr>
        </thead>
        <tbody>
          ${failureAnalysisRows.slice(0, 100).map((row) => `
            <tr>
              <td><span class="badge ${row.result.toLowerCase()}">${row.testId}</span></td>
              <td>${row.category}</td>
              <td class="query-text">${row.query}</td>
              <td><code>${row.expectedGoal}</code></td>
              <td style="color: #fda4af">${row.rootCause}</td>
              <td style="color: #a7f3d0">${row.suggestedFix}</td>
            </tr>
          `).join('')}
          ${failureAnalysisRows.length > 100 ? `
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted)">
                Showing top 100 failures/partials. Please refer to chatbot-test-report.json for the full failure logs.
              </td>
            </tr>
          ` : ''}
        </tbody>
      </table>
    </div>

    <!-- Scenario Test Log Table -->
    <div class="layout-grid">
      <div class="table-card">
        <div class="controls">
          <div class="table-title">Scenario Audit Details</div>
          <div class="filters">
            <button class="filter-btn active" onclick="filterResults('all')">All</button>
            <button class="filter-btn" onclick="filterResults('pass')">Pass</button>
            <button class="filter-btn" onclick="filterResults('partial')">Partial</button>
            <button class="filter-btn" onclick="filterResults('fail')">Fail</button>
            <input type="text" id="searchInput" class="search-box" placeholder="Search by query..." onkeyup="searchQueries()">
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Query</th>
              <th>Expected Goal</th>
              <th>Result</th>
              <th>Confidence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="resultsTableBody">
            ${results.map((r) => `
              <tr class="result-row" data-result="${r.result.toLowerCase()}" data-query="${r.query.toLowerCase()}">
                <td><code>${r.testId}</code></td>
                <td>${r.category}</td>
                <td class="query-text">${r.query}</td>
                <td><code>${r.expectedGoal}</code></td>
                <td><span class="badge ${r.result.toLowerCase()}">${r.result}</span></td>
                <td>${r.confidenceScore}%</td>
                <td>
                  <button class="detail-btn" onclick="openDetails('${r.testId}')">View Details</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Details Modal -->
  <div id="detailsModal" class="modal" onclick="closeModal(event)">
    <div class="modal-content" onclick="event.stopPropagation()">
      <span class="close-modal" onclick="document.getElementById('detailsModal').style.display = 'none'">&times;</span>
      <div class="modal-title" id="mTitle">Test Case Details</div>
      <div class="detail-row">
        <div class="detail-label">User Query</div>
        <div class="detail-val" id="mQuery"></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Expected Goal / Action</div>
        <div class="detail-val" id="mExpected"></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Actual Response</div>
        <div class="detail-val" id="mResponse"></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Evaluation Diagnostics</div>
        <div class="detail-val" id="mAnalysis"></div>
      </div>
    </div>
  </div>

  <script>
    const allResults = ${JSON.stringify(results.map(r => ({
      testId: r.testId,
      query: r.query,
      expectedGoal: r.expectedGoal,
      expectedAction: r.expectedAction,
      actualResponse: r.actualResponse,
      actualIntent: r.actualIntent,
      result: r.result,
      analysis: r.analysis
    })))};

    function filterResults(type) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      const rows = document.querySelectorAll('.result-row');
      rows.forEach(row => {
        const rowResult = row.getAttribute('data-result');
        if (type === 'all' || rowResult === type) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    function searchQueries() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const rows = document.querySelectorAll('.result-row');
      rows.forEach(row => {
        const queryText = row.getAttribute('data-query');
        if (queryText.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    function openDetails(testId) {
      const data = allResults.find(r => r.testId === testId);
      if (!data) return;

      document.getElementById('mTitle').innerText = 'Scenario Details: ' + data.testId;
      document.getElementById('mQuery').innerText = data.query;
      document.getElementById('mExpected').innerText = 'Goal: ' + data.expectedGoal + '\\nAction: ' + (data.expectedAction || 'None');
      document.getElementById('mResponse').innerText = 'Intent Classified: ' + data.actualIntent + '\\n\\nReply:\\n' + data.actualResponse;
      document.getElementById('mAnalysis').innerText = data.analysis;

      document.getElementById('detailsModal').style.display = 'flex';
    }

    function closeModal(e) {
      if (e.target === document.getElementById('detailsModal')) {
        document.getElementById('detailsModal').style.display = 'none';
      }
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'chatbot-test-report.html'), htmlContent);
  console.log(`[Success] HTML, JSON, and CSV reports successfully generated in: ${outputDir}`);
}
