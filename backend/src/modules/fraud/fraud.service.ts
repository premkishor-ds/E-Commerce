import { Injectable, NotFoundException } from '@nestjs/common';
import { FraudCaseRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class FraudService {
  constructor(private readonly fraudCaseRepository: FraudCaseRepository) {}

  async getAll() {
    return this.fraudCaseRepository.find({});
  }

  async create(dto: any) {
    return this.fraudCaseRepository.create(dto);
  }

  async update(id: string, dto: any) {
    const fraudCase = await this.fraudCaseRepository.findById(id);
    if (!fraudCase) throw new NotFoundException('Fraud case not found');
    return this.fraudCaseRepository.update(id, dto);
  }
}
