import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SystemHealthService } from './system-health.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('System Health')
@Controller('system-health')
export class SystemHealthController {
  constructor(private readonly healthService: SystemHealthService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get overall health status' })
  async getStatus() {
    return this.healthService.getStatus();
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get health check historical logs' })
  async getLogs() {
    return this.healthService.getLogs();
  }
}
