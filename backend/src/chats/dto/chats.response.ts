import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ChatsResponse {
	@ApiProperty({example: 1, description: 'The id of the chat.'})
	id: number;

	@ApiProperty({example: 0, description: 'The type of the chat (0: one-to-one, 1: channel'})
	type: number;

	@ApiProperty({example: 'Transcendence Channel', description: 'The name of the chat (for channel chat), null in one-to-one chats.'})
	name: string;

	@ApiProperty({example: 1, description: 'The user id of the owner of the chat.'})
	owner: number;

	@ApiPropertyOptional({example: 1, description: 'The total number of user in the chat.'})
	total_count?: number;
}