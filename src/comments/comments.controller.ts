import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  // ✅ Get by recipe slug
  @Get('recipe/:slug')
  async findByRecipeSlug(@Param('slug') slug: string): Promise<Comment[]> {
    return this.commentsService.findByRecipeSlug(slug);
  }

  // ✅ Create with recipe slug
  @Post('recipe/:slug')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('slug') slug: string,
    @Body() body: { content: string; authorId: number },
  ): Promise<Comment> {
    return this.commentsService.create(slug, body.content, body.authorId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Comment>): Promise<Comment> {
    return this.commentsService.update(id, updateData);
  }

  @Put(':id/approve')
  async approve(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.approve(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.commentsService.remove(id);
  }
}
