import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductRepository,
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
  UserRepository,
  NotificationRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly inventoryRepository: InventoryRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  // Categories
  async createCategory(dto: any) {
    return this.categoryRepository.create(dto);
  }

  async getCategories() {
    return this.categoryRepository.find({});
  }

  // Brands
  async createBrand(dto: any) {
    return this.brandRepository.create(dto);
  }

  async getBrands() {
    return this.brandRepository.find({});
  }

  // Products
  async createProduct(dto: any) {
    // Create matching inventory
    await this.inventoryRepository.create({
      sku: dto.sku,
      stock: dto.stock || 0,
      lowStockThreshold: dto.lowStockThreshold || 5,
    });
    return this.productRepository.create(dto);
  }

  async getProducts(filters: any) {
    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = filters.brand;
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

  async updateProduct(id: string, dto: any) {
    const updated = await this.productRepository.update(id, dto);
    if (dto.price !== undefined && updated) {
      const inv = await this.inventoryRepository.findOne({ sku: updated.sku });
      const currentStock = inv ? inv.stock : 0;
      await this.checkPriceAndStockAlerts(id, dto.price, currentStock);
    }
    return updated;
  }

  async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    await this.inventoryRepository.delete(product.sku);
    return this.productRepository.delete(id);
  }

  // Inventory
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
        await this.checkPriceAndStockAlerts(product._id.toString(), product.price, stock);
      }
    }
    return saved;
  }

  async getInventoryAlerts() {
    const items = await this.inventoryRepository.find({});
    return items.filter((i) => i.stock <= i.lowStockThreshold);
  }

  async checkPriceAndStockAlerts(productId: string, currentPrice: number, currentStock: number) {
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

          if ((!alert.type || alert.type === 'drop') && currentPrice <= alert.targetPrice) {
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
