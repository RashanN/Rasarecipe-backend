import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { CategoriesModule } from './categories/categories.module';
import { ReactionsModule } from './reactions/reactions.module';
import { RecipesModule } from './recipes/recipes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    IngredientsModule,
    CategoriesModule,
    ReactionsModule,
    RecipesModule,
    CommentsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}