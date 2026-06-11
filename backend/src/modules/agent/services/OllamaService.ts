import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);

  /**
   * Performs a health check on the Ollama instance.
   */
  async checkHealth(): Promise<boolean> {
    const url = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const resp = await fetch(`${url}/api/tags`, { signal: controller.signal });
      clearTimeout(id);
      return resp.ok;
    } catch {
      return false;
    }
  }

  /**
   * Verifies if a given model is loaded or available locally.
   */
  async isModelAvailable(model: string): Promise<boolean> {
    const url = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      const resp = await fetch(`${url}/api/tags`, { signal: controller.signal });
      clearTimeout(id);
      if (resp.ok) {
        const data = await resp.json();
        const models = data.models || [];
        return models.some((m: any) => m.name.toLowerCase().startsWith(model.toLowerCase()));
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Generates a text response from Ollama with fallback layers.
   */
  async generate(prompt: string, modelOverride?: string): Promise<string> {
    const url = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    const primaryModel = modelOverride || process.env.AI_FALLBACK_MODEL || 'gemma3:1b';
    const timeout = parseInt(process.env.AI_TIMEOUT || '30000', 10);

    // List of local models to try sequentially in case of errors
    const fallbackModels = [primaryModel, 'gemma3:1b', 'gemma3:270m', 'gemma:2b', 'gemma3n'];
    const uniqueModels = Array.from(new Set(fallbackModels));

    for (const model of uniqueModels) {
      let attempts = 3;
      while (attempts > 0) {
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);

          const response = await fetch(`${url}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model,
              prompt,
              stream: false,
              options: { temperature: 0.7 }
            }),
            signal: controller.signal,
          });
          clearTimeout(id);
          if (response.ok) {
            const data = await response.json();
            if (data.response) {
              return data.response.trim();
            }
          }
        } catch (e: any) {
          this.logger.error(`Ollama model ${model} generation attempt failed: ${e.message}. Remaining attempts: ${attempts - 1}`);
        }
        attempts--;
      }
    }

    // Try Gemini API Key if local models are completely offline
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.logger.warn('All local models failed or are offline. Attempting cloud Gemini fallback...');
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7 }
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return reply.trim();
          }
        }
      } catch (err: any) {
        this.logger.error(`Cloud Gemini fallback failed: ${err.message}`);
      }
    }

    throw new Error('All model attempts (local Ollama & cloud Gemini) failed.');
  }
}
