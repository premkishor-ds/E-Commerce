import { Injectable, Logger } from '@nestjs/common';
import * as http from 'http';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
  private readonly defaultModel = process.env.QA_MODEL || 'gemma3:1b';
  private readonly timeout = parseInt(process.env.QA_TIMEOUT || '30000', 10);
  private cache = new Map<string, string>();

  async isHealthy(): Promise<boolean> {
    try {
      const url = new URL(this.ollamaUrl);
      return new Promise((resolve) => {
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port || 80,
            path: '/',
            method: 'GET',
            timeout: 2000,
          },
          (res) => {
            resolve(res.statusCode === 200);
          },
        );
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
        req.end();
      });
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const url = new URL(`${this.ollamaUrl}/api/tags`);
      return new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port || 80,
            path: '/api/tags',
            method: 'GET',
            timeout: 5000,
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                const models = (parsed.models || []).map((m: any) => m.name);
                resolve(models);
              } catch (e) {
                reject(e);
              }
            });
          },
        );
        req.on('error', (e) => reject(e));
        req.end();
      });
    } catch (e) {
      this.logger.error('Failed to list Ollama models:', e);
      return [];
    }
  }

  async generate(prompt: string, systemPrompt?: string, modelOverride?: string): Promise<string> {
    const model = modelOverride || this.defaultModel;
    const cacheKey = `${model}:${prompt}:${systemPrompt || ''}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let attempts = 3;
    while (attempts > 0) {
      try {
        const response = await this.executeRequest(prompt, systemPrompt, model);
        this.cache.set(cacheKey, response);
        return response;
      } catch (e: any) {
        attempts--;
        this.logger.warn(`Ollama request failed. Retries left: ${attempts}. Error: ${e.message}`);
        if (attempts === 0) {
          throw new Error(`Ollama generation failed after retries: ${e.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return '';
  }

  private executeRequest(prompt: string, systemPrompt: string | undefined, model: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.ollamaUrl}/api/generate`);
      const payload = JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.1,
        },
      });

      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port || 80,
          path: '/api/generate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          timeout: this.timeout,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              if (res.statusCode !== 200) {
                reject(new Error(`Ollama returned status code ${res.statusCode}: ${data}`));
                return;
              }
              const parsed = JSON.parse(data);
              resolve(parsed.response || '');
            } catch (e) {
              reject(e);
            }
          });
        },
      );

      req.on('error', (e) => reject(e));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Ollama request timed out'));
      });
      req.write(payload);
      req.end();
    });
  }
}
