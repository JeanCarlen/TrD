import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FriendsResponse {
	@ApiProperty({example: 1, description: 'The ID of the friend (request).'})
	id: number;
	
	@ApiProperty({example: 1, description: 'The ID of the requester user.'})
	requester: number;

	@ApiProperty({example: 2, description: 'The ID of the requested user.'})
	requested: number;

	@ApiProperty({example: 0, description: 'The status of the friend (request).'})
	status: number;

	@ApiProperty({example: {username: 'laendrun', login42: 'saeby', avatar: 'http://localhost:8080/images/default.png'}})
	requester_user: object;

	@ApiProperty({example: {username: 'laendrun', login42: 'saeby', avatar: 'http://localhost:8080/images/default.png'}})
	requested_user: object;

	@ApiPropertyOptional({example: 1, description: 'The number of friends returned.'})
	total_count?: number;
}
