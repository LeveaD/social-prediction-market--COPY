import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Reputation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column({ type: 'float', default: 0 })
  score!: number;

  @CreateDateColumn()
  updatedAt!: Date;
}
