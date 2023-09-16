import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blockedusers')
export class BlockedUsers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'int4' })
  chat_id: number;
}
