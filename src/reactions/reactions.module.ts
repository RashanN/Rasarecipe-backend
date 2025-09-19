// src/reactions/reactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { Reaction } from './reaction.entity';
import { ReactionDetails } from './reaction-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, ReactionDetails])],
  providers: [ReactionsService],
  controllers: [ReactionsController],
  exports: [ReactionsService],
})
export class ReactionsModule {}
