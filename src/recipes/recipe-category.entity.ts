import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Category } from '../categories/category.entity';

@Entity('recipe_categories')
export class RecipeCategory {
  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: number;

  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Category, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}