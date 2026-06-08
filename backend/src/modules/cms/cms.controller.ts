import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('CMS & Blog Engine')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // --- CMS PAGES ---
  @Get('pages')
  @ApiOperation({ summary: 'Get all CMS pages' })
  async getPages() {
    return this.cmsService.getPages();
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get CMS page by slug' })
  async getPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  @Post('pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create CMS page (Admin)' })
  async createPage(@Request() req: any, @Body() dto: any) {
    return this.cmsService.createPage(dto, req.user.id);
  }

  @Put('pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update CMS page (Admin)' })
  async updatePage(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.cmsService.updatePage(id, dto, req.user.id);
  }

  @Delete('pages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete CMS page (Admin)' })
  async deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  // --- BLOG POSTS ---
  @Get('blogs')
  @ApiOperation({ summary: 'Get all Blog posts' })
  async getBlogPosts() {
    return this.cmsService.getBlogPosts();
  }

  @Get('blogs/:slug')
  @ApiOperation({ summary: 'Get Blog post by slug' })
  async getBlogPostBySlug(@Param('slug') slug: string) {
    return this.cmsService.getBlogPostBySlug(slug);
  }

  @Post('blogs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create Blog post (Admin)' })
  async createBlogPost(@Request() req: any, @Body() dto: any) {
    return this.cmsService.createBlogPost(dto, req.user.id);
  }

  @Put('blogs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update Blog post (Admin)' })
  async updateBlogPost(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateBlogPost(id, dto);
  }

  @Delete('blogs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete Blog post (Admin)' })
  async deleteBlogPost(@Param('id') id: string) {
    return this.cmsService.deleteBlogPost(id);
  }
}
