import {
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientInput {
  @IsInt()
  ingredientId: number;

  @IsOptional()
  @IsString()
  quantity?: string;
}

export class CreateRecipeDto {
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string | null;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string | null;

  @IsOptional()
  @IsInt({ message: 'Cooking time must be an integer (minutes)' })
  cookingTime?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientInput)
  ingredients?: IngredientInput[];

  @IsOptional()
  @IsArray()
  categories?: number[];

  @IsOptional()
  @IsString()
  slug?: string | null;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string | null;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string | null;

  @IsOptional()
  @IsInt({ message: 'Cooking time must be an integer (minutes)' })
  cookingTime?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientInput)
  ingredients?: IngredientInput[];

  @IsOptional()
  @IsArray()
  categories?: number[];

  @IsOptional()
  @IsString()
  slug?: string | null;
}