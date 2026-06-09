import { Injectable, NotFoundException } from '@nestjs/common';
import { TaxRuleRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class TaxService {
  constructor(private readonly taxRuleRepository: TaxRuleRepository) {}

  async getAll() {
    return this.taxRuleRepository.find({});
  }

  async create(dto: any) {
    return this.taxRuleRepository.create(dto);
  }

  async delete(id: string) {
    const taxRule = await this.taxRuleRepository.findById(id);
    if (!taxRule) throw new NotFoundException('Tax rule not found');
    return this.taxRuleRepository.delete(id);
  }
}
