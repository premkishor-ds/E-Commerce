import { Injectable, NotFoundException } from '@nestjs/common';
import { PrivacyRequestRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class GdprService {
  constructor(private readonly privacyRequestRepository: PrivacyRequestRepository) {}

  async getRequests() {
    return this.privacyRequestRepository.find({});
  }

  async createRequest(dto: any, userId: string, email: string) {
    return this.privacyRequestRepository.create({
      ...dto,
      userId,
      email,
      status: 'Pending',
    });
  }

  async updateRequest(id: string, dto: any) {
    const request = await this.privacyRequestRepository.findById(id);
    if (!request) throw new NotFoundException('Privacy request not found');
    return this.privacyRequestRepository.update(id, dto);
  }
}
