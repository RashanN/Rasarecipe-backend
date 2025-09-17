import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category[]> {
    const categoryData: any = {
      name: createCategoryDto.name,
      image: createCategoryDto.image || null,
    };
    
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    const updateData: any = {};
    
    if (updateCategoryDto.name !== undefined) {
      updateData.name = updateCategoryDto.name;
    }
    
    if (updateCategoryDto.image !== undefined) {
      updateData.image = updateCategoryDto.image;
    }
    
    this.categoriesRepository.merge(category, updateData);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async searchByName(name: string): Promise<Category[]> {
    const result = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name LIKE :name', { name: `%${name}%` })
      .orderBy('category.name', 'ASC')
      .getMany();
    
    return result;
  }
}