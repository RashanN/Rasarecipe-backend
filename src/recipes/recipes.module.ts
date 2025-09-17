import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe } from './recipe.entity';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { User } from '../users/user.entity';
import { Ingredient } from '../ingredients/ingredient.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeCategory,
      RecipeIngredient,
      User,
      Ingredient,
      Category,
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
