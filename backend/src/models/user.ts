import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  displayName?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
