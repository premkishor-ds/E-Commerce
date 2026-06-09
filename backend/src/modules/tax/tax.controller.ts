import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaxService } from './tax.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Tax Management')
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tax rules' })
  async getAll() {
    return this.taxService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create tax rule' })
  async create(@Body() dto: any) {
    return this.taxService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete tax rule' })
  async delete(@Param('id') id: string) {
    return this.taxService.delete(id);
  }
}
