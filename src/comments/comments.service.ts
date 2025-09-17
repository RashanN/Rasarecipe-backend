import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Recipe } from '../recipes/recipe.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Get all comments
  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find({
      relations: ['author', 'recipe'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get one comment
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'recipe'],
    });
    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
    return comment;
  }

  // Get comments by recipe slug
  async findByRecipeSlug(slug: string): Promise<Comment[]> {
    console.log(`Looking for recipe with slug: ${slug}`);
    
    const recipe = await this.recipeRepo.findOne({ where: { slug } });
    console.log(`Found recipe:`, recipe);
    
    if (!recipe) {
      console.log(`Recipe with slug '${slug}' not found`);
      throw new NotFoundException(`Recipe with slug '${slug}' not found`);
    }

    const comments = await this.commentRepo.find({
      where: { recipe: { id: recipe.id }, isApproved: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
    
    console.log(`Found ${comments.length} comments for recipe ${recipe.id}`);
    return comments;
  }

  // Create a new comment
  async create(slug: string, content: string, authorId: number): Promise<Comment> {
    const recipe = await this.recipeRepo.findOne({ where: { slug } });
    if (!recipe) throw new NotFoundException(`Recipe with slug '${slug}' not found`);

    const author = await this.userRepo.findOne({ where: { id: authorId } });
    if (!author) throw new NotFoundException(`User with ID ${authorId} not found`);

    const comment = new Comment();
    comment.content = content;
    comment.recipe = recipe;
    comment.author = author;
    comment.isApproved = false;

    return this.commentRepo.save(comment);
  }

  // Update comment
  async update(id: number, updateData: Partial<Comment>): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateData);
    return this.commentRepo.save(comment);
  }

  // Delete comment
  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepo.remove(comment);
  }

  // Approve comment
  async approve(id: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.isApproved = true;
    return this.commentRepo.save(comment);
  }
}