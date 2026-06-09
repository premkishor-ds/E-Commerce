import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Product Roadmap')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roadmap items' })
  async getAll() {
    return this.roadmapService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create roadmap item' })
  async create(@Request() req: any, @Body() dto: any) {
    return this.roadmapService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update roadmap item' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.roadmapService.update(id, dto);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vote on a roadmap feature' })
  async vote(@Param('id') id: string, @Request() req: any) {
    return this.roadmapService.vote(id, req.user.id);
  }
}
