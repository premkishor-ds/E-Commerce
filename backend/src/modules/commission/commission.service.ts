import { Injectable, NotFoundException } from '@nestjs/common';
import { CommissionRuleRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class CommissionService {
  constructor(private readonly commissionRuleRepository: CommissionRuleRepository) {}

  async getAll() {
    return this.commissionRuleRepository.find({});
  }

  async create(dto: any) {
    return this.commissionRuleRepository.create(dto);
  }

  async delete(id: string) {
    const rule = await this.commissionRuleRepository.findById(id);
    if (!rule) throw new NotFoundException('Commission rule not found');
    return this.commissionRuleRepository.delete(id);
  }
}
