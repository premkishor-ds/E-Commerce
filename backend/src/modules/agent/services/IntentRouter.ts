import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentRouter {
  private readonly ecommerceIntents = [
    'SEARCH_PRODUCT',
    'GET_PRODUCT',
    'COMPARE',
    'RECOMMEND',
    'ADD_CART',
    'REMOVE_CART',
    'VIEW_CART',
    'UPDATE_CART_QUANTITY',
    'CHECKOUT',
    'VIEW_ORDERS',
    'TRACK_ORDER',
    'CANCEL_ORDER',
    'RETURN_ORDER',
    'REFUND',
    'REORDER',
    'DOWNLOAD_INVOICE',
    'WISHLIST_ADD',
    'WISHLIST_VIEW',
    'WISHLIST_REMOVE',
    'CREATE_TICKET',
    'VIEW_TICKETS',
    'ESCALATE',
    'REVIEW_PRODUCT',
    'BROWSE_CATEGORY',
    'INVENTORY_CHECK',
    'FAQ',
    'REGISTER',
    'LOGIN',
    'LOGOUT',
    'RESET_PASSWORD',
    'CHANGE_PASSWORD',
    'OTP_VERIFY',
    'EMAIL_VERIFY',
    'ADDRESS_MANAGE',
    'VIEW_PROFILE',
    'UPDATE_PROFILE',
    'VIEW_LOYALTY',
    'VIEW_WALLET',
    'NOTIFICATION_PREF',
    'ADMIN_PRODUCTS',
    'ADMIN_ORDERS',
    'ADMIN_USERS',
    'ADMIN_COUPONS',
    'ADMIN_ANALYTICS',
    'VENDOR_PRODUCTS',
    'VENDOR_ANALYTICS',
    'VENDOR_SETTLEMENTS',
    'GREET',
    'HELP',
    'BYE',
    'THANKS'
  ];

  // Conversational intents that should always dispatch through ecommerce (they have specific handlers)
  private readonly ecommerceConversationalIntents = ['GREET', 'HELP', 'BYE', 'THANKS'];

  /**
   * Classifies user query as 'ecommerce' or 'general' route.
   */
  classifyRoute(intent: string, message: string): 'ecommerce' | 'general' {
    const upperIntent = intent.toUpperCase();
    const lower = message.toLowerCase().trim();

    // Identity / self-introduction queries → always route to general LLM
    // so the AI can introduce itself as ApexStore Assistant
    const identityKeywords = /\b(your name|what.?s your name|who are you|who r you|who is you|your identity|are you a bot|are you an ai|what are you|tell me about yourself|introduce yourself|what can you do|what do you do|how are you|how r you|are you real|are you human|are you alive|are you chatbot|are you robot|you.?re a bot|you.?re an ai|what kind of|what type of|your purpose|your role|your function|your capabilities|can you help me|what are your features)\b/i;
    if (identityKeywords.test(lower)) {
      return 'general';
    }

    // E-commerce store keywords
    const storeKeywords = /\b(buy|order|cart|checkout|price|discount|coupon|product|item|shipping|refund|return|wallet|pay|support|ticket|catalog|brand|headphones|laptop|phone|mobile|tablet|camera|watch|tv|speaker|electronics|fashion|clothes|shoes|appliance|furniture|book|game|toy|sport|beauty|grocery|invoice|wishlist|delivery|track|cancel|review|rating|reward|loyalty|address|profile|account|register|login|logout|otp|password|vendor|seller|admin)\b/i;

    // General/off-topic keywords (things the bot should politely decline)
    const generalKeywords = /\b(joke|space|bake|cake|python|javascript|coding|code|write|math|philosophy|weather|news|meaning of life|prime minister|paris|france|history|geography|explain science|sing|song|cricket|football|movie|politics|stock market|covid|election|capital of|president of|who invented|when was)\b/i;

    // Conversational intents (GREET/HELP/BYE/THANKS) always go to ecommerce handlers
    if (this.ecommerceConversationalIntents.includes(upperIntent)) {
      return 'ecommerce';
    }

    // If intent belongs to predefined list of e-commerce intents, route to existing services
    if (this.ecommerceIntents.includes(upperIntent)) {
      if (generalKeywords.test(lower) && !storeKeywords.test(lower)) {
        return 'general';
      }
      return 'ecommerce';
    }

    if (storeKeywords.test(lower) && !generalKeywords.test(lower)) {
      return 'ecommerce';
    }

    if (generalKeywords.test(lower)) {
      return 'general';
    }

    // Default fallback to general AI routing for unrecognized queries
    return 'general';
  }
}
