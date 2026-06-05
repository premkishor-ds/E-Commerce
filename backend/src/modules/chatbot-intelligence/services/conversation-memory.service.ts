import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationMemoryService {
  private contexts: Map<string, Record<string, any>> = new Map();

  getContext(sessionId: string): Record<string, any> {
    if (!this.contexts.has(sessionId)) {
      this.contexts.set(sessionId, {});
    }
    return this.contexts.get(sessionId)!;
  }

  updateContext(sessionId: string, newEntities: Record<string, any>) {
    const current = this.getContext(sessionId);
    Object.assign(current, newEntities);
  }

  clearContext(sessionId: string) {
    this.contexts.delete(sessionId);
  }
}
