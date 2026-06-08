import { Controller, Get, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';
import { SalesService } from '../sales/sales.service';
import { CatalogService } from '../catalog/catalog.service';
import {
  UserRepository,
  OrderRepository,
  ReviewRepository,
  VendorRepository,
  CouponRepository,
  TicketRepository,
} from '../../repositories/concrete.repositories';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Super Admin')
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private readonly salesService: SalesService,
    private readonly catalogService: CatalogService,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly couponRepository: CouponRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  // --- OVERVIEW STATS ---
  @Get('stats')
  @ApiOperation({ summary: 'Get platform overview statistics' })
  async getStats() {
    const [users, orders, products, vendors, tickets] = await Promise.all([
      this.userRepository.find({}),
      this.orderRepository.find({}),
      this.catalogService.getProducts({}),
      this.vendorRepository.find({}),
      this.ticketRepository.find({}),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((s, o) => s + (o.totalPrice || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(
      (o: any) => new Date(o.createdAt) >= today,
    );

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalVendors: vendors.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      openTickets: tickets.filter((t) => t.status === 'Open').length,
      pendingVendors: vendors.filter((v) => v.status === 'Pending').length,
    };
  }

  // --- USERS ---
  @Get('users')
  @ApiOperation({ summary: 'Get all users with search/filter/sort' })
  async getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ) {
    let users = await this.userRepository.find({});
    if (search) {
      const s = search.toLowerCase();
      users = users.filter(
        (u: any) =>
          u.email?.toLowerCase().includes(s) ||
          u.firstName?.toLowerCase().includes(s) ||
          u.lastName?.toLowerCase().includes(s) ||
          u.phone?.includes(s),
      );
    }
    if (role) users = users.filter((u: any) => u.roles?.includes(role));
    if (status) users = users.filter((u: any) => u.accountStatus === status);
    if (sort === 'oldest') users.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else users.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return users.map((u: any) => ({
      _id: u._id, email: u.email, firstName: u.firstName, lastName: u.lastName,
      phone: u.phone, roles: u.roles, accountStatus: u.accountStatus,
      membershipLevel: u.membershipLevel, walletBalance: u.walletBalance,
      rewardPoints: u.rewardPoints, verificationStatus: u.verificationStatus,
      createdAt: u.createdAt,
    }));
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user roles or status' })
  async updateUser(@Param('id') id: string, @Body() dto: any) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    if (dto.roles) user.roles = dto.roles;
    if (dto.accountStatus) user.accountStatus = dto.accountStatus;
    if (dto.walletBalance !== undefined) user.walletBalance = dto.walletBalance;
    return (user as any).save();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    await (user as any).deleteOne();
    return { success: true };
  }

  // --- ORDERS ---
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders with search/filter/sort' })
  async getAllOrders(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ) {
    let orders = await this.orderRepository.find({});
    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(
        (o: any) =>
          o._id?.toString().includes(s) ||
          o.trackingCode?.toLowerCase().includes(s) ||
          o.status?.toLowerCase().includes(s),
      );
    }
    if (status) orders = orders.filter((o: any) => o.status === status);
    if (sort === 'oldest') orders.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sort === 'highest') orders.sort((a: any, b: any) => (b.totalPrice || 0) - (a.totalPrice || 0));
    else if (sort === 'lowest') orders.sort((a: any, b: any) => (a.totalPrice || 0) - (b.totalPrice || 0));
    else orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    return this.salesService.updateOrderStatus(id, status, note || 'Updated by Admin');
  }

  // --- PRODUCTS ---
  @Get('products')
  @ApiOperation({ summary: 'Get all products with search/filter/sort' })
  async getAllProducts(
    @Query('search') search?: string,
    @Query('approved') approved?: string,
    @Query('active') active?: string,
    @Query('sort') sort?: string,
  ) {
    const filter: any = { search };
    if (approved !== undefined) filter.approved = approved === 'true';
    if (active !== undefined) filter.active = active === 'true';
    let products = await this.catalogService.getProducts(filter);
    if (sort === 'price_asc') products.sort((a: any, b: any) => a.price - b.price);
    else if (sort === 'price_desc') products.sort((a: any, b: any) => b.price - a.price);
    else if (sort === 'rating') products.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0));
    else if (sort === 'sales') products.sort((a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0));
    return products;
  }

  @Put('products/:id/approve')
  @ApiOperation({ summary: 'Approve a vendor product' })
  async approveProduct(@Param('id') id: string) {
    return this.catalogService.approveProduct(id);
  }

  @Put('products/:id/activation')
  @ApiOperation({ summary: 'Toggle product active status' })
  async setActivation(@Param('id') id: string, @Body('active') active: boolean) {
    return this.catalogService.setProductActivation(id, active);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Param('id') id: string) {
    return this.catalogService.deleteProduct(id);
  }

  // --- VENDORS ---
  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors with search/filter' })
  async getVendors(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    let vendors = await this.vendorRepository.find({});
    if (search) {
      const s = search.toLowerCase();
      vendors = vendors.filter(
        (v: any) =>
          v.shopName?.toLowerCase().includes(s) ||
          v.companyLegalName?.toLowerCase().includes(s) ||
          v.businessPhone?.includes(s),
      );
    }
    if (status) vendors = vendors.filter((v: any) => v.status === status);
    vendors.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return vendors;
  }

  @Put('vendors/:id/status')
  @ApiOperation({ summary: 'Approve or suspend a vendor' })
  async updateVendorStatus(@Param('id') id: string, @Body('status') status: string) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) throw new Error('Vendor not found');
    vendor.status = status === 'Approved' ? 'Active' : status;
    return (vendor as any).save();
  }

  // --- REVIEWS ---
  @Get('reviews')
  @ApiOperation({ summary: 'Get all reviews with search/filter' })
  async getReviews(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('sentiment') sentiment?: string,
    @Query('sort') sort?: string,
  ) {
    const query: any = {};
    if (status) query.status = status;
    if (sentiment) query.sentiment = sentiment;
    let reviews = await this.reviewRepository.find(query);
    if (search) {
      const s = search.toLowerCase();
      reviews = reviews.filter((r: any) => r.comment?.toLowerCase().includes(s));
    }
    if (sort === 'rating_asc') reviews.sort((a: any, b: any) => a.rating - b.rating);
    else if (sort === 'rating_desc') reviews.sort((a: any, b: any) => b.rating - a.rating);
    else reviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reviews;
  }

  @Put('reviews/:id/moderate')
  @ApiOperation({ summary: 'Approve or reject a review' })
  async moderateReview(@Param('id') id: string, @Body('status') status: string) {
    return this.salesService.moderateReview(id, status as 'Approved' | 'Rejected');
  }

  // --- COUPONS ---
  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons with search/filter' })
  async getCoupons(
    @Query('search') search?: string,
    @Query('active') active?: string,
  ) {
    const query: any = {};
    if (active !== undefined) query.isActive = active === 'true';
    let coupons = await this.couponRepository.find(query);
    if (search) {
      const s = search.toLowerCase();
      coupons = coupons.filter((c: any) => c.code?.toLowerCase().includes(s));
    }
    coupons.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return coupons;
  }

  @Put('coupons/:id')
  @ApiOperation({ summary: 'Update a coupon' })
  async updateCoupon(@Param('id') id: string, @Body() dto: any) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new Error('Coupon not found');
    Object.assign(coupon, dto);
    return (coupon as any).save();
  }

  @Delete('coupons/:id')
  @ApiOperation({ summary: 'Delete a coupon' })
  async deleteCoupon(@Param('id') id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new Error('Coupon not found');
    await (coupon as any).deleteOne();
    return { success: true };
  }
}
