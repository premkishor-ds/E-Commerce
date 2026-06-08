import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const now = Date.now();
      return next.handle().pipe(
        tap({
          next: async (response) => {
            const duration = Date.now() - now;
            const userId = user?.sub || user?.id || null;
            const role = user?.roles?.[0] || 'Guest';

            await this.auditService.logAudit({
              userId,
              role,
              action: `${method} ${url}`,
              entity: url.split('/')[3] || 'System',
              before: {},
              after: body,
              device: request.headers['user-agent'] || 'Unknown',
              ip: request.ip || '127.0.0.1',
              browser: request.headers['user-agent'] || 'Unknown',
              status: 'Success',
              duration,
            });
          },
          error: async (err) => {
            const duration = Date.now() - now;
            const userId = user?.sub || user?.id || null;
            const role = user?.roles?.[0] || 'Guest';

            await this.auditService.logAudit({
              userId,
              role,
              action: `${method} ${url}`,
              entity: url.split('/')[3] || 'System',
              before: {},
              after: { error: err.message, body },
              device: request.headers['user-agent'] || 'Unknown',
              ip: request.ip || '127.0.0.1',
              browser: request.headers['user-agent'] || 'Unknown',
              status: 'Failed',
              duration,
            });
          }
        })
      );
    }

    return next.handle();
  }
}
