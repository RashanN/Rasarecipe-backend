import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { CreateReactionDto, UpdateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
  ) {}

  async findAll(): Promise<Reaction[]> {
    return this.reactionsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne({ where: { id } });
    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
    return reaction;
  }

  async create(createReactionDto: CreateReactionDto): Promise<Reaction[]> {
    const reactionData: any = {
      name: createReactionDto.name,
      image: createReactionDto.image || null,
    };
    
    const reaction = this.reactionsRepository.create(reactionData);
    return this.reactionsRepository.save(reaction);
  }

  async update(id: number, updateReactionDto: UpdateReactionDto): Promise<Reaction> {
    const reaction = await this.findOne(id);
    
    const updateData: any = {};
    
    if (updateReactionDto.name !== undefined) {
      updateData.name = updateReactionDto.name;
    }
    
    if (updateReactionDto.image !== undefined) {
      updateData.image = updateReactionDto.image;
    }
    
    this.reactionsRepository.merge(reaction, updateData);
    return this.reactionsRepository.save(reaction);
  }

  async remove(id: number): Promise<void> {
    const reaction = await this.findOne(id);
    await this.reactionsRepository.remove(reaction);
  }

  async searchByName(name: string): Promise<Reaction[]> {
    const result = await this.reactionsRepository
      .createQueryBuilder('reaction')
      .where('reaction.name LIKE :name', { name: `%${name}%` })
      .orderBy('reaction.name', 'ASC')
      .getMany();
    
    return result;
  }
}