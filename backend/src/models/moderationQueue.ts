import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ModerationQueue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  messageId!: number;

  @Column('text')
  reason!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
