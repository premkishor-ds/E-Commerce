import { Injectable, NotFoundException } from '@nestjs/common';
import { RoadmapItemRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class RoadmapService {
  constructor(private readonly roadmapItemRepository: RoadmapItemRepository) {}

  async getAll() {
    return this.roadmapItemRepository.find({});
  }

  async create(dto: any, userId: string) {
    return this.roadmapItemRepository.create({ ...dto, createdBy: userId });
  }

  async update(id: string, dto: any) {
    const item = await this.roadmapItemRepository.findById(id);
    if (!item) throw new NotFoundException('Roadmap item not found');
    return this.roadmapItemRepository.update(id, dto);
  }

  async vote(id: string, userId: string) {
    const item = await this.roadmapItemRepository.findById(id);
    if (!item) throw new NotFoundException('Roadmap item not found');
    
    // Check if user already voted
    const votedList = item.votedBy || [];
    const userIdObj = userId as any;
    if (votedList.some((vid: any) => vid.toString() === userId)) {
      // Remove vote
      item.votedBy = votedList.filter((vid: any) => vid.toString() !== userId);
      item.votesCount = Math.max(0, (item.votesCount || 1) - 1);
    } else {
      // Add vote
      votedList.push(userIdObj);
      item.votedBy = votedList;
      item.votesCount = (item.votesCount || 0) + 1;
    }
    return (item as any).save();
  }
}
