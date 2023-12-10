import {ApiProperty} from "@nestjs/swagger";

export class UserAchievmentResponse {
	@ApiProperty({example: '1', description: 'Current progress of the achievment.'})
	current: number;

	@ApiProperty({example: '1', description: 'User id.'})
	user_id: number;

	@ApiProperty({example: '1', description: 'Achievment id.'})
	achievment_id: number;

	@ApiProperty({example: 'false', description: 'Status of the achievment.'})
	completed: boolean;

	@ApiProperty({example: 'none', description: 'Type of the achievment.'})
	type: string;

	@ApiProperty({example: '1', description: 'Achievment data.'})
	achievment_data: {
		id: number,
		title: string,
		description: string,
		objective: number,
		type: string
	}
}