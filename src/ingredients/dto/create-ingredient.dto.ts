import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}