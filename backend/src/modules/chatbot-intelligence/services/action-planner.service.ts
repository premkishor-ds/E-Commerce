import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionPlannerService {
  planAction(goal: string, context: Record<string, any>): { intent: string; entities: Record<string, string> } {
    // Map intelligence goals to existing chatbot intents
    const goalToIntentMap: Record<string, string> = {
      CAPABILITY_DISCOVERY: 'HELP',
      SHOPPING_DISCOVERY: 'SEARCH_PRODUCT',
      PRODUCT_SEARCH: 'SEARCH_PRODUCT',
      PRODUCT_DETAILS: 'GET_PRODUCT',
      PRODUCT_COMPARISON: 'COMPARE',
      PRODUCT_RECOMMENDATIONS: 'RECOMMEND',
      CART_MANAGEMENT: 'VIEW_CART',
      CHECKOUT: 'CHECKOUT',
      ORDER_TRACKING: 'TRACK_ORDER',
      ORDER_MANAGEMENT: 'VIEW_ORDERS',
      RETURNS: 'RETURN_ORDER',
      EXCHANGES: 'EXCHANGE_ORDER',
      PAYMENTS: 'VIEW_PAYMENT_METHODS',
      PROFILE_MANAGEMENT: 'VIEW_PROFILE',
      ADDRESS_MANAGEMENT: 'ADDRESS_MANAGE',
      WISHLIST: 'WISHLIST_VIEW',
      WALLET: 'VIEW_WALLET',
      LOYALTY: 'VIEW_LOYALTY',
      SUPPORT: 'CREATE_TICKET',
      LIVE_AGENT: 'LIVE_AGENT',
      NOTIFICATIONS: 'NOTIFICATION_PREF',
      ADMIN_ACTIONS: 'ADMIN_PRODUCTS',
      VENDOR_ACTIONS: 'VENDOR_PRODUCTS',
    };

    const intent = goalToIntentMap[goal] || goal;

    // Convert context properties to string attributes for dispatchIntent
    const entities: Record<string, string> = {};
    for (const [k, v] of Object.entries(context)) {
      entities[k] = String(v);
    }

    // Adapt some specific entity names for compatibility
    if (entities.product) {
      entities.productType = entities.product;
    }
    if (entities.budget) {
      entities.maxPrice = entities.budget;
    }

    return { intent, entities };
  }
}
