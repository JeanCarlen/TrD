import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum ChatType {
	PRIVATE = 0,
	CHANNEL = 1
}

@Entity('chats')
export class Chats extends BaseEntity{
	@PrimaryGeneratedColumn()
	@ApiProperty({example: 1, description: 'The id of the chat.'})
	id: number;

	@Column({type: 'int4'})
	@ApiProperty({example: 0, description: 'The type of the chat (0: one-to-one, 1: channel'})
	type: number;

	@Column({type: 'varchar', length: 100})
	@ApiProperty({example: 'Transcendence Channel', description: 'The name of the chat (for channel chat), null in one-to-one chats.'})
	name: string;

	@Column({type: 'int4'})
	@ApiProperty({example: 1, description: 'The user id of the owner of the chat.'})
	owner: number;

	@Column({type: 'varchar', length: 100, nullable: true})
	@ApiProperty({example: 'Password1234', description: 'The password of the chat (for private chat), null in unprotected chats.'})
	password: string;

	@Column({type: 'boolean', default: false})
	@ApiProperty({example: false, description: 'Whether the chat is protected by a password or not.'})
	protected: boolean;
 }
