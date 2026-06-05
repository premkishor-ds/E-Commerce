/**
 * Intelligence Knowledge Base Loader
 * Loads utterance datasets from /docs/chatbot-intelligence/ and builds
 * an in-memory intent→utterances map for semantic matching.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface UtteranceEntry {
  text: string;
  intent: string;
  entities?: Record<string, string>;
  weight: number;
}

export interface KnowledgeBase {
  entries: UtteranceEntry[];
  intentMap: Map<string, string[]>;
  loaded: boolean;
  totalUtterances: number;
}

// ─── File → Intent mapping ─────────────────────────────────────────────────

const FILE_INTENT_MAP: Record<string, string> = {
  '01-capability-discovery.md': 'HELP',
  '02-shopping-discovery.md': 'SEARCH_PRODUCT',
  '03-product-search.md': 'SEARCH_PRODUCT',
  '04-product-details.md': 'GET_PRODUCT',
  '05-product-comparison.md': 'COMPARE',
  '06-product-recommendations.md': 'RECOMMEND',
  '07-cart-management.md': 'ADD_CART',
  '08-checkout.md': 'CHECKOUT',
  '09-order-tracking.md': 'TRACK_ORDER',
  '10-order-management.md': 'VIEW_ORDERS',
  '11-returns.md': 'RETURN_ORDER',
  '12-exchanges.md': 'EXCHANGE_ORDER',
  '13-payments.md': 'VIEW_PAYMENT_METHODS',
  '14-profile-management.md': 'VIEW_PROFILE',
  '15-address-management.md': 'ADDRESS_MANAGE',
  '16-wishlist.md': 'WISHLIST_VIEW',
  '17-wallet.md': 'VIEW_WALLET',
  '18-loyalty.md': 'VIEW_LOYALTY',
  '19-support.md': 'CREATE_TICKET',
  '20-live-agent.md': 'LIVE_AGENT',
  '21-notifications.md': 'NOTIFICATION_PREF',
  '22-admin-actions.md': 'ADMIN_PRODUCTS',
  '23-vendor-actions.md': 'VENDOR_PRODUCTS',
  '24-voice-commerce.md': 'ADD_CART',
  '25-fallback-handling.md': 'HELP',
  '26-ambiguous-queries.md': 'UNKNOWN',
  '27-follow-up-queries.md': 'UNKNOWN',
  '28-context-memory.md': 'UNKNOWN',
  '29-emotional-customers.md': 'CREATE_TICKET',
  '30-multi-intent-queries.md': 'SEARCH_PRODUCT',
  '31-short-queries.md': 'SEARCH_PRODUCT',
  '32-typo-queries.md': 'SEARCH_PRODUCT',
  '33-unknown-queries.md': 'HELP',
  '34-edge-cases.md': 'HELP',
  '35-conversation-recovery.md': 'HELP',
};

// Sub-section → intent overrides within files
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

// ─── LOADER ────────────────────────────────────────────────────────────────

export function loadKnowledgeBase(): KnowledgeBase {
  const kb: KnowledgeBase = {
    entries: [],
    intentMap: new Map(),
    loaded: false,
    totalUtterances: 0,
  };

  const docsDir = path.resolve(__dirname, '../../../../docs/chatbot-intelligence');

  if (!fs.existsSync(docsDir)) {
    console.warn(`[KnowledgeBase] Docs directory not found: ${docsDir}`);
    kb.loaded = true;
    return kb;
  }

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();

  for (const filename of files) {
    const fileIntent = FILE_INTENT_MAP[filename] || 'HELP';
    const filePath = path.join(docsDir, filename);
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    let currentSectionIntent = fileIntent;
    let inUtteranceSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Detect section headers — e.g. "### ADD TO CART"
      if (trimmed.startsWith('###')) {
        const sectionTitle = trimmed.replace(/^###\s*/, '').toUpperCase();
        // Check for override
        const matched = Object.keys(SECTION_INTENT_OVERRIDES).find(key =>
          sectionTitle.includes(key),
        );
        currentSectionIntent = matched ? SECTION_INTENT_OVERRIDES[matched] : fileIntent;
        inUtteranceSection = true;
        continue;
      }

      // Reset on level-2 headers (## sections that aren't utterances)
      if (trimmed.startsWith('## ')) {
        const h2 = trimmed.replace(/^##\s*/, '').toUpperCase();
        if (
          h2.includes('UTTERANCE') ||
          h2.includes('REAL-WORLD') ||
          h2.includes('DATASET') ||
          h2.includes('EXAMPLE')
        ) {
          inUtteranceSection = true;
        } else {
          inUtteranceSection = false;
        }
        continue;
      }

      // Skip markdown formatting lines
      if (
        !trimmed ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('|') ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('`') ||
        trimmed.startsWith('>') ||
        trimmed.startsWith('!') ||
        trimmed.includes('→') ||
        trimmed.includes('↓') ||
        trimmed.match(/^[0-9]+\./) || // numbered lists (used in steps)
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('Intent') ||
        trimmed.startsWith('Entity') ||
        trimmed.startsWith('Goal') ||
        trimmed.startsWith('Action') ||
        trimmed.startsWith('Turn') ||
        trimmed.startsWith('Bot:') ||
        trimmed.startsWith('User:')
      ) {
        continue;
      }

      // Clean and add as utterance
      const cleaned = trimmed
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/_/g, '')
        .replace(/`/g, '')
        .toLowerCase()
        .trim();

      if (cleaned.length >= 2 && cleaned.length <= 200 && !cleaned.includes('→')) {
        const entry: UtteranceEntry = {
          text: cleaned,
          intent: currentSectionIntent,
          weight: inUtteranceSection ? 1.0 : 0.5,
        };

        kb.entries.push(entry);

        if (!kb.intentMap.has(currentSectionIntent)) {
          kb.intentMap.set(currentSectionIntent, []);
        }
        kb.intentMap.get(currentSectionIntent)!.push(cleaned);
      }
    }
  }

  kb.totalUtterances = kb.entries.length;
  kb.loaded = true;
  console.log(`[KnowledgeBase] Loaded ${kb.totalUtterances} utterances across ${kb.intentMap.size} intents`);
  return kb;
}

// Singleton
let _kb: KnowledgeBase | null = null;
export function getKnowledgeBase(): KnowledgeBase {
  if (!_kb) _kb = loadKnowledgeBase();
  return _kb;
}
