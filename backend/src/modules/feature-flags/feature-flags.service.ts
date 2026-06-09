import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureFlagRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly featureFlagRepository: FeatureFlagRepository) {}

  async getAll() {
    return this.featureFlagRepository.find({});
  }

  async create(dto: any, userId: string) {
    return this.featureFlagRepository.create({ ...dto, updatedBy: userId });
  }

  async update(id: string, dto: any) {
    const flag = await this.featureFlagRepository.findById(id);
    if (!flag) throw new NotFoundException('Feature flag not found');
    return this.featureFlagRepository.update(id, dto);
  }
}
