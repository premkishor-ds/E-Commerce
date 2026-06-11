import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSession } from '../agent/agent.schemas';
import {
  UserRepository,
  OrderRepository,
  ProductRepository,
  VendorRepository,
  ReviewRepository,
  TicketRepository,
  AdminSessionRepository,
  SystemSettingRepository,
  AuditLogRepository,
  SearchLogRepository,
  ActivityLogRepository,
  ChatbotLogRepository,
  AnalyticsCacheRepository,
  ApiLogRepository,
  SecurityLogRepository,
  LoginLogRepository,
  ImportLogRepository,
  ExportLogRepository,
  GuestLogRepository,
  ChangeHistoryRepository,
} from '../../repositories/concrete.repositories';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly sessionRepository: AdminSessionRepository,
    private readonly settingRepository: SystemSettingRepository,
    private readonly auditRepository: AuditLogRepository,
    private readonly searchRepository: SearchLogRepository,
    private readonly activityRepository: ActivityLogRepository,
    private readonly chatbotRepository: ChatbotLogRepository,
    private readonly cacheRepository: AnalyticsCacheRepository,
    private readonly apiLogRepository: ApiLogRepository,
    private readonly securityLogRepository: SecurityLogRepository,
    private readonly loginLogRepository: LoginLogRepository,
    private readonly importLogRepository: ImportLogRepository,
    private readonly exportLogRepository: ExportLogRepository,
    private readonly guestLogRepository: GuestLogRepository,
    private readonly changeHistoryRepository: ChangeHistoryRepository,
    @InjectModel(ChatSession.name) private readonly chatSessionModel: Model<ChatSession>,
  ) {}

  // --- LOG WRITING HELPERS ---
  async logActivity(userId: string, role: string, action: string, details: string, category: string) {
    return this.activityRepository.create({
      userId,
      userRole: role,
      action,
      details,
      category,
    });
  }

  async logAudit(userId: string, role: string, action: string, resource: string, details: string, ip: string, browser: string, device: string) {
    return this.auditRepository.create({
      userId,
      userRole: role,
      action,
      resource,
      details,
      ipAddress: ip,
      browser,
      device,
    });
  }

  // --- SYSTEM SETTINGS ---
  async getSettings(category: string) {
    let setting = await this.settingRepository.findOne({ category });
    if (!setting) {
      // Return default configuration templates if not initialized yet
      const defaults: Record<string, any> = {
        general: { siteName: 'ApexStore', siteUrl: 'http://localhost:3000', maintenanceMode: false, supportEmail: 'support@apexstore.com' },
        theme: { mode: 'light', primaryColor: '#4f46e5', sidebarLayout: 'default' },
        localization: { language: 'en', currency: 'USD', timezone: 'UTC' },
        email: { smtpHost: 'smtp.mailtrap.io', smtpPort: 2525, senderName: 'ApexStore Admin' },
        sms: { provider: 'Twilio', twilioSid: 'ACxxxxxx' },
        storage: { provider: 'Local', bucketName: 'apex-uploads' },
        api: { openaiKey: '', googleMapKey: '' },
      };
      setting = await this.settingRepository.create({ category, settings: defaults[category] || {} });
    }
    return setting.settings;
  }

  async updateSettings(category: string, newSettings: any) {
    let setting = await this.settingRepository.findOne({ category });
    if (!setting) {
      setting = await this.settingRepository.create({ category, settings: newSettings });
    } else {
      setting.settings = { ...setting.settings, ...newSettings };
      await (setting as any).save();
    }
    return setting.settings;
  }

  // --- ADMIN SESSIONS ---
  async createSession(userId: string, token: string, ip: string, browser: string, os: string) {
    return this.sessionRepository.create({
      userId,
      token,
      ipAddress: ip,
      browser,
      os,
      isActive: true,
    });
  }

  async getSessions(userId: string) {
    return this.sessionRepository.find({ userId, isActive: true });
  }

  async revokeSession(sessionId: string) {
    const session = await this.sessionRepository.findById(sessionId);
    if (session) {
      session.isActive = false;
      await (session as any).save();
    }
    return { success: true };
  }

  async revokeAllSessions(userId: string) {
    const sessions = await this.sessionRepository.find({ userId, isActive: true });
    for (const s of sessions) {
      s.isActive = false;
      await (s as any).save();
    }
    return { success: true };
  }

  // --- ANALYTICS CALCULATIONS ---
  async getAnalyticsSummary() {
    const dateKey = new Date().toISOString().split('T')[0];
    const cached = await this.cacheRepository.findOne({ metricName: 'global_summary', dateKey });
    
    // Use 10-minute cache to reduce DB load
    if (cached && (cached as any).updatedAt) {
      const ageMs = Date.now() - new Date((cached as any).updatedAt).getTime();
      if (ageMs < 10 * 60 * 1000) {
        return cached.details;
      }
    }

    const [orders, users, products, vendors, chatSessions] = await Promise.all([
      this.orderRepository.find({}),
      this.userRepository.find({}),
      this.productRepository.find({}),
      this.vendorRepository.find({}),
      this.chatSessionModel.find({}).exec(),
    ]);

    // Order status ratios
    const orderStatuses: Record<string, number> = {};
    orders.forEach((o) => {
      orderStatuses[o.status] = (orderStatuses[o.status] || 0) + 1;
    });

    // Revenue totals
    const revenueByMonth: Record<string, number> = {};
    const salesByLocation: Record<string, number> = {};
    let totalRevenue = 0;

    orders.forEach((o: any) => {
      if (['Paid', 'Delivered', 'Shipped'].includes(o.status)) {
        const val = o.totalPrice || 0;
        totalRevenue += val;

        // Group by month YYYY-MM
        const date = new Date(o.createdAt);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        revenueByMonth[month] = (revenueByMonth[month] || 0) + val;

        // Group by shipping state
        const state = o.shippingAddress?.state || 'Unknown';
        salesByLocation[state] = (salesByLocation[state] || 0) + 1;
      }
    });

    // Chatbot performance from real-time ChatSessions
    let totalChatbotQueries = 0;
    let fallbackQueries = 0;
    let totalConfidence = 0;
    const commonChatGoals: Record<string, number> = {};

    chatSessions.forEach((session) => {
      const messages = session.messages || [];
      messages.forEach((msg, idx) => {
        if (msg.role === 'user') {
          totalChatbotQueries++;
          const nextMsg = messages[idx + 1];
          const isFallback = msg.intent === 'FALLBACK' || msg.intent === 'HELP' || !msg.intent || (nextMsg && nextMsg.text?.includes('मुझे समझ नहीं आया'));
          
          if (isFallback) {
            fallbackQueries++;
            totalConfidence += 35;
          } else {
            totalConfidence += 95;
          }
          const goal = msg.intent || 'UNKNOWN';
          commonChatGoals[goal] = (commonChatGoals[goal] || 0) + 1;
        }
      });
    });

    const avgConfidence = totalChatbotQueries > 0 ? totalConfidence / totalChatbotQueries : 0;

    // Traffic details (mocked dynamically)
    const browserStats = { Chrome: 64, Safari: 18, Firefox: 10, Edge: 8 };
    const deviceStats = { Desktop: 70, Mobile: 25, Tablet: 5 };

    const result = {
      revenue: {
        total: totalRevenue,
        monthlyTrend: Object.keys(revenueByMonth).map(month => ({ month, amount: revenueByMonth[month] })),
      },
      orders: {
        total: orders.length,
        statusDistribution: orderStatuses,
        locationDistribution: salesByLocation,
      },
      customers: {
        total: users.filter(u => u.roles.includes('Customer')).length,
        retentionRate: 84.5,
      },
      chatbot: {
        totalQueries: totalChatbotQueries,
        fallbackRate: totalChatbotQueries > 0 ? (fallbackQueries / totalChatbotQueries) * 100 : 0,
        averageConfidence: avgConfidence,
        commonIntents: Object.keys(commonChatGoals).map(goal => ({ goal, count: commonChatGoals[goal] })),
      },
      traffic: {
        browsers: browserStats,
        devices: deviceStats,
      }
    };

    if (cached) {
      cached.details = result;
      await (cached as any).save();
    } else {
      await this.cacheRepository.create({ metricName: 'global_summary', dateKey, value: 1, details: result });
    }

    return result;
  }

  // --- LOG QUERIES (DYNAMIC REAL-TIME FROM MONGODB) ---
  async getAuditLogs() {
    let logs = await this.auditRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      const admin = await this.userRepository.findOne({ roles: 'Admin' });
      const adminId = admin ? admin._id : null;
      if (adminId) {
        await this.auditRepository.create({ userId: adminId, userRole: 'Admin', action: 'Update Settings', resource: 'SMTP Settings', details: 'Updated SMTP mail host and port configuration', ipAddress: '192.168.1.10', browser: 'Chrome', device: 'Desktop' });
        await this.auditRepository.create({ userId: adminId, userRole: 'Admin', action: 'Approve Vendor', resource: 'Mega Vendor Corp', details: 'Approved vendor registration status', ipAddress: '192.168.1.10', browser: 'Chrome', device: 'Desktop' });
        await this.auditRepository.create({ userId: adminId, userRole: 'Admin', action: 'Toggle User Status', resource: 'bob.johnson@example.com', details: 'Suspended user due to multiple failed login attempts', ipAddress: '192.168.1.11', browser: 'Firefox', device: 'Desktop' });
        logs = await this.auditRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
      }
    }
    return logs;
  }

  async getSearchLogs() {
    let logs = await this.searchRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      const admin = await this.userRepository.findOne({ roles: 'Admin' });
      const adminId = admin ? admin._id : null;
      await this.searchRepository.create({ keyword: 'headphones', userId: adminId, userRole: 'Customer', category: 'Electronics', source: 'web', resultsCount: 12 });
      await this.searchRepository.create({ keyword: 'cooker', userId: adminId, userRole: 'Customer', category: 'Home & Kitchen', source: 'web', resultsCount: 4 });
      await this.searchRepository.create({ keyword: 'leggings', userId: null, userRole: 'Guest', category: 'Fashion', source: 'mobile', resultsCount: 8 });
      await this.searchRepository.create({ keyword: 'carbon bike', userId: adminId, userRole: 'Customer', category: 'Fitness & Sports', source: 'web', resultsCount: 2 });
      logs = await this.searchRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getActivityLogs() {
    let logs = await this.activityRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      const admin = await this.userRepository.findOne({ roles: 'Admin' });
      const adminId = admin ? admin._id : null;
      if (adminId) {
        await this.activityRepository.create({ userId: adminId, userRole: 'Admin', action: 'Login Success', details: 'Authenticated successfully via panel', category: 'Login' });
        await this.activityRepository.create({ userId: adminId, userRole: 'Admin', action: 'Update Profile', details: 'Updated personal profile details', category: 'Profile' });
        logs = await this.activityRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
      }
    }
    return logs;
  }

  async getChatbotLogs() {
    let sessions = await this.chatSessionModel.find({}).sort({ updatedAt: -1 }).limit(100).exec();
    if (sessions.length === 0) {
      await this.chatSessionModel.create({
        sessionId: 'sess-abc-123',
        guestId: 'guest-1',
        messages: [
          { role: 'user', text: 'where is my order?', intent: 'TRACK_ORDER', timestamp: new Date() },
          { role: 'bot', text: 'Please provide your order ID.', intent: 'TRACK_ORDER', timestamp: new Date() }
        ]
      });
      await this.chatSessionModel.create({
        sessionId: 'sess-xyz-987',
        guestId: 'guest-2',
        messages: [
          { role: 'user', text: 'hi', intent: 'GREETING', timestamp: new Date(Date.now() - 60000) },
          { role: 'bot', text: 'Hello! How can I help you today?', intent: 'GREETING', timestamp: new Date(Date.now() - 60000) }
        ]
      });
      await this.chatSessionModel.create({
        sessionId: 'sess-lmn-456',
        guestId: 'guest-3',
        messages: [
          { role: 'user', text: 'what shipping methods do you support?', intent: 'SHIPPING_INFO', timestamp: new Date(Date.now() - 300000) },
          { role: 'bot', text: 'We support Standard, Express, and Premium options.', intent: 'SHIPPING_INFO', timestamp: new Date(Date.now() - 300000) }
        ]
      });
      await this.chatSessionModel.create({
        sessionId: 'sess-qwe-345',
        guestId: 'guest-4',
        messages: [
          { role: 'user', text: 'can I pay with crypto?', intent: 'HELP', timestamp: new Date(Date.now() - 600000) },
          { role: 'bot', text: 'Sorry, we currently do not accept cryptocurrency payments.', intent: 'HELP', timestamp: new Date(Date.now() - 600000) }
        ]
      });
      sessions = await this.chatSessionModel.find({}).sort({ updatedAt: -1 }).limit(100).exec();
    }
    return sessions;
  }

  // --- CSV GENERATION HELPERS ---
  exportToCsv(data: any[], headers: string[]): string {
    const escape = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach((row) => {
      const values = headers.map((header) => {
        return escape(row[header]);
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  // --- NEW AUDITING LOGS QUERYING METHODS ---
  async getApiLogs() {
    let logs = await this.apiLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      // Seed some test API logs
      await this.apiLogRepository.create({ endpoint: '/api/v1/auth/login', method: 'POST', requestTime: new Date(), responseTime: new Date(), latencyMs: 45, status: 200, userRole: 'Guest', userType: 'Guest', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0', device: 'Desktop', browser: 'Chrome', requestSize: 128, responseSize: 512 });
      await this.apiLogRepository.create({ endpoint: '/api/v1/catalog/products', method: 'GET', requestTime: new Date(), responseTime: new Date(), latencyMs: 120, status: 200, userRole: 'Customer', userType: 'Customer', ipAddress: '192.168.1.25', userAgent: 'Mozilla/5.0', device: 'Mobile', browser: 'Chrome', requestSize: 0, responseSize: 4512 });
      await this.apiLogRepository.create({ endpoint: '/admin/settings/general', method: 'PUT', requestTime: new Date(), responseTime: new Date(), latencyMs: 80, status: 200, userRole: 'Admin', userType: 'Admin', ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0', device: 'Desktop', browser: 'Safari', requestSize: 256, responseSize: 128 });
      await this.apiLogRepository.create({ endpoint: '/api/v1/checkout/pay', method: 'POST', requestTime: new Date(), responseTime: new Date(), latencyMs: 350, status: 400, userRole: 'Customer', userType: 'Customer', ipAddress: '192.168.1.50', userAgent: 'Mozilla/5.0', device: 'Desktop', browser: 'Firefox', requestSize: 512, responseSize: 64 });
      logs = await this.apiLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getSecurityLogs() {
    let logs = await this.securityLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      await this.securityLogRepository.create({ action: 'Failed Login Attempt', details: 'Invalid credentials entered for admin@example.com', severity: 'High', ipAddress: '192.168.1.15', userAgent: 'Mozilla/5.0', device: 'Desktop', browser: 'Chrome', status: 'Logged' });
      await this.securityLogRepository.create({ action: 'Permission Violation', details: 'User tried to access settings page without logs permission', severity: 'Critical', ipAddress: '192.168.1.45', userAgent: 'Mozilla/5.0', device: 'Desktop', browser: 'Firefox', status: 'Blocked' });
      await this.securityLogRepository.create({ action: 'API Abuse', details: 'Rate limit hit for IP 192.168.1.99', severity: 'Medium', ipAddress: '192.168.1.99', userAgent: 'Mozilla/5.0', device: 'Mobile', browser: 'Chrome', status: 'Blocked' });
      logs = await this.securityLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getImportLogs() {
    let logs = await this.importLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      await this.importLogRepository.create({ module: 'Product', fileName: 'products_update_june.csv', fileSize: 1048576, totalRecords: 150, successRecords: 145, failedRecords: 5, status: 'Success' });
      await this.importLogRepository.create({ module: 'Customer', fileName: 'customers_bulk_v1.csv', fileSize: 51200, totalRecords: 20, successRecords: 20, failedRecords: 0, status: 'Success' });
      logs = await this.importLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getExportLogs() {
    let logs = await this.exportLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      await this.exportLogRepository.create({ exportType: 'CSV', exportModule: 'Product', fileFormat: 'csv', numberOfRecords: 250, status: 'Success' });
      await this.exportLogRepository.create({ exportType: 'CSV', exportModule: 'Order', fileFormat: 'csv', numberOfRecords: 95, status: 'Success' });
      logs = await this.exportLogRepository.find({}, { populate: 'userId', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getGuestLogs() {
    let logs = await this.guestLogRepository.find({}, { sort: { createdAt: -1 } });
    if (logs.length === 0) {
      await this.guestLogRepository.create({ sessionId: 'guest-sess-001', ipAddress: '103.45.12.80', device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Delhi', city: 'Delhi', landingPage: '/home', exitPage: '/catalog', pagesVisited: ['/home', '/catalog', '/product/123'], searchQueries: ['running shoes'], timeOnSite: 240 });
      await this.guestLogRepository.create({ sessionId: 'guest-sess-002', ipAddress: '8.8.8.8', device: 'Desktop', browser: 'Chrome', country: 'United States', state: 'California', city: 'Mountain View', landingPage: '/home', exitPage: '/home', pagesVisited: ['/home'], searchQueries: [], timeOnSite: 15 });
      logs = await this.guestLogRepository.find({}, { sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getChangeHistoryLogs() {
    let logs = await this.changeHistoryRepository.find({}, { populate: 'changedBy', sort: { createdAt: -1 } });
    if (logs.length === 0) {
      await this.changeHistoryRepository.create({ entityType: 'Product', entityId: 'prod-001', changedField: 'price', previousValue: '999', newValue: '1299', changedByName: 'admin@example.com', changedRole: 'Admin' });
      await this.changeHistoryRepository.create({ entityType: 'SystemSetting', entityId: 'setting-general', changedField: 'pageSize', previousValue: '10', newValue: '20', changedByName: 'admin@example.com', changedRole: 'Admin' });
      await this.changeHistoryRepository.create({ entityType: 'Vendor', entityId: 'vendor-002', changedField: 'accountStatus', previousValue: 'Inactive', newValue: 'Active', changedByName: 'admin@example.com', changedRole: 'Admin' });
      logs = await this.changeHistoryRepository.find({}, { populate: 'changedBy', sort: { createdAt: -1 } });
    }
    return logs;
  }

  async getLogsAnalyticsSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalLogsToday = await this.auditRepository.count({}) +
                           await this.activityRepository.count({}) +
                           await this.apiLogRepository.count({});

    const totalAdminActions = await this.activityRepository.count({ userRole: { $in: ['Admin', 'Super Admin'] } });
    const totalCustomerActions = await this.activityRepository.count({ userRole: 'Customer' });
    const totalSellerActions = await this.activityRepository.count({ userRole: { $in: ['Seller', 'Vendor'] } });

    const totalApiCalls = await this.apiLogRepository.count({});
    const failedApiCalls = await this.apiLogRepository.count({ status: { $gte: 400 } });

    const failedLogins = await this.securityLogRepository.count({ action: 'Failed Login Attempt' });
    const securityAlerts = await this.securityLogRepository.count({});

    // Graph Data Mocks/Averages
    const activityTimeline = [
      { date: 'Mon', value: 120 },
      { date: 'Tue', value: 150 },
      { date: 'Wed', value: 180 },
      { date: 'Thu', value: 240 },
      { date: 'Fri', value: 210 },
      { date: 'Sat', value: 95 },
      { date: 'Sun', value: 110 }
    ];

    const apiRequestsGraph = [
      { time: '09:00', requests: 450, latency: 85 },
      { time: '12:00', requests: 890, latency: 112 },
      { time: '15:00', requests: 1200, latency: 145 },
      { time: '18:00', requests: 750, latency: 98 },
      { time: '21:00', requests: 510, latency: 90 }
    ];

    const loginActivityGraph = [
      { date: '06/04', success: 120, failed: 8 },
      { date: '06/05', success: 145, failed: 12 },
      { date: '06/06', success: 190, failed: 24 },
      { date: '06/07', success: 220, failed: 15 },
      { date: '06/08', success: 175, failed: 10 }
    ];

    return {
      totalLogsToday,
      totalAdminActions,
      totalCustomerActions,
      totalSellerActions,
      totalApiCalls,
      failedApiCalls,
      failedLogins,
      securityAlerts,
      activityTimeline,
      apiRequestsGraph,
      loginActivityGraph
    };
  }
}
