import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('chatadmins')
export class ChatAdmins extends BaseEntity {
	@PrimaryGeneratedColumn()
	@ApiProperty({example: 1, description: 'The id of the chatadmin.'})
	id: number;

	@Column({type: 'int4'})
	@ApiProperty({example: 1, description: 'The id of the chat.'})
	chat_id: number;

	@Column({type: 'int4'})
	@ApiProperty({example: 1, description: 'The user id of the chat admin.'})
	user_id: number;
}
