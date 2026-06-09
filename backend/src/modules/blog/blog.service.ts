import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class BlogService {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async createPost(dto: any, authorId: string) {
    return this.blogPostRepository.create({ ...dto, authorId });
  }

  async getPosts() {
    return this.blogPostRepository.find({});
  }

  async getPostBySlug(slug: string) {
    const post = await this.blogPostRepository.findOne({ slug });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async updatePost(id: string, dto: any) {
    return this.blogPostRepository.update(id, dto);
  }

  async deletePost(id: string) {
    return this.blogPostRepository.delete(id);
  }
}
