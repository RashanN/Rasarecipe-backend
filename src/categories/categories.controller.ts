import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus, 
  UseInterceptors, 
  UploadedFile,
  Req,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { extname } from 'path';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<Category[]> {
    if (search) {
      return this.categoriesService.searchByName(search);
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './Uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `category-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG, JPG, PNG, and GIF images are allowed'), false);
        }
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Category[]> {
    const name = req.body.name;
    
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Name is required and must be a string');
    }
    
    if (name.length > 255) {
      throw new BadRequestException('Name must be 255 characters or less');
    }
    
    const createCategoryDto: CreateCategoryDto = {
      name: name.trim(),
      image: file ? `uploads/categories/${file.filename}` : null,
      extra: null // Explicitly set extra to null since frontend doesn't send it
    };
    
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './Uploads/categories',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `category-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG, JPG, PNG, and GIF images are allowed'), false);
        }
      },
    }),
  )
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<Category> {
    const name = req.body.name;
    
    const updateCategoryDto: UpdateCategoryDto = {
      name: name ? name.trim() : undefined,
      image: file ? `uploads/categories/${file.filename}` : undefined,
      extra: null // Explicitly set extra to null since frontend doesn't send it
    };
    
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}