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
import { ReactionsService } from './reactions.service';
import { Reaction } from './reaction.entity';
import { CreateReactionDto, UpdateReactionDto } from './dto/create-reaction.dto';
import { extname } from 'path';
import { ReactionDetails } from '../reactions/reaction-details.entity';
import { Recipe } from '../recipes/recipe.entity';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<Reaction[]> {
    if (search) {
      return this.reactionsService.searchByName(search);
    }
    return this.reactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Reaction> {
    return this.reactionsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './Uploads/reactions',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `reaction-${uniqueSuffix}${ext}`);
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
  ): Promise<Reaction[]> {
    const name = req.body.name;
    
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Name is required and must be a string');
    }
    
    if (name.length > 255) {
      throw new BadRequestException('Name must be 255 characters or less');
    }
    
    const createReactionDto: CreateReactionDto = {
      name: name.trim(),
      image: file ? `uploads/reactions/${file.filename}` : null
    };
    
    return this.reactionsService.create(createReactionDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './Uploads/reactions',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `reaction-${uniqueSuffix}${ext}`);
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
  ): Promise<Reaction> {
    const name = req.body.name;
    
    const updateReactionDto: UpdateReactionDto = {
      name: name ? name.trim() : undefined,
      image: file ? `uploads/reactions/${file.filename}` : undefined
    };
    
    return this.reactionsService.update(id, updateReactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.reactionsService.remove(id);
  }

  



// Add these new endpoints to your ReactionsController class:

@Get('recipe/:recipeId')
async getRecipeReactions(@Param('recipeId') recipeId: number) {
  return this.reactionsService.getRecipeReactions(recipeId);
}

@Post('recipe/:recipeId/react/:reactionId')
@HttpCode(HttpStatus.OK)
async addRecipeReaction(
  @Param('recipeId') recipeId: number,
  @Param('reactionId') reactionId: number,
) {
  return this.reactionsService.addRecipeReaction(recipeId, reactionId);
}

@Delete('recipe/:recipeId/react/:reactionId')
@HttpCode(HttpStatus.OK)
async removeRecipeReaction(
  @Param('recipeId') recipeId: number,
  @Param('reactionId') reactionId: number,
) {
  return this.reactionsService.removeRecipeReaction(recipeId, reactionId);
}

}