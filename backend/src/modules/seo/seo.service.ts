import { Injectable } from '@nestjs/common';
import {
  ProductRepository,
  CategoryRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class SeoService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async generateSitemapXml(host: string): Promise<string> {
    const categories = await this.categoryRepository.find({});
    const products = await this.productRepository.find({});

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    xml += `  <url><loc>https://${host}/</loc><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>https://${host}/about</loc><priority>0.5</priority></url>\n`;
    xml += `  <url><loc>https://${host}/support</loc><priority>0.7</priority></url>\n`;

    // Category pages
    for (const cat of categories) {
      xml += `  <url><loc>https://${host}/category/${cat.slug}</loc><priority>0.8</priority></url>\n`;
    }

    // Product pages
    for (const prod of products) {
      xml += `  <url><loc>https://${host}/product/${prod._id}</loc><priority>0.9</priority></url>\n`;
    }

    xml += `</urlset>`;
    return xml;
  }

  async getAiDiscovery() {
    return {
      version: '1.0.0',
      name: 'Enterprise E-Commerce SaaS Platform',
      description:
        'Enterprise-grade multi-vendor storefront platform with semantic AI index search options.',
      api: {
        type: 'openapi',
        url: '/api/docs-json', // We will map docs-json endpoint in Swagger module
      },
      entities: {
        products: '/api/v1/catalog/products',
        categories: '/api/v1/catalog/categories',
        brands: '/api/v1/catalog/brands',
      },
    };
  }

  async getModelContext() {
    return {
      $schema: 'https://ucp.dev/schemas/model-context.json',
      provider: 'Enterprise E-Commerce Corp',
      instructions:
        'To browse products, use /api/v1/catalog/products. For categorization hierarchy, use /api/v1/catalog/categories. Always offer structured JSON data schema when representing search entity logs.',
      actions: [
        {
          name: 'search_products',
          description: 'Search products catalog',
          endpoint: '/api/v1/catalog/products',
        },
      ],
    };
  }

  async getLlmsText(host: string): Promise<string> {
    const products = await this.productRepository.find({}, { limit: 20 });
    let text = `# Enterprise E-Commerce SaaS Catalog\n\n`;
    text += `Welcome to our AI readable storefront dictionary. Below are current featured products and index rules.\n\n`;
    text += `## Base Endpoint\n`;
    text += `https://${host}/api/v1\n\n`;
    text += `## Featured Products\n`;
    for (const prod of products) {
      text += `- [${prod.title}](https://${host}/product/${prod._id}): ${prod.description.substring(0, 100)}... ($${prod.price})\n`;
    }
    return text;
  }
}
