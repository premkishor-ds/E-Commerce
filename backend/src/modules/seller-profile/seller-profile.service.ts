import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerRepository } from '../../repositories/concrete.repositories';

@Injectable()
export class SellerProfileService {
  constructor(private readonly sellerRepository: SellerRepository) {}

  async getSellers() {
    return this.sellerRepository.find({ isActive: true });
  }

  async getSellerByUser(userId: string) {
    const seller = await this.sellerRepository.findOne({ userId });
    if (!seller) throw new NotFoundException('Seller profile not found');
    return seller;
  }

  async create(dto: any, userId: string) {
    return this.sellerRepository.create({ ...dto, userId, isActive: true });
  }

  async update(userId: string, dto: any) {
    const seller = await this.sellerRepository.findOne({ userId });
    if (!seller) throw new NotFoundException('Seller profile not found');
    return this.sellerRepository.update(seller._id.toString(), dto);
  }
}
