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

  /**
   * Classifies user query as 'ecommerce' or 'general' route.
   */
  classifyRoute(intent: string, message: string): 'ecommerce' | 'general' {
    const upperIntent = intent.toUpperCase();
    const lower = message.toLowerCase().trim();
    const storeKeywords = /\b(buy|order|cart|checkout|price|discount|coupon|product|item|shipping|refund|return|wallet|pay|support|ticket|catalog|brand|headphones|laptop|phone)\b/i;
    const generalKeywords = /\b(joke|space|bake|cake|python|javascript|coding|code|write|math|philosophy|weather|news|meaning of life|prime minister|2\+2|paris|france|history|geography|explain|sing|song|who are you|tell me)\b/i;

    // If intent belongs to predefined list of e-commerce intents, route to existing services
    if (this.ecommerceIntents.includes(upperIntent)) {
      // Small talk/general questions can be classified as FAQ or help; double check message keywords
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

    // Default fallback to general AI routing for invalid / out-of-domain queries
    return 'general';
  }
}
