import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface GoalDefinition {
  goal: string;
  intent: string;
  description: string;
  actionMapping: string;
  expectedEntities: { entity: string; examples: string[] }[];
  clarificationRules: { missingEntity: string; clarification: string }[];
  utterances: string[];
}

@Injectable()
export class IntelligenceLoaderService implements OnModuleInit {
  private goalsRegistry: Map<string, GoalDefinition> = new Map();
  private allUtterances: { text: string; goal: string; intent: string }[] = [];

  onModuleInit() {
    this.loadAll();
  }

  private loadAll() {
    const docsDir = path.resolve(process.cwd(), '../docs/chatbot-intelligence');
    if (!fs.existsSync(docsDir)) {
      console.warn(`[IntelligenceLoaderService] Docs directory not found at ${docsDir}`);
      return;
    }

    const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      this.parseFile(file, content);
    }

    console.log(`[IntelligenceLoaderService] Parsed ${this.goalsRegistry.size} goals with ${this.allUtterances.length} utterances.`);
  }

  private parseFile(filename: string, content: string) {
    const lines = content.split('\n');
    let currentSection = '';
    let goal = '';
    let intent = '';
    let description = '';
    let actionMapping = '';
    const expectedEntities: { entity: string; examples: string[] }[] = [];
    const clarificationRules: { missingEntity: string; clarification: string }[] = [];
    const utterances: { text: string; intent: string }[] = [];

    const SECTION_INTENT_OVERRIDES: Record<string, string> = {
      'CANCEL ORDER': 'CANCEL_ORDER',
      'MODIFY ORDER': 'MODIFY_ORDER',
      'REORDER': 'REORDER',
      'DOWNLOAD INVOICE': 'DOWNLOAD_INVOICE',
      'VIEW ORDERS': 'VIEW_ORDERS',
      'ADD TO CART': 'ADD_CART',
      'REMOVE FROM CART': 'REMOVE_CART',
      'VIEW CART': 'VIEW_CART',
      'UPDATE QUANTITY': 'UPDATE_CART_QUANTITY',
      'SAVE FOR LATER': 'SAVE_CART_FOR_LATER',
      'RESTORE SAVED CART': 'RESTORE_SAVED_CART',
      'ADD TO WISHLIST': 'WISHLIST_ADD',
      'VIEW WISHLIST': 'WISHLIST_VIEW',
      'REMOVE FROM WISHLIST': 'WISHLIST_REMOVE',
      'MOVE TO CART': 'MOVE_TO_CART',
      'CLEAR WISHLIST': 'CLEAR_WISHLIST',
      'ADD FUNDS': 'VIEW_WALLET',
      'APPLY COUPON': 'APPLY_COUPON',
      'RETRY PAYMENT': 'RETRY_PAYMENT',
      'VIEW PAYMENT HISTORY': 'VIEW_PAYMENT_HISTORY',
      'CHECK PAYMENT STATUS': 'CHECK_PAYMENT_STATUS',
      'ADD PAYMENT METHOD': 'ADD_PAYMENT_METHOD',
      'DELETE PAYMENT METHOD': 'DELETE_PAYMENT_METHOD',
      'ADD ADDRESS': 'ADD_ADDRESS',
      'UPDATE ADDRESS': 'UPDATE_ADDRESS',
      'DELETE ADDRESS': 'DELETE_ADDRESS',
      'SET DEFAULT ADDRESS': 'SET_DEFAULT_ADDRESS',
      'VIEW PROFILE': 'VIEW_PROFILE',
      'UPDATE PROFILE': 'UPDATE_PROFILE',
      'CHANGE PASSWORD': 'CHANGE_PASSWORD',
      'VIEW TICKETS': 'VIEW_TICKETS',
      'CREATE TICKET': 'CREATE_TICKET',
      'ESCALATE': 'ESCALATE',
      'VENDOR PRODUCT': 'VENDOR_PRODUCTS',
      'VENDOR ANALYTICS': 'VENDOR_ANALYTICS',
      'VENDOR SETTLEMENTS': 'VENDOR_SETTLEMENTS',
      'PRODUCT MANAGEMENT': 'ADMIN_PRODUCTS',
      'ORDER MANAGEMENT': 'ADMIN_ORDERS',
      'USER MANAGEMENT': 'ADMIN_USERS',
      'COUPON MANAGEMENT': 'ADMIN_COUPONS',
      'ANALYTICS': 'ADMIN_ANALYTICS',
      'REDEEM': 'VIEW_LOYALTY',
      'PRICE ALERTS': 'PRICE_ALERT',
      'RESTOCK ALERTS': 'PRICE_ALERT',
    };

    let currentSubIntent = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('###')) {
        const title = line.replace(/^###\s*/, '').toUpperCase();
        const matched = Object.keys(SECTION_INTENT_OVERRIDES).find(key => title.includes(key));
        if (matched) {
          currentSubIntent = SECTION_INTENT_OVERRIDES[matched];
        }
        continue;
      }

      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').toLowerCase();
        continue;
      }

      if (currentSection.includes('goal')) {
        const match = line.match(/`?([A-Z0-9_]+)`?\s*→\s*maps to intent:\s*`?([A-Z0-9_]+)`?/i);
        if (match) {
          goal = match[1].trim();
          intent = match[2].trim();
          currentSubIntent = intent;
        }
      } else if (currentSection.includes('description')) {
        description += (description ? ' ' : '') + line;
      } else if (currentSection.includes('action')) {
        actionMapping += (actionMapping ? ' ' : '') + line;
      } else if (currentSection.includes('expected entities')) {
        if (line.startsWith('|') && !line.includes('---') && !line.includes('Entity |')) {
          const parts = line.split('|').map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            const entityName = parts[0].replace(/`/g, '');
            const examples = parts[1].split(',').map(e => e.trim());
            expectedEntities.push({ entity: entityName, examples });
          }
        }
      } else if (currentSection.includes('clarification rules')) {
        if (line.startsWith('|') && !line.includes('---') && !line.includes('Missing Entity |')) {
          const parts = line.split('|').map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            clarificationRules.push({
              missingEntity: parts[0].replace(/`/g, ''),
              clarification: parts[1].replace(/"/g, ''),
            });
          }
        }
      } else if (currentSection.includes('utterance') || currentSection.includes('example')) {
        if (!line.startsWith('#') && !line.startsWith('!') && !line.startsWith('|') && !line.startsWith('-') && !line.includes('→')) {
          utterances.push({ text: line, intent: currentSubIntent || intent || goal });
        }
      }
    }

    if (goal) {
      this.goalsRegistry.set(goal, {
        goal,
        intent: intent || goal,
        description,
        actionMapping,
        expectedEntities,
        clarificationRules,
        utterances: utterances.map(u => u.text),
      });

      for (const u of utterances) {
        this.allUtterances.push({
          text: u.text.toLowerCase(),
          goal,
          intent: u.intent || intent || goal,
        });
      }
    }
  }

  getGoals(): Map<string, GoalDefinition> {
    return this.goalsRegistry;
  }

  getAllUtterances(): { text: string; goal: string; intent: string }[] {
    return this.allUtterances;
  }

  getGoal(goalName: string): GoalDefinition | undefined {
    return this.goalsRegistry.get(goalName);
  }
}
