import * as fs from 'fs';
import * as path from 'path';

function generateDetailedLog() {
  const jsonPath = path.join(__dirname, 'reports', 'chatbot-test-report.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Error: chatbot-test-report.json not found. Run tests first.');
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);
  const results = data.results || [];

  let content = '# CHATBOT QA RUN - DETAILED QUERY & RESPONSE AUDIT LOG\n\n';
  content += `Total Cases: ${results.length}\n`;
  content += `Passed: ${data.summary.passed} | Partial: ${data.summary.partial} | Failed: ${data.summary.failed}\n\n`;
  content += '---\n\n';

  for (const r of results) {
    content += `### [${r.testId}] - ${r.category}\n`;
    content += `**User Query:** \`${r.query}\`\n\n`;
    content += `**Expected Goal (Intent):** \`${r.expectedGoal}\` | **Expected Action:** \`${r.expectedAction || 'None'}\`\n\n`;
    content += `**Actual Intent:** \`${r.actualIntent}\` | **Result Status:** \`${r.result}\` | **Confidence:** \`${r.confidenceScore}%\`\n\n`;
    content += `**Actual Response:**\n\`\`\`\n${r.actualResponse}\n\`\`\`\n\n`;
    content += `**Evaluation Diagnosis:**\n> ${r.analysis}\n\n`;
    content += '---\n\n';
  }

  fs.writeFileSync(path.join(__dirname, 'reports', 'chatbot-detailed-log.md'), content);
  
  // Also copy to the artifacts directory
  const artifactDest = path.join('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\71f59f70-5636-4110-a118-66226831252e', 'chatbot-detailed-log.md');
  fs.writeFileSync(artifactDest, content);
  
  console.log(`Detailed query log written to: reports/chatbot-detailed-log.md`);
  console.log(`Detailed query log copied to artifacts: ${artifactDest}`);
}

generateDetailedLog();
