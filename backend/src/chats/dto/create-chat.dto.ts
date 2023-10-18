import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ChatType } from '../entities/chat.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatDto {
	@ApiProperty({example: 0, description: 'The type of the chat (0: one-to-one, 1: channel)'})
	@IsEnum(ChatType, {message: '$property must be either PRIVATE or CHANNEL.'})
	type: number;
	
	@ApiProperty({example: 1, description: 'The user id of the owner of the chat.'})
	@IsNumber({}, {message: '$property should be a number.'})
	owner: number;
	
	@ApiPropertyOptional({example: 'Transcendence Channel', description: 'The name of the chat (for channel chat), null in one-to-one chats.'})
	@MinLength(3, {message: '$property should be at least 3 characters long.'})
	@MaxLength(32, {message: '$property should be at most 32 characters long.'})
	@IsString({message: '$property should be a string.'})
	@IsOptional()
	name?: string
}
