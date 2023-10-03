import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FriendStatus {
	PENDING = 0,
	ACCEPTED = 1,
	REJECTED = 2
}

@Entity('friends')
export class Friends extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({example: 1, description: 'The ID of the friend (request).'})
  id: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 1, description: 'The ID of the requester user.'})
  requester: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 2, description: 'The ID of the requested user.'})
  requested: number;

  @Column({ type: 'int4' })
  @ApiProperty({example: 0, description: 'The status of the friend (request).'})
  status: number;
}
