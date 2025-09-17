import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReactionDto {
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string | null; // Allow null

  @IsOptional()
  @IsString({ message: 'Extra must be a string' })
  extra?: string | null; // Allow null
}

export class UpdateReactionDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must be 255 characters or less' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string | null; // Allow null

  @IsOptional()
  @IsString({ message: 'Extra must be a string' })
  extra?: string | null; // Allow null
}