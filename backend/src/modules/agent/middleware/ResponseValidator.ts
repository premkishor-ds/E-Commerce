import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseValidator {
  /**
   * Validates AI-generated replies against e-commerce hallucinations and data leaks.
   */
  validateResponse(reply: string, originalSystemReply?: string): { isValid: boolean; reason?: string } {
    const text = reply.toLowerCase();

    // 1. Sensitive Data Leakage
    const apiKeys = /\b[a-zA-Z0-9]{32,}\b|api[_-]?key|client[_-]?secret|bearer\s+[a-zA-Z0-9_\-\.]+|mongodb\+srv:\/\//i;
    if (apiKeys.test(reply) && !reply.includes('API key or support keys are not displayed for security')) {
      // Exclude generic mentions of API keys in general instruction rejections
      if (text.includes('secret') || text.includes('key') || text.includes('password') || text.includes('token')) {
        const containsActualKey = /[a-zA-Z0-9]{20,}/.test(reply);
        if (containsActualKey) {
          return { isValid: false, reason: 'Sensitive key or credential token leak detected' };
        }
      }
    }

    const passwords = /password\s*:\s*\S+|admin\s*pass/i;
    if (passwords.test(reply)) {
      return { isValid: false, reason: 'Sensitive password details leak detected' };
    }

    // 2. Hallucinated Order IDs (e.g. ORD-XXXXXX)
    const orderIdPattern = /\b(ord-\d{6,}|ord-[a-z0-9]{6,})\b/i;
    if (orderIdPattern.test(reply)) {
      const match = reply.match(orderIdPattern);
      if (match) {
        const matchedId = match[0].toLowerCase();
        const originalLower = originalSystemReply ? originalSystemReply.toLowerCase() : '';
        if (!originalLower.includes(matchedId)) {
          return { isValid: false, reason: `Hallucinated Order ID detected: ${match[0]}` };
        }
      }
    }

    // 3. Hallucinated Tracking Details
    const trackingPattern = /\b(tracking|carrier|usps|fedex|ups|dhl)\b.*\b[a-z0-9]{8,}\b/i;
    if (trackingPattern.test(reply)) {
      const originalLower = originalSystemReply ? originalSystemReply.toLowerCase() : '';
      if (!originalLower.includes('track') && !originalLower.includes('shipping') && !originalLower.includes('delivery')) {
        return { isValid: false, reason: 'Hallucinated Tracking details detected' };
      }
    }

    // 4. Hallucinated Prices
    const pricePattern = /\$\d+(\.\d{2})?/g;
    if (pricePattern.test(reply)) {
      const match = reply.match(pricePattern);
      if (match) {
        const originalLower = originalSystemReply ? originalSystemReply.toLowerCase() : '';
        for (const p of match) {
          if (!originalLower.includes(p.toLowerCase())) {
            // General talk can have prices if it's explicitly educational, but not as part of our store
            if (originalSystemReply !== undefined) {
              return { isValid: false, reason: `Hallucinated price detected: ${p}` };
            }
          }
        }
      }
    }

    // 5. Hallucinated Discounts
    const discountPattern = /\b\d+%\s*(off|discount)\b/gi;
    if (discountPattern.test(reply)) {
      const match = reply.match(discountPattern);
      if (match) {
        const originalLower = originalSystemReply ? originalSystemReply.toLowerCase() : '';
        for (const d of match) {
          if (!originalLower.includes(d.toLowerCase())) {
            if (originalSystemReply !== undefined) {
              return { isValid: false, reason: `Hallucinated discount detected: ${d}` };
            }
          }
        }
      }
    }

    return { isValid: true };
  }
}
