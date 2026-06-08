import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestTime = new Date();
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const method = req.method;
    const endpoint = req.originalUrl || req.url;

    // Exclude high-traffic or health check endpoints from API logging
    const excludePaths = ['/health', '/metrics', '/favicon.ico', '/api/health'];
    if (excludePaths.some((path) => endpoint.includes(path))) {
      return next();
    }

    // Parse request size
    const requestSize = parseInt(req.headers['content-length'] as string, 10) || 0;

    // Parse user agent to get browser/device/os
    let browser = 'Unknown';
    let device = 'Desktop';
    let os = 'Unknown';

    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';

    if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone')) {
      device = 'Mobile';
    } else if (ua.includes('ipad') || ua.includes('tablet')) {
      device = 'Tablet';
    }

    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    // Intercept response write to get response size
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: any[] = [];

    res.write = function (chunk: any, ...args: any[]) {
      if (chunk) chunks.push(Buffer.from(chunk));
      return oldWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk: any, ...args: any[]) {
      if (chunk) chunks.push(Buffer.from(chunk));
      const responseBody = Buffer.concat(chunks);
      const responseSize = responseBody.length;

      const responseTime = new Date();
      const latencyMs = responseTime.getTime() - requestTime.getTime();
      const status = res.statusCode;

      // Extract user info from JWT header if not already resolved by passport/guards
      let userId: string | null = null;
      let userRole = 'Guest';
      let userType = 'Guest';

      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded: any = jwt.decode(token);
          if (decoded) {
            userId = decoded.sub || decoded.id || null;
            userRole = (decoded.roles && decoded.roles[0]) || 'Customer';
            userType = userRole;
          }
        } catch {}
      }

      // Log the API call asynchronously
      this.auditService.logApi({
        endpoint,
        method,
        requestTime,
        responseTime,
        latencyMs,
        status,
        userId,
        userRole,
        userType,
        ipAddress,
        userAgent,
        device,
        browser,
        requestSize,
        responseSize,
      });

      // Log guest user visits asynchronously for landing/exit page and views
      if (userRole === 'Guest') {
        const sessionId = (req.headers['x-session-id'] as string) || 'sess_' + ipAddress.replace(/\D/g, '') || 'guest_session';
        this.auditService.logGuest({
          sessionId,
          ipAddress,
          device,
          browser,
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          landingPage: endpoint,
          exitPage: endpoint,
          pagesVisited: [endpoint],
          searchQueries: method === 'GET' && req.query.q ? [String(req.query.q)] : [],
          timeOnSite: Math.ceil(latencyMs / 1000) || 1,
        });
      }

      return oldEnd.apply(res, [chunk, ...args]);
    }.bind(this);

    next();
  }
}
