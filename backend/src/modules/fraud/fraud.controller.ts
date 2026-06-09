import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FraudService } from './fraud.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Fraud Detection')
@Controller('fraud')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all fraud cases' })
  async getAll() {
    return this.fraudService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create fraud case report' })
  async create(@Body() dto: any) {
    return this.fraudService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update fraud case status/resolution' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.fraudService.update(id, dto);
  }
}
