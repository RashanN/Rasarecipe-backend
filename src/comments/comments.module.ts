import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Recipe } from '../recipes/recipe.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    // Import the entities that this module will work with
    TypeOrmModule.forFeature([Comment, Recipe, User])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, TypeOrmModule] // Export TypeOrmModule as well if other modules need it
})
export class CommentsModule {}