/**
 * Semantic Intelligence Engine
 * Provides typo correction, fuzzy matching, contextual intent boosting,
 * and confidence scoring on top of the rule-based intent engine.
 *
 * This AUGMENTS (not replaces) agent.intent.engine.ts
 */

import { getKnowledgeBase } from './agent.knowledge.loader';
import { IntentMatch } from './agent.intent.engine';

// ─── TYPO CORRECTION ──────────────────────────────────────────────────────

const TYPO_MAP: Record<string, string> = {
  // Order
  trak: 'track',
  trakc: 'track',
  ordr: 'order',
  ordur: 'order',
  ordeer: 'order',
  ordrs: 'orders',
  orderss: 'orders',
  ordres: 'orders',
  cancl: 'cancel',
  cancle: 'cancel',
  cancell: 'cancel',
  canel: 'cancel',
  canceel: 'cancel',
  retrun: 'return',
  reutrn: 'return',
  retun: 'return',
  retunr: 'return',
  reeturn: 'return',
  refnd: 'refund',
  refudn: 'refund',
  rfeund: 'refund',
  rfund: 'refund',
  // Products
  phoen: 'phone',
  phoone: 'phone',
  phnoe: 'phone',
  phne: 'phone',
  mobil: 'mobile',
  moble: 'mobile',
  laptpo: 'laptop',
  lptop: 'laptop',
  laoptop: 'laptop',
  headfone: 'headphone',
  hedaphones: 'headphones',
  earbods: 'earbuds',
  smasung: 'samsung',
  samsng: 'samsung',
  sasmung: 'samsung',
  sansung: 'samsung',
  samsong: 'samsung',
  iphon: 'iphone',
  ipone: 'iphone',
  ifone: 'iphone',
  iphoen: 'iphone',
  ipohne: 'iphone',
  ihphone: 'iphone',
  // Cart
  crat: 'cart',
  craet: 'cart',
  chekout: 'checkout',
  chekcout: 'checkout',
  checkut: 'checkout',
  procced: 'proceed',
  prceed: 'proceed',
  // Wishlist
  wishlst: 'wishlist',
  wishist: 'wishlist',
  wishlits: 'wishlist',
  wihslist: 'wishlist',
  // Payment
  payement: 'payment',
  paymnt: 'payment',
  paymnet: 'payment',
  paymant: 'payment',
  walelt: 'wallet',
  walleet: 'wallet',
  walett: 'wallet',
  // Support
  tickt: 'ticket',
  tiket: 'ticket',
  tickeet: 'ticket',
  compliant: 'complaint',
  complint: 'complaint',
  agentt: 'agent',
  agnet: 'agent',
  // Profile
  profle: 'profile',
  profiel: 'profile',
  porfle: 'profile',
  adress: 'address',
  adresses: 'addresses',
  // Auth
  logn: 'login',
  lgoin: 'login',
  regsiter: 'register',
  registeer: 'register',
  logut: 'logout',
  // Misc
  serach: 'search',
  searh: 'search',
  searcch: 'search',
  delivry: 'delivery',
  dlvry: 'delivery',
  delvery: 'delivery',
  shiping: 'shipping',
  shpping: 'shipping',
  shping: 'shipping',
  invoce: 'invoice',
  invocie: 'invoice',
  reordeer: 'reorder',
  compere: 'compare',
  compair: 'compare',
  pakage: 'package',
  packge: 'package',
  paymet: 'payment',
  pymnt: 'payment',
  crart: 'cart',
  humman: 'human',
  humen: 'human',
};

export function correctTypos(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  return words.map(w => TYPO_MAP[w] || w).join(' ');
}

// ─── LEVENSHTEIN DISTANCE ─────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 + Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix[b.length][a.length];
}

// ─── SEMANTIC SIMILARITY ──────────────────────────────────────────────────

/**
 * Token-overlap similarity between two strings.
 * Returns 0.0 to 1.0.
 */
function tokenOverlap(a: string, b: string): number {
  const tokensA = a.split(/\s+/).filter(t => t.length > 2);
  const tokensB = b.split(/\s+/).filter(t => t.length > 2);
  const setB = new Set(tokensB);
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  let intersection = 0;
  for (const t of tokensA) {
    if (setB.has(t)) intersection++;
  }
  const maxLen = Math.max(tokensA.length, tokensB.length);  
  return intersection / maxLen;
}

// ─── KNOWLEDGE BASE MATCHING ──────────────────────────────────────────────

/**
 * Searches the knowledge base for the closest intent match.
 * Returns null if no confident match found.
 */
export function searchKnowledgeBase(
  query: string,
  topK = 1,
): { intent: string; score: number } | null {
  const kb = getKnowledgeBase();
  if (!kb.loaded || kb.entries.length === 0) return null;

  const normalizedQuery = correctTypos(query.toLowerCase().trim());

  let bestIntent = '';
  let bestScore = 0;

  // Score accumulator per intent
  const intentScores = new Map<string, number>();

  for (const entry of kb.entries) {
    if (entry.intent === 'UNKNOWN') continue;

    // Exact match
    if (entry.text === normalizedQuery) {
      const score = 10 * entry.weight;
      const prev = intentScores.get(entry.intent) || 0;
      intentScores.set(entry.intent, Math.max(prev, score));
      continue;
    }

    // Token overlap
    const overlap = tokenOverlap(normalizedQuery, entry.text);
    if (overlap > 0.5) {
      const score = overlap * 7 * entry.weight;
      const prev = intentScores.get(entry.intent) || 0;
      intentScores.set(entry.intent, Math.max(prev, score));
      continue;
    }

    // Substring match
    if (entry.text.includes(normalizedQuery) || normalizedQuery.includes(entry.text)) {
      const score = 5 * entry.weight;
      const prev = intentScores.get(entry.intent) || 0;
      intentScores.set(entry.intent, Math.max(prev, score));
    }
  }

  intentScores.forEach((score, intent) => {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  });

  if (bestScore >= 3 && bestIntent) {
    return { intent: bestIntent, score: bestScore };
  }

  return null;
}

// ─── CONFIDENCE SCORING ───────────────────────────────────────────────────

export interface EnrichedIntentMatch extends IntentMatch {
  correctedText: string;
  kbScore: number;
  finalConfidence: number;
}

/**
 * Enriches a rule-based intent match with KB semantic scoring.
 * Rule score takes priority at high confidence, KB fills gaps.
 */
export function enrichIntentMatch(
  originalText: string,
  ruleMatch: IntentMatch,
): EnrichedIntentMatch {
  const correctedText = correctTypos(originalText.toLowerCase());
  const kbResult = searchKnowledgeBase(correctedText);

  let finalIntent = ruleMatch.intent;
  let finalScore = ruleMatch.score;
  let kbScore = 0;

  if (kbResult) {
    kbScore = kbResult.score;

    // KB wins when rule match is weak or unknown
    if (ruleMatch.intent === 'UNKNOWN' || ruleMatch.score < 4) {
      finalIntent = kbResult.intent;
      finalScore = kbResult.score;
    } else if (ruleMatch.score < 7 && kbResult.score > ruleMatch.score) {
      // KB supplements medium-confidence rule matches
      finalIntent = kbResult.intent;
      finalScore = Math.max(ruleMatch.score, kbResult.score);
    }
  }

  return {
    intent: finalIntent,
    score: finalScore,
    entities: ruleMatch.entities,
    correctedText,
    kbScore,
    finalConfidence: Math.min(finalScore / 10, 1.0),
  };
}

// ─── CLARIFICATION ENGINE ─────────────────────────────────────────────────

interface ClarificationResult {
  needsClarification: boolean;
  question: string;
  suggestions: string[];
}

const MISSING_ENTITY_CLARIFICATIONS: Record<
  string,
  Record<string, { question: string; suggestions: string[] }>
> = {
  SEARCH_PRODUCT: {
    productType: {
      question: "What type of product are you looking for?",
      suggestions: ['Phones', 'Laptops', 'Headphones', 'Shoes', 'TVs'],
    },
    brand: {
      question: "Any preferred brand?",
      suggestions: ['Samsung', 'Apple', 'Sony', 'No preference'],
    },
  },
  TRACK_ORDER: {
    orderId: {
      question: "What's your Order ID? (e.g. ORD-A1B2C3D4) Or say **\"my latest order\"**.",
      suggestions: ['My latest order', 'View all orders'],
    },
  },
  CANCEL_ORDER: {
    orderId: {
      question: "Which order would you like to cancel? Please provide the Order ID.",
      suggestions: ['My latest order', 'View all orders'],
    },
  },
  RETURN_ORDER: {
    orderId: {
      question: "Which order would you like to return? Provide the Order ID or say **\"my latest order\"**.",
      suggestions: ['My latest order', 'View all orders'],
    },
  },
  COMPARE: {
    compareProductA: {
      question: "Which two products would you like to compare? (e.g. **\"Compare iPhone vs Samsung\"**)",
      suggestions: ['Compare phones', 'Compare laptops'],
    },
  },
  PRICE_ALERT: {
    productType: {
      question: "Which product would you like to set a price alert for?",
      suggestions: ['Search products first'],
    },
  },
};

export function getClarification(
  intent: string,
  entities: Record<string, string>,
): ClarificationResult {
  const rules = MISSING_ENTITY_CLARIFICATIONS[intent];
  if (!rules) return { needsClarification: false, question: '', suggestions: [] };

  for (const [entityKey, config] of Object.entries(rules)) {
    if (!entities[entityKey]) {
      return {
        needsClarification: true,
        question: config.question,
        suggestions: config.suggestions,
      };
    }
  }

  return { needsClarification: false, question: '', suggestions: [] };
}

// ─── EMOTIONAL TONE DETECTOR ──────────────────────────────────────────────

export type EmotionalTone = 'angry' | 'frustrated' | 'confused' | 'happy' | 'urgent' | 'neutral';

const EMOTION_PATTERNS: Record<EmotionalTone, RegExp> = {
  angry: /\b(furious|livid|ridiculous|outrageous|scam|fraud|worst|horrible|terrible|disgusting|unacceptable|disgraceful|never.again|legal.action|consumer.court)\b/i,
  frustrated: /\b(frustrated|annoying|waiting|days|weeks|ignored|unresolved|waste.of.time|keeps.happening|multiple.times|still.not)\b/i,
  confused: /\b(confused|lost|don.t.understand|don.t.get|make.no.sense|unclear|complicated|clueless|overwhelming)\b/i,
  happy: /\b(amazing|love|great|awesome|fantastic|perfect|excellent|wonderful|brilliant|best)\b/i,
  urgent: /\b(urgent|emergency|asap|immediately|right.now|no.time|critical|must.fix|today|tonight|time.sensitive)\b/i,
  neutral: /.*/,
};

export function detectEmotionalTone(text: string): EmotionalTone {
  for (const [tone, pattern] of Object.entries(EMOTION_PATTERNS) as [EmotionalTone, RegExp][]) {
    if (tone === 'neutral') continue;
    if (pattern.test(text)) return tone;
  }
  return 'neutral';
}

export function getEmpathyPrefix(tone: EmotionalTone): string {
  switch (tone) {
    case 'angry':
      return "I sincerely apologize for the trouble you've experienced. Let me help resolve this right away. ";
    case 'frustrated':
      return "I understand your frustration, and I'm sorry for the inconvenience. Let me look into this immediately. ";
    case 'confused':
      return "No worries, I'm here to guide you through this step by step. ";
    case 'happy':
      return "Great to hear! ";
    case 'urgent':
      return "I understand this is urgent. I'm prioritizing your request right now. ";
    default:
      return '';
  }
}

// ─── MULTI-INTENT DETECTOR ────────────────────────────────────────────────

const CONJUNCTION_PATTERN = /\b(and|also|plus|as well as|additionally|along with)\b/i;

export function detectMultipleIntents(text: string): string[] {
  if (!CONJUNCTION_PATTERN.test(text)) return [text];

  const parts = text
    .split(CONJUNCTION_PATTERN)
    .map(p => p.trim())
    .filter(p => p.length > 3 && !CONJUNCTION_PATTERN.test(p));

  return parts.length > 1 ? parts : [text];
}

// ─── CONTEXT RESOLVER ─────────────────────────────────────────────────────

const PRONOUN_PATTERN = /^(it|this|that|the one|that one|this one|them|those|these|the item|the product|the same|same)$/i;

export function isPronounReference(text: string): boolean {
  return PRONOUN_PATTERN.test(text.trim());
}

export function resolveProductFromHistory(
  recentMessages: { role: string; text: string }[],
): string | null {
  for (let i = recentMessages.length - 1; i >= 0; i--) {
    const msg = recentMessages[i];

    // From bot search results: "• **ProductName** — $price"
    if (msg.role === 'bot') {
      const match = msg.text.match(/•\s+\*\*([^*]{3,60})\*\*/);
      if (match) return match[1].trim();
    }

    // From user messages: extract product type
    if (msg.role === 'user') {
      const productWords = msg.text
        .replace(/add|to cart|buy|search|find|show me|look for|need/gi, '')
        .trim();
      if (productWords.length > 2 && !PRONOUN_PATTERN.test(productWords)) {
        return productWords;
      }
    }
  }
  return null;
}
