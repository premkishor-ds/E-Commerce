import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
@ApiTags('Catalog (Products, Categories, Brands)')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Categories
  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Category (Admin)' })
  async createCategory(@Body() dto: any) {
    return this.catalogService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all Categories' })
  async getCategories() {
    return this.catalogService.getCategories();
  }

  // Brands
  @Post('brands')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Brand (Admin)' })
  async createBrand(@Body() dto: any) {
    return this.catalogService.createBrand(dto);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all Brands' })
  async getBrands() {
    return this.catalogService.getBrands();
  }

  // Products
  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller', 'Vendor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Product' })
  async createProduct(@Body() dto: any) {
    return this.catalogService.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Query products with filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getProducts(
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.getProducts({ category, brand, search });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product details by ID' })
  async getProductById(@Param('id') id: string) {
    return this.catalogService.getProductById(id);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller', 'Vendor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a product' })
  async updateProduct(@Param('id') id: string, @Body() dto: any) {
    return this.catalogService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product (Admin)' })
  async deleteProduct(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }

  // Inventory
  @Put('inventory/:sku/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update inventory stock for a SKU' })
  async updateStock(@Param('sku') sku: string, @Body('stock') stock: number) {
    return this.catalogService.updateStock(sku, stock);
  }

  @Get('inventory/alerts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get low stock inventory items' })
  async getInventoryAlerts() {
    return this.catalogService.getInventoryAlerts();
  }
}
