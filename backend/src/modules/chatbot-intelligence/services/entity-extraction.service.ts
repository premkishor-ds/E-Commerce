import { Injectable } from '@nestjs/common';
import { IntelligenceLoaderService } from './intelligence-loader.service';

@Injectable()
export class EntityExtractionService {
  constructor(private readonly loader: IntelligenceLoaderService) {}

  extract(query: string, goal?: string): Record<string, string> {
    const entities: Record<string, string> = {};
    const lower = query.toLowerCase();

    // 1. Order ID
    const orderIdMatch = query.match(/ORD[-\s]?([A-Z0-9]{5,24})/i);
    if (orderIdMatch) {
      entities.orderId = 'ORD-' + orderIdMatch[1].toUpperCase();
    }

    // 2. Budget / Prices
    const priceMatch = lower.match(/(?:under|below|max|budget)\s+[$₹£€]?\s*(\d+)/i);
    if (priceMatch) {
      entities.budget = priceMatch[1];
      entities.maxPrice = priceMatch[1];
    }
    const minPriceMatch = lower.match(/(?:above|over|min|at least)\s+[$₹£€]?\s*(\d+)/i);
    if (minPriceMatch) {
      entities.minPrice = minPriceMatch[1];
    }

    // 3. Coupon
    const couponMatch = query.match(/\b([A-Z0-9]{4,12})\b/);
    if (couponMatch && !entities.orderId) {
      entities.coupon = couponMatch[1];
    }

    // 4. Quantity
    const qtyMatch = lower.match(/(\d+)\s*(?:item|piece|unit|qty|quantity|x|pcs)\b/);
    if (qtyMatch) {
      entities.quantity = qtyMatch[1];
    }

    // 5. Payment Method
    const payments = ['stripe', 'razorpay', 'wallet', 'cod', 'cash on delivery', 'card'];
    for (const p of payments) {
      if (lower.includes(p)) {
        entities.paymentMethod = p === 'cash on delivery' ? 'COD' : p.toUpperCase();
        break;
      }
    }

    // 6. Storage & RAM
    const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
    if (ramMatch) {
      entities.ram = ramMatch[1] + 'GB';
    }
    const storageMatch = lower.match(/(\d+)\s*(?:gb|tb)\s*(?:storage|ssd|rom|disk|internal)?\b/);
    if (storageMatch && !ramMatch) {
      entities.storage = storageMatch[0].replace(/\s+/g, '').toUpperCase();
    }

    // 7. Color
    const colors = ['black', 'white', 'blue', 'red', 'gold', 'silver', 'green', 'yellow', 'pink', 'grey', 'gray'];
    for (const c of colors) {
      if (lower.includes(c)) {
        entities.color = c;
        break;
      }
    }

    // 8. Size
    const sizes = ['xxl', 'xl', 'large', 'medium', 'small', 'size 10', 'size 9', 'size 8', 'size 7'];
    for (const s of sizes) {
      if (lower.includes(s)) {
        entities.size = s.toUpperCase();
        break;
      }
    }

    // 9. Vocabulary match (Brand, Category, Product) from registries
    const goals = this.loader.getGoals();
    for (const [, def] of goals.entries()) {
      for (const entDef of def.expectedEntities) {
        for (const val of entDef.examples) {
          if (val.length > 2 && lower.includes(val.toLowerCase())) {
            entities[entDef.entity] = val;
          }
        }
      }
    }

    // Add generic product name extraction fallback
    if (lower.includes('compare')) {
      const vsMatch = query.match(/compare\s+(.+?)\s+(?:vs|versus|and|with)\s+(.+)/i);
      if (vsMatch) {
        entities.productA = vsMatch[1].trim();
        entities.productB = vsMatch[2].trim();
      }
    }

    return entities;
  }
}
