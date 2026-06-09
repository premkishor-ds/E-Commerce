import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly announcementRepository: AnnouncementRepository) {}

  async getActive() {
    return this.announcementRepository.find({ isActive: true });
  }

  async create(dto: any, userId: string) {
    return this.announcementRepository.create({ ...dto, createdBy: userId });
  }

  async delete(id: string) {
    const announcement = await this.announcementRepository.findById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    return this.announcementRepository.delete(id);
  }
}
