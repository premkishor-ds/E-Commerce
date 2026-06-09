import { Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeBaseArticleRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly kbRepository: KnowledgeBaseArticleRepository) {}

  async getArticles() {
    return this.kbRepository.find({ status: 'published' });
  }

  async getArticleBySlug(slug: string) {
    const article = await this.kbRepository.findOne({ slug });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: any, authorId: string) {
    return this.kbRepository.create({ ...dto, authorId });
  }

  async delete(id: string) {
    const article = await this.kbRepository.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    return this.kbRepository.delete(id);
  }
}
