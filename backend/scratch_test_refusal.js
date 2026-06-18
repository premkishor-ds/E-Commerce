const sessionId = 'test-session-refusal-' + Date.now();

async function runTest() {
  const query = 'What is the capital of France?';
  console.log(`Sending query: "${query}"...`);
  
  try {
    const res = await fetch('http://localhost:5001/api/v1/agent/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        sessionId: sessionId,
      })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error calling agent endpoint:', err);
  }
}

runTest();
