import { Injectable, NotFoundException } from '@nestjs/common';
import { FileMetadataRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class MediaService {
  constructor(private readonly fileMetadataRepository: FileMetadataRepository) {}

  async registerFile(dto: any, userId: string) {
    return this.fileMetadataRepository.create({ ...dto, uploadedBy: userId });
  }

  async getFiles() {
    return this.fileMetadataRepository.find({});
  }

  async deleteFile(id: string) {
    const file = await this.fileMetadataRepository.findById(id);
    if (!file) throw new NotFoundException('File not found');
    return this.fileMetadataRepository.delete(id);
  }
}
