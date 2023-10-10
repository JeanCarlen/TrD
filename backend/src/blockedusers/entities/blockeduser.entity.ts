import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('blockedusers')
export class BlockedUsers extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: 1, description: 'The ID of the `blockage`.'})
  id: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 1, description: 'The ID of the blocking user.'})
  blockinguser_id: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 2, description: 'The ID of the blocked user.'})
  blockeduser_id: number;
}
