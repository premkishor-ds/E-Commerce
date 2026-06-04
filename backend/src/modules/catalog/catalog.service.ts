import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductRepository,
  CategoryRepository,
  BrandRepository,
  InventoryRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class CatalogService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly inventoryRepository: InventoryRepository,
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
    return this.productRepository.update(id, dto);
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
    inv.stock = stock;
    inv.logs.push({
      quantityChanged: stock - inv.stock,
      reason: 'Manual Adjustment',
      timestamp: new Date(),
    });
    return inv.save();
  }

  async getInventoryAlerts() {
    // Returns inventories under low stock threshold
    const items = await this.inventoryRepository.find({});
    return items.filter((i) => i.stock <= i.lowStockThreshold);
  }
}
