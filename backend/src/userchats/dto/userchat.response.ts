import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserChatsResponse {
	@ApiProperty({example: 1, description: 'The ID of the userchat.'})
	id: number;

	@ApiProperty({example: 1, description: 'The ID of the user.'})
	user_id: number;

	@ApiProperty({example: 1, description: 'The ID of the chat.'})
	chat_id: number;

	@ApiProperty({example: {username: 'laendrun', login42: 'saeby', avatar: 'http://localhost:8080/images/default.png'}})
	user: {
		username: string,
		avatar: string,
		login42: string|null,
	};

	@ApiProperty({example: {name: 'general', type: 0, owner: 1}})
	chat: {
		name: string,
		type: number,
		owner: number,
	};
}