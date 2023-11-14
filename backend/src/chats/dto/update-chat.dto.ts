import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@ApiPropertyOptional({example: 'Transcendence Channel', description: 'The name of the chat (for channel chat), null in one-to-one chats.'})
	@MinLength(3, {message: '$property should be at least 3 characters long.'})
	@MaxLength(32, {message: '$property should be at most 32 characters long.'})
	@IsString({message: '$property should be a string.'})
	@IsOptional()
	name?: string

	@ApiPropertyOptional({example: 1, description: 'Type of chat (0: one-to-one, 1: channel)'})
	@IsInt({message: '$property should be an integer.'})
	@IsOptional()
	type?: number

	@ApiPropertyOptional({example: 'Test1234', description: 'password of the chat'})
	@IsString({message: '$property should be a string.'})
	@IsOptional()
	password?: string | undefined
}
