import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_achievments')
export class UserAchievments extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: 1, description: 'The ID of the UserAchievment.'})
  id: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 1, description: 'The current progress of the user for the specific achievment.'})
  current: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 1, description: 'The user id.'})
  user_id: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 1, description: 'The achievment id.'})
  achievment_id: number;

  @Column({type: 'boolean', default: false})
  @ApiProperty({example: false, description: 'The status of the achievment.'})
  completed: boolean;

  @Column({type: 'varchar', length: 32, nullable: false, default: 'none'})
  @ApiProperty({example: 'none', description: 'The type of the achievment.'})
  type: string;
}
