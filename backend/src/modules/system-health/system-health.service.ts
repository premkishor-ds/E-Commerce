import { Injectable } from '@nestjs/common';
import { SystemHealthLogRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class SystemHealthService {
  constructor(private readonly healthLogRepository: SystemHealthLogRepository) {}

  async getStatus() {
    return {
      status: 'Healthy',
      timestamp: new Date(),
      services: {
        api: 'up',
        database: 'up',
        cache: 'up',
      },
    };
  }

  async getLogs() {
    return this.healthLogRepository.find({});
  }
}
