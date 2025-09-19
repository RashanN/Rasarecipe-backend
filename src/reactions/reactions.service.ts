import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { CreateReactionDto, UpdateReactionDto } from './dto/create-reaction.dto';
import { ReactionDetails } from '../reactions/reaction-details.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    @InjectRepository(ReactionDetails)
    private reactionDetailsRepository: Repository<ReactionDetails>,
  ) {}

  // ========== RECIPE REACTIONS METHODS (User Interactions) ==========
  
  async getRecipeReactions(recipeId: number) {
    return await this.reactionDetailsRepository.find({
      where: { recipeId },
      relations: ['reaction'],
    });
  }

  async addRecipeReaction(recipeId: number, reactionId: number) {
    const existing = await this.reactionDetailsRepository.findOne({
      where: { recipeId, reactionId },
    });

    if (existing) {
      existing.count += 1;
      return await this.reactionDetailsRepository.save(existing);
    } else {
      const newReactionDetail = this.reactionDetailsRepository.create({
        recipeId,
        reactionId,
        count: 1,
      });
      return await this.reactionDetailsRepository.save(newReactionDetail);
    }
  }

  async removeRecipeReaction(recipeId: number, reactionId: number) {
    const existing = await this.reactionDetailsRepository.findOne({
      where: { recipeId, reactionId },
    });

    if (existing && existing.count > 0) {
      existing.count -= 1;
      if (existing.count === 0) {
        await this.reactionDetailsRepository.remove(existing);
        return null;
      }
      return await this.reactionDetailsRepository.save(existing);
    }
    
    throw new NotFoundException('Reaction not found');
  }

  // ========== ADMIN PANEL METHODS (CRUD Operations) ==========

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