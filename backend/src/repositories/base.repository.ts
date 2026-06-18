import * as mongoose from 'mongoose';

export abstract class BaseRepository<T extends mongoose.Document> {
  constructor(protected readonly model: mongoose.Model<T>) {}

  async create(doc: any): Promise<T> {
    const createdEntity = new this.model(doc);
    return createdEntity.save() as Promise<T>;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: any = {}, options: any = {}): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async update(id: string, update: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async deleteMany(filter: any = {}): Promise<any> {
    return this.model.deleteMany(filter).exec();
  }

  async updateMany(filter: any = {}, update: any = {}): Promise<any> {
    return this.model.updateMany(filter, update).exec();
  }
}
