import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The id of the message.' })
  id: number;

  @ApiProperty({ example: 1, description: 'The id of the user who sent the message.' })
  @Column({ type: 'int4' })
  user_id: number;

  @ApiProperty({ example: 1, description: 'The id of the chat where the message was sent.' })
  @Column({ type: 'int4' })
  chat_id: number;

  @ApiProperty({ example: 'Hello World!', description: 'The text of the message.' })
  @Column({ type: 'text' })
  text: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'The date when the message was sent.' })
  @Column({ type: 'date' })
  created: Date;
}
