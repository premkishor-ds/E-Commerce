const dotenv = require('dotenv');
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const QA_MODEL = process.env.QA_MODEL || 'qwen2.5:14b';

async function test() {
  const reply = `👋 Hello ! I'm the **ApexStore AI Assistant**.

I can help you:
• 🔍 Search & compare products
• 🛒 Manage your cart & wishlist
• 📦 Track & manage orders
• 🎫 Create support tickets
• 🔐 Manage your account

What can I help you with today?`;

  const contextPrompt = `User says: hello`;

  const prompt = `You are the ApexStore AI Assistant.
Your task is to refine the system's reply into a conversational, highly helpful AI response.
You must structure your response to:
1. First, show you understand the user's query by briefly and naturally acknowledging it (e.g., "I understand you'd like to check your order..." or "It looks like you're looking for headphones...").
2. Second, provide the direct answer/information from the system reply in a clear, easy-to-read layout. Use bullet points, bold text, or paragraphs where appropriate to make it digestible.

System Reply to enhance:
"${reply}"

${contextPrompt ? `Context (User message/context): "${contextPrompt}"` : ''}

Rules:
- Do NOT invent or add any mock numbers, order IDs, product names, or facts not present in the System Reply.
- Preserve all existing links, markdown links (e.g. [Link Text](/path)), bold markers (**), and formatting.
- Ensure the language matches the language used in the user's query/system reply.

Enhanced AI Response:`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: QA_MODEL, prompt, stream: false, options: { temperature: 0.1 } }),
    });
    console.log('Ollama Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Ollama Response response:', data.response);
    } else {
      console.log('Ollama response not OK');
    }
  } catch (e) {
    console.error('Ollama call failed:', e.message);
  }
}

test().catch(console.error);
