import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Added type and length for consistency
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Added type and length
  image?: string; // Made optional with ?

  @Column({ type: 'text', nullable: true })
  extra?: string; // Already correct

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}