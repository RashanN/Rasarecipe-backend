import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from '../ingredients/ingredient.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: number;

  @PrimaryColumn({ name: 'ingredient_id' })
  ingredientId: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'qty', type: 'varchar', length: 255, nullable: true })
  quantity: string | null;
}