import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Knowledge Base')
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Get('articles')
  @ApiOperation({ summary: 'Get all published articles' })
  async getArticles() {
    return this.kbService.getArticles();
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Get article by slug' })
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.kbService.getArticleBySlug(slug);
  }

  @Post('articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create article' })
  async create(@Request() req: any, @Body() dto: any) {
    return this.kbService.create(dto, req.user.id);
  }

  @Delete('articles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete article' })
  async delete(@Param('id') id: string) {
    return this.kbService.delete(id);
  }
}
