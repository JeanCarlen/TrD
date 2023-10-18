import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userchats')
export class UserChats extends BaseEntity {
	@PrimaryGeneratedColumn()
	@ApiProperty({example: 1, description: 'The id of the userchat.'})
	id: number;

	@Column({ type: 'int4'})
	@ApiProperty({example: 0, description: 'The id of the user.'})
	user_id: number;

	@Column({type: 'int4'})
	@ApiProperty({example: 0, description: 'The id of the chat.'})
	chat_id: number;
}
