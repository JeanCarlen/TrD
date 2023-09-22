import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'int4' })
  chat_id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'date' })
  created: Date;
}
