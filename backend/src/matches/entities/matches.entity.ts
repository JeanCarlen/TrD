import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('matches')
export class Matches extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  user_1: number;

  @Column({ type: 'int4' })
  user_2: number;

  @Column({ type: 'int4' })
  score_1: number;

  @Column({ type: 'int4' })
  score_2: number;

  @Column({ type: 'int4' })
  status: number;
}
