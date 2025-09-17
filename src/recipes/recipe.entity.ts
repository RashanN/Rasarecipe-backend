import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { RecipeCategory } from './recipe-category.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Comment } from '../comments/entities/comment.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @Column({ name: 'cooking_time', type: 'int', nullable: true })
  cookingTime: number | null;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  extra: string | null;

  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User | null;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true, eager: true })
  recipeIngredients: RecipeIngredient[];

  @OneToMany(() => RecipeCategory, (rc) => rc.recipe, { cascade: true, eager: true })
  recipeCategories: RecipeCategory[];

    @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];
}