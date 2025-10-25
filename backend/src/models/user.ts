import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ default: false })
  verified!: boolean;

  @Column({ nullable: true })
  hederaChallenge?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
