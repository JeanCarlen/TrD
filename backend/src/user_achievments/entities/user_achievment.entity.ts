import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_achievments')
export class UserAchievments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  current: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'int4' })
  achievment_id: number;
}
