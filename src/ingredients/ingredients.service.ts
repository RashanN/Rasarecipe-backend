import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/create-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientsRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
    return ingredient;
  }

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientsRepository.create(createIngredientDto);
    return this.ingredientsRepository.save(ingredient);
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOne(id);
    this.ingredientsRepository.merge(ingredient, updateIngredientDto);
    return this.ingredientsRepository.save(ingredient);
  }

  async remove(id: number): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.ingredientsRepository.remove(ingredient);
  }

  async searchByName(name: string): Promise<Ingredient[]> {
    return this.ingredientsRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.name LIKE :name', { name: `%${name}%` })
      .orderBy('ingredient.name', 'ASC')
      .getMany();
  }
}