import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UsersResponse {
	@ApiProperty({example: 1, description: 'The ID of the user.'})
	id: number;

	@ApiProperty({example: 'laendrun', description: 'The username of the user.'})
	username: string;

	@ApiProperty({example: 'saeby', description: 'The login42 of the user.'})
	login42: string;

	@ApiProperty({example: 'http://localhost:8080/images/default.png', description: 'The avatar of the user.'})
	avatar: string;

	@ApiProperty({example: true, description: 'The twofaenabled of the user.'})
	twofaenabled: boolean;

	@ApiPropertyOptional({example: 2, description: 'The count of active friends of the user.'})
	active_friends?: number;

	@ApiPropertyOptional({example: 1, description: 'The count of pending friends of the user.'})
	pending_requests?: number;

	@ApiPropertyOptional({example: 1, description: 'The count of request friends of the user.'})
	requests_sent?: number;
}
