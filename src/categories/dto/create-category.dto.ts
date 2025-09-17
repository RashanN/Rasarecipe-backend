import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string | null;

  @IsOptional()
  @IsString({ message: 'Extra must be a string' })
   extra?: string | null;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string  | null;

  @IsOptional()
  @IsString({ message: 'Extra must be a string' })
   extra?: string | null;
}