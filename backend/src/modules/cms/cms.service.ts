import { Injectable, NotFoundException } from '@nestjs/common';
import { CmsPageRepository, BlogPostRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class CmsService {
  constructor(
    private readonly cmsPageRepository: CmsPageRepository,
    private readonly blogPostRepository: BlogPostRepository,
  ) {}

  // --- CMS PAGES ---
  async createPage(dto: any, authorId: string) {
    return this.cmsPageRepository.create({ ...dto, authorId });
  }

  async getPages() {
    return this.cmsPageRepository.find({});
  }

  async getPageBySlug(slug: string) {
    const page = await this.cmsPageRepository.findOne({ slug });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async updatePage(id: string, dto: any, updatedBy: string) {
    const page = await this.cmsPageRepository.findById(id);
    if (!page) throw new NotFoundException('Page not found');
    
    // Maintain history of changes
    page.history.push({
      content: page.content,
      updatedBy: updatedBy as any,
      timestamp: new Date()
    });

    if (dto.title) page.title = dto.title;
    if (dto.content) page.content = dto.content;
    if (dto.status) page.status = dto.status;
    if (dto.seoMeta) page.seoMeta = dto.seoMeta;
    
    return (page as any).save();
  }

  async deletePage(id: string) {
    return this.cmsPageRepository.delete(id);
  }

  // --- BLOG POSTS ---
  async createBlogPost(dto: any, authorId: string) {
    return this.blogPostRepository.create({ ...dto, authorId });
  }

  async getBlogPosts() {
    return this.blogPostRepository.find({});
  }

  async getBlogPostBySlug(slug: string) {
    const post = await this.blogPostRepository.findOne({ slug });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async updateBlogPost(id: string, dto: any) {
    return this.blogPostRepository.update(id, dto);
  }

  async deleteBlogPost(id: string) {
    return this.blogPostRepository.delete(id);
  }
}
