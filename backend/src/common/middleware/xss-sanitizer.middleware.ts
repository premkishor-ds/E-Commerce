import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class XssSanitizerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      req.body = this.sanitize(req.body);
    }
    next();
  }

  private sanitize(obj: any): any {
    if (typeof obj === 'string') {
      // Strips <script> tags, inline javascript links, and HTML markers
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '')
        .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '')
        .replace(/on\w+\s*=\s*['"][^'"]*['"]/gi, '');
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    } else if (typeof obj === 'object' && obj !== null) {
      const sanitizedObj: any = {};
      for (const key of Object.keys(obj)) {
        sanitizedObj[key] = this.sanitize(obj[key]);
      }
      return sanitizedObj;
    }
    return obj;
  }
}
