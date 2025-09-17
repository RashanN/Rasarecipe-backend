import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/create-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<Ingredient[]> {
    if (search) {
      return this.ingredientsService.searchByName(search);
    }
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ingredient> {
    return this.ingredientsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.ingredientsService.remove(id);
  }
}