import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  login42: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  refreshtoken: string;

  @Column({ type: 'boolean', nullable: true })
  twofaenabled: boolean;

  @Column({ type: 'char', length: 256, nullable: true })
  twofasecret: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  avatar: string;

  @Column({ type: 'boolean', nullable: true })
  is42: boolean;

  @Column({ type: 'varchar', length: 72, nullable: true })
  password: string;
}
