import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 256 })
  refreshtoken: string;

  @Column({ type: 'boolean'})
  twofaenabled: boolean;

  @Column({ type: 'varchar', length: 256})
  avatar: string;
}
