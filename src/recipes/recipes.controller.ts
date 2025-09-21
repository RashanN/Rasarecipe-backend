import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async findAll(@Query('approved') approved?: string): Promise<Recipe[]> {
    // If approved=true is passed, return only approved recipes
    if (approved === 'true') {
      return this.recipesService.findApproved();
    }
    // Otherwise return all recipes (for admin dashboard)
    return this.recipesService.findAll();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Recipe> {
    return this.recipesService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipesService.findOne(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `recipe-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Recipe> {
    const createRecipeDto: CreateRecipeDto = {
      name: body.name,
      content: body.content,
      image: file ? `/uploads/${file.filename}` : (body.image || null),
      cookingTime: body.cookingTime ? Number(body.cookingTime) : null,
      ingredients: body.ingredients ? JSON.parse(body.ingredients) : [],
      categories: body.categories ? JSON.parse(body.categories) : [],
      slug: body.slug || null,
    };

    return this.recipesService.create(createRecipeDto, req.user?.id || 1);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `recipe-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Recipe> {
    const updateRecipeDto: UpdateRecipeDto = {
      name: body.name,
      content: body.content,
      image: file ? `/uploads/${file.filename}` : (body.image !== undefined ? body.image : undefined),
      cookingTime: body.cookingTime ? Number(body.cookingTime) : null,
      ingredients: body.ingredients ? JSON.parse(body.ingredients) : undefined,
      categories: body.categories ? JSON.parse(body.categories) : undefined,
      slug: body.slug || null,
    };

    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recipesService.remove(id);
  }

  @Put(':id/approve')
  async approve(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<Recipe> {
    const approvedBy = req.user?.id || 1;
    return this.recipesService.approve(id, approvedBy);
  }
  


  @Get('category/:id')
async getByCategory(
  @Param('id') id: number,
  @Query('limit') limit = 10,
  @Query('page') page = 1,
  @Query('search') search?: string,
) {
  return this.recipesService.findByCategory(id, limit, page, search);
}

}