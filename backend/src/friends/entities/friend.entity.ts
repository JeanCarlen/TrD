import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('friends')
export class Friends extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  requester: number;

  @Column({ type: 'int4' })
  requested: number;

  @Column({ type: 'int4' })
  status: number;
}
