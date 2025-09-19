// src/reactions/reaction-details.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { Reaction } from './reaction.entity';

@Entity('reaction_details')
@Unique('UQ_reaction_details_recipe_reaction', ['recipeId', 'reactionId'])
export class ReactionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({ name: 'recipe_id' })
  recipeId: number;

  @Column({ name: 'reaction_id' })
  reactionId: number;

  @ManyToOne(() => Recipe, (recipe) => (recipe as any).reactionDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Reaction, (reaction) => (reaction as any).reactionDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reaction_id' })
  reaction: Reaction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
