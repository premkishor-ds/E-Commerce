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
import { AdminService } from './admin.service';

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
    private readonly adminService: AdminService,
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
      pendingVendors: vendors.filter((v) => v.status === 'Verification In Progress').length,
      activeVendors: vendors.filter((v) => v.status === 'Active').length,
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
    let vendors = await this.vendorRepository.find({}, { populate: 'userId' });
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

  @Put('vendors/:id')
  @ApiOperation({ summary: 'Update vendor details' })
  async updateVendor(@Param('id') id: string, @Body() dto: any) {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) throw new Error('Vendor not found');
    if (dto.companyLegalName !== undefined) vendor.companyLegalName = dto.companyLegalName;
    if (dto.businessPhone !== undefined) vendor.businessPhone = dto.businessPhone;
    if (dto.commissionRate !== undefined) vendor.commissionRate = dto.commissionRate;
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

  // --- ADMIN PROFILE ---
  @Get('profile')
  @ApiOperation({ summary: 'Get current admin profile details' })
  async getProfile(@Request() req: any) {
    const user = await this.userRepository.findById(req.user.sub || req.user.id);
    if (!user) throw new Error('User not found');
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName || `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      alternatePhone: user.alternatePhone || '',
      roles: user.roles,
      permissions: user.permissions,
      accountStatus: user.accountStatus,
      verificationStatus: user.verificationStatus,
      createdAt: (user as any).createdAt,
      employeeId: 'EMP-2026-9872',
      department: 'Platform Administration',
      joiningDate: (user as any).createdAt,
      profileCompletion: 85,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update admin profile' })
  async updateProfile(@Request() req: any, @Body() dto: any) {
    const user = await this.userRepository.findById(req.user.sub || req.user.id);
    if (!user) throw new Error('User not found');
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.alternatePhone !== undefined) user.alternatePhone = dto.alternatePhone;
    await (user as any).save();
    await this.adminService.logActivity(user._id.toString(), user.roles[0], 'Update Profile', 'Updated personal profile details', 'Profile');
    return user;
  }

  @Get('profile/sessions')
  @ApiOperation({ summary: 'Get active admin sessions' })
  async getActiveSessions(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.adminService.getSessions(userId);
  }

  @Delete('profile/sessions/:id')
  @ApiOperation({ summary: 'Revoke an active session' })
  async revokeSession(@Request() req: any, @Param('id') id: string) {
    return this.adminService.revokeSession(id);
  }

  @Delete('profile/sessions')
  @ApiOperation({ summary: 'Revoke all sessions' })
  async revokeAllSessions(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.adminService.revokeAllSessions(userId);
  }

  // --- SYSTEM SETTINGS ---
  @Get('settings/:category')
  @ApiOperation({ summary: 'Get settings by category' })
  async getSettings(@Param('category') category: string) {
    return this.adminService.getSettings(category);
  }

  @Put('settings/:category')
  @ApiOperation({ summary: 'Update settings by category' })
  async updateSettings(@Request() req: any, @Param('category') category: string, @Body() body: any) {
    const userId = req.user.sub || req.user.id;
    const result = await this.adminService.updateSettings(category, body);
    await this.adminService.logActivity(userId, req.user.roles[0], 'Update Settings', `Updated ${category} system configurations`, 'Settings');
    return result;
  }

  // --- DETAILED LOGS ---
  @Get('audit-logs')
  @ApiOperation({ summary: 'Get system audit logs' })
  async getAuditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Get('search-logs')
  @ApiOperation({ summary: 'Get query search logs' })
  async getSearchLogs() {
    return this.adminService.getSearchLogs();
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get all user activity logs' })
  async getActivityLogs() {
    return this.adminService.getActivityLogs();
  }

  @Get('chatbot-logs')
  @ApiOperation({ summary: 'Get detailed chatbot queries and fallback rates' })
  async getChatbotLogs() {
    return this.adminService.getChatbotLogs();
  }

  // --- EXPORTS ---
  @Get('customers/export')
  @ApiOperation({ summary: 'Export customers to CSV string' })
  async exportCustomers() {
    const customers = await this.userRepository.find({ roles: 'Customer' });
    const formatted = customers.map((c: any) => ({
      ID: c._id.toString(),
      Email: c.email,
      Phone: c.phone || 'N/A',
      Status: c.accountStatus,
      Balance: `$${(c.walletBalance || 0).toFixed(2)}`,
      Joined: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A',
    }));
    const csv = this.adminService.exportToCsv(formatted, ['ID', 'Email', 'Phone', 'Status', 'Balance', 'Joined']);
    return { csv, filename: `customers_export_${Date.now()}.csv` };
  }

  @Get('logs/export')
  @ApiOperation({ summary: 'Export audit logs to CSV string' })
  async exportAuditLogs() {
    const logs = [
      { ID: 'AUD-001', Action: 'Update Settings', Resource: 'SMTP Settings', Role: 'Admin', IP: '192.168.1.10', Date: new Date().toLocaleDateString() },
      { ID: 'AUD-002', Action: 'Approve Vendor', Resource: 'Mega Vendor Corp', Role: 'Admin', IP: '192.168.1.10', Date: new Date().toLocaleDateString() },
    ];
    const csv = this.adminService.exportToCsv(logs, ['ID', 'Action', 'Resource', 'Role', 'IP', 'Date']);
    return { csv, filename: `audit_logs_export_${Date.now()}.csv` };
  }

  // --- PLATFORM ANALYTICS ---
  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get computed overview metrics' })
  async getAnalytics() {
    return this.adminService.getAnalyticsSummary();
  }
}
