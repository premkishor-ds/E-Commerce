import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  UserRepository,
  ProductRepository,
  ReviewRepository,
  OrderRepository,
  InventoryRepository,
  SellerRepository,
  VendorRepository,
} from '../../repositories/concrete.repositories';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class IntegrityService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly orderRepository: OrderRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly sellerRepository: SellerRepository,
    private readonly vendorRepository: VendorRepository,
  ) {}

  onModuleInit() {
    // Run integrity scan daily (every 24 hours).
    // Run once on startup after a 5 second delay to let the app initialize and database to connect.
    setTimeout(() => {
      this.runIntegrityScan().catch((e) =>
        console.error('Initial integrity scan failed:', e),
      );
    }, 5000);

    setInterval(() => {
      this.runIntegrityScan().catch((e) =>
        console.error('Scheduled integrity scan failed:', e),
      );
    }, 24 * 60 * 60 * 1000);
  }

  async runIntegrityScan() {
    console.log('[Integrity Scan] Starting database integrity verification (Optimized)...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Fetch critical lookups using lean queries and projections for maximum performance
    const [users, products, sellers, vendors, inventories] = await Promise.all([
      this.userRepository.find({}, { projection: { _id: 1 }, lean: true }),
      this.productRepository.find({}, { projection: { _id: 1, sku: 1, title: 1, vendorId: 1 }, lean: true }),
      this.sellerRepository.find({}, { projection: { _id: 1 }, lean: true }),
      this.vendorRepository.find({}, { projection: { _id: 1 }, lean: true }),
      this.inventoryRepository.find({}, { projection: { sku: 1, stock: 1 }, lean: true }),
    ]);

    const userIds = new Set(users.map((u) => u._id.toString()));
    const productIds = new Set(products.map((p) => p._id.toString()));
    
    // Maps for lookup
    const inventoryMap = new Map(inventories.map((i) => [i.sku, i]));

    // We will collect anomalies
    const anomalies = {
      orphanReviews: [] as any[],
      reviewsWithoutPurchases: [] as any[],
      productsWithoutOwner: [] as any[],
      negativeInventory: [] as any[],
      missingInventory: [] as any[],
    };

    // 1. Audit Reviews (Orphan reviews and reviews without purchase)
    const reviews = await this.reviewRepository.find({}, { projection: { _id: 1, userId: 1, productId: 1 }, lean: true });
    
    // To check purchases, build a map of user purchases from Paid/Delivered orders
    const orders = await this.orderRepository.find(
      { status: { $in: ['Paid', 'Shipped', 'Delivered'] } },
      { projection: { userId: 1, 'items.productId': 1 }, lean: true }
    );
    
    const userPurchases = new Map<string, Set<string>>();
    for (const order of orders) {
      if (!order.userId) continue;
      const uId = order.userId.toString();
      if (!userPurchases.has(uId)) {
        userPurchases.set(uId, new Set());
      }
      const pSet = userPurchases.get(uId)!;
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.productId) {
            pSet.add(item.productId.toString());
          }
        }
      }
    }

    for (const review of reviews) {
      const reviewUserId = review.userId ? review.userId.toString() : '';
      const reviewProductId = review.productId ? review.productId.toString() : '';

      let isOrphan = false;
      if (!reviewUserId || !userIds.has(reviewUserId)) {
        anomalies.orphanReviews.push({
          reviewId: review._id.toString(),
          reason: 'User does not exist or userId is missing',
          userId: reviewUserId,
        });
        isOrphan = true;
      }
      if (!reviewProductId || !productIds.has(reviewProductId)) {
        anomalies.orphanReviews.push({
          reviewId: review._id.toString(),
          reason: 'Product does not exist or productId is missing',
          productId: reviewProductId,
        });
        isOrphan = true;
      }

      if (!isOrphan) {
        // Check if verified purchase exists
        const purchasedProducts = userPurchases.get(reviewUserId);
        if (!purchasedProducts || !purchasedProducts.has(reviewProductId)) {
          anomalies.reviewsWithoutPurchases.push({
            reviewId: review._id.toString(),
            userId: reviewUserId,
            productId: reviewProductId,
          });
        }
      }
    }

    // 2. Audit Products (Owner validation, Inventory check)
    for (const product of products) {
      const ownerId = product.vendorId ? product.vendorId.toString() : '';
      
      // Check if vendorId references a valid User record
      const ownerExists = ownerId && userIds.has(ownerId);
      if (!ownerExists) {
        anomalies.productsWithoutOwner.push({
          productId: product._id.toString(),
          sku: product.sku,
          title: product.title,
          reason: 'vendorId is missing or does not reference a valid User record',
        });
      }

      // Check Inventory mapping
      const inventory = inventoryMap.get(product.sku);
      if (!inventory) {
        anomalies.missingInventory.push({
          productId: product._id.toString(),
          sku: product.sku,
          title: product.title,
        });
      } else if (inventory.stock < 0) {
        anomalies.negativeInventory.push({
          sku: product.sku,
          stock: inventory.stock,
          productId: product._id.toString(),
        });
      }
    }

    // Write diagnostic report
    const scanReport = {
      scanTime: new Date().toISOString(),
      summary: {
        totalReviewsScanned: reviews.length,
        totalProductsScanned: products.length,
        orphanReviewsCount: anomalies.orphanReviews.length,
        reviewsWithoutPurchasesCount: anomalies.reviewsWithoutPurchases.length,
        productsWithoutOwnerCount: anomalies.productsWithoutOwner.length,
        negativeInventoryCount: anomalies.negativeInventory.length,
        missingInventoryCount: anomalies.missingInventory.length,
      },
      anomalies,
    };

    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, `integrity_scan_${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(scanReport, null, 2), 'utf8');
    console.log(`[Integrity Scan] Completed. Diagnostic report saved to ${reportPath}`);
    
    return scanReport;
  }
}
