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

	@ApiProperty({example: {username: 'laendrun', login42: 'saeby', avatar: 'http://10.12.2.5:8080/images/default.png', curr_status: 0}})
	requester_user: {
		username: string,
		avatar: string,
		login42: string|null,
		curr_status: number,
	};

	@ApiProperty({example: {username: 'laendrun', login42: 'saeby', avatar: 'http://10.12.2.5:8080/images/default.png', curr_status: 0}})
	requested_user: {
		username: string,
		avatar: string,
		login42: string|null,
		curr_status: number,
	};

	@ApiPropertyOptional({example: 1, description: 'The number of friends returned.'})
	total_count?: number;

	// @ApiProperty({example: 1, description: 'The status of the user. (0=> off, 1=> on, 2=> ingame)'})
	// curr_status: number;
}
