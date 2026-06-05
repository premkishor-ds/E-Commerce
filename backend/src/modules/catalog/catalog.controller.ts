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
  Request,
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

import { UploadService } from './upload.service';

@ApiTags('Catalog (Products, Categories, Brands)')
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Securely upload a file via chatbot' })
  async uploadFile(
    @Request() req: any,
    @Body('filename') filename: string,
    @Body('mimeType') mimeType: string,
    @Body('base64Data') base64Data: string,
  ) {
    const buffer = Buffer.from(base64Data, 'base64');
    return this.uploadService.validateAndScanFile(
      req.user.id,
      filename,
      mimeType,
      buffer,
    );
  }


  // --- CATEGORIES ---

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

  // --- BRANDS ---

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

  // --- PRODUCTS ---

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller', 'Vendor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Product' })
  async createProduct(@Request() req: any, @Body() dto: any) {
    const isVendor =
      req.user.roles.includes('Vendor') || req.user.roles.includes('Seller');
    return this.catalogService.createProduct(
      dto,
      isVendor ? req.user.id : undefined,
    );
  }

  @Get('products')
  @ApiOperation({ summary: 'Query products with filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'vendorId', required: false })
  @ApiQuery({ name: 'approved', required: false })
  @ApiQuery({ name: 'active', required: false })
  async getProducts(
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('search') search?: string,
    @Query('vendorId') vendorId?: string,
    @Query('approved') approved?: string,
    @Query('active') active?: string,
  ) {
    const filter: any = { category, brand, search, vendorId };
    if (approved !== undefined) filter.approved = approved === 'true';
    if (active !== undefined) filter.active = active === 'true';
    return this.catalogService.getProducts(filter);
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
  async updateProduct(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: any,
  ) {
    const isVendor =
      req.user.roles.includes('Vendor') || req.user.roles.includes('Seller');
    return this.catalogService.updateProduct(
      id,
      dto,
      isVendor ? req.user.id : undefined,
    );
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller', 'Vendor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: string, @Request() req: any) {
    const isVendor =
      req.user.roles.includes('Vendor') || req.user.roles.includes('Seller');
    return this.catalogService.deleteProduct(
      id,
      isVendor ? req.user.id : undefined,
    );
  }

  // --- VENDOR ANALYTICS ---

  @Get('vendor/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Vendor', 'Seller', 'Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get vendor specific metrics' })
  async getVendorAnalytics(@Request() req: any) {
    return this.catalogService.getVendorAnalytics(req.user.id);
  }

  // --- ADMIN APPROVALS & STATUS ---

  @Post('products/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Approve vendor product' })
  async approveProduct(@Param('id') id: string) {
    return this.catalogService.approveProduct(id);
  }

  @Post('products/:id/activation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activate/Deactivate product status' })
  async setActivation(
    @Param('id') id: string,
    @Body('active') active: boolean,
  ) {
    return this.catalogService.setProductActivation(id, active);
  }

  // --- BULK OPERATIONS ---

  @Post('bulk/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk CSV Import' })
  async bulkImport(@Body('csv') csv: string) {
    return this.catalogService.bulkImportCsv(csv);
  }

  @Get('bulk/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk CSV Export' })
  async bulkExport() {
    return this.catalogService.bulkExportCsv();
  }

  // --- INVENTORY ---

  @Put('inventory/:sku/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update inventory stock for a SKU' })
  async updateStock(@Param('sku') sku: string, @Body('stock') stock: number) {
    return this.catalogService.updateStock(sku, stock);
  }

  @Put('inventory/:sku/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Adjust stock types (damaged, incoming, preorder, reserved)',
  })
  async adjustInventory(
    @Param('sku') sku: string,
    @Body('type') type: 'damaged' | 'incoming' | 'preorder' | 'reserved',
    @Body('quantity') quantity: number,
    @Body('reason') reason: string,
  ) {
    return this.catalogService.adjustInventory(sku, type, quantity, reason);
  }

  @Post('inventory/:sku/transfer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Transfer stock between warehouses' })
  async transferInventory(
    @Param('sku') sku: string,
    @Body('fromWarehouse') fromWh: string,
    @Body('toWarehouse') toWh: string,
    @Body('quantity') quantity: number,
  ) {
    return this.catalogService.transferInventory(sku, fromWh, toWh, quantity);
  }

  @Post('inventory/:sku/reserve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reserve stock' })
  async reserveStock(
    @Param('sku') sku: string,
    @Body('quantity') quantity: number,
  ) {
    return this.catalogService.reserveStock(sku, quantity);
  }

  @Get('inventory/:sku/forecast')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Forecasting for SKU stock limits' })
  async getForecast(@Param('sku') sku: string) {
    return this.catalogService.getInventoryForecast(sku);
  }

  @Get('inventory/alerts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Seller')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get low stock inventory items' })
  async getInventoryAlerts() {
    return this.catalogService.getInventoryAlerts();
  }

  // --- RECOMMENDATION ENDPOINTS ---

  @Get('recommendations/trending')
  @ApiOperation({ summary: 'Get trending products' })
  async getTrending() {
    return this.catalogService.getTrendingProducts();
  }

  @Get('recommendations/personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get personalized products recommendations' })
  async getPersonalized(@Request() req: any) {
    return this.catalogService.getPersonalizedRecommendations(req.user.id);
  }

  @Get('recommendations/frequent/:productId')
  @ApiOperation({ summary: 'Get frequently bought together products' })
  async getFrequent(@Param('productId') productId: string) {
    return this.catalogService.getFrequentlyBoughtTogether(productId);
  }

  @Get('recommendations/similar/:productId')
  @ApiOperation({ summary: 'Get similar products' })
  async getSimilar(@Param('productId') productId: string) {
    return this.catalogService.getSimilarProducts(productId);
  }

  @Get('recommendations/cross-sell/:productId')
  @ApiOperation({ summary: 'Get cross-sell recommendations' })
  async getCrossSell(@Param('productId') productId: string) {
    return this.catalogService.getCrossSellProducts(productId);
  }

  @Get('recommendations/upsell/:productId')
  @ApiOperation({ summary: 'Get upsell recommendations' })
  async getUpsell(@Param('productId') productId: string) {
    return this.catalogService.getUpsellProducts(productId);
  }

  @Get('recommendations/recent-purchases')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get recently purchased products' })
  async getRecentlyPurchased(@Request() req: any) {
    return this.catalogService.getRecentlyPurchased(req.user.id);
  }
}
