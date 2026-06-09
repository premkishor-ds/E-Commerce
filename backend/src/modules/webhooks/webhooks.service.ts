import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhookRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class WebhooksService {
  constructor(private readonly webhookRepository: WebhookRepository) {}

  async getAll() {
    return this.webhookRepository.find({});
  }

  async create(dto: any, userId: string) {
    return this.webhookRepository.create({ ...dto, createdBy: userId });
  }

  async delete(id: string) {
    const hook = await this.webhookRepository.findById(id);
    if (!hook) throw new NotFoundException('Webhook not found');
    return this.webhookRepository.delete(id);
  }
}
