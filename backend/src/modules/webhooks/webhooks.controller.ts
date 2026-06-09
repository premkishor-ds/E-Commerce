import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Webhooks Engine')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all configured webhooks' })
  async getAll() {
    return this.webhooksService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create webhook endpoint' })
  async create(@Request() req: any, @Body() dto: any) {
    return this.webhooksService.create(dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete webhook endpoint' })
  async delete(@Param('id') id: string) {
    return this.webhooksService.delete(id);
  }
}
