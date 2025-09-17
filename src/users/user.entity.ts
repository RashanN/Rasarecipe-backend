import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany 
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Comment } from '../comments/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column({ default: 'author' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Add the OneToMany relationship for comments
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}