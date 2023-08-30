import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  login42: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 256 })
  refreshtoken: string;

  @Column({ type: 'boolean'})
  twofaenabled: boolean;

  @Column({ type: 'varchar', length: 256})
  avatar: string;
}
