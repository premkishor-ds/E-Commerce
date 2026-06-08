import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './rbac.decorator';
import { AuditService } from '../admin/audit.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user, method, url } = request;
    if (!user || !user.roles) {
      this.auditService.logSecurity({
        userId: null,
        role: 'Guest',
        action: 'Unauthorized access attempt',
        details: `Guest attempted to access protected endpoint ${method} ${url} (Requires: ${requiredRoles.join(', ')}).`,
      });
      return false;
    }
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      this.auditService.logSecurity({
        userId: user.sub || user.id || null,
        role: user.roles[0],
        action: 'Permission violation',
        details: `User attempted to access protected endpoint ${method} ${url} requiring ${requiredRoles.join(', ')} but had roles: ${user.roles.join(', ')}.`,
      });
    }
    return hasRole;
  }
}
