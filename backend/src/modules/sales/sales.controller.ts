import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Sales & Checkout (Cart, Wishlist, Orders, Coupons)')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // CART
  @Get('cart')
  @ApiOperation({ summary: 'Retrieve current customer cart' })
  async getCart(@Request() req: any) {
    return this.salesService.getCart(req.user.id);
  }

  @Post('cart/add')
  @ApiOperation({ summary: 'Add product item to cart' })
  async addToCart(
    @Request() req: any,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.salesService.addToCart(req.user.id, productId, quantity || 1);
  }

  @Delete('cart/remove/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.salesService.removeFromCart(req.user.id, productId);
  }

  // WISHLIST
  @Get('wishlist')
  @ApiOperation({ summary: 'Retrieve user wishlist' })
  async getWishlist(@Request() req: any) {
    return this.salesService.getWishlist(req.user.id);
  }

  @Post('wishlist/add')
  @ApiOperation({ summary: 'Add product item to wishlist' })
  async addToWishlist(
    @Request() req: any,
    @Body('productId') productId: string,
  ) {
    return this.salesService.addToWishlist(req.user.id, productId);
  }

  @Delete('wishlist/remove/:productId')
  @ApiOperation({ summary: 'Remove product item from wishlist' })
  async removeFromWishlist(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.salesService.removeFromWishlist(req.user.id, productId);
  }

  // COUPONS
  @Post('coupons')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiOperation({ summary: 'Create a new coupon promo (Admin)' })
  async createCoupon(@Body() dto: any) {
    return this.salesService.createCoupon(dto);
  }

  @Post('coupons/validate')
  @ApiOperation({ summary: 'Validate discount coupon code eligibility' })
  async validateCoupon(
    @Body('code') code: string,
    @Body('amount') amount: number,
  ) {
    return this.salesService.validateCoupon(code, amount);
  }

  // ORDERS & CHECKOUT
  @Post('orders')
  @ApiOperation({ summary: 'Place a new Order' })
  async placeOrder(@Request() req: any, @Body() dto: any) {
    return this.salesService.placeOrder(req.user.id, dto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all user orders' })
  async getOrders(@Request() req: any) {
    return this.salesService.getOrders(req.user.id);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get details of specific order' })
  async getOrderById(@Param('id') id: string) {
    return this.salesService.getOrderById(id);
  }

  @Put('orders/:id/status')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Update Order status workflow (Admin/Support)' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    return this.salesService.updateOrderStatus(id, status, note);
  }
}
