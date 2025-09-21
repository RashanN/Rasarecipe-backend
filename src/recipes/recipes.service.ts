import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeCategory } from './recipe-category.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/create-recipe.dto';
import { User } from '../users/user.entity';
import { Ingredient } from '../ingredients/ingredient.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeIngredient) private readonly recipeIngredientRepo: Repository<RecipeIngredient>,
    @InjectRepository(RecipeCategory) private readonly recipeCategoryRepo: Repository<RecipeCategory>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Ingredient) private readonly ingredientRepo: Repository<Ingredient>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
  ) {}

  private async generateUniqueSlug(name: string) {
    const base = name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    let slug = base;
    let i = 1;
    while (await this.recipeRepo.findOne({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }

  async create(dto: CreateRecipeDto, authorId?: number): Promise<Recipe> {
    let author: User | null = null;
    if (authorId) {
      author = await this.usersRepo.findOneBy({ id: authorId });
      if (!author) throw new NotFoundException('Author not found');
    }

    const slug = dto.slug ?? (await this.generateUniqueSlug(dto.name));

    const recipe = this.recipeRepo.create({
      name: dto.name,
      slug,
      content: dto.content ?? '',
      image: dto.image ?? null,
      cookingTime: dto.cookingTime ?? null,
      author: author!,
      isApproved: false,
      approvedBy: null,
      extra: null,
    });

    const savedRecipe = await this.recipeRepo.save(recipe);

    if (dto.ingredients && dto.ingredients.length) {
      const ingIds = dto.ingredients.map((x) => x.ingredientId);
      const foundIngs = await this.ingredientRepo.findBy({ id: In(ingIds) });
      
      const riEntities: RecipeIngredient[] = [];
      
      for (const ingredientInput of dto.ingredients) {
        const ing = foundIngs.find((f) => f.id === ingredientInput.ingredientId);
        if (!ing) throw new NotFoundException(`Ingredient ${ingredientInput.ingredientId} not found`);
        
        const recipeIngredient = this.recipeIngredientRepo.create({
          recipe: savedRecipe,
          ingredient: ing,
          quantity: ingredientInput.quantity ?? null,
        });
        
        riEntities.push(recipeIngredient);
      }
      
      await this.recipeIngredientRepo.save(riEntities);
    }

    if (dto.categories && dto.categories.length) {
      const cats = await this.categoryRepo.findBy({ id: In(dto.categories) });
      
      const rcEntities: RecipeCategory[] = [];
      
      for (const category of cats) {
        const recipeCategory = this.recipeCategoryRepo.create({
          recipe: savedRecipe,
          category: category,
        });
        
        rcEntities.push(recipeCategory);
      }
      
      await this.recipeCategoryRepo.save(rcEntities);
    }

    return this.findOne(savedRecipe.id);
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeRepo.find({
      relations: [
        'author',
        'approvedBy',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'recipeCategories',
        'recipeCategories.category',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  // NEW METHOD: Find only approved recipes
  async findApproved(): Promise<Recipe[]> {
    return this.recipeRepo.find({
      where: { isApproved: true },
      relations: [
        'author',
        'approvedBy',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'recipeCategories',
        'recipeCategories.category',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({
      where: { id },
      relations: [
        'author',
        'approvedBy',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'recipeCategories',
        'recipeCategories.category',
      ],
    });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async findBySlug(slug: string): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({
      where: { slug },
      relations: [
        'author',
        'approvedBy',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'recipeCategories',
        'recipeCategories.category',
      ],
    });
    
    if (!recipe) {
      throw new NotFoundException(`Recipe with slug ${slug} not found`);
    }
    
    return recipe;
  }

  async update(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.findOne(id);

    if (dto.name && dto.name !== recipe.name) {
      recipe.name = dto.name;
      recipe.slug = await this.generateUniqueSlug(dto.name);
    }
    if (dto.content !== undefined) recipe.content = dto.content ?? '';
    if (dto.image !== undefined) recipe.image = dto.image ?? null;
    if (dto.cookingTime !== undefined) recipe.cookingTime = dto.cookingTime ?? null;

    await this.recipeRepo.save(recipe);

    if (dto.ingredients !== undefined) {
      await this.recipeIngredientRepo.delete({ recipe: { id: recipe.id } });
      
      if (dto.ingredients.length) {
        const ingIds = dto.ingredients.map((i) => i.ingredientId);
        const foundIngs = await this.ingredientRepo.findBy({ id: In(ingIds) });
        
        const riEntities: RecipeIngredient[] = [];
        
        for (const ingredientInput of dto.ingredients) {
          const ing = foundIngs.find((f) => f.id === ingredientInput.ingredientId);
          if (!ing) throw new NotFoundException(`Ingredient ${ingredientInput.ingredientId} not found`);
          
          const recipeIngredient = this.recipeIngredientRepo.create({
            recipe,
            ingredient: ing,
            quantity: ingredientInput.quantity ?? null,
          });
          
          riEntities.push(recipeIngredient);
        }
        
        await this.recipeIngredientRepo.save(riEntities);
      }
    }

    if (dto.categories !== undefined) {
      await this.recipeCategoryRepo.delete({ recipe: { id: recipe.id } });
      
      if (dto.categories.length) {
        const cats = await this.categoryRepo.findBy({ id: In(dto.categories) });
        
        const rcEntities: RecipeCategory[] = [];
        
        for (const category of cats) {
          const recipeCategory = this.recipeCategoryRepo.create({
            recipe,
            category: category,
          });
          
          rcEntities.push(recipeCategory);
        }
        
        await this.recipeCategoryRepo.save(rcEntities);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.recipeRepo.delete(id);
  }

  async approve(id: number, approverId: number): Promise<Recipe> {
    const recipe = await this.findOne(id);
    const approver = await this.usersRepo.findOneBy({ id: approverId });
    if (!approver) throw new NotFoundException('Approver not found');
    recipe.isApproved = true;
    recipe.approvedBy = approver;
    await this.recipeRepo.save(recipe);
    return this.findOne(id);
  }

  async findByCategory(
  categoryId: number,
  limit = 10,
  page = 1,
  search?: string,
) {
  const qb = this.recipeRepo
    .createQueryBuilder("recipe")
    .leftJoinAndSelect("recipe.recipeCategories", "rc")
    .leftJoinAndSelect("rc.category", "category")
    .leftJoinAndSelect("recipe.author", "author")
    .where("category.id = :categoryId", { categoryId });

  if (search) {
    qb.andWhere("recipe.name LIKE :search", { search: `%${search}%` });
  }

  qb.orderBy("recipe.createdAt", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] = await qb.getManyAndCount();

  return {
    items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}

}