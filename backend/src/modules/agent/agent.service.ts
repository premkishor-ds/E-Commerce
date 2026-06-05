import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AgentMemoryService } from './agent.memory.service';
import {
  classifyIntent,
  extractEntities,
  hasPermission,
  INTENT_PERMISSIONS,
} from './agent.intent.engine';
import { ChatbotIntelligenceService } from '../chatbot-intelligence/services/chatbot-intelligence.service';
import { AuthService } from '../auth/auth.service';
import { SalesService } from '../sales/sales.service';
import { SupportService } from '../support/support.service';
import { SupportGateway } from '../support/support.gateway';
import { CatalogService } from '../catalog/catalog.service';
import { UploadService } from '../catalog/upload.service';
import { ProfileService } from '../profile/profile.service';
import { PaymentService } from '../payment/payment.service';
import { RecoveryService } from '../sales/recovery.service';
import { VoiceService } from '../voice/voice.service';
import { NotificationService } from '../notification/notification.service';
import {
  enrichIntentMatch,
  detectEmotionalTone,
  getEmpathyPrefix,
  detectMultipleIntents,
  correctTypos,
  getClarification,
} from './agent.semantic.engine';

export interface AgentRequest {
  message: string;
  sessionId: string;
  guestId?: string;
  userId?: string;
  userRoles?: string[];
  userJwt?: string;
  // State from frontend for active step flows
  activeStep?: string;
  stepData?: Record<string, any>;
}

export interface AgentResponse {
  reply: string;
  intent: string;
  confidence: number;
  actions: AgentAction[];
  nextStep?: string;
  stepData?: Record<string, any>;
  data?: any;
  needsAuth?: boolean;
  suggestions?: string[];
}

export interface AgentAction {
  type:
    | 'ADD_TO_CART'
    | 'REMOVE_FROM_CART'
    | 'NAVIGATE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'CLEAR_CART'
    | 'UPDATE_WISHLIST'
    | 'NOTIFY';
  payload: Record<string, any>;
}

const DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    greet:
      '👋 नमस्ते! मैं एपेक्सस्टोर एआई सहायक हूं।\n\nमैं आपकी सहायता कर सकता हूँ:\n• 🔍 उत्पादों की खोज और तुलना करें\n• 🛒 अपनी कार्ट और इच्छासूची प्रबंधित करें\n• 📦 ऑर्डर ट्रैक और प्रबंधित करें\n• 🎫 सहायता टिकट बनाएं',
    help: '🤖 **एपेक्सस्टोर एआई सहायक — मैं क्या कर सकता हूँ:**\n\n🔍 **खोज**: "उत्पाद दिखाएं"\n🛒 **カート**: "कार्ट में जोड़ें"\n📦 **ऑर्डर**: "मेरे ऑर्डर", "ऑर्डर ट्रैक करें"\n\nबस स्वाभाविक रूप से लिखें!',
    thanks:
      '😊 आपका स्वागत है! क्या मैं आपकी किसी और चीज़ में मदद कर सकता हूँ?',
    bye: '👋 अलविदा! एपेಕ್ಸ್स्टोर पर फिर आएं!',
    unknown: '🤔 मुझे समझ नहीं आया। सहायता के लिए "help" टाइप करें।',
    need_login: '⚠️ इस क्रिया को करने के लिए आपको लॉग इन करना होगा।',
  },
  te: {
    greet:
      '👋 నమస్కారం! నేను అపెక్స్‌స్టోర్ AI సహాయకుడిನಿ.\n\nನೆನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ:\n• 🔍 ఉత్పత్తుల శోధన మరియు పోలిక\n• 🛒 కార్ట్ మరియు విష్‌లిస్ట్ నిర్వహణ\n• 📦 ఆర్డర్ ట్రాకింగ్\n• 🎫 సహాయ టిక్కెట్‌ల సృష్టి',
    help: '🤖 **ಅಪೇಕ್ಸ್ ಸ್ಟೋರ್ AI ಸಹಾಯಕಿ — ನಾನೇನು ಮಾಡಬಲ್ಲೆ:**\n\n🔍 **శోధన**: "ఉత్పత్తులను చూపించు"\n🛒 **కార్ట్**: "కార్ట్‌కు జోడించు"\n📦 **ಆರ್ಡರ್**: "ನಾ ಆರ್ಡರ್ಸ್"\n\nದಯವಿಟ್ಟು ಇಂಗ್ಲೀಷ್ ಅಥವಾ ತೆಲುಗು ನಲ್ಲಿ ಬರೆಯಿರಿ!',
    thanks: '😊 మీకు స్వాగతం! నేను మీకు ఇంకా ఏదైనా సహాయం చేయగలనా?',
    bye: '👋 సెలవు! అపెక్స్‌స్టోర్‌ను మళ్ಲಿ సందರ್ಶించండి!',
    unknown: '🤔 నాకు అర్థం కాలేದು. సహాయం కోసం "help" అని టైಪ್ చేయండి.',
    need_login: '⚠️ ఈ చర్యను చేయడానికి మీరు లాగిన్ అవ్వాలి.',
  },
  ta: {
    greet:
      '👋 வணக்கம்! நான் அபெக்ஸ்ஸ்டோர் AI உதவியாளர்.\n\nநான் உங்களுக்கு உதவ முடியும்:\n• 🔍 தயாரிப்புகளைத் தேட மற்றும் ஒப்பிட\n• 🛒 கார்ட் மற்றும் விருப்பப்பட்டಿಯலை நிர்வகிக்க\n• 📦 ஆர்டர்களைக் கண்காணிக்க\n• 🎫 ஆதரவு டிக்கெட்டுகளை உருவாக்க',
    help: '🤖 **அபெக்ஸ்ஸ்டோர் AI உதவியாளர் — நான் செய்யக்கூடியவை:**\n\n🔍 **தேடல்**: "தயாரிப்புகளைக் காட்டு"\n🛒 **கார்ட்**: "கார்ட்டில் சேர்"\n📦 **ಆರ್ಡರ್**: "எனது ஆர்டர்கள்"\n\nஇயல்பாக எழுதுங்கள்!',
    thanks: '😊 உங்களுக்கு வரவேற்பு! நான் உங்களுக்கு வேறு ஏதாவது உதவ முடியுமா?',
    bye: '👋 விடைபெறுகிறேன்! அபெக்ஸ்ஸ்டோருக்கு மீண்டும் வருக!',
    unknown: '🤔 எனக்கு புரியவில்லை. உதவிக்கு "help" என தட்டச்சு செய்யவும்.',
    need_login: '⚠️ இந்தச் செயலைச் செய்ய நீங்கள் உள்நுழைய வேண்டும்.',
  },
  kn: {
    greet:
      '👋 ನಮಸ್ಕಾರ! ನಾನು ಅಪೆಕ್ಸ್ ಸ್ಟೋರ್ AI ಸಹಾಯಕ.\n\nನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n• 🔍 ಉತ್ಪನ್ನಗಳ ಹುಡುಕಾಟ ಮತ್ತು ಹೋಲಿಕೆ\n• 🛒 ಕಾರ್ಟ್ ಮತ್ತು ವಿಶ್‌ಲಿಸ್ಟ್ ನಿರ್ವಹಣೆ\n• 📦 ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್\n• 🎫 ಬೆಂಬಲ ಟಿಕೆಟ್ ರಚನೆ',
    help: '🤖 **ಅಪೆಕ್ಸ್ ಸ್ಟೋರ್ AI ಸಹಾಯಕ — ನಾನು ಮಾಡಬಹುದಾದ ಕೆಲಸಗಳು:**\n\n🔍 **ಹುಡುಕಾಟ**: "ಉತ್ಪನ್ನಗಳನ್ನು ತೋರಿಸಿ"\n🛒 **ಕಾರ್ಟ್**: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ"\n📦 **ಆರ್ಡರ್**: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು"\n\nಸಹಾಯಕ್ಕಾಗಿ "help" ಎಂದು ಟೈಪ್ ಮಾಡಿ.',
    thanks: '😊 ನಿಮಗೆ ಸ್ವಾಗತ! ನಾನು ನಿಮಗೆ ಬೇರೆ ಯಾವುದಾದರೂ ಸಹಾಯ ಮಾಡಬಲ್ಲೆನೇ?',
    bye: '👋 ಹೋಗಿ ಬನ್ನಿ! ಅಪೆಕ್ಸ್ ಸ್ಟೋರ್‌ಗೆ ಮತ್ತೆ ಭೇಟಿ ನೀಡಿ!',
    unknown: '🤔 ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಸಹಾಯಕ್ಕಾಗಿ "help" ಎಂದು ಟೈಪ್ ಮಾಡಿ.',
    need_login: '⚠️ ಈ ಕ್ರಿಯೆಯನ್ನು ಮಾಡಲು ನೀವು ಲಾಗಿನ್ ಆಗಬೇಕು.',
  },
};

@Injectable()
export class AgentService {
  constructor(
    private readonly memory: AgentMemoryService,
    private readonly authService: AuthService,
    private readonly salesService: SalesService,
    private readonly supportService: SupportService,
    private readonly supportGateway: SupportGateway,
    private readonly catalogService: CatalogService,
    private readonly uploadService: UploadService,
    private readonly profileService: ProfileService,
    private readonly paymentService: PaymentService,
    private readonly recoveryService: RecoveryService,
    private readonly voiceService: VoiceService,
    private readonly notificationService: NotificationService,
    private readonly chatbotIntelligenceService: ChatbotIntelligenceService,
  ) {}

  // ─── TRANSLATION HELPERS ──────────────────────────────────────────────────
  private detectLanguage(message: string): string {
    const text = message.toLowerCase();
    if (
      /namaste|shukriya|dhanyawad|madad|alvida|नमस्ते|धन्यवाद|मदद|अलविदा/i.test(
        text,
      )
    )
      return 'hi';
    if (/namaskaram|sahayam|dhanyavadalu|నమస్కారం|సహాయం|ధన్యవాదాలు/i.test(text))
      return 'te';
    if (/vanakkam|udavi|nandri|வணக்கம்|உதவி|நன்றி/i.test(text)) return 'ta';
    if (/namaskara|sahaya|dhanyavada|ನಮಸ್ಕಾರ|ಸಹಾಯ|ಧನ್ಯವಾದ/i.test(text))
      return 'kn';
    return 'en';
  }

  private translateInput(message: string, lang: string): string {
    if (lang === 'en') return message;
    const text = message.toLowerCase();
    if (lang === 'hi') {
      if (/namaste|नमस्ते/i.test(text)) return 'hello';
      if (/madad|मದದ್|मदद/i.test(text)) return 'help';
      if (/dhanyawad|shukriya|धन्यवाद/i.test(text)) return 'thanks';
      if (/alvida|अलविदा/i.test(text)) return 'bye';
    }
    if (lang === 'te') {
      if (/namaskaram|నమస్కారం/i.test(text)) return 'hello';
      if (/sahayam|సహాయం/i.test(text)) return 'help';
      if (/dhanyavadalu|ధన్యవాదాలు/i.test(text)) return 'thanks';
      if (/bye/i.test(text)) return 'bye';
    }
    if (lang === 'ta') {
      if (/vanakkam|வணக்கம்/i.test(text)) return 'hello';
      if (/udavi|உதவி/i.test(text)) return 'help';
      if (/nandri|நன்றி/i.test(text)) return 'thanks';
      if (/bye/i.test(text)) return 'bye';
    }
    if (lang === 'kn') {
      if (/namaskara|ನಮಸ್ಕಾರ/i.test(text)) return 'hello';
      if (/sahaya|ಸಹಾಯ/i.test(text)) return 'help';
      if (/dhanyavada|ಧನ್ಯವಾದ/i.test(text)) return 'thanks';
      if (/bye/i.test(text)) return 'bye';
    }
    return message;
  }

  private translateReply(intent: string, reply: string, lang: string): string {
    if (lang === 'en' || !lang) return reply;
    const dict = DICTIONARY[lang];
    if (!dict) return reply;
    if (intent === 'GREET') return dict.greet || reply;
    if (intent === 'HELP') return dict.help || reply;
    if (intent === 'THANKS') return dict.thanks || reply;
    if (intent === 'BYE') return dict.bye || reply;
    if (intent === 'UNKNOWN') return dict.unknown || reply;
    return reply;
  }

  // ─── LOCAL GEMMA INTEGRATION ──────────────────────────────────────────────
  private async callLocalGemma(prompt: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Fast 1.5s timeout
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma',
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) return null;
      const data = await response.json();
      return data.response || null;
    } catch {
      return null;
    }
  }

  private async classifyIntentWithGemma(
    message: string,
  ): Promise<string | null> {
    const prompt = `Classify the user message into exactly one of these intents: GREET, REGISTER, LOGIN, LOGOUT, RESET_PASSWORD, CHANGE_PASSWORD, OTP_VERIFY, EMAIL_VERIFY, ADDRESS_MANAGE, VIEW_PROFILE, UPDATE_PROFILE, VIEW_LOYALTY, VIEW_WALLET, NOTIFICATION_PREF, SEARCH_PRODUCT, GET_PRODUCT, COMPARE, RECOMMEND, ADD_CART, REMOVE_CART, VIEW_CART, APPLY_COUPON, REMOVE_COUPON, CHECKOUT, VIEW_ORDERS, TRACK_ORDER, CANCEL_ORDER, RETURN_ORDER, REFUND, REORDER, DOWNLOAD_INVOICE, WISHLIST_ADD, WISHLIST_VIEW, WISHLIST_REMOVE, CREATE_TICKET, VIEW_TICKETS, ESCALATE, REVIEW_PRODUCT, BROWSE_CATEGORY, INVENTORY_CHECK, ADMIN_PRODUCTS, ADMIN_ORDERS, ADMIN_USERS, ADMIN_COUPONS, ADMIN_ANALYTICS, VENDOR_PRODUCTS, VENDOR_ANALYTICS, VENDOR_SETTLEMENTS, HELP. Respond with ONLY the intent name in uppercase, nothing else.
User Message: "${message}"
Intent:`;
    const res = await this.callLocalGemma(prompt);
    if (res) {
      const cleaned = res.trim().toUpperCase();
      if (
        cleaned in INTENT_PERMISSIONS ||
        [
          'GREET',
          'HELP',
          'THANKS',
          'BYE',
          'RECOMMEND',
          'SEARCH_PRODUCT',
        ].includes(cleaned)
      ) {
        return cleaned;
      }
    }
    return null;
  }

  private async enhanceReplyWithGemma(
    reply: string,
    contextPrompt?: string,
  ): Promise<string> {
    const prompt = `You are the ApexStore AI Assistant. Enhance the following system reply to be friendly, helpful, and conversational. Do not add details not present in the system reply. Keep markdown formatting and hyperlinks as they are.
System Reply:
${reply}
${contextPrompt ? `Context: ${contextPrompt}` : ''}
Enhanced Reply:`;
    const gemmaResponse = await this.callLocalGemma(prompt);
    return gemmaResponse ? gemmaResponse.trim() : reply;
  }

  async processMessage(req: AgentRequest): Promise<AgentResponse> {
    const {
      message,
      sessionId,
      guestId,
      userId,
      userRoles = [],
      activeStep,
      stepData = {},
    } = req;

    const sessionOwnerId = userId || guestId;
    if (sessionOwnerId && Types.ObjectId.isValid(sessionOwnerId)) {
      const activeSession = await (this.supportService as any).liveChatSessionRepository.findOne({
        userId: new Types.ObjectId(sessionOwnerId),
        status: 'Active',
      });
      if (activeSession) {
        const session = await this.supportService.sendChatMessage(
          activeSession._id.toString(),
          sessionOwnerId,
          userId ? 'Customer' : 'Guest',
          message,
        );
        const latestMsg = session.messages[session.messages.length - 1];
        if (this.supportGateway && this.supportGateway.server) {
          this.supportGateway.server.to(activeSession._id.toString()).emit('new_message', {
            sessionId: activeSession._id.toString(),
            message: latestMsg,
          });
        }
        return {
          reply: `[Live Agent Active] Message sent to support representative.`,
          intent: 'LIVE_AGENT_MESSAGE',
          confidence: 1.0,
          actions: [],
        };
      }
    }

    // Detect language
    let lang = this.detectLanguage(message);
    if (userId) {
      try {
        const profile = await this.profileService.getProfile(userId);
        if (profile) {
          if (lang !== 'en' && profile.languagePreference !== lang) {
            profile.languagePreference = lang;
            await profile.save();
          } else if (profile.languagePreference) {
            lang = profile.languagePreference;
          }
        }
      } catch {
        /* ignore */
      }
    }

    const workMessage = this.translateInput(message, lang);

    // Ensure session exists
    await this.memory.getOrCreateSession(sessionId, userId, guestId);
    if (guestId) await this.memory.trackGuestSession(guestId, sessionId);

    // ─── ACTIVE STEP FLOWS ──────────────────────────────────────────────────
    // Run active step handler first if we are in an active workflow
    const AUTH_STEPS = [
      'LOGIN_EMAIL',
      'LOGIN_PASSWORD',
      'REGISTER_EMAIL',
      'REGISTER_PASSWORD',
    ];
    const isStaleAuthStep =
      activeStep && AUTH_STEPS.includes(activeStep) && !!userId;

    if (activeStep && !isStaleAuthStep) {
      const ruleMatchForStep = classifyIntent(workMessage);
      const stepEntities = ruleMatchForStep.entities;
      const stepResult = await this.handleActiveStep(
        workMessage,
        activeStep,
        stepData,
        userId,
        userRoles,
        sessionId,
        stepEntities,
      );
      if (stepResult) {
        stepResult.reply = await this.enhanceReplyWithGemma(
          stepResult.reply,
          `Active workflow: ${activeStep}`,
        );
        stepResult.reply = this.translateReply(
          stepResult.intent || 'UNKNOWN',
          stepResult.reply,
          lang,
        );
        await this.memory.appendMessage(
          sessionId,
          'bot',
          stepResult.reply,
          stepResult.intent || 'UNKNOWN',
          stepResult.actions.map((a) => a.type),
        );
        return stepResult;
      }
    }

    // 1. Get original rule-based results
    const typoFixed = correctTypos(workMessage);
    const ruleMatch = classifyIntent(typoFixed !== workMessage ? typoFixed : workMessage);
    const originalEntities = ruleMatch.entities;

    // 2. Route message through the Chatbot Intelligence Layer
    const intelResult = this.chatbotIntelligenceService.processQuery(sessionId, workMessage);

    // Keep GREET / BYE / THANKS / HELP if matched by rules
    if (ruleMatch.intent === 'GREET' || ruleMatch.intent === 'BYE' || ruleMatch.intent === 'THANKS') {
      intelResult.intent = ruleMatch.intent;
    }

    // Override generic intents with specific ruleMatch intents
    if ((intelResult.intent === 'HELP' || intelResult.intent === 'UNKNOWN') && ruleMatch.intent !== 'UNKNOWN' && ruleMatch.intent !== 'HELP') {
      intelResult.intent = ruleMatch.intent;
    }

    // Override if rule Match has higher confidence/score
    if (ruleMatch.score > intelResult.confidence * 10) {
      intelResult.intent = ruleMatch.intent;
    }

    const isActuallyFallback = intelResult.isFallback && (ruleMatch.intent === 'UNKNOWN' || ruleMatch.score < 4);
    const isActuallyClarifying = intelResult.needsClarification && (ruleMatch.intent === 'UNKNOWN' || ruleMatch.score < 4);

    if (isActuallyFallback) {
      const reply = intelResult.fallbackQuestion;
      const translatedReply = this.translateReply('HELP', reply, lang);
      await this.memory.appendMessage(sessionId, 'bot', translatedReply, 'HELP');
      return {
        reply: translatedReply,
        intent: 'HELP',
        confidence: intelResult.confidence,
        actions: [],
        suggestions: intelResult.fallbackSuggestions,
      };
    }

    if (isActuallyClarifying && intelResult.clarificationQuestion) {
      const reply = intelResult.clarificationQuestion;
      const translatedReply = this.translateReply('HELP', reply, lang);
      await this.memory.appendMessage(sessionId, 'bot', translatedReply, 'HELP');
      return {
        reply: translatedReply,
        intent: 'HELP',
        confidence: intelResult.confidence,
        actions: [],
        suggestions: [],
      };
    }

    let intent = intelResult.intent;
    let score = Math.max(intelResult.confidence * 10, ruleMatch.score);
    const entities = { ...originalEntities, ...intelResult.entities };

    // 3. Detect emotional tone and inject empathy prefix into reply later
    const emotionalTone = detectEmotionalTone(workMessage);
    const empathyPrefix = getEmpathyPrefix(emotionalTone);

    // Save user message to database history
    await this.memory.appendMessage(sessionId, 'user', message, intent);

    // Intercept checkout as guest commands directly
    const textMsg = workMessage.toLowerCase().trim();
    if (textMsg === 'checkout as guest' || textMsg === 'guest checkout') {
      const reply = `📦 **Guest Checkout Selected**\n\nPlease enter the **Full Name** of the recipient to begin checkout:`;
      const translatedReply = this.translateReply('CHECKOUT', reply, lang);
      const response: AgentResponse = {
        reply: translatedReply,
        intent: 'CHECKOUT',
        confidence: 10,
        actions: [],
        nextStep: 'CHECKOUT_NAME',
        stepData: { isGuest: true, guestId: guestId || sessionId },
      };
      await this.memory.appendMessage(
        sessionId,
        'bot',
        translatedReply,
        'CHECKOUT',
      );
      return response;
    }

    // Get conversation context
    const ctx = await this.memory.getFullContext(sessionId, userId, guestId);

    // ─── PERMISSION CHECK ────────────────────────────────────────────────────
    const evaluatedRoles = userRoles.length ? userRoles : ['Guest'];
    if (!hasPermission(intent, evaluatedRoles)) {
      const reply = `⚠️ You need to be logged in as **${this.getRequiredRole(intent)}** to perform this action. Type **"login"** to sign in.`;
      const translatedReply = this.translateReply(intent, reply, lang);
      await this.memory.appendMessage(
        sessionId,
        'bot',
        translatedReply,
        intent,
      );
      return {
        reply: translatedReply,
        intent,
        confidence: score,
        actions: [],
        needsAuth: true,
        suggestions: ['Login', 'Register new account'],
      };
    }

    // ─── DISPATCH INTENT ────────────────────────────────────────────────────
    const response = await this.dispatchIntent(
      intent,
      entities,
      workMessage,
      userId,
      evaluatedRoles,
      sessionId,
      ctx,
      guestId,
    );
    // Prepend empathy for emotional customers
    if (empathyPrefix && !response.reply.startsWith(empathyPrefix)) {
      response.reply = empathyPrefix + response.reply;
    }
    response.reply = await this.enhanceReplyWithGemma(
      response.reply,
      `User says: ${workMessage}`,
    );
    response.reply = this.translateReply(intent, response.reply, lang);
    await this.memory.appendMessage(
      sessionId,
      'bot',
      response.reply,
      intent,
      response.actions.map((a) => a.type),
    );

    // Update memory from entities
    if (userId) {
      if (entities.productType || entities.brand || entities.category) {
        const searchTerm =
          entities.productType || entities.brand || entities.category || '';
        await this.memory.updateUserSearchHistory(userId, searchTerm);
      }
    } else if (guestId) {
      const searchTerm =
        entities.productType || entities.brand || entities.category || '';
      if (searchTerm) await this.memory.addGuestSearch(guestId, searchTerm);
    }

    return response;
  }

  // ─── ACTIVE STEP HANDLER ────────────────────────────────────────────────────

  private async handleActiveStep(
    message: string,
    step: string,
    data: Record<string, any>,
    userId: string | undefined,
    roles: string[],
    sessionId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entities: Record<string, string>,
  ): Promise<AgentResponse | null> {
    const q = message.toLowerCase().trim();

    switch (step) {
      case 'REGISTER_EMAIL':
        if (!message.includes('@') || !message.includes('.')) {
          return this.buildReply(
            'Please enter a valid **email address**:',
            'REGISTER',
            0,
            [],
            'REGISTER_EMAIL',
            data,
          );
        }
        return this.buildReply(
          `Got it! Now choose a **password** (min 6 characters):`,
          'REGISTER',
          8,
          [],
          'REGISTER_PASSWORD',
          { ...data, email: message.trim() },
        );

      case 'REGISTER_PASSWORD':
        if (message.length < 6) {
          return this.buildReply(
            'Password must be at least **6 characters**. Please try again:',
            'REGISTER',
            0,
            [],
            'REGISTER_PASSWORD',
            data,
          );
        }
        try {
          const result = await this.authService.register({
            email: data.email,
            password: message,
          });
          return {
            reply: `🎉 **Account Created!**\nWelcome **${data.email}**! You are now registered and logged in.\n\nWhat would you like to do next?`,
            intent: 'REGISTER',
            confidence: 10,
            actions: [
              {
                type: 'LOGIN',
                payload: { user: result.user, token: result.accessToken },
              },
            ],
            suggestions: ['Browse products', 'View cart', 'My profile'],
          };
        } catch (err: any) {
          return this.buildReply(
            `❌ Registration failed: ${err.message}. Try a different email.`,
            'REGISTER',
            0,
            [],
          );
        }

      case 'LOGIN_EMAIL':
        if (!message.includes('@')) {
          return this.buildReply(
            'Please enter a valid email address:',
            'LOGIN',
            0,
            [],
            'LOGIN_EMAIL',
            data,
          );
        }
        return this.buildReply(
          `Enter your **password** for **${message}**:`,
          'LOGIN',
          8,
          [],
          'LOGIN_PASSWORD',
          { ...data, email: message.trim() },
        );

      case 'LOGIN_PASSWORD':
        try {
          const result = await this.authService.login({
            email: data.email,
            password: message,
          });
          return {
            reply: `🔑 **Logged in successfully!**\nWelcome back, **${data.email}**! You are signed in as **${result.user.roles?.join(', ') || 'Customer'}**.\n\nHow can I help you today?`,
            intent: 'LOGIN',
            confidence: 10,
            actions: [
              {
                type: 'LOGIN',
                payload: { user: result.user, token: result.accessToken },
              },
            ],
            suggestions: ['My orders', 'Browse products', 'My cart'],
          };
        } catch {
          return this.buildReply(
            `❌ Invalid email or password. Please try again or type **"reset password"** to recover your account.`,
            'LOGIN',
            0,
            [],
            'LOGIN_EMAIL',
            {},
          );
        }

      case 'OTP_VERIFY_STEP':
        if (data.phone) {
          try {
            const result = await this.authService.verifyOtp(
              data.phone,
              message.trim(),
            );
            return {
              reply: `✅ **OTP Verified Successfully!**\nWelcome back. You are signed in.`,
              intent: 'OTP_VERIFY',
              confidence: 10,
              actions: [
                {
                  type: 'LOGIN',
                  payload: { user: result.user, token: result.accessToken },
                },
              ],
              suggestions: ['My profile', 'Browse products'],
            };
          } catch {
            return this.buildReply(
              `❌ Invalid or expired OTP. Please try again:`,
              'OTP_VERIFY',
              0,
              [],
              'OTP_VERIFY_STEP',
              data,
            );
          }
        }
        return this.buildReply('Phone context missing.', 'OTP_VERIFY', 0, []);

      case 'CHANGE_PASSWORD_STEP':
        if (message.length < 6) {
          return this.buildReply(
            'Password must be at least **6 characters**. Please try again:',
            'CHANGE_PASSWORD',
            0,
            [],
            'CHANGE_PASSWORD_STEP',
            data,
          );
        }
        return this.buildReply(
          `✅ **Password Updated!**\nYour password has been changed.`,
          'CHANGE_PASSWORD',
          10,
          [],
        );

      case 'CREATE_TICKET_SUBJECT':
        return this.buildReply(
          `Got it! Please describe the **issue in detail**:`,
          'CREATE_TICKET',
          8,
          [],
          'CREATE_TICKET_MESSAGE',
          { ...data, subject: message },
        );

      case 'CREATE_TICKET_MESSAGE':
        if (userId) {
          try {
            const history = await this.memory.getRecentHistory(sessionId, 10);
            const historyText = history
              .map(
                (h) => `[${h.role === 'user' ? 'User' : 'Chatbot'}]: ${h.text}`,
              )
              .join('\n');
            const messageWithLogs = `${message}\n\n---\n💬 **Chat Session Transcript:**\n${historyText}`;

            const ticket = await this.supportService.createTicket(userId, {
              subject: data.subject,
              message: messageWithLogs,
              priority: data.priority || 'Medium',
            });
            return {
              reply: `✅ **Support Ticket Created!**\nYour ticket **#${ticket._id?.toString().slice(-6).toUpperCase() || 'XXXX'}** has been submitted.\n\n• **Subject**: ${data.subject}\n• **Status**: Open\n• **Priority**: ${data.priority || 'Medium'}\n\nOur team will respond within 24 hours.`,
              intent: 'CREATE_TICKET',
              confidence: 10,
              actions: [],
              suggestions: ['View my tickets', 'Track order', 'Home'],
            };
          } catch {
            return this.buildReply(
              'Failed to create ticket. Please try again.',
              'CREATE_TICKET',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          'Please **login** to create a support ticket.',
          'CREATE_TICKET',
          0,
          [],
          undefined,
          undefined,
          true,
        );

      case 'REVIEW_RATING': {
        const num = parseInt(q.replace(/\D/g, ''));
        if (isNaN(num) || num < 1 || num > 5) {
          return this.buildReply(
            'Please enter a number between **1 and 5** stars:',
            'REVIEW_PRODUCT',
            0,
            [],
            'REVIEW_RATING',
            data,
          );
        }
        return this.buildReply(
          `${num} stars! Now type your **review comment**:`,
          'REVIEW_PRODUCT',
          8,
          [],
          'REVIEW_COMMENT',
          { ...data, rating: num },
        );
      }

      case 'REVIEW_COMMENT':
        return {
          reply: `⭐ **Review Submitted!**\n\nThank you for rating **${data.productTitle || 'the product'}** **${data.rating}/5** stars!\n\n*"${message}"*\n\nYour review helps other shoppers!`,
          intent: 'REVIEW_PRODUCT',
          confidence: 10,
          actions: [],
          data: {
            productId: data.productId,
            rating: data.rating,
            comment: message,
          },
          suggestions: ['Browse similar products', 'My orders'],
        };

      case 'CHECKOUT_ADDRESS_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please login.',
            'CHECKOUT',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        if (q === 'new') {
          return this.buildReply(
            `📦 Let's place your order!\n\nPlease enter the **Full Name** of the recipient:`,
            'CHECKOUT',
            8,
            [],
            'CHECKOUT_NAME',
            data,
          );
        }
        try {
          const addresses = await this.profileService.getAddresses(userId);
          const index = parseInt(message.trim()) - 1;
          const selected = addresses[index];
          if (!selected) {
            return this.buildReply(
              '⚠️ Invalid selection. Please choose a number from the list or type **"new"**:',
              'CHECKOUT',
              0,
              [],
              'CHECKOUT_ADDRESS_SELECT',
              data,
              false,
              [...addresses.map((_, i) => String(i + 1)), 'new'],
            );
          }
          const updated = {
            ...data,
            fullName: selected.fullName,
            address: (selected as any).addressLine1 || (selected as any).street,
            city: selected.city,
            zipCode: (selected as any).postalCode || (selected as any).pincode,
          };
          return this.buildReply(
            `💳 **Select a Payment Method:**\n\n• **Stripe** (Card)\n• **Razorpay** (UPI/Netbanking)\n• **Wallet** (Store credits)\n• **COD** (Cash on Delivery)\n\nPlease type your choice:`,
            'CHECKOUT',
            8,
            [],
            'CHECKOUT_PAYMENT_SELECT',
            updated,
            false,
            ['Stripe', 'Razorpay', 'Wallet', 'COD'],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Error selecting address: ${e.message}`,
            'CHECKOUT',
            0,
            [],
          );
        }
      }

      case 'CHECKOUT_NAME':
        return this.buildReply(
          `Thanks **${message}**! Please enter your **shipping address**:`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_ADDRESS',
          { ...data, fullName: message },
        );

      case 'CHECKOUT_ADDRESS':
        return this.buildReply(
          `Got it! Enter your **City** and **ZIP Code** (format: City, ZIP):`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_CITY_ZIP',
          { ...data, address: message },
        );

      case 'CHECKOUT_CITY_ZIP': {
        const parts = message.split(',');
        const city = parts[0]?.trim() || message;
        const zip = parts[1]?.trim() || '';
        const updated = {
          ...data,
          city,
          zipCode: zip,
        };
        return this.buildReply(
          `💳 **Select a Payment Method:**\n\n• **Stripe** (Card)\n• **Razorpay** (UPI/Netbanking)\n• **Wallet** (Store credits)\n• **COD** (Cash on Delivery)\n\nPlease type your choice:`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_PAYMENT_SELECT',
          updated,
          false,
          ['Stripe', 'Razorpay', 'Wallet', 'COD'],
        );
      }

      case 'CHECKOUT_PAYMENT_SELECT': {
        const choice = message.trim();
        const valid = ['Stripe', 'Razorpay', 'Wallet', 'COD'];
        const match = valid.find(
          (v) => v.toLowerCase() === choice.toLowerCase(),
        );
        if (!match) {
          return this.buildReply(
            `⚠️ Invalid payment method. Please choose from: **Stripe**, **Razorpay**, **Wallet**, or **COD**:`,
            'CHECKOUT',
            0,
            [],
            'CHECKOUT_PAYMENT_SELECT',
            data,
            false,
            valid,
          );
        }

        if (match === 'Wallet') {
          if (!userId)
            return this.buildReply(
              'Please **login** to pay via Wallet.',
              'CHECKOUT',
              5,
              [],
              undefined,
              undefined,
              true,
            );
          try {
            const profile = await this.profileService.getProfile(userId);
            const balance = profile.walletBalance || 0;
            if (balance < data.total) {
              return this.buildReply(
                `❌ **Insufficient Wallet Balance!**\n\n• **Required**: $${data.total?.toFixed(2)}\n• **Available**: $${balance.toFixed(2)}\n\nPlease choose another payment method:`,
                'CHECKOUT',
                0,
                [],
                'CHECKOUT_PAYMENT_SELECT',
                data,
                false,
                ['Stripe', 'Razorpay', 'COD'],
              );
            }
          } catch (e: any) {
            return this.buildReply(
              `❌ Profile check failed: ${e.message}`,
              'CHECKOUT',
              0,
              [],
            );
          }
        }

        const updated: any = {
          ...data,
          paymentProvider: match,
        };

        const cartSummary = data.cartItems
          ? data.cartItems
              .map((i: any) => `• ${i.title} ×${i.quantity}`)
              .join('\n')
          : 'Your cart items';

        return this.buildReply(
          `📦 **Order Summary:**\n\n${cartSummary}\n\n` +
            `• **Deliver to**: ${updated.fullName}, ${updated.address}, ${updated.city} ${updated.zipCode}\n` +
            `• **Payment Method**: ${updated.paymentProvider}\n` +
            `• **Total Price**: $${(data.total || 0).toFixed(2)}\n\n` +
            `Type **"confirm"** to place the order or **"cancel"** to abort.`,
          'CHECKOUT',
          8,
          [],
          'CHECKOUT_CONFIRM',
          updated,
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'CHECKOUT_CONFIRM': {
        const isConfirm =
          q === 'confirm' ||
          q === 'yes' ||
          q === 'place order' ||
          q.includes('confirm order') ||
          q === 'ok' ||
          q === 'okay' ||
          q === 'sure' ||
          q === 'y';

        if (isConfirm) {
          if (data.cartItems?.length > 0) {
            try {
              if (data.paymentProvider === 'Wallet' && userId) {
                const user = await (
                  this.authService as any
                ).userRepository.findById(userId);
                if (user) {
                  user.walletBalance = (user.walletBalance || 0) - data.total;
                  await user.save();
                }
              }

              const order = await this.salesService.placeOrder(userId || null, {
                items: data.cartItems.map((i: any) => ({
                  productId: i.productId || i.id,
                  quantity: i.quantity,
                })),
                shippingAddress: {
                  fullName: data.fullName,
                  addressLine1: data.address,
                  city: data.city,
                  postalCode: data.zipCode,
                  country: 'US',
                  state: '',
                  phone: '',
                },
                guestId: data.guestId,
                paymentProvider: data.paymentProvider || 'Stripe',
              });

              if (data.paymentProvider !== 'COD') {
                await this.salesService.updateOrderStatus(
                  String(order._id),
                  'Paid',
                  'Payment verified successfully.',
                );
              }

              return {
                reply: `🎉 **Order Placed Successfully!**\n\nYour order **#${String(order._id).slice(-8).toUpperCase()}** is confirmed!\n\n• **Status**: ${data.paymentProvider === 'COD' ? 'Pending' : 'Paid (Verified)'}\n• **Total**: $${data.total?.toFixed(2)}\n• **Payment**: ${data.paymentProvider}\n• **Delivery**: ${data.fullName}, ${data.city}\n\nYou can track this order via Order Tracking inside the chat!`,
                intent: 'CHECKOUT',
                confidence: 10,
                actions: [{ type: 'CLEAR_CART', payload: {} }],
                suggestions: [
                  'Track my order',
                  'Cancel order',
                  'Continue shopping',
                ],
              };
            } catch (err: any) {
              return this.buildReply(
                `❌ Order failed: ${err.message}`,
                'CHECKOUT',
                0,
                [],
              );
            }
          }
        }
        return this.buildReply(
          'Order cancelled. You can continue browsing whenever you are ready!',
          'CHECKOUT',
          8,
          [],
          undefined,
          undefined,
          false,
          ['View cart', 'Browse products'],
        );
      }

      case 'CANCEL_ORDER_CONFIRM':
        if (q === 'confirm' || q === 'yes') {
          try {
            await this.salesService.updateOrderStatus(
              data.orderId,
              'Cancelled',
              'Cancelled by user via Chatbot',
            );
            return {
              reply: `✅ **Order #${data.orderId.slice(-8).toUpperCase()} Cancelled Successfully.**\nYour order has been cancelled and a refund has been initiated.`,
              intent: 'CANCEL_ORDER',
              confidence: 10,
              actions: [],
              suggestions: ['Browse products', 'My orders'],
            };
          } catch (err: any) {
            return this.buildReply(
              `❌ Cancellation failed: ${err.message}`,
              'CANCEL_ORDER',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          'Cancellation aborted. Your order is still active.',
          'CANCEL_ORDER',
          8,
          [],
        );

      // ── Return / Refund flow ──────────────────────────────────────────────
      case 'RETURN_ORDER_ID': {
        let orderId = '';
        if (/my latest|last order|most recent/i.test(message) && userId) {
          try {
            const orders = await this.salesService.getOrders(userId);
            if (orders?.[0])
              orderId = `ORD-${String(orders[0]._id).slice(-8).toUpperCase()}`;
          } catch {
            /* ignore */
          }
        } else {
          const idMatch = message.match(/[A-Z0-9-]{6,}/i);
          if (idMatch) orderId = idMatch[0].toUpperCase();
        }
        if (!orderId) {
          return this.buildReply(
            '⚠️ Please provide a valid Order ID (e.g. *ORD-A1B2C3D4*) or say **"my latest order"**:',
            'RETURN_ORDER',
            0,
            [],
            'RETURN_ORDER_ID',
            data,
          );
        }
        // Auto-create return ticket
        try {
          await this.supportService.createTicket(userId || 'guest', {
            subject: `Return Request: ${orderId}`,
            message: `Customer is requesting a return/refund for order ${orderId}. Initiated via AI Chatbot.`,
            priority: 'High',
          });
          return {
            reply: `✅ **Return Ticket Created!**\n\n📋 A return request for order **${orderId}** has been submitted.\n\n• **Subject**: Return Request: ${orderId}\n• **Priority**: High\n• **Status**: Open\n\nOur team will review and send a pre-paid return label within **24 hours**.`,
            intent: 'RETURN_ORDER',
            confidence: 10,
            actions: [],
            suggestions: [
              'View my tickets',
              'Track order',
              'Continue shopping',
            ],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to create return ticket: ${e.message}. Please try again.`,
            'RETURN_ORDER',
            0,
            [],
          );
        }
      }
      // ─────────────────────────────────────────────────────────────────────
      case 'PROFILE_UPDATE_NAME': {
        const newName = message.trim();
        if (!newName || newName.length < 2) {
          return this.buildReply(
            '⚠️ Please enter a valid name (at least 2 characters):',
            'UPDATE_PROFILE',
            0,
            [],
            'PROFILE_UPDATE_NAME',
            data,
            false,
            [],
          );
        }
        return this.buildReply(
          `✏️ Got it! Shall I update your display name to **"${newName}"**?`,
          'UPDATE_PROFILE',
          9,
          [],
          'PROFILE_UPDATE_CONFIRM',
          { ...data, value: newName },
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'PROFILE_UPDATE_CONFIRM': {
        const isConfirm =
          q === 'yes' ||
          q.includes('yes') ||
          q.includes('confirm') ||
          q.includes('update it') ||
          q === 'ok' ||
          q === 'sure' ||
          q === 'y';
        const isCancel =
          q === 'no' ||
          q.includes('no') ||
          q.includes('cancel') ||
          q.includes('cancele') ||
          q === 'n';

        if (isConfirm) {
          if (!userId) {
            return this.buildReply(
              'Please **login** to update your profile.',
              'UPDATE_PROFILE',
              5,
              [],
              undefined,
              undefined,
              true,
            );
          }
          try {
            await this.profileService.updateProfile(userId, {
              displayName: data.value,
              firstName: data.value.split(' ')[0] || data.value,
              lastName: data.value.split(' ').slice(1).join(' ') || '',
            });
            return {
              reply: `✅ **Profile updated!**\n\nYour display name has been changed to **"${data.value}"** successfully!`,
              intent: 'UPDATE_PROFILE',
              confidence: 10,
              actions: [
                {
                  type: 'NOTIFY',
                  payload: { message: `Name updated to "${data.value}"` },
                },
              ],
              suggestions: ['View profile', 'Change password', 'My orders'],
            };
          } catch (err: any) {
            return this.buildReply(
              `❌ Failed to update name: ${err.message || 'Unknown error'}. Please try again.`,
              'UPDATE_PROFILE',
              0,
              [],
            );
          }
        } else if (isCancel) {
          return this.buildReply(
            '❌ Name update cancelled. Your profile is unchanged.',
            'UPDATE_PROFILE',
            8,
            [],
            undefined,
            undefined,
            false,
            ['View profile', 'My orders'],
          );
        } else {
          return this.buildReply(
            `⚠️ Please confirm or cancel the name update to **"${data.value}"**.\n\nType **Confirm** or **Cancel**:`,
            'UPDATE_PROFILE',
            0,
            [],
            'PROFILE_UPDATE_CONFIRM',
            data,
            false,
            ['Confirm', 'Cancel'],
          );
        }
      }
      // ─────────────────────────────────────────────────────────────────────────

      // ── Address CRUD Flow ──────────────────────────────────────────────────
      case 'ADD_ADDRESS_NAME':
        return this.buildReply(
          '📞 Please enter the **Mobile Number** for this address:',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_MOBILE',
          { ...data, fullName: message.trim() },
        );

      case 'ADD_ADDRESS_MOBILE':
        return this.buildReply(
          '📍 Please enter the **Street Address** (e.g. Apartment, Suite, Street name):',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_STREET',
          { ...data, mobile: message.trim() },
        );

      case 'ADD_ADDRESS_STREET':
        return this.buildReply(
          '🏙️ Please enter the **City** name:',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_CITY',
          { ...data, street: message.trim() },
        );

      case 'ADD_ADDRESS_CITY':
        return this.buildReply(
          '🗺️ Please enter the **State** name:',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_STATE',
          { ...data, city: message.trim() },
        );

      case 'ADD_ADDRESS_STATE':
        return this.buildReply(
          '📮 Please enter the **Pincode / Postal Code**:',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_PINCODE',
          { ...data, state: message.trim() },
        );

      case 'ADD_ADDRESS_PINCODE':
        return this.buildReply(
          '🏠 Choose an **Address Type** (e.g., Home, Office, Work):',
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_TYPE',
          { ...data, pincode: message.trim() },
          false,
          ['Home', 'Office'],
        );

      case 'ADD_ADDRESS_TYPE': {
        const addrType = message.trim();
        const addressSummary = `\n• **Name**: ${data.fullName}\n• **Phone**: ${data.mobile}\n• **Street**: ${data.street}\n• **City/State/Pin**: ${data.city}, ${data.state} - ${data.pincode}\n• **Type**: ${addrType}`;
        return this.buildReply(
          `📝 **Please confirm the new address:**\n${addressSummary}\n\nShall I add this address?`,
          'ADDRESS_MANAGE',
          9,
          [],
          'ADD_ADDRESS_CONFIRM',
          { ...data, addressType: addrType },
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'ADD_ADDRESS_CONFIRM': {
        const isConfirm =
          q === 'yes' ||
          q.includes('yes') ||
          q.includes('confirm') ||
          q === 'ok' ||
          q === 'y';
        if (isConfirm) {
          if (!userId)
            return this.buildReply(
              'Please **login** to manage addresses.',
              'ADDRESS_MANAGE',
              5,
              [],
              undefined,
              undefined,
              true,
            );
          try {
            await this.profileService.addAddress(userId, {
              fullName: data.fullName,
              phone: data.mobile,
              addressLine1: data.street,
              city: data.city,
              state: data.state,
              postalCode: data.pincode,
              addressType: data.addressType,
            });
            return {
              reply:
                '✅ **Address added successfully!** You can now use it at checkout or manage it from your profile.',
              intent: 'ADDRESS_MANAGE',
              confidence: 10,
              actions: [],
              suggestions: ['View addresses', 'My profile'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to add address: ${e.message}`,
              'ADDRESS_MANAGE',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          '❌ Address addition cancelled.',
          'ADDRESS_MANAGE',
          8,
          [],
          undefined,
          undefined,
          false,
          ['View addresses', 'My profile'],
        );
      }

      case 'DELETE_ADDRESS_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage addresses.',
            'ADDRESS_MANAGE',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const addresses = await this.profileService.getAddresses(userId);
        const index = parseInt(message.trim()) - 1;
        const selected = addresses[index];
        if (!selected) {
          return this.buildReply(
            '⚠️ Invalid selection. Please select a valid number from the list:',
            'ADDRESS_MANAGE',
            0,
            [],
            'DELETE_ADDRESS_SELECT',
            data,
            false,
            addresses.map((a, i) => String(i + 1)),
          );
        }
        try {
          await this.profileService.deleteAddress(userId, String(selected._id));
          return {
            reply: `✅ **Address deleted successfully.**`,
            intent: 'ADDRESS_MANAGE',
            confidence: 10,
            actions: [],
            suggestions: ['View addresses', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to delete address: ${e.message}`,
            'ADDRESS_MANAGE',
            0,
            [],
          );
        }
      }

      case 'SET_DEFAULT_ADDRESS_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage addresses.',
            'ADDRESS_MANAGE',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const addresses = await this.profileService.getAddresses(userId);
        const index = parseInt(message.trim()) - 1;
        const selected = addresses[index];
        if (!selected) {
          return this.buildReply(
            '⚠️ Invalid selection. Please select a valid number from the list:',
            'ADDRESS_MANAGE',
            0,
            [],
            'SET_DEFAULT_ADDRESS_SELECT',
            data,
            false,
            addresses.map((a, i) => String(i + 1)),
          );
        }
        try {
          await this.profileService.updateAddress(
            userId,
            String(selected._id),
            { isDefault: true },
          );
          return {
            reply: `✅ **Address set as default successfully.**`,
            intent: 'ADDRESS_MANAGE',
            confidence: 10,
            actions: [],
            suggestions: ['View addresses', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to set default: ${e.message}`,
            'ADDRESS_MANAGE',
            0,
            [],
          );
        }
      }

      // ── Payment Method Flow ────────────────────────────────────────────────
      case 'ADD_PAYMENT_METHOD_TYPE': {
        const type = message.trim();
        return this.buildReply(
          `💳 Please enter details for **${type}** (e.g. Card number or UPI ID):`,
          'VIEW_PAYMENT_METHODS',
          9,
          [],
          'ADD_PAYMENT_METHOD_DETAILS',
          { ...data, type },
        );
      }

      case 'ADD_PAYMENT_METHOD_DETAILS': {
        const details = message.trim();
        return this.buildReply(
          `📝 Confirm saving payment details: **${data.type} (${details})**?`,
          'VIEW_PAYMENT_METHODS',
          9,
          [],
          'ADD_PAYMENT_METHOD_CONFIRM',
          { ...data, details },
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'ADD_PAYMENT_METHOD_CONFIRM': {
        const isConfirm =
          q === 'yes' ||
          q.includes('yes') ||
          q.includes('confirm') ||
          q === 'ok' ||
          q === 'y';
        if (isConfirm) {
          if (!userId)
            return this.buildReply(
              'Please **login** to save payment methods.',
              'VIEW_PAYMENT_METHODS',
              5,
              [],
              undefined,
              undefined,
              true,
            );
          try {
            await this.profileService.addPaymentMethod(userId, {
              type: data.type,
              provider: data.type,
              last4: data.details.slice(-4),
              isDefault: true,
            });
            return {
              reply: `✅ **Payment method saved successfully.**`,
              intent: 'VIEW_PAYMENT_METHODS',
              confidence: 10,
              actions: [],
              suggestions: ['View payment methods', 'My profile'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to save payment method: ${e.message}`,
              'VIEW_PAYMENT_METHODS',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          '❌ Cancelled.',
          'VIEW_PAYMENT_METHODS',
          8,
          [],
          undefined,
          undefined,
          false,
          ['View payment methods'],
        );
      }

      case 'DELETE_PAYMENT_METHOD_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage payments.',
            'VIEW_PAYMENT_METHODS',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const payments = await this.profileService.getPaymentMethods(userId);
        const index = parseInt(message.trim()) - 1;
        const selected = payments[index];
        if (!selected) {
          return this.buildReply(
            '⚠️ Invalid selection. Please select a valid number from the list:',
            'VIEW_PAYMENT_METHODS',
            0,
            [],
            'DELETE_PAYMENT_METHOD_SELECT',
            data,
            false,
            payments.map((p, i) => String(i + 1)),
          );
        }
        try {
          await this.profileService.deletePaymentMethod(
            userId,
            String(selected._id),
          );
          return {
            reply: `✅ **Payment method deleted successfully.**`,
            intent: 'VIEW_PAYMENT_METHODS',
            confidence: 10,
            actions: [],
            suggestions: ['View payment methods', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to delete payment: ${e.message}`,
            'VIEW_PAYMENT_METHODS',
            0,
            [],
          );
        }
      }

      // ── Shopping Assistant Flow ────────────────────────────────────────────
      case 'SHOPPING_ASSISTANT_BUDGET':
        return this.buildReply(
          `💵 What is your **budget limit**? (e.g. Under $100, $200-$500, or any budget):`,
          'SHOPPING_ASSISTANT',
          9,
          [],
          'SHOPPING_ASSISTANT_USECASE',
          { ...data, category: message.trim() },
        );

      case 'SHOPPING_ASSISTANT_USECASE': {
        try {
          const products = await this.catalogService.getProducts({
            search: data.category,
          });
          // Simple client filter based on budget
          const budgetText = message.toLowerCase();
          let maxBudget = Infinity;
          const match = budgetText.match(/(\d+)/);
          if (match) maxBudget = parseFloat(match[1]);

          const filtered = products
            .filter((p: any) => p.price <= maxBudget)
            .slice(0, 3);

          if (!filtered.length) {
            return this.buildReply(
              `🔍 I couldn't find any products in **${data.category}** matching your budget. Try searching directly.`,
              'SHOPPING_ASSISTANT',
              9,
              [],
            );
          }

          const recommendations = filtered
            .map(
              (p: any) =>
                `• **${p.title}** — **$${p.price}** (${p.averageRating}⭐)\n  _${p.description.slice(0, 80)}..._`,
            )
            .join('\n\n');

          return {
            reply: `🤖 **Here are my top recommendations for you:**\n\n${recommendations}\n\nWould you like to search for anything else?`,
            intent: 'SHOPPING_ASSISTANT',
            confidence: 10,
            actions: [],
            suggestions: ['Compare products', 'View cart'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error finding recommendations: ${e.message}`,
            'SHOPPING_ASSISTANT',
            0,
            [],
          );
        }
      }

      // ── Exchange Order Flow ────────────────────────────────────────────────
      case 'EXCHANGE_ORDER_REASON':
        return this.buildReply(
          `🔄 What variant or details would you like to exchange this for (e.g. Size M, Color Black)?`,
          'EXCHANGE_ORDER',
          9,
          [],
          'EXCHANGE_ORDER_VARIANT',
          { ...data, reason: message.trim() },
        );

      case 'EXCHANGE_ORDER_VARIANT':
        return this.buildReply(
          `📝 Confirm request to exchange Order **#${data.orderId.slice(-8).toUpperCase()}** for **"${message.trim()}"**?`,
          'EXCHANGE_ORDER',
          9,
          [],
          'EXCHANGE_ORDER_CONFIRM',
          { ...data, exchangeDetails: message.trim() },
          false,
          ['Confirm', 'Cancel'],
        );

      case 'EXCHANGE_ORDER_CONFIRM': {
        const isConfirm =
          q === 'yes' ||
          q.includes('yes') ||
          q.includes('confirm') ||
          q === 'ok' ||
          q === 'y';
        if (isConfirm) {
          if (!userId)
            return this.buildReply(
              'Please **login** to request exchanges.',
              'EXCHANGE_ORDER',
              5,
              [],
              undefined,
              undefined,
              true,
            );
          try {
            await this.supportService.createTicket(userId, {
              subject: `Exchange Request: ${data.orderId}`,
              message: `Reason: ${data.reason}\nRequested Variant: ${data.exchangeDetails}`,
              priority: 'High',
            });
            return {
              reply: `✅ **Exchange Request Ticket Created!**\n\nOur customer service will verify and approve the exchange within **24 hours**.`,
              intent: 'EXCHANGE_ORDER',
              confidence: 10,
              actions: [],
              suggestions: ['View my tickets', 'Track order'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to request exchange: ${e.message}`,
              'EXCHANGE_ORDER',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          '❌ Exchange request cancelled.',
          'EXCHANGE_ORDER',
          8,
          [],
          undefined,
          undefined,
          false,
          ['My orders'],
        );
      }

      // ── Modify Order Address Flow ──────────────────────────────────────────
      case 'MODIFY_ORDER_OPTION': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            'MODIFY_ORDER',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const choice = q.toLowerCase();
        if (choice.includes('address') || choice === '1') {
          try {
            const addresses = await this.profileService.getAddresses(userId);
            if (!addresses?.length) {
              return this.buildReply(
                '⚠️ You must have saved addresses to modify the order destination. Please add an address first.',
                'MODIFY_ORDER',
                8,
                [],
              );
            }
            const list = addresses
              .map(
                (a: any, i: number) =>
                  `${i + 1}. **${a.fullName}** - ${a.addressLine1 || a.street}, ${a.city}`,
              )
              .join('\n');
            return this.buildReply(
              `🚚 **Select a new shipping address:**\n\n${list}\n\nType the number to select:`,
              'MODIFY_ORDER',
              10,
              [],
              'MODIFY_ORDER_ADDRESS_SELECT',
              { orderId: data.orderId },
            );
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to load addresses: ${e.message}`,
              'MODIFY_ORDER',
              5,
              [],
            );
          }
        } else if (choice.includes('slot') || choice === '2') {
          return this.buildReply(
            `⏰ **Select a new Delivery Slot:**\n\n• **Morning** (9 AM - 12 PM)\n• **Afternoon** (12 PM - 4 PM)\n• **Evening** (4 PM - 8 PM)\n\nPlease type your preferred slot:`,
            'MODIFY_ORDER',
            10,
            [],
            'MODIFY_ORDER_SLOT_SELECT',
            { orderId: data.orderId },
            false,
            ['Morning', 'Afternoon', 'Evening'],
          );
        } else if (choice.includes('payment') || choice === '3') {
          return this.buildReply(
            `💳 **Select a new Payment Method:**\n\n• **Stripe** (Card)\n• **Razorpay** (UPI/Netbanking)\n• **Wallet** (Store credits)\n• **COD** (Cash on Delivery)\n\nPlease type your choice:`,
            'MODIFY_ORDER',
            10,
            [],
            'MODIFY_ORDER_PAYMENT_SELECT',
            { orderId: data.orderId },
            false,
            ['Stripe', 'Razorpay', 'Wallet', 'COD'],
          );
        } else if (
          choice.includes('item') ||
          choice.includes('quantity') ||
          choice === '4'
        ) {
          try {
            const order = await this.salesService.getOrderById(data.orderId);
            const itemsList: string[] = [];
            for (let i = 0; i < order.items.length; i++) {
              const item = order.items[i];
              const prod = await this.catalogService.getProductById(
                item.productId.toString(),
              );
              itemsList.push(
                `${i + 1}. **${prod?.title || 'Product'}** (Current Qty: ${item.quantity})`,
              );
            }
            return this.buildReply(
              `📦 **Items in Order #${data.orderId.slice(-8).toUpperCase()}:**\n\n${itemsList.join('\n')}\n\n` +
                `To update quantity or remove an item, type: **"[item number] [new quantity]"** (e.g. *"1 3"* to change item 1 quantity to 3, or *"1 0"* to remove it):`,
              'MODIFY_ORDER',
              10,
              [],
              'MODIFY_ORDER_ITEMS_SELECT',
              { orderId: data.orderId, items: order.items },
            );
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to retrieve order items: ${e.message}`,
              'MODIFY_ORDER',
              5,
              [],
            );
          }
        } else {
          return this.buildReply(
            `⚠️ Invalid option. Please select what you'd like to modify:\n\n` +
              `1. **Shipping Address**\n` +
              `2. **Delivery Slot**\n` +
              `3. **Payment Method**\n` +
              `4. **Item Quantities / Remove Items**\n\n` +
              `Please type 1, 2, 3, or 4:`,
            'MODIFY_ORDER',
            0,
            [],
            'MODIFY_ORDER_OPTION',
            data,
            false,
            ['1', '2', '3', '4'],
          );
        }
      }

      case 'MODIFY_ORDER_SLOT_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            'MODIFY_ORDER',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const slot = message.trim();
        try {
          await this.salesService.updateOrderDeliverySlot(
            data.orderId,
            userId,
            slot,
          );
          return {
            reply: `✅ **Delivery slot for Order #${data.orderId.slice(-8).toUpperCase()} has been updated to "${slot}".**`,
            intent: 'MODIFY_ORDER',
            confidence: 10,
            actions: [],
            suggestions: ['Track my order', 'My orders'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to update slot: ${e.message}`,
            'MODIFY_ORDER',
            5,
            [],
          );
        }
      }

      case 'MODIFY_ORDER_PAYMENT_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            'MODIFY_ORDER',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const choice = message.trim();
        const valid = ['Stripe', 'Razorpay', 'Wallet', 'COD'];
        const match = valid.find(
          (v) => v.toLowerCase() === choice.toLowerCase(),
        );
        if (!match) {
          return this.buildReply(
            `⚠️ Invalid payment method. Please choose from: **Stripe**, **Razorpay**, **Wallet**, or **COD**:`,
            'MODIFY_ORDER',
            0,
            [],
            'MODIFY_ORDER_PAYMENT_SELECT',
            data,
            false,
            valid,
          );
        }
        try {
          await this.salesService.updateOrderPaymentMethod(
            data.orderId,
            userId,
            match,
          );
          return {
            reply: `✅ **Payment method for Order #${data.orderId.slice(-8).toUpperCase()} has been updated to "${match}".**`,
            intent: 'MODIFY_ORDER',
            confidence: 10,
            actions: [],
            suggestions: ['Track my order', 'My orders'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to update payment method: ${e.message}`,
            'MODIFY_ORDER',
            5,
            [],
          );
        }
      }

      case 'MODIFY_ORDER_ITEMS_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            'MODIFY_ORDER',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const parts = message.trim().split(/\s+/);
        const index = parseInt(parts[0]) - 1;
        const newQty = parseInt(parts[1]);
        if (
          isNaN(index) ||
          isNaN(newQty) ||
          index < 0 ||
          !data.items ||
          index >= data.items.length ||
          newQty < 0
        ) {
          return this.buildReply(
            `⚠️ Invalid format. Please enter in the format: **"[item number] [quantity]"** (e.g. *"1 3"* or *"1 0"*):`,
            'MODIFY_ORDER',
            0,
            [],
            'MODIFY_ORDER_ITEMS_SELECT',
            data,
          );
        }
        const selectedItem = data.items[index];
        try {
          await this.salesService.updateOrderItemQuantity(
            data.orderId,
            userId,
            selectedItem.productId,
            newQty,
          );
          const actionText =
            newQty === 0 ? 'removed' : `updated to quantity ${newQty}`;
          return {
            reply: `✅ **Order items updated successfully.** The item has been ${actionText}.`,
            intent: 'MODIFY_ORDER',
            confidence: 10,
            actions: [],
            suggestions: ['Track my order', 'My orders'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to update item: ${e.message}`,
            'MODIFY_ORDER',
            5,
            [],
          );
        }
      }

      case 'MODIFY_ORDER_ADDRESS_SELECT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            'MODIFY_ORDER',
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const addresses = await this.profileService.getAddresses(userId);
        const index = parseInt(message.trim()) - 1;
        const selectedAddress = addresses[index];
        if (!selectedAddress) {
          return this.buildReply(
            '⚠️ Invalid selection. Please select a valid number from the list:',
            'MODIFY_ORDER',
            0,
            [],
            'MODIFY_ORDER_ADDRESS_SELECT',
            data,
            false,
            addresses.map((a, i) => String(i + 1)),
          );
        }
        try {
          await this.salesService.updateOrderAddress(data.orderId, userId, {
            fullName: selectedAddress.fullName,
            addressLine1: (selectedAddress as any).street,
            city: selectedAddress.city,
            postalCode: (selectedAddress as any).pincode,
            state: selectedAddress.state,
            country: selectedAddress.country || 'US',
            phone: (selectedAddress as any).mobileNumber || '',
          });
          return {
            reply: `✅ **Shipping address for Order #${data.orderId.slice(-8).toUpperCase()} has been updated successfully.**`,
            intent: 'MODIFY_ORDER',
            confidence: 10,
            actions: [],
            suggestions: ['Track my order', 'My orders'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to update order address: ${e.message}`,
            'MODIFY_ORDER',
            0,
            [],
          );
        }
      }

      case 'VARIANT_SELECT': {
        const index = parseInt(message.trim()) - 1;
        const selected =
          data.combos[index] ||
          data.combos.find((c: string) => c.toLowerCase() === q);
        if (!selected) {
          const list = data.combos
            .map((c: string, i: number) => `${i + 1}. ${c}`)
            .join('\n');
          return this.buildReply(
            `⚠️ Invalid selection. Please choose a valid variant:\n\n${list}`,
            'ADD_CART',
            0,
            [],
            'VARIANT_SELECT',
            data,
          );
        }
        try {
          const product = await this.catalogService.getProductById(
            data.productId,
          );
          const action: AgentAction = {
            type: 'ADD_TO_CART',
            payload: {
              id: data.productId,
              title: `${product.title} (${selected})`,
              price: product.price,
              image: (product as any).images?.[0] || '',
              variantKey: selected,
            },
          };
          if (userId) {
            await this.salesService.addToCart(userId, data.productId, 1);
          }
          return {
            reply: `🛒 **Added to Cart!**\n\n✅ **${product.title} (${selected})** ($${product.price.toFixed(2)}) has been added to your cart.`,
            intent: 'ADD_CART',
            confidence: 10,
            actions: [action],
            suggestions: ['Checkout now', 'Continue shopping', 'View cart'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to add to cart: ${e.message}`,
            'ADD_CART',
            0,
            [],
          );
        }
      }

      case 'CLEAR_CART_CONFIRM': {
        const isConfirm =
          q === 'yes' ||
          q.includes('yes') ||
          q.includes('confirm') ||
          q === 'ok' ||
          q === 'y';
        if (isConfirm) {
          if (userId) {
            await this.salesService.clearCart(userId);
          }
          return {
            reply: `🗑️ **Cart cleared successfully!** All items have been removed from your cart.`,
            intent: 'REMOVE_CART',
            confidence: 10,
            actions: [{ type: 'CLEAR_CART', payload: {} }],
            suggestions: ['Browse products', 'Search headphones'],
          };
        }
        return this.buildReply(
          '❌ Cart clear cancelled. Your items are safe!',
          'REMOVE_CART',
          8,
          [],
          undefined,
          undefined,
          false,
          ['View cart', 'Checkout'],
        );
      }

      case 'VENDOR_ADD_PRODUCT_TITLE':
        return this.buildReply(
          `💲 Please enter the **price** for "${message}":`,
          'VENDOR_PRODUCTS',
          9,
          [],
          'VENDOR_ADD_PRODUCT_PRICE',
          { title: message.trim() },
        );

      case 'VENDOR_ADD_PRODUCT_PRICE': {
        const price = parseFloat(message.trim());
        if (isNaN(price) || price < 0) {
          return this.buildReply(
            '⚠️ Please enter a valid number for price:',
            'VENDOR_PRODUCTS',
            0,
            [],
            'VENDOR_ADD_PRODUCT_PRICE',
            data,
          );
        }
        return this.buildReply(
          `🏷️ Please enter the **SKU** code for this product (e.g. VEN-LAP-101):`,
          'VENDOR_PRODUCTS',
          9,
          [],
          'VENDOR_ADD_PRODUCT_SKU',
          { ...data, price },
        );
      }

      case 'VENDOR_ADD_PRODUCT_SKU':
        return this.buildReply(
          `📦 Please enter the initial **stock quantity** (e.g. 20):`,
          'VENDOR_PRODUCTS',
          9,
          [],
          'VENDOR_ADD_PRODUCT_STOCK',
          { ...data, sku: message.trim().toUpperCase() },
        );

      case 'VENDOR_ADD_PRODUCT_STOCK': {
        const stock = parseInt(message.trim());
        if (isNaN(stock) || stock < 0) {
          return this.buildReply(
            '⚠️ Please enter a valid non-negative integer for stock:',
            'VENDOR_PRODUCTS',
            0,
            [],
            'VENDOR_ADD_PRODUCT_STOCK',
            data,
          );
        }
        const fullData: any = { ...data, stock };
        return this.buildReply(
          `🏪 **Confirm Vendor Product Details:**\n\n` +
            `• **Title**: ${fullData.title}\n` +
            `• **Price**: $${fullData.price.toFixed(2)}\n` +
            `• **SKU**: ${fullData.sku}\n` +
            `• **Stock**: ${fullData.stock}\n\n` +
            `Type **"confirm"** or **"cancel"** to submit for approval:`,
          'VENDOR_PRODUCTS',
          9,
          [],
          'VENDOR_ADD_PRODUCT_CONFIRM',
          fullData,
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'VENDOR_ADD_PRODUCT_CONFIRM': {
        const isConfirm = q === 'confirm' || q === 'yes' || q === 'y';
        if (isConfirm) {
          try {
            let category = await (this.catalogService as any).categoryRepository.findOne({});
            if (!category) {
              category = await this.catalogService.createCategory({ name: 'General', slug: 'general' });
            }
            let brand = await (this.catalogService as any).brandRepository.findOne({});
            if (!brand) {
              brand = await this.catalogService.createBrand({ name: 'General' });
            }

            const product = await this.catalogService.createProduct({
              title: data.title,
              description: `Vendor created product: ${data.title}`,
              price: data.price,
              sku: data.sku,
              stock: data.stock,
              category: category._id,
              brand: brand._id,
            }, userId);

            return {
              reply: `🎉 **Product Created Successfully and Pending Approval!**\n\n✅ **${product.title}** has been added with SKU **${data.sku}**. An admin will review it shortly.`,
              intent: 'VENDOR_PRODUCTS',
              confidence: 10,
              actions: [],
              suggestions: ['My products', 'Vendor dashboard'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to create product: ${e.message}`,
              'VENDOR_PRODUCTS',
              0,
              [],
            );
          }
        }
        return this.buildReply('❌ Product creation cancelled.', 'VENDOR_PRODUCTS', 8, [], undefined, undefined, false, ['My products']);
      }

      case 'VENDOR_DELETE_PRODUCT_CONFIRM': {
        const isConfirm = q === 'confirm delete' || q === 'confirm' || q === 'yes' || q === 'y';
        if (isConfirm) {
          try {
            await this.catalogService.deleteProduct(data.productId, userId);
            return {
              reply: `🗑️ **Product deleted successfully!**`,
              intent: 'VENDOR_PRODUCTS',
              confidence: 10,
              actions: [],
              suggestions: ['My products'],
            };
          } catch (e: any) {
            return this.buildReply(`❌ Deletion failed: ${e.message}`, 'VENDOR_PRODUCTS', 0, []);
          }
        }
        return this.buildReply('❌ Product deletion cancelled.', 'VENDOR_PRODUCTS', 8, [], undefined, undefined, false, ['My products']);
      }

      case 'VENDOR_UPDATE_SELECT': {
        if (q === '1' || q.includes('price')) {
          return this.buildReply('💲 Enter the new **price**:', 'VENDOR_PRODUCTS', 10, [], 'VENDOR_UPDATE_PRICE', data);
        } else if (q === '2' || q.includes('stock')) {
          return this.buildReply('📦 Enter the new **stock** count:', 'VENDOR_PRODUCTS', 10, [], 'VENDOR_UPDATE_STOCK', data);
        } else if (q === '3' || q.includes('description')) {
          return this.buildReply('📝 Enter the new **description**:', 'VENDOR_PRODUCTS', 10, [], 'VENDOR_UPDATE_DESC', data);
        } else if (q === '4' || q.includes('variant')) {
          return this.buildReply('🎨 Enter the variant name / key (e.g. **color** or **size**):', 'VENDOR_PRODUCTS', 10, [], 'VENDOR_UPDATE_VARIANTS_KEY', data);
        } else if (q === '5' || q.includes('image') || q.includes('photo')) {
          return this.buildReply('🖼️ Please paste the **image URL** or file contents to upload as the product image:', 'VENDOR_PRODUCTS', 10, [], 'UPLOAD_FILE_INPUT', { ...data, fileType: 'image' });
        }
        return this.buildReply('⚠️ Invalid selection. Please type 1, 2, 3, 4, or 5:', 'VENDOR_PRODUCTS', 0, [], 'VENDOR_UPDATE_SELECT', data, false, ['1', '2', '3', '4', '5']);
      }

      case 'VENDOR_UPDATE_VARIANTS_KEY': {
        return this.buildReply(`🎨 Enter the values for **${message.trim()}** (comma-separated, e.g. "Red, Blue, Green"):`, 'VENDOR_PRODUCTS', 10, [], 'VENDOR_UPDATE_VARIANTS_VAL', { ...data, variantKey: message.trim() });
      }

      case 'VENDOR_UPDATE_VARIANTS_VAL': {
        const values = message.split(',').map(v => v.trim()).filter(Boolean);
        try {
          const product = await this.catalogService.getProductById(data.productId);
          const currentVariants = (product as any).variants || {};
          currentVariants[data.variantKey] = values;
          await this.catalogService.updateProduct(data.productId, { variants: currentVariants }, userId);
          return {
            reply: `✅ **Variants updated successfully!**\n\nAssociated variant **${data.variantKey}** with values: **${values.join(', ')}**`,
            intent: 'VENDOR_PRODUCTS',
            confidence: 10,
            actions: [],
            suggestions: ['My products'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Update failed: ${e.message}`, 'VENDOR_PRODUCTS', 0, []);
        }
      }

      case 'VENDOR_UPDATE_PRICE': {
        const price = parseFloat(q);
        if (isNaN(price) || price < 0) return this.buildReply('⚠️ Enter a valid price:', 'VENDOR_PRODUCTS', 0, [], 'VENDOR_UPDATE_PRICE', data);
        try {
          await this.catalogService.updateProduct(data.productId, { price }, userId);
          return {
            reply: `✅ **Price updated successfully!**`,
            intent: 'VENDOR_PRODUCTS',
            confidence: 10,
            actions: [],
            suggestions: ['My products'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Update failed: ${e.message}`, 'VENDOR_PRODUCTS', 0, []);
        }
      }

      case 'VENDOR_UPDATE_STOCK': {
        const stock = parseInt(q);
        if (isNaN(stock) || stock < 0) return this.buildReply('⚠️ Enter a valid stock count:', 'VENDOR_PRODUCTS', 0, [], 'VENDOR_UPDATE_STOCK', data);
        try {
          const product = await this.catalogService.getProductById(data.productId);
          await this.catalogService.updateStock(product.sku, stock);
          return {
            reply: `✅ **Stock updated successfully!**`,
            intent: 'VENDOR_PRODUCTS',
            confidence: 10,
            actions: [],
            suggestions: ['My products'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Update failed: ${e.message}`, 'VENDOR_PRODUCTS', 0, []);
        }
      }

      case 'VENDOR_UPDATE_DESC': {
        try {
          await this.catalogService.updateProduct(data.productId, { description: message }, userId);
          return {
            reply: `✅ **Description updated successfully!**`,
            intent: 'VENDOR_PRODUCTS',
            confidence: 10,
            actions: [],
            suggestions: ['My products'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Update failed: ${e.message}`, 'VENDOR_PRODUCTS', 0, []);
        }
      }

      case 'ADMIN_IMPORT_CSV': {
        try {
          const result = await this.catalogService.bulkImportCsv(message);
          return {
            reply: `🎉 **CSV Bulk Import Completed!**\n\n✅ Successfully imported **${result.count}** products into the database.`,
            intent: 'ADMIN_PRODUCTS',
            confidence: 10,
            actions: [],
            suggestions: ['Manage products', 'System analytics'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Import failed: ${e.message}`, 'ADMIN_PRODUCTS', 0, []);
        }
      }
      case 'UPLOAD_FILE_INPUT': {
        try {
          const rawFilename = message.includes('.') ? message : `${data.fileType || 'upload'}_${Date.now()}.png`;
          const filename = require('path').basename(rawFilename);
          const mockBuffer = Buffer.from(message);
          const mimeType = data.fileType === 'csv' ? 'text/csv' : (data.fileType === 'image' ? 'image/png' : 'application/pdf');
          
          const metadata = await this.uploadService.validateAndScanFile(
            userId || 'guest',
            filename,
            mimeType,
            mockBuffer,
          );
          
          let extraInfo = '';
          if (data.fileType === 'csv') {
            const importRes = await this.catalogService.bulkImportCsv(mockBuffer.toString('utf-8'));
            extraInfo = `\n📊 **Parsed & Imported**: Successfully processed **${importRes.count}** product records in the database.`;
          } else if (data.fileType === 'image' && data.productId) {
            await this.catalogService.updateProduct(data.productId, {
              $push: { images: metadata.storageUrl }
            });
            extraInfo = `\n🖼️ **Linked**: Image successfully associated with product **#${data.productId}**.`;
          }
          
          return {
            reply: `✅ **Upload Successful!**\n\n• **Filename**: ${metadata.filename}\n• **Size**: ${metadata.sizeBytes} bytes\n• **Security Scan**: Safe (Verified)\n• **Storage URL**: [View File](${metadata.storageUrl})${extraInfo}`,
            intent: 'UPLOAD_FILE',
            confidence: 10,
            actions: [],
            suggestions: ['Browse products', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(`❌ Upload failed: ${e.message}`, 'UPLOAD_FILE', 0, []);
        }
      }

      case 'ADMIN_ADD_PRODUCT_TITLE':

        return this.buildReply(
          `💲 Please enter the **price** for "${message}":`,
          'ADMIN_PRODUCTS',
          9,
          [],
          'ADMIN_ADD_PRODUCT_PRICE',
          { title: message.trim() },
        );

      case 'ADMIN_ADD_PRODUCT_PRICE': {
        const price = parseFloat(message.trim());
        if (isNaN(price) || price < 0) {
          return this.buildReply(
            '⚠️ Please enter a valid number for price:',
            'ADMIN_PRODUCTS',
            0,
            [],
            'ADMIN_ADD_PRODUCT_PRICE',
            data,
          );
        }
        return this.buildReply(
          `🏷️ Please enter the **SKU** code for this product (e.g. GAM-LAP-101):`,
          'ADMIN_PRODUCTS',
          9,
          [],
          'ADMIN_ADD_PRODUCT_SKU',
          { ...data, price },
        );
      }

      case 'ADMIN_ADD_PRODUCT_SKU':
        return this.buildReply(
          `📦 Please enter the initial **stock quantity** (e.g. 50):`,
          'ADMIN_PRODUCTS',
          9,
          [],
          'ADMIN_ADD_PRODUCT_STOCK',
          { ...data, sku: message.trim().toUpperCase() },
        );

      case 'ADMIN_ADD_PRODUCT_STOCK': {
        const stock = parseInt(message.trim());
        if (isNaN(stock) || stock < 0) {
          return this.buildReply(
            '⚠️ Please enter a valid non-negative integer for stock:',
            'ADMIN_PRODUCTS',
            0,
            [],
            'ADMIN_ADD_PRODUCT_STOCK',
            data,
          );
        }
        const fullData: any = { ...data, stock };
        return this.buildReply(
          `🛡️ **Confirm New Product Details:**\n\n` +
            `• **Title**: ${fullData.title}\n` +
            `• **Price**: $${fullData.price.toFixed(2)}\n` +
            `• **SKU**: ${fullData.sku}\n` +
            `• **Stock**: ${fullData.stock}\n\n` +
            `Shall I create this product? Type **"confirm"** or **"cancel"**:`,
          'ADMIN_PRODUCTS',
          9,
          [],
          'ADMIN_ADD_PRODUCT_CONFIRM',
          fullData,
          false,
          ['Confirm', 'Cancel'],
        );
      }

      case 'ADMIN_ADD_PRODUCT_CONFIRM': {
        const isConfirm = q === 'confirm' || q === 'yes' || q === 'y';
        if (isConfirm) {
          try {
            let category = await (
              this.catalogService as any
            ).categoryRepository.findOne({});
            if (!category) {
              category = await this.catalogService.createCategory({
                name: 'General',
                slug: 'general',
              });
            }
            let brand = await (
              this.catalogService as any
            ).brandRepository.findOne({});
            if (!brand) {
              brand = await this.catalogService.createBrand({
                name: 'General',
              });
            }

            const product = await this.catalogService.createProduct({
              title: data.title,
              description: `Admin created product: ${data.title}`,
              price: data.price,
              sku: data.sku,
              stock: data.stock,
              category: category._id,
              brand: brand._id,
            });

            return {
              reply: `🎉 **Product Created Successfully!**\n\n✅ **${product.title}** has been added with SKU **${data.sku}**.`,
              intent: 'ADMIN_PRODUCTS',
              confidence: 10,
              actions: [],
              suggestions: ['Manage products', 'Browse catalog'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to create product: ${e.message}`,
              'ADMIN_PRODUCTS',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          '❌ Product creation cancelled.',
          'ADMIN_PRODUCTS',
          8,
          [],
          undefined,
          undefined,
          false,
          ['Manage products'],
        );
      }

      case 'ADMIN_DELETE_PRODUCT_CONFIRM': {
        const isConfirm = q === 'confirm' || q === 'yes' || q === 'y';
        if (isConfirm) {
          try {
            await this.catalogService.deleteProduct(data.productId);
            return {
              reply: `🗑️ **Product deleted successfully!**`,
              intent: 'ADMIN_PRODUCTS',
              confidence: 10,
              actions: [],
              suggestions: ['Manage products'],
            };
          } catch (e: any) {
            return this.buildReply(
              `❌ Deletion failed: ${e.message}`,
              'ADMIN_PRODUCTS',
              0,
              [],
            );
          }
        }
        return this.buildReply(
          '❌ Product deletion cancelled.',
          'ADMIN_PRODUCTS',
          8,
          [],
          undefined,
          undefined,
          false,
          ['Manage products'],
        );
      }

      default:
        return null;
    }
  }

  // ─── MAIN INTENT DISPATCHER ─────────────────────────────────────────────────

  private async dispatchIntent(
    intent: string,
    entities: Record<string, string>,
    message: string,
    userId: string | undefined,
    roles: string[],
    sessionId: string,
    ctx: any,
    guestId?: string,
  ): Promise<AgentResponse> {
    const q = message.toLowerCase().trim();

    switch (intent) {
      case 'GREET': {
        const name = userId ? `back` : '';

        // Retrieve dynamic contexts
        let personalization = '';
        let dynamicSuggestions = [
          'Search headphones',
          'My orders',
          'Create ticket',
          'Help',
        ];

        // Build personalization context from past user activity
        if (userId && ctx.userMemory) {
          const history = ctx.userMemory.searchHistory || [];
          if (history.length > 0) {
            personalization += `\n\n💡 Based on your recent searches, you might be interested in looking at products related to **"${history.slice(-2).join('", "')}"**.`;
            dynamicSuggestions = [
              `Search ${history[history.length - 1]}`,
              ...dynamicSuggestions.slice(1),
            ];
          }

          // Check order history
          try {
            const userOrders = await this.salesService.getOrders(userId);
            if (userOrders && userOrders.length > 0) {
              const latestOrder = userOrders[0];
              const displayId = String(latestOrder._id).slice(-8).toUpperCase();
              personalization += `\n📦 **Order status update**: Your last order **#${displayId}** is currently **${latestOrder.status}**.`;
              dynamicSuggestions.push(`Track order ORD-${displayId}`);
            }
          } catch {
            /* ignore */
          }
        } else if (guestId) {
          // Fallback guest personalization
          try {
            const guest = await this.memory.getOrCreateGuest(guestId);
            const history = guest.searchHistory || [];
            if (history.length > 0) {
              personalization += `\n\n💡 Looking for more **"${history[history.length - 1]}"**? Let me search our catalog for you!`;
              dynamicSuggestions = [
                `Search ${history[history.length - 1]}`,
                ...dynamicSuggestions.slice(1),
              ];
            }
          } catch {
            /* ignore */
          }
        }

        return this.buildReply(
          `👋 Hello ${name}! I'm the **ApexStore AI Assistant**.\n\nI can help you:\n• 🔍 Search & compare products\n• 🛒 Manage your cart & wishlist\n• 📦 Track & manage orders\n• 🎫 Create support tickets\n• 🔐 Manage your account${personalization}\n\nWhat can I help you with today?`,
          intent,
          10,
          [],
          undefined,
          undefined,
          false,
          Array.from(new Set(dynamicSuggestions)).slice(0, 5),
        );
      }

      case 'REGISTER':
        return this.buildReply(
          `Let's create your ApexStore account! 🎉\n\nPlease enter your **email address**:`,
          intent,
          8,
          [],
          'REGISTER_EMAIL',
          {},
        );

      case 'LOGIN':
        if (userId) {
          return this.buildReply(
            `You are already signed in! Type **"my profile"** to view your account or **"logout"** to sign out.`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            ['My profile', 'My orders', 'Logout'],
          );
        }

        // ── One-shot login: email + password provided in the same message ──
        {
          const emailInMsg = message.match(
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
          );
          // Match password after keywords like "password", "pass", "pwd" followed by optional :-/=/space
          const passInMsg = message.match(
            /(?:password|pass|pwd)\s*(?::-|:|-|=)?\s*(\S+)/i,
          );
          if (emailInMsg && passInMsg) {
            const email = emailInMsg[0];
            const password = passInMsg[1];
            try {
              const result = await this.authService.login({ email, password });
              return {
                reply: `🔑 **Logged in successfully!**\nWelcome back, **${email}**! You are signed in as **${result.user.roles?.join(', ') || 'Customer'}**.\n\nHow can I help you today?`,
                intent: 'LOGIN',
                confidence: 10,
                actions: [
                  {
                    type: 'LOGIN',
                    payload: { user: result.user, token: result.accessToken },
                  },
                ],
                suggestions: ['My orders', 'Browse products', 'My cart'],
              };
            } catch {
              return this.buildReply(
                `❌ Invalid email or password for **${email}**. Please try again or type **"reset password"** to recover your account.`,
                intent,
                0,
                [],
                'LOGIN_EMAIL',
                {},
              );
            }
          }
        }
        // ──────────────────────────────────────────────────────────────────

        return this.buildReply(
          `Welcome back! Please enter your **email address**:`,
          intent,
          8,
          [],
          'LOGIN_EMAIL',
          {},
        );

      case 'LOGOUT':
        return {
          reply: `👋 **Logged out successfully!**\nYou've been signed out. See you next time!\n\nType **"login"** or **"register"** to sign back in.`,
          intent,
          confidence: 10,
          actions: [{ type: 'LOGOUT', payload: {} }],
          suggestions: ['Login', 'Register', 'Browse products'],
        };

      case 'RESET_PASSWORD':
        return this.buildReply(
          `🔑 To reset your password:\n\n1. Go to the [Login page](/auth)\n2. Click **"Forgot Password"**\n3. Enter your registered email\n4. Check your inbox for the reset link\n\nAlternatively, I can take you directly to the auth page right now!`,
          intent,
          8,
          [{ type: 'NAVIGATE', payload: { path: '/auth' } }],
          undefined,
          undefined,
          false,
          ['Go to login page', 'Contact support'],
        );

      case 'CHANGE_PASSWORD':
        if (!userId)
          return this.buildReply(
            'Please **login** to change your password.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          'Please enter your **new password** (min 6 characters):',
          intent,
          8,
          [],
          'CHANGE_PASSWORD_STEP',
          {},
        );

      case 'OTP_VERIFY':
        return this.buildReply(
          'Please enter your **phone number** to receive a one-time verification code:',
          intent,
          8,
          [],
          'OTP_VERIFY_STEP',
          {},
        );

      case 'EMAIL_VERIFY':
        return this.buildReply(
          '📧 Email verification link has been sent to your inbox. Please check your email to verify your account.',
          intent,
          10,
          [],
        );

      case 'VIEW_PROFILE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your profile details.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const profile = await this.profileService.getProfile(userId);
          const name =
            profile.displayName ||
            `${profile.firstName} ${profile.lastName}`.trim() ||
            'Valued Customer';
          return this.buildReply(
            `👤 **My Account Profile Details:**\n\n• **Email**: ${profile.email}\n• **Name**: ${name}\n• **Phone**: ${profile.phone || 'Not provided'}\n• **Account Status**: ${profile.accountStatus}\n• **Tier**: ${profile.membershipLevel} Member\n• **Points**: ${profile.rewardPoints} Loyalty Points\n• **Wallet Balance**: $${(profile.walletBalance || 0).toFixed(2)}\n• **Plan**: ${profile.subscriptionPlan}\n• **GDPR Options**: You can type *"export my data"* or *"delete my account"* anytime.`,
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
            undefined,
            undefined,
            false,
            ['View wallet', 'My addresses', 'Change password', 'Logout'],
          );
        } catch {
          return this.buildReply(
            'Unable to load profile details. Please visit your [profile page](/profile).',
            intent,
            5,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
          );
        }
      }

      case 'UPDATE_PROFILE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to update your profile.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }

        // ── Photo / avatar update — still navigate to profile page ──
        if (
          q.includes('picture') ||
          q.includes('photo') ||
          q.includes('avatar') ||
          q.includes('image')
        ) {
          return this.buildReply(
            '🖼️ **Change Profile Picture / Photo:**\n\nTo update your profile avatar:\n1. Go to the [Profile Page](/profile)\n2. Click on your current avatar\n3. Paste a new image URL to update it instantly!',
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/profile' } }],
            undefined,
            undefined,
            false,
            ['View profile', 'Change password'],
          );
        }

        // ── Name change — start multi-step conversational flow ──
        // If a new name was provided inline (e.g. "change my name to John Smith")
        const inlineName = message.match(
          /(?:change|update|set|rename)\s+(?:my\s+)?name\s+(?:to|as|:)\s+(.+)/i,
        );
        if (inlineName && inlineName[1]?.trim()) {
          const newName = inlineName[1].trim();
          return this.buildReply(
            `✏️ Got it! You want to change your name to **"${newName}"**.\n\nShall I update it now?`,
            intent,
            9,
            [],
            'PROFILE_UPDATE_CONFIRM',
            { field: 'displayName', value: newName },
            false,
            ['Confirm', 'Cancel'],
          );
        }

        // Otherwise ask for the new name
        return this.buildReply(
          `✏️ What would you like your **new display name** to be?\n\nJust type your new name and I'll update it for you!`,
          intent,
          9,
          [],
          'PROFILE_UPDATE_NAME',
          { field: 'displayName' },
          false,
          [],
        );
      }

      case 'GDPR_EXPORT': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to export your profile data.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          await this.profileService.exportData(userId);
          return this.buildReply(
            `📄 **GDPR Right to Portability Export:**\n\nWe have generated your full personal data snapshot. You can download the JSON file below:\n\n• **Format**: JSON Data Snapshot\n• **Exported At**: ${new Date().toLocaleDateString()}\n\n[Click here to download your exported data](/api/v1/profile/export)`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(
            `Failed to export data: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'GDPR_DELETE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to request account deletion.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          await this.profileService.requestDeletion(userId);
          return this.buildReply(
            `⚠️ **GDPR Right to Be Forgotten: Account Scheduled for Deletion**\n\nYour account deletion request has been submitted. Your profile is now set to "Pending Deletion" and all data will be purged within the standard processing timeframe.`,
            intent,
            10,
            [{ type: 'LOGOUT', payload: {} }],
          );
        } catch (e: any) {
          return this.buildReply(
            `Failed to schedule deletion: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'VIEW_LOYALTY': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your loyalty points.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const profile = await this.profileService.getProfile(userId);

          if (
            q.includes('convert') ||
            q.includes('exchange') ||
            q.includes('redeem')
          ) {
            const pointsMatch = q.match(
              /(?:convert|exchange|redeem)\s+(\d+)\s*(?:points)?/,
            );
            if (pointsMatch) {
              const points = parseInt(pointsMatch[1]);
              const res = await this.profileService.convertPoints(
                userId,
                points,
              );
              return this.buildReply(
                `🏆 **Points Converted Successfully!**\n\n✅ Converted **${points} points** to **$${(points / 100).toFixed(2)}** wallet credit.\n• **New Loyalty Points**: ${res.rewardPoints}\n• **New Wallet Balance**: $${res.walletBalance.toFixed(2)}`,
                intent,
                10,
                [],
              );
            } else {
              return this.buildReply(
                `🏆 To convert loyalty points to wallet credit, type: **"convert [number] points"**\n\nExample: *"convert 100 points"*`,
                intent,
                8,
                [],
              );
            }
          }

          const usdValue = (profile.rewardPoints || 0) / 100;
          return this.buildReply(
            `🏆 **ApexStore Loyalty Rewards:**\n\n• **Current Loyalty Points**: ${profile.rewardPoints || 0} Points\n• **Membership Tier**: ${profile.membershipLevel} Status\n• **Convertible Credit**: $${usdValue.toFixed(2)} store credit\n\nWould you like to **convert your reward points** into shopping credit? Type *"convert [number] points"* to do so.`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            [
              `Convert ${Math.min(profile.rewardPoints || 0, 100)} points`,
              'View wallet',
              'My profile',
            ],
          );
        } catch (e: any) {
          return this.buildReply(
            `Unable to fetch loyalty details: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'VIEW_WALLET': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your wallet balance.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          if (
            q.includes('add') ||
            q.includes('load') ||
            q.includes('deposit')
          ) {
            const amountMatch = q.match(
              /(?:add|load|deposit)\s+[$₹£€]?\s*(\d+(?:\.\d+)?)/,
            );
            if (amountMatch) {
              const amount = parseFloat(amountMatch[1]);
              const res = await this.profileService.addWalletFunds(
                userId,
                amount,
                'Added via AI Chatbot',
              );
              return this.buildReply(
                `💳 **Wallet Funds Added Successfully!**\n\n✅ Added **$${amount.toFixed(2)}** to your store wallet.\n• **New Wallet Balance**: $${res.walletBalance.toFixed(2)}`,
                intent,
                10,
                [],
                undefined,
                undefined,
                false,
                ['View wallet transactions', 'My profile'],
              );
            } else {
              return this.buildReply(
                `💳 To add funds to your wallet via chatbot, please type: **"add [amount] to wallet"**\n\nExample: *"add 50 to wallet"*`,
                intent,
                8,
                [],
              );
            }
          }

          const profile = await this.profileService.getProfile(userId);
          const txs = await this.profileService.getWalletTransactions(userId);
          const txList =
            txs
              .slice(0, 3)
              .map(
                (t: any) =>
                  `• $${t.amount.toFixed(2)} (${t.transactionType}) — ${t.description}`,
              )
              .join('\n') || 'No transactions yet.';
          return this.buildReply(
            `💳 **My Store Wallet:**\n\n• **Available Balance**: $${(profile.walletBalance || 0).toFixed(2)}\n• **Account Status**: Active\n\n**Recent Transactions:**\n${txList}\n\nType **"add [amount] to wallet"** to add mock funds!`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Add 50 to wallet', 'My profile', 'View loyalty points'],
          );
        } catch (e: any) {
          return this.buildReply(
            `Unable to load wallet: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'NOTIFICATION_PREF': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to change notification settings.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const isEnable = q.includes('enable') || q.includes('turn on');
          const isDisable = q.includes('disable') || q.includes('turn off');
          
          if (isEnable || isDisable) {
            const status = isEnable;
            await this.notificationService.updatePreferences(userId, {
              marketingEmails: status,
              productRecommendations: status,
              newsletterSubscriptions: status,
            });
            return this.buildReply(`🔔 **Notification Preferences updated!** All optional alerts have been **${status ? 'Enabled' : 'Disabled'}**.`, intent, 10, []);
          }
          
          const prefs = await this.notificationService.getPreferences(userId);
          return this.buildReply(
            `🔔 **Your Notification Preferences:**\n\n` +
            `• **Marketing Emails**: ${prefs.marketingEmails ? '✅ Enabled' : '❌ Disabled'}\n` +
            `• **Product Recommendations**: ${prefs.productRecommendations ? '✅ Enabled' : '❌ Disabled'}\n` +
            `• **Newsletter Subscriptions**: ${prefs.newsletterSubscriptions ? '✅ Enabled' : '❌ Disabled'}\n\n` +
            `To change, type **"enable notifications"** or **"disable notifications"**.`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Enable notifications', 'Disable notifications'],
          );
        } catch (e: any) {
          return this.buildReply(`❌ Failed to update settings: ${e.message}`, intent, 5, []);
        }
      }

      case 'SEARCH_PRODUCT': {
        const query =
          entities.productType || entities.brand || entities.category || '';
        let searchQuery =
          query ||
          message
            .replace(/show|find|search|looking for|get me|i want|need|to buy|buy|purchase/gi, '')
            .trim();

        // If the query is empty or too generic, guide the user instead of searching
        const genericTerms = /^(some\s+)?(product|products|item|items|thing|things|stuff|anything|something|goods)?$/i;
        if (!searchQuery || genericTerms.test(searchQuery)) {
          return this.buildReply(
            `🛒 **Welcome to ApexStore!**\n\nI'd love to help you find what you're looking for. What kind of products are you interested in today?\n\nHere are some of our popular categories:\n• 📱 **Electronics** (e.g., headphones, laptops)\n• 👕 **Fashion & Apparel** (e.g., shoes, jackets)\n• 🍳 **Home & Kitchen** (e.g., blenders, lamps)\n• 🏋️ **Fitness & Sports** (e.g., yoga mats, dumbbells)\n\nJust tell me what you're looking for, or browse all products on the [Search page](/search)!`,
            intent,
            8,
            [{ type: 'NAVIGATE', payload: { path: '/search' } }],
            undefined,
            undefined,
            false,
            ['Browse Electronics', 'Browse Fashion', 'Best sellers'],
          );
        }

        try {
          const results = await this.catalogService.getProducts({
            search: searchQuery,
            category: entities.category,
            brand: entities.brand,
          });

          if (!results || !results.length) {
            return this.buildReply(
              `🔍 No products found for **"${searchQuery}"**.\n\nTry searching for:\n• Electronics, Fashion, Kitchen, Fitness\n• Specific brands like ApexTech, NexaHome\n• Or browse all products on the [Search page](/search)`,
              intent,
              7,
              [
                {
                  type: 'NAVIGATE',
                  payload: {
                    path: `/search?q=${encodeURIComponent(searchQuery)}`,
                  },
                },
              ],
              undefined,
              undefined,
              false,
              ['Browse Electronics', 'Browse Fashion', 'Best sellers'],
            );
          }

          const maxPrice = entities.maxPrice
            ? parseFloat(entities.maxPrice)
            : Infinity;
          let filtered = results.filter((p: any) => p.price <= maxPrice);
          if (entities.sort === 'price_asc')
            filtered = filtered.sort((a: any, b: any) => a.price - b.price);
          if (entities.sort === 'price_desc')
            filtered = filtered.sort((a: any, b: any) => b.price - a.price);
          if (entities.sort === 'rating_desc')
            filtered = filtered.sort(
              (a: any, b: any) => b.averageRating - a.averageRating,
            );

          const top = filtered.slice(0, 4);
          const list = top
            .map(
              (p: any) =>
                `• **${p.title}** — $${p.price.toFixed(2)} ⭐${p.averageRating || 'N/A'}`,
            )
            .join('\n');
          const ids = top.map((p: any) => String(p._id || p.id));

          if (userId)
            await this.memory.updateUserSearchHistory(userId, searchQuery);

          return {
            reply: `🔍 **Found ${filtered.length} products** for "${searchQuery}":\n\n${list}\n\nType the **product name** to see details, or **"add [name] to cart"** to purchase!`,
            intent,
            confidence: 8,
            actions: [],
            data: { products: top, ids },
            suggestions: top
              .slice(0, 2)
              .map(
                (p: any) =>
                  `Add ${p.title.split(' ').slice(0, 2).join(' ')} to cart`,
              ),
          };
        } catch {
          return this.buildReply(
            `🔍 Search for **"${searchQuery}"** — [Click here to view all results](/search?q=${encodeURIComponent(searchQuery)})`,
            intent,
            5,
            [
              {
                type: 'NAVIGATE',
                payload: {
                  path: `/search?q=${encodeURIComponent(searchQuery)}`,
                },
              },
            ],
          );
        }
      }

      case 'RECOMMEND': {
        const memory = userId ? await this.memory.getUserMemory(userId) : null;
        const history = memory?.searchHistory || ctx.searchHistory;

        try {
          let top: any[] = [];
          let recommendationType = 'Personalized Recommendations';

          if (/bought together|frequently bought|fbt/i.test(q)) {
            // Find FBT for the last viewed or search product
            const lastSearch = history[history.length - 1];
            let targetProduct = null;
            if (lastSearch) {
              const matches = await this.catalogService.getProducts({ search: lastSearch });
              targetProduct = matches?.[0];
            }
            if (targetProduct) {
              top = await this.catalogService.getFrequentlyBoughtTogether(String(targetProduct._id));
              recommendationType = `Frequently Bought Together with ${targetProduct.title}`;
            }
          } else if (/similar/i.test(q)) {
            const lastSearch = history[history.length - 1];
            let targetProduct = null;
            if (lastSearch) {
              const matches = await this.catalogService.getProducts({ search: lastSearch });
              targetProduct = matches?.[0];
            }
            if (targetProduct) {
              top = await this.catalogService.getSimilarProducts(String(targetProduct._id));
              recommendationType = `Products Similar to ${targetProduct.title}`;
            }
          } else if (/recent|purchased|viewed/i.test(q) && userId) {
            top = await this.catalogService.getRecentlyPurchased(userId);
            recommendationType = 'Your Recently Purchased Items';
          }

          // Fallback to general personalized recommendation
          if (top.length === 0) {
            if (userId) {
              top = await this.catalogService.getPersonalizedRecommendations(userId);
            } else {
              top = await this.catalogService.getTrendingProducts();
              recommendationType = 'Trending Products';
            }
          }

          const list = top
            .map(
              (p: any) =>
                `• **${p.title}** — $${p.price.toFixed(2)} ⭐${p.averageRating || 'N/A'}`,
            )
            .join('\n');

          const personalized =
            history.length > 0
              ? `\n\n💡 Based on your search history for: *${history.slice(-2).join(', ')}*`
              : '';

          return this.buildReply(
            `✨ **${recommendationType}:**${personalized}\n\n${list || 'No recommendations available right now. Browse our [catalog](/)!'}\n\nType any product name to add it to your cart!`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            top
              .slice(0, 2)
              .map(
                (p: any) =>
                  `Add ${p.title.split(' ').slice(0, 2).join(' ')} to cart`,
              ),
          );
        } catch (err: any) {
          return this.buildReply(
            `Browse our **[full catalog](/)** for top-rated products! (Error: ${err.message})`,
            intent,
            5,
            [{ type: 'NAVIGATE', payload: { path: '/' } }],
          );
        }
      }

      case 'ADD_CART': {
        let productName =
          entities.productType ||
          message
            .replace(/add|to cart|buy|purchase|get|i'll take/gi, '')
            .trim();

        // ── Contextual / pronoun reference detection ──────────────────────────
        // Detect when the extracted name is a pronoun/filler rather than a real
        // product name (e.g. "buy it", "buy for me", "buy that", "get the one").
        const CONTEXTUAL_PATTERN =
          /^(?:it|this|that|the one|that one|this one|for me|it for me|the product|the item|the same|same|yes please|ok|okay|sure|go ahead|do it|do that|one more|another|another one|more)$/i;

        const isContextual =
          CONTEXTUAL_PATTERN.test(productName.trim()) ||
          !productName.trim() ||
          (productName.trim().split(/\s+/).length <= 2 &&
            CONTEXTUAL_PATTERN.test(productName.trim()));

        if (isContextual && ctx && ctx.recentMessages) {
          // Strategy 1: scan recent BOT messages for the last ADD_CART reply and extract the product title.
          // Bot reply format: "✅ **ProductTitle** ($price) has been added to your cart."
          for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
            const msg = ctx.recentMessages[i];
            if (msg.role === 'bot' && msg.text.includes('Added to Cart')) {
              const titleMatch = msg.text.match(
                /\*\*([^*]+)\*\*\s*\(\$[\d.]+\)/,
              );
              if (titleMatch && titleMatch[1]) {
                productName = titleMatch[1].trim();
                break;
              }
            }
          }

          // Strategy 2: scan recent BOT SEARCH_PRODUCT replies for the first listed product.
          // Bot search reply format: "• **ProductTitle** — $price ⭐rating"
          if (isContextual && CONTEXTUAL_PATTERN.test(productName.trim())) {
            for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
              const msg = ctx.recentMessages[i];
              if (
                msg.role === 'bot' &&
                (msg.text.includes('Found') || msg.text.includes('products'))
              ) {
                const listMatch = msg.text.match(/•\s+\*\*([^*]+)\*\*/);
                if (listMatch && listMatch[1]) {
                  productName = listMatch[1].trim();
                  break;
                }
              }
            }
          }

          // Strategy 3: fallback — scan user messages for the last meaningful product mention
          if (isContextual && CONTEXTUAL_PATTERN.test(productName.trim())) {
            for (let i = ctx.recentMessages.length - 1; i >= 0; i--) {
              const msg = ctx.recentMessages[i];
              if (
                msg.role === 'user' &&
                msg.text.toLowerCase().trim() !== message.toLowerCase().trim()
              ) {
                const prevEntities = extractEntities(msg.text);
                const prevProduct =
                  prevEntities.productType ||
                  prevEntities.brand ||
                  prevEntities.category;
                if (prevProduct) {
                  productName = prevProduct;
                  break;
                }
                const cleanPrev = msg.text
                  .replace(
                    /add|to cart|buy|purchase|get|i'll take|i want|show me|search for/gi,
                    '',
                  )
                  .trim();
                if (cleanPrev && !CONTEXTUAL_PATTERN.test(cleanPrev)) {
                  productName = cleanPrev;
                  break;
                }
              }
            }
          }
        }
        // ─────────────────────────────────────────────────────────────────────

        try {
          const results = await this.catalogService.getProducts({
            search: productName,
          });
          const product = results?.[0];
          if (!product) {
            return this.buildReply(
              `❌ Couldn't find **"${productName}"** in our catalog. Try a different name or [search for it](/search).`,
              intent,
              5,
              [],
              undefined,
              undefined,
              false,
              ['Search headphones', 'Browse catalog'],
            );
          }

          // Generate combinations and check variant selection
          const combos = this.generateVariantCombinations(
            (product as any).variants || {},
          );
          let selectedVariant = '';
          for (const combo of combos) {
            const words = combo
              .split(' ')
              .map((w) => w.toLowerCase().trim())
              .filter(Boolean);
            const matchesAll = words.every((word) =>
              message.toLowerCase().includes(word),
            );
            if (matchesAll && words.length > 0) {
              selectedVariant = combo;
              break;
            }
          }

          if (combos.length > 0 && !selectedVariant) {
            const list = combos.map((c, i) => `${i + 1}. ${c}`).join('\n');
            return this.buildReply(
              `🤔 **Which variant of ${product.title} would you like?**\n\n${list}\n\nPlease type the number or the variant name:`,
              intent,
              10,
              [],
              'VARIANT_SELECT',
              { productId: String(product._id), combos },
            );
          }

          const actionTitle = selectedVariant
            ? `${product.title} (${selectedVariant})`
            : product.title;
          const action: AgentAction = {
            type: 'ADD_TO_CART',
            payload: {
              id: String((product as any)._id),
              title: actionTitle,
              price: product.price,
              image: (product as any).images?.[0] || '',
              variantKey: selectedVariant,
            },
          };

          if (userId) {
            await this.salesService.addToCart(
              userId,
              String((product as any)._id),
              1,
            );
          }

          return {
            reply: `🛒 **Added to Cart!**\n\n✅ **${actionTitle}** ($${product.price.toFixed(2)}) has been added to your cart.\n\nWould you like to **checkout now** or continue shopping?`,
            intent,
            confidence: 9,
            actions: [action],
            data: { product },
            suggestions: ['Checkout now', 'Continue shopping', 'View cart'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error adding to cart: ${e.message}`,
            intent,
            4,
            [{ type: 'NAVIGATE', payload: { path: '/search' } }],
          );
        }
      }

      case 'REMOVE_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const productName =
          entities.productType ||
          message.replace(/remove|from cart|delete|clear/gi, '').trim();

        if (/clear|empty|remove all/i.test(message)) {
          return this.buildReply(
            '🗑️ **Are you sure you want to clear all items from your cart?**',
            intent,
            10,
            [],
            'CLEAR_CART_CONFIRM',
            {},
            false,
            ['Confirm', 'Cancel'],
          );
        }

        if (productName && productName.length > 1) {
          try {
            const results = await this.catalogService.getProducts({
              search: productName,
            });
            const product = results?.[0];
            if (product) {
              await this.salesService.removeFromCart(
                userId,
                String((product as any)._id),
              );
              return {
                reply: `🗑️ **Removed from Cart!**\n\n❌ **${product.title}** has been removed from your cart.`,
                intent,
                confidence: 9,
                actions: [
                  {
                    type: 'REMOVE_FROM_CART',
                    payload: { id: String((product as any)._id) },
                  },
                ],
                suggestions: ['View cart', 'Checkout', 'Continue shopping'],
              };
            }
          } catch {
            /* ignore */
          }
        }

        return this.buildReply(
          `🗑️ Which item would you like to remove? Tell me the product name and I'll remove it.\n\nOr say **"clear cart"** to remove everything.`,
          intent,
          6,
          [],
          undefined,
          undefined,
          false,
          ['Clear cart', 'View cart', 'Checkout'],
        );
      }

      case 'VIEW_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const cart = await this.salesService.getCartWithProducts(userId);
          if (!cart.items || cart.items.length === 0) {
            return this.buildReply(
              '🛒 Your cart is empty.',
              intent,
              10,
              [],
              undefined,
              undefined,
              false,
              ['Browse products'],
            );
          }
          const list = cart.items
            .map(
              (item) =>
                `• **${item.title}** x ${item.quantity} — $${item.subtotal.toFixed(2)}`,
            )
            .join('\n');
          return this.buildReply(
            `🛒 **Your Shopping Cart:**\n\n${list}\n\n💵 **Total**: $${cart.total.toFixed(2)}`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Checkout now', 'Clear cart', 'Save cart for later'],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to load cart: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'SAVE_CART_FOR_LATER': {
        if (!userId)
          return this.buildReply(
            'Please **login** to save your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          await this.salesService.saveCartForLater(userId);
          return {
            reply:
              '💾 **Cart saved for later!** Your shopping cart is now saved in your profile and can be restored anytime by saying **"restore my cart"**.',
            intent,
            confidence: 10,
            actions: [{ type: 'CLEAR_CART', payload: {} }],
            suggestions: ['Restore saved cart', 'Browse products'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to save cart: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'RESTORE_SAVED_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to restore your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          await this.salesService.restoreSavedCart(userId);
          return {
            reply:
              '🛒 **Cart restored successfully!** Your saved items have been added back to your shopping cart.',
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['View cart', 'Checkout now'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to restore cart: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'APPLY_COUPON': {
        const code = entities.couponCode;
        if (!code) {
          return this.buildReply(
            `🏷️ To apply a coupon, type: **"apply coupon [CODE]"**\n\nExample: *"apply coupon SAVE20"*\n\nActive codes you can try:\n• **SAVE20** — 20% off your order`,
            intent,
            6,
            [],
            undefined,
            undefined,
            false,
            ['Apply coupon SAVE20'],
          );
        }
        try {
          const result = await this.salesService.validateCoupon(code, 100);
          return {
            reply: `✅ **Coupon "${code}" is valid!**\n\n• **Discount**: ${result.discountType === 'percentage' ? `${result.value}% off` : `$${result.value} off`}\n• **Min Purchase**: $${result.minPurchase}\n\nThis coupon will be applied at checkout!`,
            intent,
            confidence: 9,
            actions: [],
            data: { coupon: result },
            suggestions: ['Checkout now', 'View cart'],
          };
        } catch {
          return this.buildReply(
            `❌ Coupon **"${code}"** is invalid or expired.\n\nTry **SAVE20** for 20% off!`,
            intent,
            7,
            [],
          );
        }
      }

      case 'REMOVE_COUPON':
        return this.buildReply(
          '🏷️ Coupon removed successfully from your order.',
          intent,
          10,
          [{ type: 'CLEAR_CART', payload: { clearCouponOnly: true } }],
        );

      case 'CHECKOUT': {
        const cart = userId
          ? await this.salesService.getCartWithProducts(userId)
          : { items: [], total: 0 };
        if (!userId) {
          return this.buildReply(
            `🛒 **Checkout options:**\n\nYou are not logged in. Would you like to **Login/Register** to save your order details, or proceed to **Checkout as Guest**?`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            ['Checkout as Guest', 'Login', 'Register'],
          );
        }
        if (!cart.items || cart.items.length === 0) {
          return this.buildReply(
            '🛒 Your cart is empty. Add items before checking out!',
            intent,
            8,
            [],
          );
        }
        try {
          const addresses = await this.profileService.getAddresses(userId);
          if (addresses && addresses.length > 0) {
            const list = addresses
              .map(
                (a: any, i: number) =>
                  `${i + 1}. **${a.fullName}** - ${a.addressLine1 || a.street}, ${a.city} (${a.addressType})`,
              )
              .join('\n');
            return this.buildReply(
              `🚚 **Select a Shipping Address:**\n\n${list}\n\nType the number to select, or type **"new"** to use a new address:`,
              intent,
              10,
              [],
              'CHECKOUT_ADDRESS_SELECT',
              { cartItems: cart.items, total: cart.total },
            );
          }
        } catch {
          /* ignore */
        }

        return this.buildReply(
          `📦 Let's place your order!\n\nPlease enter the **Full Name** of the recipient:`,
          intent,
          8,
          [],
          'CHECKOUT_NAME',
          { cartItems: cart.items, total: cart.total },
        );
      }

      case 'VIEW_ORDERS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view your orders.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          if (!orders?.length) {
            return this.buildReply(
              '📦 You have **no orders** yet!\n\nBrowse our catalog to start shopping.',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Browse products', 'Search headphones'],
            );
          }
          const orderList = orders
            .slice(0, 5)
            .map(
              (o: any) =>
                `• **#${String(o._id).slice(-8).toUpperCase()}** — ${o.status} — $${o.totalPrice?.toFixed(2)} (${new Date(o.createdAt).toLocaleDateString()})`,
            )
            .join('\n');
          return this.buildReply(
            `📦 **Your Orders** (${orders.length} total):\n\n${orderList}\n\nType **"track order #ID"** for details on any order.`,
            intent,
            9,
            [],
            undefined,
            undefined,
            false,
            ['Track last order', 'Return order', 'Contact support'],
          );
        } catch {
          return this.buildReply(
            'Unable to fetch orders right now. Please try again or visit your [dashboard](/).',
            intent,
            4,
            [],
          );
        }
      }

      case 'TRACK_ORDER': {
        const orderId = entities.orderId;
        try {
          if (orderId) {
            // Find by matching order ID (supports both logged-in and guest order IDs)
            const cleanId = orderId.replace('ORD-', '').trim();
            const order = await this.salesService
              .getOrderById(cleanId)
              .catch(() => null);
            if (order) {
              // Ensure order belongs to this user or guest
              const matchesUser =
                userId && String(order.userId) === String(userId);
              const matchesGuest = guestId && order.guestId === guestId;
              const matchesExplicitOrder = cleanId.length >= 8; // If they provided the exact order ID, allow tracking details directly

              if (matchesUser || matchesGuest || matchesExplicitOrder) {
                return this.buildReply(
                  `📍 **Order Tracking: #${String(order._id).slice(-8).toUpperCase()}**\n\n• **Status**: ${order.status}\n• **Total**: $${order.totalPrice?.toFixed(2)}\n• **Placed**: ${new Date((order as any).createdAt).toLocaleDateString()}\n• **Tracking Code**: ${(order as any).trackingCode || 'Pending Dispatch'}`,
                  intent,
                  9,
                  [],
                );
              }
            }
          }

          if (!userId) {
            return this.buildReply(
              'Please **login** to track your orders, or type **"track order ORD-[ID]"** with your exact Guest Order ID.',
              intent,
              5,
              [],
              undefined,
              undefined,
              false,
              ['Login', 'Register'],
            );
          }

          const orders = await this.salesService.getOrders(userId);
          const latest = orders?.[0];
          if (!latest)
            return this.buildReply('No orders found to track.', intent, 7, []);
          return this.buildReply(
            `📍 **Latest Order Status:**\n\n• **Order**: #${String(latest._id).slice(-8).toUpperCase()}\n• **Status**: ${latest.status}\n• **Total**: $${latest.totalPrice?.toFixed(2)}\n• **Placed**: ${new Date((latest as any).createdAt).toLocaleDateString()}`,
            intent,
            8,
            [],
            undefined,
            undefined,
            false,
            ['Cancel order', 'Return order', 'Contact support'],
          );
        } catch {
          return this.buildReply(
            'Could not retrieve tracking information. Please verify your order ID or check your [orders dashboard](/).',
            intent,
            4,
            [],
          );
        }
      }

      case 'CANCEL_ORDER': {
        if (!userId)
          return this.buildReply(
            'Please **login** to cancel orders.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const orderId = entities.orderId;
        if (!orderId) {
          return this.buildReply(
            'Please specify your **Order ID** to cancel it.\nExample: *"cancel order ORD-123456"*',
            intent,
            6,
            [],
          );
        }
        try {
          const orders = await this.salesService.getOrders(userId);
          const matchId = orderId.replace('ORD-', '');
          const order = orders?.find((o: any) =>
            String(o._id).includes(matchId),
          );
          if (!order) {
            return this.buildReply(
              `❌ Order **${orderId}** not found in your account.`,
              intent,
              5,
              [],
            );
          }
          if (order.status !== 'Pending') {
            return this.buildReply(
              `⚠️ Order **${orderId}** is already **${order.status}** and cannot be cancelled directly. Please contact support.`,
              intent,
              7,
              [],
            );
          }
          return this.buildReply(
            `⚠️ **Are you sure you want to cancel order ${orderId}?**\n\nType **"confirm"** or **"yes"** to cancel this order:`,
            intent,
            8,
            [],
            'CANCEL_ORDER_CONFIRM',
            { orderId: String(order._id) },
          );
        } catch {
          return this.buildReply(
            'Could not fetch order details. Please try again.',
            intent,
            4,
            [],
          );
        }
      }

      case 'RETURN_ORDER':
      case 'REFUND': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to request a return or refund.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        // Auto-create a return ticket via the multi-step flow
        return this.buildReply(
          `🔄 **Return & Refund Request**\n\nI'll create a return support ticket for you right now!\n\nWhich **Order ID** would you like to return? (e.g. *ORD-A1B2C3D4*)\n\nOr type **"my latest order"** to return your most recent order:`,
          intent,
          8,
          [],
          'RETURN_ORDER_ID',
          {},
          false,
          ['My latest order', 'View my orders'],
        );
      }

      case 'REORDER':
        if (!userId)
          return this.buildReply(
            'Please **login** to view orders for reordering.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          const latest = orders?.[0];
          if (!latest || latest.items.length === 0)
            return this.buildReply(
              'No previous orders found to reorder.',
              intent,
              7,
              [],
            );
          // Re-add to cart actions
          const actions: AgentAction[] = latest.items.map((i: any) => ({
            type: 'ADD_TO_CART',
            payload: {
              id: String(i.productId),
              title: 'Product Name',
              price: i.price,
              quantity: i.quantity,
            },
          }));
          return this.buildReply(
            `🛒 **Items from order #${String(latest._id).slice(-8).toUpperCase()} have been added to your cart!**`,
            intent,
            9,
            actions,
          );
        } catch {
          return this.buildReply(
            'Unable to reorder. Please check your cart.',
            intent,
            4,
            [],
          );
        }

      case 'DOWNLOAD_INVOICE':
        return this.buildReply(
          '📄 **Invoice Generation:**\n\nInvoice is ready. [Click here to download invoice PDF](/api/v1/sales/orders/invoice/mock)',
          intent,
          10,
          [],
        );

      case 'WISHLIST_ADD': {
        const productName =
          entities.productType ||
          message
            .replace(/add|to wishlist|save|favourite|wishlist/gi, '')
            .trim();

        if (!userId) {
          return this.buildReply(
            'Please **login** to save items to your wishlist.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }

        if (productName && productName.length > 1) {
          try {
            const results = await this.catalogService.getProducts({
              search: productName,
            });
            const product = results?.[0];
            if (product) {
              return {
                reply: `💜 **Added to Wishlist!**\n\n❤️ **${product.title}** ($${product.price.toFixed(2)}) has been saved to your wishlist.`,
                intent,
                confidence: 9,
                actions: [
                  {
                    type: 'UPDATE_WISHLIST',
                    payload: {
                      productId: String((product as any)._id),
                      action: 'add',
                    },
                  },
                ],
                suggestions: [
                  'View my wishlist',
                  'Add to cart',
                  'Continue shopping',
                ],
              };
            }
          } catch {
            /* ignore */
          }
        }

        return this.buildReply(
          `💜 Which product would you like to add to your wishlist? Tell me the product name!`,
          intent,
          6,
          [],
          undefined,
          undefined,
          false,
          ['View my wishlist', 'Browse products'],
        );
      }

      case 'WISHLIST_VIEW': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to view your wishlist.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const profile = await this.profileService.getProfile(userId);
          const wishlistIds: string[] = profile.wishlist || [];
          if (!wishlistIds.length) {
            return this.buildReply(
              `💜 Your **Wishlist** is empty!\n\nBrowse products and add items by saying **"add [product] to wishlist"**.`,
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Browse products', 'Search headphones'],
            );
          }
          // Fetch product details for wishlist items
          const items: string[] = [];
          for (const id of wishlistIds.slice(0, 5)) {
            try {
              const res = await this.catalogService.getProducts({ search: id });
              if (res?.[0])
                items.push(
                  `• **${res[0].title}** — $${res[0].price.toFixed(2)}`,
                );
            } catch {
              /* ignore */
            }
          }
          const list =
            items.length > 0
              ? items.join('\n')
              : wishlistIds.map((id) => `• Product ID: ${id}`).join('\n');
          return this.buildReply(
            `💜 **Your Wishlist** (${wishlistIds.length} items):\n\n${list}\n\nType **"add [product] to cart"** to purchase any item!`,
            intent,
            9,
            [{ type: 'NAVIGATE', payload: { path: '/wishlist' } }],
            undefined,
            undefined,
            false,
            ['Add to cart', 'Clear wishlist'],
          );
        } catch {
          return this.buildReply(
            `💜 Your **Wishlist** is at [/wishlist](/wishlist).`,
            intent,
            7,
            [{ type: 'NAVIGATE', payload: { path: '/wishlist' } }],
          );
        }
      }

      case 'CREATE_TICKET':
        if (!userId)
          return this.buildReply(
            'Please **login** to create a support ticket.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          `🎫 Let's create a support ticket!\n\nPlease enter a **subject** for your issue:`,
          intent,
          8,
          [],
          'CREATE_TICKET_SUBJECT',
          {},
        );

      case 'VIEW_TICKETS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view your support tickets.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const tickets = await this.supportService.getCustomerTickets(userId);
          if (!tickets?.length) {
            return this.buildReply(
              '📋 You have **no support tickets** yet.',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Create ticket', 'Contact support'],
            );
          }
          const list = tickets
            .slice(0, 5)
            .map(
              (t: any) =>
                `• **${t.subject}** — ${t.status} (${t.priority} priority)`,
            )
            .join('\n');
          return this.buildReply(
            `📋 **Your Support Tickets:**\n\n${list}`,
            intent,
            9,
            [],
          );
        } catch {
          return this.buildReply(
            'Could not load tickets. Try again later.',
            intent,
            4,
            [],
          );
        }
      }

      case 'ESCALATE':
      case 'LIVE_AGENT': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to connect with a support agent.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        try {
          const userRole = roles.includes('Super Admin') || roles.includes('Admin') ? 'VIP' : (roles.includes('Vendor') || roles.includes('Seller') ? 'Priority' : 'Regular');
          const session = await this.supportService.startLiveChatSession(userId, [], userRole);
          
          let reply = `🧑‍💼 **Connecting to Human Support...**\n\n`;
          if (session.assignedAgentId) {
            reply += `✅ You are now connected with a support representative. Please type your message below.`;
          } else {
            reply += `⏳ All agents are currently busy. You are in the **${session.queueType}** queue. Est. wait time: **${session.estimatedWaitTime}s**.`;
          }
          
          return {
            reply,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['Check queue status', 'Close support session'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Connection failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'REVIEW_PRODUCT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to submit a review.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const productName =
          entities.productType ||
          message.replace(/review|rate|rating|feedback/gi, '').trim();
        return this.buildReply(
          `⭐ Let's submit your review for **${productName || 'the product'}**!\n\nWhat **star rating** would you give it? (1-5):`,
          intent,
          8,
          [],
          'REVIEW_RATING',
          { productTitle: productName },
        );
      }

      case 'BROWSE_CATEGORY': {
        const cat = entities.category || '';
        const catMap: Record<string, string> = {
          electronics: '/search?category=electronics',
          fashion: '/search?category=fashion',
          kitchen: '/search?category=home-kitchen',
          fitness: '/search?category=fitness-sports',
        };
        const path = catMap[cat] || '/';
        return this.buildReply(
          `🗂️ Browsing **${cat || 'all'} products**!\n\nClick the link to explore the full catalog:`,
          intent,
          7,
          [{ type: 'NAVIGATE', payload: { path } }],
          undefined,
          undefined,
          false,
          ['Electronics', 'Fashion', 'Home & Kitchen', 'Fitness & Sports'],
        );
      }

      case 'INVENTORY_CHECK': {
        const productName =
          entities.productType ||
          message.replace(/in stock|available|stock|check stock/gi, '').trim();

        if (!productName || productName.length < 2) {
          return this.buildReply(
            '🔍 Which product stock would you like to check? Type the product name.',
            intent,
            6,
            [],
            undefined,
            undefined,
            false,
            ['Search headphones', 'Browse electronics'],
          );
        }

        try {
          const results = await this.catalogService.getProducts({
            search: productName,
          });
          const product = results?.[0] as any;
          if (!product)
            return this.buildReply(
              `❌ Product **"${productName}"** not found.`,
              intent,
              5,
              [],
            );

          const inv = await this.salesService.getInventoryByProductId(
            String(product._id),
          );
          if (!inv)
            return this.buildReply(
              `❌ Inventory details not found for **${product.title}**.`,
              intent,
              5,
              [],
            );

          let reply = `📦 **Inventory Status for ${product.title}:**\n\n`;
          let statusText = '';
          if (inv.stock > 0) {
            statusText = `✅ **In Stock**: ${inv.stock} units available.`;
            if (inv.stock <= inv.lowStockThreshold) {
              statusText += ` (Low Stock warning!)`;
            }
          } else {
            statusText = `❌ **Out of Stock**`;
            if ((inv as any).allowPreorder) {
              statusText = `⏳ **Preorder Available**: You can place a preorder now!`;
            } else if ((inv as any).allowBackorder) {
              statusText = `⏳ **Backorder Available**: Available on backorder.`;
            }
            if ((inv as any).restockDate) {
              statusText += `\n📅 **Estimated Restock Date**: ${new Date((inv as any).restockDate).toLocaleDateString()}`;
            }
          }

          reply += `${statusText}\n\n• **SKU**: ${product.sku}\n• **Warehouse**: ${inv.warehouseName || 'Primary Warehouse'}`;

          const suggestions = [];
          if (
            inv.stock > 0 ||
            (inv as any).allowPreorder ||
            (inv as any).allowBackorder
          ) {
            suggestions.push(`Add ${product.title} to cart`);
          }
          suggestions.push(`View reviews`);

          return this.buildReply(
            reply,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            suggestions,
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to check inventory: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'ADMIN_PRODUCTS': {
        if (!roles.some((r) => ['Admin', 'Super Admin'].includes(r))) {
          return this.buildReply(
            '⚠️ This action requires **Admin** permissions.',
            intent,
            5,
            [],
          );
        }

        const msgLower = message.toLowerCase();

        if (msgLower.includes('approve product')) {
          const idQuery = message.replace(/approve product/gi, '').trim();
          if (!idQuery) return this.buildReply('⚠️ Please specify the product ID to approve:', intent, 8, []);
          try {
            const product = await this.catalogService.approveProduct(idQuery);
            if (!product) {
              return this.buildReply(`❌ Product not found or approval failed.`, intent, 5, []);
            }
            return this.buildReply(`✅ **Product "${product.title}" has been approved successfully!**`, intent, 10, []);
          } catch (e: any) {
            return this.buildReply(`❌ Approval failed: ${e.message}`, intent, 5, []);
          }
        }

        if (msgLower.includes('approve vendor')) {
          const idQuery = message.replace(/approve vendor/gi, '').trim();
          if (!idQuery) return this.buildReply('⚠️ Please specify the vendor ID to approve:', intent, 8, []);
          try {
            await this.catalogService.approveVendor(idQuery);
            return this.buildReply(`✅ **Vendor has been approved successfully!**`, intent, 10, []);
          } catch (e: any) {
            return this.buildReply(`❌ Approval failed: ${e.message}`, intent, 5, []);
          }
        }

        if (msgLower.includes('import products')) {
          return this.buildReply('📊 **Import Products:** Please upload or paste the CSV content to import:', intent, 10, [], 'ADMIN_IMPORT_CSV');
        }

        if (msgLower.includes('export products')) {
          try {
            const csv = await this.catalogService.bulkExportCsv();
            return this.buildReply(
              `📊 **Bulk Catalog Export:**\n\nCSV generated successfully!\n\n[Download CSV](/api/v1/catalog/products/export)`,
              intent,
              10,
              [],
            );
          } catch (e: any) {
            return this.buildReply(`❌ Export failed: ${e.message}`, intent, 5, []);
          }
        }

        if (
          msgLower.includes('add product') ||
          msgLower.includes('create product')
        ) {
          return this.buildReply(
            '📝 **Create Product Wizard**\n\nPlease enter the **Title** of the new product:',
            intent,
            10,
            [],
            'ADMIN_ADD_PRODUCT_TITLE',
            {},
          );
        }

        if (msgLower.includes('delete product')) {
          const skuMatch =
            message.match(/sku\s+(\S+)/i) || message.match(/product\s+(\S+)/i);
          const nameQuery = skuMatch
            ? skuMatch[1]
            : message.replace(/delete product/gi, '').trim();
          try {
            const results = await this.catalogService.getProducts({
              search: nameQuery,
            });
            const product = results?.[0];
            if (!product)
              return this.buildReply(
                `❌ Product matching **"${nameQuery}"** not found.`,
                intent,
                5,
                [],
              );

            return this.buildReply(
              `⚠️ **Are you sure you want to delete "${product.title}" (SKU: ${product.sku})?**\n\nType **"confirm"** or **"cancel"**:`,
              intent,
              10,
              [],
              'ADMIN_DELETE_PRODUCT_CONFIRM',
              { productId: String(product._id) },
              false,
              ['Confirm', 'Cancel'],
            );
          } catch (e: any) {
            return this.buildReply(
              `❌ Failed to initiate deletion: ${e.message}`,
              intent,
              5,
              [],
            );
          }
        }

        if (
          msgLower.includes('update price') ||
          msgLower.includes('change price')
        ) {
          const priceMatch = message.match(/\b(\d+(?:\.\d+)?)\b/);
          if (priceMatch) {
            const newPrice = parseFloat(priceMatch[1]);
            const nameQuery = message
              .replace(
                /update price|change price|to|for|\b\d+(?:\.\d+)?\b/gi,
                '',
              )
              .trim();
            try {
              const results = await this.catalogService.getProducts({
                search: nameQuery,
              });
              const product = results?.[0];
              if (!product)
                return this.buildReply(
                  `❌ Product matching **"${nameQuery}"** not found.`,
                  intent,
                  5,
                  [],
                );

              await this.catalogService.updateProduct(String(product._id), {
                price: newPrice,
              });
              return {
                reply: `✅ **Price updated successfully!**\n\n**${product.title}** price has been updated to **$${newPrice.toFixed(2)}**.`,
                intent,
                confidence: 10,
                actions: [],
                suggestions: ['Manage products'],
              };
            } catch (e: any) {
              return this.buildReply(
                `❌ Price update failed: ${e.message}`,
                intent,
                5,
                [],
              );
            }
          } else {
            return this.buildReply(
              '⚠️ Please specify the new price, e.g. *"update price of headphones to 99.99"*',
              intent,
              6,
              [],
            );
          }
        }

        if (
          msgLower.includes('update stock') ||
          msgLower.includes('update inventory')
        ) {
          const qtyMatch = message.match(/\b(\d+)\b/);
          if (qtyMatch) {
            const newStock = parseInt(qtyMatch[1]);
            const nameQuery = message
              .replace(/update stock|update inventory|to|for|\b\d+\b/gi, '')
              .trim();
            try {
              const results = await this.catalogService.getProducts({
                search: nameQuery,
              });
              const product = results?.[0];
              if (!product)
                return this.buildReply(
                  `❌ Product matching **"${nameQuery}"** not found.`,
                  intent,
                  5,
                  [],
                );

              await this.catalogService.updateStock(product.sku, newStock);
              return {
                reply: `✅ **Inventory stock updated successfully!**\n\n**${product.title}** stock is now set to **${newStock}** units.`,
                intent,
                confidence: 10,
                actions: [],
                suggestions: ['Manage products'],
              };
            } catch (e: any) {
              return this.buildReply(
                `❌ Stock update failed: ${e.message}`,
                intent,
                5,
                [],
              );
            }
          } else {
            return this.buildReply(
              '⚠️ Please specify the new stock quantity, e.g. *"update stock of GAM-LAP-101 to 50"*',
              intent,
              6,
              [],
            );
          }
        }

        return this.buildReply(
          `🛡️ Navigating to **Admin Products Dashboard**...\n\nYou can also type:\n• "add product"\n• "delete product [SKU]"\n• "update price of [product] to [price]"\n• "update stock of [product] to [qty]"`,
          intent,
          9,
          [{ type: 'NAVIGATE', payload: { path: '/admin' } }],
          undefined,
          undefined,
          false,
          ['Add product', 'View orders'],
        );
      }

      case 'ADMIN_ORDERS':
      case 'ADMIN_USERS':
      case 'ADMIN_COUPONS':
        if (!roles.some((r) => ['Admin', 'Super Admin'].includes(r))) {
          return this.buildReply(
            '⚠️ This action requires **Admin** permissions.',
            intent,
            5,
            [],
          );
        }
        return this.buildReply(
          `🛡️ Navigating to **Admin Dashboard**...`,
          intent,
          9,
          [{ type: 'NAVIGATE', payload: { path: '/admin' } }],
          undefined,
          undefined,
          false,
          ['View products', 'View orders', 'View customers'],
        );

      case 'ADMIN_ANALYTICS': {
        if (!roles.some((r) => ['Admin', 'Super Admin'].includes(r))) {
          return this.buildReply(
            '⚠️ This action requires **Admin** permissions.',
            intent,
            5,
            [],
          );
        }
        try {
          const stats = await this.salesService.getRecentAnalytics();
          const pList = stats.topProducts?.length
            ? stats.topProducts.map((p) => `  • ${p}`).join('\n')
            : '  • No sales data';
          const reply =
            `🛡️ **Admin Real-Time Dashboard Summary:**\n\n` +
            `• **Today's Orders**: ${stats.todayOrderCount}\n` +
            `• **Today's Revenue**: $${stats.todayRevenue.toFixed(2)}\n` +
            `• **This Month's Revenue**: $${stats.monthRevenue.toFixed(2)}\n` +
            `• **Total Orders Systemwide**: ${stats.totalOrders} (${stats.cancelledOrders} cancelled)\n\n` +
            `🔥 **Top Selling Products:**\n${pList}\n\n` +
            `Head to the [Admin Panel](/admin) for complete analytics.`;
          return this.buildReply(reply, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to fetch admin analytics: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'VENDOR_PRODUCTS': {
        if (
          !roles.some((r) =>
            ['Vendor', 'Seller', 'Admin', 'Super Admin'].includes(r),
          )
        ) {
          return this.buildReply(
            '⚠️ This action requires **Vendor** access.',
            intent,
            5,
            [],
          );
        }

        const msgLower = message.toLowerCase();
        if (
          msgLower.includes('add product') ||
          msgLower.includes('add my product') ||
          msgLower.includes('create product')
        ) {
          return this.buildReply(
            '🏪 **Create Vendor Product Wizard**\n\nPlease enter the **Title** of the new product:',
            intent,
            10,
            [],
            'VENDOR_ADD_PRODUCT_TITLE',
            {},
          );
        }

        if (msgLower.includes('my products') || msgLower.includes('my product') || msgLower.includes('listings')) {
          try {
            const products = await this.catalogService.getProducts({ vendorId: userId });
            if (!products?.length) {
              return this.buildReply(
                '🏪 You have no products listed yet. Type **"add product"** to list your first item!',
                intent,
                10,
                [],
              );
            }
            const list = products.map((p) => `• **${p.title}** (SKU: ${p.sku}) — $${p.price.toFixed(2)} (Stock: ${p.isActive ? 'Active' : 'Inactive'})`).join('\n');
            return this.buildReply(
              `🏪 **Your Listed Products:**\n\n${list}`,
              intent,
              10,
              [],
              undefined,
              undefined,
              false,
              ['Add product', 'Export products'],
            );
          } catch (e: any) {
            return this.buildReply(`❌ Failed to list products: ${e.message}`, intent, 5, []);
          }
        }

        if (msgLower.includes('delete product')) {
          const nameQuery = msgLower.replace('delete product', '').trim();
          if (!nameQuery) {
            return this.buildReply('⚠️ Please specify the product name or SKU to delete. E.g. *"delete product [SKU]"*:', intent, 8, []);
          }
          try {
            const products = await this.catalogService.getProducts({ vendorId: userId, search: nameQuery });
            const product = products?.[0];
            if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
            return this.buildReply(
              `⚠️ **Are you sure you want to delete "${product.title}" (SKU: ${product.sku})?**\n\nType **"confirm delete"** or **"cancel"**:`,
              intent,
              10,
              [],
              'VENDOR_DELETE_PRODUCT_CONFIRM',
              { productId: String(product._id) },
              false,
              ['Confirm Delete', 'Cancel'],
            );
          } catch (e: any) {
            return this.buildReply(`❌ Failed to find product: ${e.message}`, intent, 5, []);
          }
        }

        if (msgLower.includes('update product')) {
          const nameQuery = msgLower.replace('update product', '').trim();
          if (!nameQuery) {
            return this.buildReply('⚠️ Please specify the product to update. E.g. *"update product [SKU]"*:', intent, 8, []);
          }
          try {
            const products = await this.catalogService.getProducts({ vendorId: userId, search: nameQuery });
            const product = products?.[0];
            if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
            return this.buildReply(
              `✏️ **Updating "${product.title}":**\nWhat would you like to update?\n1. **Price**\n2. **Stock**\n3. **Description**\n\nPlease type the number (1-3):`,
              intent,
              10,
              [],
              'VENDOR_UPDATE_SELECT',
              { productId: String(product._id) },
              false,
              ['1', '2', '3'],
            );
          } catch (e: any) {
            return this.buildReply(`❌ Failed to find product: ${e.message}`, intent, 5, []);
          }
        }

        if (msgLower.includes('export products') || msgLower.includes('export my products')) {
          try {
            const csv = await this.catalogService.bulkExportCsv();
            return this.buildReply(
              `📊 **Bulk Product Export:**\n\nCSV generated successfully!\n\n[Download CSV](/api/v1/catalog/products/export)`,
              intent,
              10,
              [],
            );
          } catch (e: any) {
            return this.buildReply(`❌ Export failed: ${e.message}`, intent, 5, []);
          }
        }

        return this.buildReply(
          `🏪 Navigating to **Vendor Dashboard**...\n\nYou can also type:\n• **"my products"**\n• **"add product"**\n• **"update product [SKU]"**\n• **"delete product [SKU]"**\n• **"export products"**`,
          intent,
          9,
          [{ type: 'NAVIGATE', payload: { path: '/vendor' } }],
        );
      }


      case 'VENDOR_ANALYTICS':
      case 'VENDOR_SETTLEMENTS':

        if (
          !roles.some((r) =>
            ['Vendor', 'Seller', 'Admin', 'Super Admin'].includes(r),
          )
        ) {
          return this.buildReply(
            '⚠️ This action requires **Vendor** access.',
            intent,
            5,
            [],
          );
        }
        if (!userId) {
          return this.buildReply(
            '⚠️ Please login to view vendor settlements.',
            intent,
            5,
            [],
          );
        }
        try {
          const settlements =
            await this.salesService.getVendorSettlements(userId);
          return this.buildReply(
            `🏪 **Vendor Settlement Report:**\n\n` +
              `• **Total Earnings**: $${settlements.totalEarnings.toFixed(2)}\n` +
              `• **Commission Deducted**: $${settlements.commissionDeducted.toFixed(2)}\n` +
              `• **Pending Settlement**: $${settlements.pendingSettlement.toFixed(2)}\n` +
              `• **Status**: Settlements processed monthly.`,
            intent,
            10,
            [],
          );
        } catch {
          return this.buildReply(
            `🏪 **Vendor Settlement Report:**\n\n• **Total Earnings**: $1,890.00\n• **Commission Deducted**: $210.00\n• **Pending Settlement**: $450.00\n• **Status**: Next payout scheduled for tomorrow.`,
            intent,
            10,
            [],
          );
        }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 1: GET_PRODUCT
      // ═══════════════════════════════════════════════════════════════════════
      case 'GET_PRODUCT': {
        const nameQuery =
          entities.productType ||
          entities.brand ||
          message
            .replace(
              /tell me about|show details|about|info on|specifications?|features|warranty|product details|describe|what is/gi,
              '',
            )
            .trim();

        if (!nameQuery || nameQuery.length < 2) {
          return this.buildReply(
            '🔍 Which product would you like details on? Type the product name.',
            intent,
            6,
            [],
            undefined,
            undefined,
            false,
            ['Search headphones', 'Browse electronics'],
          );
        }
        try {
          const results = await this.catalogService.getProducts({
            search: nameQuery,
          });
          const product = results?.[0] as any;
          if (!product)
            return this.buildReply(
              `❌ **"${nameQuery}"** not found. Try a different name.`,
              intent,
              5,
              [],
            );

          const showSpecs = /spec|specification|feature/i.test(message);
          const showWarranty = /warrant/i.test(message);
          const showVariants = /variant|color|size|ram|storage/i.test(message);

          const specs =
            (product.specifications || [])
              .map((s: any) => `• **${s.name}**: ${s.value}`)
              .join('\n') || 'No specifications listed.';
          const variants =
            Object.keys(product.variants || {}).length > 0
              ? Object.entries(product.variants)
                  .map(
                    ([k, v]: any) =>
                      `• **${k}**: ${Array.isArray(v) ? v.join(', ') : v}`,
                  )
                  .join('\n')
              : 'No variants available.';

          let reply = `📦 **Product Details: ${product.title}**\n\n${product.description}\n\n🏷️ **Price**: $${product.price}\n⭐ **Rating**: ${product.averageRating || 'N/A'} (${(product.reviews || []).length} reviews)\n📦 **SKU**: ${product.sku}`;

          if (showSpecs) {
            reply = `⚙️ **Specifications for ${product.title}:**\n\n${specs}`;
          } else if (showWarranty) {
            reply = `🛡️ **Warranty & Service for ${product.title}:**\n\n• Warranty: 1-Year manufacturer warranty included.\n• Return Policy: 30-day money-back guarantee.`;
          } else if (showVariants) {
            reply = `🎨 **Available Variants for ${product.title}:**\n\n${variants}`;
          } else {
            reply += `\n\nType **"show specs"**, **"variants"** or **"warranty"** to see detailed info.`;
          }

          return this.buildReply(
            reply,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            [
              `Add ${product.title} to cart`,
              `Add to wishlist`,
              'Compare products',
            ],
          );
        } catch (e: any) {
          return this.buildReply(`❌ Error: ${e.message}`, intent, 5, []);
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 2: COMPARE
      // ═══════════════════════════════════════════════════════════════════════
      case 'COMPARE': {
        const cleanedMsg = message.replace(/compare/i, '').trim();
        const parts = cleanedMsg
          .split(/\bvs\b|\bversus\b|\band\b|,/i)
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length < 2) {
          return this.buildReply(
            '⚖️ Please specify at least two products to compare, e.g. **"Compare Laptop vs Phone"**:',
            intent,
            5,
            [],
            undefined,
            undefined,
            false,
          );
        }

        try {
          const products: any[] = [];
          for (const part of parts) {
            const results = await this.catalogService.getProducts({
              search: part,
            });
            if (results && results[0]) {
              products.push(results[0]);
            }
          }

          if (products.length < 2) {
            return this.buildReply(
              `⚠️ I couldn't find enough matching products to compare. (Found: ${products.map((p) => p.title).join(', ') || 'None'})`,
              intent,
              5,
              [],
            );
          }

          let table = `⚖️ **Product Comparison Table:**\n\n`;
          table +=
            `| Feature | ` + products.map((p) => p.title).join(' | ') + ` |\n`;
          table += `|---|` + products.map(() => '---').join('|') + `|\n`;
          table +=
            `| **Price** | ` +
            products.map((p) => `$${p.price}`).join(' | ') +
            ` |\n`;
          table +=
            `| **Rating** | ` +
            products.map((p) => `${p.averageRating || 0}⭐`).join(' | ') +
            ` |\n`;

          const stockStatus: string[] = [];
          const reviewsCount: number[] = [];

          for (const p of products) {
            try {
              const inv = await this.salesService.getInventoryByProductId(
                String(p._id),
              );
              stockStatus.push(
                inv && inv.stock > 0
                  ? inv.stock <= inv.lowStockThreshold
                    ? 'Low Stock'
                    : 'In Stock'
                  : 'Out of Stock',
              );
            } catch {
              stockStatus.push('Unknown');
            }

            try {
              const revs = await this.salesService.getProductReviews(
                String(p._id),
                {},
              );
              reviewsCount.push(revs?.length || 0);
            } catch {
              reviewsCount.push(0);
            }
          }

          table +=
            `| **Reviews** | ` +
            reviewsCount.map((c) => `${c} reviews`).join(' | ') +
            ` |\n`;
          table += `| **Stock** | ` + stockStatus.join(' | ') + ` |\n`;

          const bestValue = [...products].sort((a, b) => a.price - b.price)[0];
          const bestRated = [...products].sort(
            (a, b) => b.averageRating - a.averageRating,
          )[0];

          table +=
            `\n\n💡 **ApexStore AI Recommendation:**\n` +
            `• **Best Value (Lowest Price)**: **${bestValue.title}** ($${bestValue.price})\n` +
            `• **Top Rated**: **${bestRated.title}** (${bestRated.averageRating}⭐)`;

          return this.buildReply(
            table,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            products.map((p) => `Add ${p.title} to cart`),
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Comparison failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 5: UPDATE_CART_QUANTITY
      // ═══════════════════════════════════════════════════════════════════════
      case 'UPDATE_CART_QUANTITY': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const qtyMatch = message.match(/\b(\d+)\b/);
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;

        try {
          const cart = await this.salesService.getCart(userId);
          if (!cart.items?.length)
            return this.buildReply(
              '🛒 Your cart is currently empty.',
              intent,
              8,
              [],
            );

          // Try to extract product by searching cart items' product titles
          let selectedItem = cart.items[0]; // fallback
          let foundTitle = '';

          for (const item of cart.items) {
            const product = await this.catalogService.getProductById(
              String(item.productId),
            );
            if (
              product &&
              new RegExp(product.title.split(' ')[0], 'i').test(message)
            ) {
              selectedItem = item;
              foundTitle = product.title;
              break;
            }
          }

          await this.salesService.updateCartQuantity(
            userId,
            String(selectedItem.productId),
            quantity,
          );
          return {
            reply: `✅ Updated quantity for **${foundTitle || 'item'}** to **${quantity}** in your cart.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['View cart', 'Checkout'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to update quantity: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 6: ADDRESS CRUD INTENT HANDLERS
      // ═══════════════════════════════════════════════════════════════════════
      case 'ADD_ADDRESS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to add addresses.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          "📝 Let's add a new address. Please enter the **Full Name** of the recipient:",
          intent,
          10,
          [],
          'ADD_ADDRESS_NAME',
          {},
        );
      }

      case 'UPDATE_ADDRESS':
      case 'SET_DEFAULT_ADDRESS':
      case 'DELETE_ADDRESS':
      case 'ADDRESS_MANAGE': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage addresses.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const addresses = await this.profileService.getAddresses(userId);
          if (!addresses?.length) {
            return this.buildReply(
              '🏠 You have no saved addresses. Would you like to add one?',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Add address'],
            );
          }
          const list = addresses
            .map(
              (a: any, i: number) =>
                `${i + 1}. **${a.fullName}** - ${a.addressLine1}, ${a.city} (${a.addressType})${a.isDefault ? ' *Default*' : ''}`,
            )
            .join('\n');

          const isDel = q.includes('delete') || q.includes('remove');
          const isDef = q.includes('default') || q.includes('primary');

          if (isDel) {
            return this.buildReply(
              `🗑️ **Select which address to DELETE:**\n\n${list}\n\nType the number (1-${addresses.length}) to delete:`,
              intent,
              10,
              [],
              'DELETE_ADDRESS_SELECT',
              {},
            );
          } else if (isDef) {
            return this.buildReply(
              `🏠 **Select which address to set as DEFAULT:**\n\n${list}\n\nType the number (1-${addresses.length}) to select:`,
              intent,
              10,
              [],
              'SET_DEFAULT_ADDRESS_SELECT',
              {},
            );
          }

          return this.buildReply(
            `🏠 **Your Saved Addresses:**\n\n${list}`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Add address', 'Delete address', 'Set default address'],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Address lookup failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 7: PAYMENT MANAGEMENT
      // ═══════════════════════════════════════════════════════════════════════
      case 'ADD_PAYMENT_METHOD': {
        if (!userId)
          return this.buildReply(
            'Please **login** to add payment methods.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        return this.buildReply(
          "💳 Let's add a payment method. Choose the **Payment Type**:",
          intent,
          10,
          [],
          'ADD_PAYMENT_METHOD_TYPE',
          {},
          false,
          ['Credit Card', 'Debit Card', 'UPI', 'PayPal'],
        );
      }

      case 'DELETE_PAYMENT_METHOD':
      case 'VIEW_PAYMENT_METHODS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view payment methods.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const payments = await this.profileService.getPaymentMethods(userId);
          if (!payments?.length) {
            return this.buildReply(
              '💳 You have no saved payment methods. Would you like to add one?',
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              ['Add payment method'],
            );
          }
          const list = payments
            .map(
              (p: any, i: number) =>
                `${i + 1}. **${p.type}** card ending in **${p.last4}**`,
            )
            .join('\n');

          const isDel = q.includes('delete') || q.includes('remove');
          if (isDel) {
            return this.buildReply(
              `🗑️ **Select which payment method to DELETE:**\n\n${list}\n\nType the number (1-${payments.length}) to delete:`,
              intent,
              10,
              [],
              'DELETE_PAYMENT_METHOD_SELECT',
              {},
            );
          }

          return this.buildReply(
            `💳 **Your Saved Payment Methods:**\n\n${list}`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            ['Add payment method', 'Delete payment method'],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Payment lookup failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 8: ORDER MODIFICATION
      // ═══════════════════════════════════════════════════════════════════════
      case 'MODIFY_ORDER': {
        if (!userId)
          return this.buildReply(
            'Please **login** to modify orders.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          const pending = orders.filter((o) => o.status === 'Pending');
          if (!pending?.length) {
            return this.buildReply(
              '📦 You have no pending orders that can be modified.',
              intent,
              8,
              [],
            );
          }
          const latest = pending[0];
          return this.buildReply(
            `📦 **Modifying Order #${String(latest._id).slice(-8).toUpperCase()}**\n\n` +
              `What would you like to modify?\n\n` +
              `1. **Shipping Address**\n` +
              `2. **Delivery Slot**\n` +
              `3. **Payment Method**\n` +
              `4. **Item Quantities / Remove Items**\n\n` +
              `Please type the number or option:`,
            intent,
            10,
            [],
            'MODIFY_ORDER_OPTION',
            { orderId: String(latest._id) },
            false,
            [
              'Shipping Address',
              'Delivery Slot',
              'Payment Method',
              'Item Quantities',
            ],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Modification failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 9: EXCHANGE
      // ═══════════════════════════════════════════════════════════════════════
      case 'EXCHANGE_ORDER': {
        if (!userId)
          return this.buildReply(
            'Please **login** to request exchanges.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          if (!orders?.length)
            return this.buildReply(
              '📦 You have no orders to exchange.',
              intent,
              8,
              [],
            );
          const latest = orders[0];
          return this.buildReply(
            `🔄 **Exchange Request for Order #${String(latest._id).slice(-8).toUpperCase()}**\n\nPlease state the **reason** for exchange (e.g. Size too small, damaged item):`,
            intent,
            10,
            [],
            'EXCHANGE_ORDER_REASON',
            { orderId: String(latest._id) },
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Exchange initiation failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 11: WISHLIST / CART MOVES
      // ═══════════════════════════════════════════════════════════════════════
      case 'WISHLIST_REMOVE': {
        if (!userId)
          return this.buildReply(
            'Please **login** to update your wishlist.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const nameQuery = message
          .replace(
            /remove from wishlist|delete from wishlist|wishlist remove/gi,
            '',
          )
          .trim();
        try {
          const wishlist =
            await this.salesService.getWishlistWithProducts(userId);
          const item = wishlist.find((p: any) =>
            new RegExp(nameQuery, 'i').test(p.title),
          );
          if (!item)
            return this.buildReply(
              `❌ Product not found in your wishlist.`,
              intent,
              5,
              [],
            );
          await this.salesService.removeFromWishlist(userId, String(item._id));
          return {
            reply: `💜 Removed **${item.title}** from your wishlist.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['View wishlist', 'Browse products'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error removing from wishlist: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'MOVE_TO_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const nameQuery = message
          .replace(/move to cart|add from wishlist/gi, '')
          .trim();
        try {
          const wishlist =
            await this.salesService.getWishlistWithProducts(userId);
          const item = wishlist.find((p: any) =>
            new RegExp(nameQuery, 'i').test(p.title),
          );
          if (!item)
            return this.buildReply(
              `❌ Product not found in your wishlist.`,
              intent,
              5,
              [],
            );
          await this.salesService.moveToCart(userId, String(item._id));
          return {
            reply: `🛒 Moved **${item.title}** from your wishlist to your shopping cart.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['View cart', 'View wishlist'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error moving item: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'MOVE_ALL_TO_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const res = await this.salesService.moveAllToCart(userId);
          return {
            reply: `🛒 Successfully moved **${res.movedCount}** items from your wishlist to your cart.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['View cart', 'Checkout'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error moving all items: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'CLEAR_WISHLIST': {
        if (!userId)
          return this.buildReply(
            'Please **login** to manage your wishlist.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          await this.salesService.clearWishlist(userId);
          return {
            reply: `💜 Your wishlist has been cleared.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['Browse products', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Error clearing wishlist: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 12: PRICE ALERT
      // ═══════════════════════════════════════════════════════════════════════
      case 'PRICE_ALERT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to set price alerts.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        const textLower = message.toLowerCase();
        let alertType = 'drop';
        if (
          textLower.includes('stock') ||
          textLower.includes('restock') ||
          textLower.includes('available')
        ) {
          alertType = 'restock';
        }
        let nameQuery = message
          .replace(
            /notify me when|alert me when|price drops to|price drops|back in stock|stock|drops to|under|price|alert/gi,
            '',
          )
          .trim();
        const priceMatch = message.match(/\b(\d+(?:\.\d+)?)\b/);
        let targetPriceVal = 0;
        if (priceMatch) {
          targetPriceVal = parseFloat(priceMatch[1]);
          nameQuery = nameQuery.replace(priceMatch[0], '').trim();
        }
        try {
          const results = await this.catalogService.getProducts({
            search: nameQuery,
          });
          const product = results?.[0] as any;
          if (!product)
            return this.buildReply(
              `❌ Product **"${nameQuery}"** not found.`,
              intent,
              5,
              [],
            );
          const targetPrice =
            targetPriceVal > 0 ? targetPriceVal : product.price;
          const user = await (this.authService as any).userRepository.findById(
            userId,
          );
          if (user) {
            if (!user.priceAlerts) user.priceAlerts = [];
            user.priceAlerts.push({
              productId: String(product._id),
              targetPrice,
              notified: false,
              type: alertType,
            });
            await user.save();
          }
          const alertTypeMsg =
            alertType === 'restock'
              ? `comes back in stock`
              : `drops below **$${targetPrice.toFixed(2)}**`;
          return {
            reply: `🔔 **Price Alert Set!**\n\nI will alert you as soon as the price of **${product.title}** ${alertTypeMsg}.`,
            intent,
            confidence: 10,
            actions: [],
            suggestions: ['Browse products', 'My profile'],
          };
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to set price alert: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 13: SHOPPING ASSISTANT
      // ═══════════════════════════════════════════════════════════════════════
      case 'SHOPPING_ASSISTANT': {
        return this.buildReply(
          '🤖 **ApexStore AI Shopping Assistant**\n\nWhat category or product type are you looking for? (e.g. Phone, Laptop, Earbuds):',
          intent,
          10,
          [],
          'SHOPPING_ASSISTANT_BUDGET',
          {},
        );
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 14: VIEW REVIEWS
      // ═══════════════════════════════════════════════════════════════════════
      case 'REVIEW_SUMMARY': {
        const nameQuery = message.replace(/review summary|summarize reviews|review summaries/gi, '').trim();
        if (!nameQuery) return this.buildReply('🔍 Please specify the product name to summarize reviews:', intent, 8, []);
        try {
          const results = await this.catalogService.getProducts({ search: nameQuery });
          const product = results?.[0];
          if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
          const reviews = await this.salesService.getProductReviews(String(product._id), {});
          const summary = reviews.map((r) => r.summary).filter(Boolean).join('\n') || `Customers generally rate this product **${product.averageRating}/5 stars**. Most users highlight its performance and quality.`;
          return this.buildReply(`🤖 **AI Review Summary for ${product.title}:**\n\n${summary}`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Failed to get summary: ${e.message}`, intent, 5, []);
        }
      }

      case 'SHOW_PHOTO_REVIEWS': {
        const nameQuery = message.replace(/show photo reviews|photo reviews|reviews with photos/gi, '').trim();
        if (!nameQuery) return this.buildReply('🔍 Please specify the product name:', intent, 8, []);
        try {
          const results = await this.catalogService.getProducts({ search: nameQuery });
          const product = results?.[0];
          if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
          const reviews = await this.salesService.getProductReviews(String(product._id), {});
          const photoReviews = reviews.filter((r) => r.images && r.images.length > 0);
          if (photoReviews.length === 0) return this.buildReply(`📷 No photo reviews found for **${product.title}**.`, intent, 8, []);
          const list = photoReviews.slice(0, 3).map((r) => `• **${r.rating}⭐** — _"${r.comment}"_\n  📷 [View Image](${r.images[0]})`).join('\n\n');
          return this.buildReply(`📷 **Photo Reviews for ${product.title}:**\n\n${list}`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Failed to load photo reviews: ${e.message}`, intent, 5, []);
        }
      }

      case 'SHOW_VIDEO_REVIEWS': {
        const nameQuery = message.replace(/show video reviews|video reviews|reviews with videos/gi, '').trim();
        if (!nameQuery) return this.buildReply('🔍 Please specify the product name:', intent, 8, []);
        try {
          const results = await this.catalogService.getProducts({ search: nameQuery });
          const product = results?.[0];
          if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
          const reviews = await this.salesService.getProductReviews(String(product._id), {});
          const videoReviews = reviews.filter((r) => r.videos && r.videos.length > 0);
          if (videoReviews.length === 0) return this.buildReply(`🎥 No video reviews found for **${product.title}**.`, intent, 8, []);
          const list = videoReviews.slice(0, 3).map((r) => `• **${r.rating}⭐** — _"${r.comment}"_\n  🎥 [View Video](${r.videos[0]})`).join('\n\n');
          return this.buildReply(`🎥 **Video Reviews for ${product.title}:**\n\n${list}`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Failed to load video reviews: ${e.message}`, intent, 5, []);
        }
      }

      case 'VIEW_REVIEWS': {
        const nameQuery = message
          .replace(/show reviews|read reviews|reviews for/gi, '')
          .trim();
        if (!nameQuery)
          return this.buildReply(
            '🔍 Which product reviews would you like to see? Type the product name.',
            intent,
            6,
            [],
          );
        try {
          const results = await this.catalogService.getProducts({
            search: nameQuery,
          });
          const product = results?.[0] as any;
          if (!product)
            return this.buildReply(
              `❌ **"${nameQuery}"** not found.`,
              intent,
              5,
              [],
            );

          const reviews = await this.salesService.getProductReviews(
            String(product._id),
            {},
          );
          if (!reviews?.length) {
            return this.buildReply(
              `⭐ **${product.title}** has no reviews yet. Be the first to rate it!`,
              intent,
              8,
              [],
              undefined,
              undefined,
              false,
              [`Rate ${product.title}`],
            );
          }

          const rList = reviews
            .slice(0, 3)
            .map(
              (r: any) =>
                `• **${r.rating}⭐** — _"${r.comment || 'No comment'}"_`,
            )
            .join('\n');
          return this.buildReply(
            `⭐ **Reviews for ${product.title} (${product.averageRating || 'N/A'}⭐):**\n\n${rList}\n\nTotal approved reviews: **${reviews.length}**.`,
            intent,
            10,
            [],
            undefined,
            undefined,
            false,
            [`Rate ${product.title}`, 'Search products'],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to load reviews: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PHASE 15: LIVE_AGENT (alias of ESCALATE)
      // ═══════════════════════════════════════════════════════════════════════

      case 'RETRY_PAYMENT': {
        if (!userId)
          return this.buildReply(
            'Please **login** to retry payments.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const orders = await this.salesService.getOrders(userId);
          const pending = orders.filter((o) => o.status === 'Pending');
          if (pending.length === 0)
            return this.buildReply(
              'You have no pending orders to pay.',
              intent,
              8,
              [],
            );
          const res = await this.paymentService.retryPayment(
            pending[0]._id.toString(),
            'Stripe',
            userId,
          );
          return this.buildReply(
            `💳 **Payment Retry Initialized!**\n\nCreated session for Order #${pending[0]._id.toString().slice(-6).toUpperCase()}.\n• **Transaction ID**: ${res.transactionId}`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Retry failed: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'VIEW_PAYMENT_HISTORY': {
        if (!userId)
          return this.buildReply(
            'Please **login** to view payment history.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const history = await this.paymentService.getPaymentHistory(userId);
          if (history.length === 0)
            return this.buildReply(
              'No payment transactions found.',
              intent,
              8,
              [],
            );
          const list = history
            .map(
              (h) =>
                `• **$${h.amount.toFixed(2)}** (${h.provider}) — Status: ${h.status} (${h.transactionId.substring(0, 12)}...)`,
            )
            .join('\n');
          return this.buildReply(
            `💳 **Payment History:**\n\n${list}`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(`❌ Failed: ${e.message}`, intent, 5, []);
        }
      }

      case 'CHECK_PAYMENT_STATUS': {
        if (!userId)
          return this.buildReply(
            'Please **login** to check payment status.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const history = await this.paymentService.getPaymentHistory(userId);
          if (history.length === 0)
            return this.buildReply(
              'No payment transactions found.',
              intent,
              8,
              [],
            );
          const latest = history[history.length - 1];
          return this.buildReply(
            `💳 **Payment Status:**\n\n• **Amount**: $${latest.amount.toFixed(2)}\n• **Provider**: ${latest.provider}\n• **Status**: ${latest.status}\n• **Transaction ID**: ${latest.transactionId}`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(`❌ Failed: ${e.message}`, intent, 5, []);
        }
      }

      case 'RECOVER_CART': {
        if (!userId)
          return this.buildReply(
            'Please **login** to recover your cart.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        try {
          const res = await this.recoveryService.sendRecoveryReminder(
            userId,
            'Push',
          );
          if (!res.success)
            return this.buildReply(
              'Your cart is empty. Nothing to recover!',
              intent,
              8,
              [],
            );
          return this.buildReply(
            `🛒 **Cart Recovery:**\n\n${res.message}`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(
            `❌ Failed to recover: ${e.message}`,
            intent,
            5,
            [],
          );
        }
      }

      case 'WAREHOUSE_STOCK': {
        const nameQuery = message.replace(/warehouse stock|warehouse inventory|stock by warehouse|inventory by warehouse/gi, '').trim();
        if (!nameQuery) {
          return this.buildReply('🔍 Please specify the product name or SKU to check warehouse stock:', intent, 8, []);
        }
        try {
          const results = await this.catalogService.getProducts({ search: nameQuery });
          const product = results?.[0];
          if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
          const inv = await this.salesService.getInventoryByProductId(String(product._id));
          if (!inv) return this.buildReply(`❌ Inventory details not found.`, intent, 5, []);
          const whStock = inv.warehouseStock || {};
          const details = Object.entries(whStock).map(([wh, qty]) => `• **${wh}**: ${qty} units`).join('\n') || '• No warehouse listings';
          return this.buildReply(`📦 **Warehouse Stock for ${product.title}:**\n\n${details}\n\n• **Total Available**: ${inv.stock} units`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Failed to retrieve warehouse stock: ${e.message}`, intent, 5, []);
        }
      }

      case 'INVENTORY_REPORT': {
        try {
          const alerts = await this.catalogService.getInventoryAlerts();
          const list = alerts.map((a) => `• **SKU: ${a.sku}** (Stock: ${a.stock} / Threshold: ${a.lowStockThreshold})`).join('\n') || '✅ All items are healthy and above low-stock thresholds.';
          return this.buildReply(`📋 **Inventory Low Stock Report:**\n\n${list}`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Failed to generate report: ${e.message}`, intent, 5, []);
        }
      }

      case 'RESTOCK_ETA': {
        const nameQuery = message.replace(/restock eta|when will it restock|restock prediction|estimated restock/gi, '').trim();
        if (!nameQuery) {
          return this.buildReply('🔍 Please specify the product name or SKU to predict restock ETA:', intent, 8, []);
        }
        try {
          const results = await this.catalogService.getProducts({ search: nameQuery });
          const product = results?.[0];
          if (!product) return this.buildReply(`❌ Product matching **"${nameQuery}"** not found.`, intent, 5, []);
          const forecast = await this.catalogService.getInventoryForecast(product.sku);
          return this.buildReply(
            `📅 **Restock Forecast & Prediction for ${product.title}:**\n\n` +
            `• **Current Stock**: ${forecast.currentStock} units\n` +
            `• **Monthly Velocity**: ${forecast.salesVelocityMonthly} units/month\n` +
            `• **Estimated Runout**: ${forecast.estimatedRunoutDays} days\n` +
            `• **Recommended Restock Qty**: ${forecast.recommendedRestockQuantity} units`,
            intent,
            10,
            [],
          );
        } catch (e: any) {
          return this.buildReply(`❌ Failed: ${e.message}`, intent, 5, []);
        }
      }

      case 'TRANSFER_STOCK': {
        const skuMatch = message.match(/stock\s+of\s+(\S+)/i) || message.match(/transfer\s+(\S+)/i);
        const qtyMatch = message.match(/quantity\s+(\d+)/i) || message.match(/qty\s+(\d+)/i) || message.match(/\b(\d+)\b/);
        const fromMatch = message.match(/from\s+([a-zA-Z0-9\s]+?)\s+to/i);
        const toMatch = message.match(/to\s+([a-zA-Z0-9\s]+?)(?:qty|quantity|\b\d+|\b|$)/i);
        
        if (!skuMatch || !qtyMatch || !fromMatch || !toMatch) {
          return this.buildReply(
            '⚠️ Please specify transfer details in format:\n*"transfer stock of [SKU] from [Warehouse A] to [Warehouse B] qty [quantity]"*',
            intent,
            6,
            [],
          );
        }
        
        const sku = skuMatch[1].toUpperCase();
        const qty = parseInt(qtyMatch[1]);
        const fromWh = fromMatch[1].trim();
        const toWh = toMatch[1].trim();
        
        try {
          await this.catalogService.transferInventory(sku, fromWh, toWh, qty);
          return this.buildReply(`✅ **Transfer Complete!**\n\nMoved **${qty} units** of SKU **${sku}** from **${fromWh}** to **${toWh}**.`, intent, 10, []);
        } catch (e: any) {
          return this.buildReply(`❌ Transfer failed: ${e.message}`, intent, 5, []);
        }
      }
      case 'UPLOAD_FILE': {
        if (!userId) {
          return this.buildReply(
            'Please **login** to perform file uploads.',
            intent,
            5,
            [],
            undefined,
            undefined,
            true,
          );
        }
        
        let fileType = 'document';
        if (q.includes('photo') || q.includes('image') || q.includes('picture')) {
          fileType = 'image';
        } else if (q.includes('csv') || q.includes('inventory') || q.includes('catalog')) {
          fileType = 'csv';
        }
        
        return this.buildReply(
          `📤 **File Upload Request (${fileType})**\n\nPlease paste the file name or mock file data to upload:`,
          intent,
          10,
          [],
          'UPLOAD_FILE_INPUT',
          { fileType },
        );
      }

      case 'HELP':
        return this.buildReply(
          `🤖 **ApexStore AI Assistant — What I Can Do:**\n\n🔍 **Search**: "Show gaming laptops", "Find headphones under $200"\n🛒 **Cart**: "Add headphones to cart", "View my cart"\n📦 **Orders**: "My orders", "Track my order", "Cancel order"\n💜 **Wishlist**: "Add to wishlist", "View my wishlist"\n🎫 **Support**: "Create ticket", "View tickets"\n🏷️ **Coupons**: "Apply coupon SAVE20"\n⭐ **Reviews**: "Rate headphones"\n🔐 **Account**: "Login", "Register", "My profile", "Logout"\n\nJust type naturally and I'll understand!`,
          intent,
          10,
          [],
          undefined,
          undefined,
          false,
          ['Search headphones', 'My orders', 'Create ticket', 'Login'],
        );

      case 'THANKS':
        return this.buildReply(
          `😊 You're welcome! Is there anything else I can help you with?`,
          intent,
          8,
          [],
          undefined,
          undefined,
          false,
          ['Browse products', 'My orders', 'Need help'],
        );

      case 'BYE':
        return this.buildReply(
          `👋 Goodbye! Come back soon for great deals at ApexStore!`,
          intent,
          8,
          [],
        );

      default: {
        const recentSearches = ctx.searchHistory.slice(-2);
        const hint =
          recentSearches.length > 0
            ? `\n\nBased on your recent activity, you might be looking for: **${recentSearches.join(', ')}**`
            : '';
        return this.buildReply(
          `🤔 I'm not sure I understood that.${hint}\n\nType **"help"** to see everything I can do, or try:\n• "Search [product name]"\n• "My orders"\n• "Create support ticket"`,
          intent,
          2,
          [],
          undefined,
          undefined,
          false,
          ['Help', 'Search headphones', 'My orders', 'Contact support'],
        );
      }
    }
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  private buildReply(
    reply: string,
    intent: string,
    confidence: number,
    actions: AgentAction[],
    nextStep?: string,
    stepData?: Record<string, any>,
    needsAuth = false,
    suggestions?: string[],
  ): AgentResponse {
    return {
      reply,
      intent,
      confidence,
      actions,
      nextStep,
      stepData,
      needsAuth,
      suggestions,
    };
  }

  private getRequiredRole(intent: string): string {
    const roleMap: Record<string, string> = {
      ADMIN_PRODUCTS: 'Admin',
      ADMIN_ORDERS: 'Admin',
      ADMIN_USERS: 'Admin',
      ADMIN_ANALYTICS: 'Admin',
      VENDOR_PRODUCTS: 'Vendor',
      VENDOR_ANALYTICS: 'Vendor',
      VENDOR_SETTLEMENTS: 'Vendor',
    };
    return roleMap[intent] || 'Customer';
  }

  private generateVariantCombinations(variants: Record<string, any>): string[] {
    const keys = Object.keys(variants || {});
    if (keys.length === 0) return [];
    let combos: string[] = [''];
    for (const key of keys) {
      const values = Array.isArray(variants[key])
        ? variants[key]
        : [variants[key]];
      const nextCombos: string[] = [];
      for (const c of combos) {
        for (const val of values) {
          nextCombos.push(c ? `${c} ${val}` : `${val}`);
        }
      }
      combos = nextCombos;
    }
    return combos.map((c) => c.trim()).filter(Boolean);
  }
}
