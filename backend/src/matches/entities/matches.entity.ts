import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('matches')
export class Matches extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The ID of the Match.' })
  id: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 1, description: 'User 1 ID' })
  user_1: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 2, description: 'User 2 ID' })
  user_2: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 1, description: 'User 1 score' })
  score_1: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 2, description: 'User 2 score' })
  score_2: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 1, description: 'Status of the match' })
  status: number;
}
