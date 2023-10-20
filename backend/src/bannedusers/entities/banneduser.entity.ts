import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bannedusers')
export class BannedUsers extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The ID of the BannedUser.' })
  id: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 1, description: 'The ID of the User.' })
  user_id: number;

  @Column({ type: 'int4' })
  @ApiProperty({ example: 1, description: 'The ID of the Chat.' })
  chat_id: number;

  @Column({ type: 'date' })
  @ApiProperty({ example: new Date(), description: 'Date until the user is banned.' })
  until: Date;
}
