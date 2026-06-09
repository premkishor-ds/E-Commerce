import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GdprService } from './gdpr.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('GDPR & Compliance')
@Controller('gdpr')
export class GdprController {
  constructor(private readonly gdprService: GdprService) {}

  @Get('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all compliance privacy requests' })
  async getRequests() {
    return this.gdprService.getRequests();
  }

  @Post('requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a new privacy request' })
  async createRequest(@Request() req: any, @Body() dto: any) {
    return this.gdprService.createRequest(dto, req.user.id, req.user.email);
  }

  @Put('requests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Process privacy request' })
  async updateRequest(@Param('id') id: string, @Body() dto: any) {
    return this.gdprService.updateRequest(id, dto);
  }
}
