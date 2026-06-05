import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ProductRepository,
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  UserRepository,
  NotificationRepository,
  OrderRepository,
  VendorRepository,
} from '../../repositories/concrete.repositories';
import { Types } from 'mongoose';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly orderRepository: OrderRepository,
    private readonly vendorRepository: VendorRepository,
  ) {}


  // --- CATEGORIES & BRANDS ---

  async createCategory(dto: any) {
    return this.categoryRepository.create(dto);
  }

  async getCategories() {
    return this.categoryRepository.find({});
  }

  async createBrand(dto: any) {
    return this.brandRepository.create(dto);
  }

  async getBrands() {
    return this.brandRepository.find({});
  }

  // --- PRODUCTS (VENDOR & ADMIN CRUD) ---

  async createProduct(dto: any, vendorId?: string) {
    const sku =
      dto.sku ||
      'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const productData = {
      ...dto,
      sku,
      vendorId: vendorId ? new Types.ObjectId(vendorId) : null,
      isApproved: vendorId ? false : true, // Admin products auto-approved, vendors require approval
      isActive: true,
    };

    // Create inventory record
    const warehouseStock: Record<string, number> = {};
    const whName = dto.warehouseName || 'Primary Warehouse';
    warehouseStock[whName] = dto.stock || 0;

    await this.inventoryRepository.create({
      sku,
      stock: dto.stock || 0,
      lowStockThreshold: dto.lowStockThreshold || 5,
      reservedStock: 0,
      incomingStock: dto.incomingStock || 0,
      damagedStock: 0,
      preorderStock: dto.preorderStock || 0,
      warehouseStock,
      warehouseName: whName,
      allowPreorder: dto.allowPreorder || false,
      allowBackorder: dto.allowBackorder || false,
      logs: [
        {
          quantityChanged: dto.stock || 0,
          reason: 'Initial Ingestion',
          timestamp: new Date(),
          warehouse: whName,
        },
      ],
    });

    return this.productRepository.create(productData);
  }

  async getProducts(filters: any) {
    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = filters.brand;
    if (filters.vendorId) query.vendorId = new Types.ObjectId(filters.vendorId);
    if (filters.approved !== undefined) query.isApproved = filters.approved;
    if (filters.active !== undefined) query.isActive = filters.active;

    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    return this.productRepository.find(query);
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: string, dto: any, vendorId?: string) {
    const product = await this.getProductById(id);
    if (vendorId && String(product.vendorId) !== vendorId) {
      throw new BadRequestException('Unauthorized to update this product');
    }

    const updated = await this.productRepository.update(id, dto);
    if (dto.price !== undefined && updated) {
      const inv = await this.inventoryRepository.findOne({ sku: updated.sku });
      const currentStock = inv ? inv.stock : 0;
      await this.checkPriceAndStockAlerts(id, dto.price, currentStock);
    }
    return updated;
  }

  async deleteProduct(id: string, vendorId?: string) {
    const product = await this.getProductById(id);
    if (vendorId && String(product.vendorId) !== vendorId) {
      throw new BadRequestException('Unauthorized to delete this product');
    }
    await this.inventoryRepository.delete(product.sku);
    return this.productRepository.delete(id);
  }

  // --- VENDOR ANALYTICS ---

  async getVendorAnalytics(vendorId: string) {
    const products = await this.productRepository.find({
      vendorId: new Types.ObjectId(vendorId),
    });
    const productIds = products.map((p) => p._id.toString());

    // Analytics: Product Views
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = products.reduce(
      (sum, p) => sum + (p.salesCount || 0),
      0,
    );

    // Simulated Conversion Rate
    const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;

    // Revenue and Orders
    const orders = await this.orderRepository.find({});
    let vendorRevenue = 0;
    let vendorOrdersCount = 0;

    for (const order of orders) {
      let isVendorOrder = false;
      for (const item of order.items) {
        if (productIds.includes(item.productId.toString())) {
          vendorRevenue += item.price * item.quantity;
          isVendorOrder = true;
        }
      }
      if (isVendorOrder) vendorOrdersCount++;
    }

    const topProducts = [...products]
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 3)
      .map((p) => ({
        title: p.title,
        sales: p.salesCount,
        revenue: (p.salesCount || 0) * p.price,
      }));

    return {
      productViews: totalViews,
      conversionRate: Math.round(conversionRate * 100) / 100,
      revenue: vendorRevenue,
      orders: vendorOrdersCount,
      topProducts,
    };
  }

  // --- ADMIN APPROVALS & CONTROLS ---

  async approveProduct(productId: string) {
    return this.productRepository.update(productId, { isApproved: true });
  }

  async setProductActivation(productId: string, active: boolean) {
    return this.productRepository.update(productId, { isActive: active });
  }

  async approveVendor(vendorId: string) {
    return this.vendorRepository.update(vendorId, { status: 'Approved' });
  }


  // --- BULK OPERATIONS ---

  async bulkImportCsv(csvContent: string) {
    const lines = csvContent.split('\n');
    const imported = [];
    const headers = lines[0].split(',').map((h) => h.trim());

    // Find category and brand fallbacks
    const category = await this.categoryRepository.findOne({});
    const brand = await this.brandRepository.findOne({});

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      if (cols.length < headers.length) continue;

      const title = cols[0];
      const price = parseFloat(cols[1]);
      const sku = cols[2];
      const stock = parseInt(cols[3]) || 0;

      if (!title || isNaN(price) || !sku) continue;

      const product = await this.createProduct({
        title,
        price,
        sku,
        stock,
        description: `Imported ${title}`,
        category: category?._id,
        brand: brand?._id,
      });
      imported.push(product);
    }
    return { success: true, count: imported.length };
  }

  async bulkExportCsv() {
    const products = await this.productRepository.find({});
    let csv = 'Title,Price,SKU,SalesCount\n';
    for (const p of products) {
      csv += `"${p.title.replace(/"/g, '""')}",${p.price},${p.sku},${p.salesCount || 0}\n`;
    }
    return csv;
  }

  // --- ADVANCED INVENTORY MANAGEMENT ---

  async updateStock(sku: string, stock: number) {
    const inv = await this.inventoryRepository.findOne({ sku });
    if (!inv) throw new NotFoundException('Inventory SKU not found');
    const oldStock = inv.stock;
    inv.stock = stock;
    inv.logs.push({
      quantityChanged: stock - oldStock,
      reason: 'Manual Adjustment',
      timestamp: new Date(),
    });
    const saved = await inv.save();
    if (oldStock <= 0 && stock > 0) {
      const product = await this.productRepository.findOne({ sku });
      if (product) {
        await this.checkPriceAndStockAlerts(
          product._id.toString(),
          product.price,
          stock,
        );
      }
    }
    return saved;
  }

  async adjustInventory(
    sku: string,
    type: 'damaged' | 'incoming' | 'preorder' | 'reserved',
    quantity: number,
    reason: string,
  ) {
    const inv = await this.inventoryRepository.findOne({ sku });
    if (!inv) throw new NotFoundException('Inventory not found');

    if (type === 'damaged') inv.damagedStock += quantity;
    if (type === 'incoming') inv.incomingStock += quantity;
    if (type === 'preorder') inv.preorderStock += quantity;
    if (type === 'reserved') inv.reservedStock += quantity;

    inv.logs.push({
      quantityChanged: quantity,
      reason: `Adjustment (${type}): ${reason}`,
      timestamp: new Date(),
    });
    return inv.save();
  }

  async transferInventory(
    sku: string,
    fromWh: string,
    toWh: string,
    quantity: number,
  ) {
    const inv = await this.inventoryRepository.findOne({ sku });
    if (!inv) throw new NotFoundException('Inventory not found');

    if (!inv.warehouseStock) inv.warehouseStock = {};
    const fromStock = inv.warehouseStock[fromWh] || 0;
    if (fromStock < quantity)
      throw new BadRequestException(`Insufficient stock in ${fromWh}`);

    inv.warehouseStock[fromWh] = fromStock - quantity;
    inv.warehouseStock[toWh] = (inv.warehouseStock[toWh] || 0) + quantity;

    inv.logs.push({
      quantityChanged: quantity,
      reason: `Transfer from ${fromWh} to ${toWh}`,
      timestamp: new Date(),
      warehouse: toWh,
    });
    return inv.save();
  }

  async reserveStock(sku: string, quantity: number) {
    const inv = await this.inventoryRepository.findOne({ sku });
    if (!inv) throw new NotFoundException('Inventory not found');

    if (inv.stock < quantity)
      throw new BadRequestException('Insufficient stock for reservation');
    inv.stock -= quantity;
    inv.reservedStock += quantity;

    inv.logs.push({
      quantityChanged: -quantity,
      reason: 'Stock Reservation',
      timestamp: new Date(),
    });
    return inv.save();
  }

  async getInventoryForecast(sku: string) {
    const inv = await this.inventoryRepository.findOne({ sku });
    if (!inv) throw new NotFoundException('Inventory not found');

    // Simulated Forecasting based on history log size
    const speed = Math.max(
      1,
      inv.logs.filter((l) => l.quantityChanged < 0).length,
    );
    const etaDays = speed > 0 ? Math.round((inv.stock / speed) * 30) : 999;

    return {
      sku,
      currentStock: inv.stock,
      salesVelocityMonthly: speed,
      estimatedRunoutDays: etaDays,
      recommendedRestockQuantity: speed * 2,
    };
  }

  async getInventoryAlerts() {
    const items = await this.inventoryRepository.find({});
    return items.filter((i) => i.stock <= i.lowStockThreshold);
  }

  // --- AI RECOMMENDATION ENGINE ALGORITHMS ---

  async getFrequentlyBoughtTogether(productId: string) {
    const orders = await this.orderRepository.find({});
    const frequencyMap: Record<string, number> = {};

    for (const order of orders) {
      const containsTarget = order.items.some(
        (i) => i.productId.toString() === productId,
      );
      if (containsTarget) {
        for (const item of order.items) {
          const itemPid = item.productId.toString();
          if (itemPid !== productId) {
            frequencyMap[itemPid] = (frequencyMap[itemPid] || 0) + 1;
          }
        }
      }
    }

    const sortedIds = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => id);

    const products = [];
    for (const id of sortedIds) {
      const p = await this.productRepository.findById(id).catch(() => null);
      if (p) products.push(p);
    }
    return products;
  }

  async getSimilarProducts(productId: string) {
    const product = await this.getProductById(productId);
    return this.productRepository.find(
      {
        category: product.category,
        _id: { $ne: product._id },
      },
      { limit: 4, sort: { averageRating: -1 } },
    );
  }

  async getTrendingProducts() {
    return this.productRepository.find(
      {},
      { limit: 5, sort: { salesCount: -1, views: -1 } },
    );
  }

  async getPersonalizedRecommendations(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) return this.getTrendingProducts();

    const allProducts = await this.productRepository.find({ isActive: true });
    const userOrders = await this.orderRepository.find({ userId: user._id });
    
    // Extract categories user has bought or saved
    const interestedCategories = new Set<string>();
    const purchasedProductIds = new Set<string>();

    for (const order of userOrders) {
      for (const item of order.items) {
        purchasedProductIds.add(item.productId.toString());
        const prod = await this.productRepository.findById(item.productId.toString()).catch(() => null);
        if (prod) interestedCategories.add(prod.category.toString());
      }
    }

    const cartItems = (user as any).savedCart || [];
    for (const item of cartItems) {
      const prod = await this.productRepository.findById(item.productId.toString()).catch(() => null);
      if (prod) interestedCategories.add(prod.category.toString());
    }


    // Rank products using Hybrid Scorer:
    // Score = (CategoryMatch * 50) + (AvgRating * 10) + (PurchasedBefore * -10)
    const scoredProducts = allProducts.map((p: any) => {
      let score = 0;
      if (interestedCategories.has(p.category.toString())) {
        score += 50;
      }
      if (purchasedProductIds.has(p._id.toString())) {
        score -= 10; // De-prioritize already purchased items to encourage new discoveries
      }
      score += (p.averageRating || 0) * 10;
      return { product: p, score };
    });

    // Return top 5 products sorted by recommendation score
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.product);
  }


  async getCrossSellProducts(productId: string) {
    const product = await this.getProductById(productId);
    // Find products in brand or category with similar prices (accessory cross-selling)
    return this.productRepository.find(
      {
        brand: product.brand,
        _id: { $ne: product._id },
      },
      { limit: 4, sort: { averageRating: -1 } },
    );
  }

  async getUpsellProducts(productId: string) {
    const product = await this.getProductById(productId);
    // Upsell: products in the same category but more expensive (+10% to +50% price range)
    return this.productRepository.find(
      {
        category: product.category,
        price: { $gt: product.price, $lte: product.price * 1.5 },
        _id: { $ne: product._id },
      },
      { limit: 4, sort: { price: 1 } },
    );
  }

  async getRecentlyPurchased(userId: string) {
    const orders = await this.orderRepository.find({
      userId: new Types.ObjectId(userId),
    });
    const productIds = new Set<string>();

    for (const order of orders) {
      for (const item of order.items) {
        productIds.add(item.productId.toString());
      }
    }

    const products = [];
    for (const id of Array.from(productIds).slice(0, 5)) {
      const p = await this.productRepository.findById(id).catch(() => null);
      if (p) products.push(p);
    }
    return products;
  }

  async checkPriceAndStockAlerts(
    productId: string,
    currentPrice: number,
    currentStock: number,
  ) {
    const users = await this.userRepository.find({
      'priceAlerts.productId': productId,
    });
    for (const user of users) {
      let updated = false;
      const alerts = (user as any).priceAlerts || [];
      for (const alert of alerts) {
        if (alert.productId === productId && !alert.notified) {
          let trigger = false;
          let msg = '';
          const product = await this.productRepository.findById(productId);
          if (!product) continue;

          if (
            (!alert.type || alert.type === 'drop') &&
            currentPrice <= alert.targetPrice
          ) {
            trigger = true;
            msg = `Price Drop! The price of **${product.title}** has dropped to $${currentPrice.toFixed(2)}.`;
          }
          if (alert.type === 'restock' && currentStock > 0) {
            trigger = true;
            msg = `Back in stock! **${product.title}** is now available.`;
          }

          if (trigger) {
            alert.notified = true;
            updated = true;
            await this.notificationRepository.create({
              userId: user._id,
              title: 'Price & Stock Alert',
              message: msg,
              isRead: false,
              type: 'Alert',
            });
          }
        }
      }
      if (updated) {
        user.markModified('priceAlerts');
        await user.save();
      }
    }
  }
}
