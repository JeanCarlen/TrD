import { ApiProperty } from "@nestjs/swagger";

export class AchievmentsResponse {
	@ApiProperty({example: 1, description: 'The ID of the achievment.'})
	id: number;

	@ApiProperty({example: 'Achievment 1', description: 'The title of the achievment.'})
	title: string;

	@ApiProperty({example: 'Description 1', description: 'The description of the achievment.'})
	description: string;

	@ApiProperty({example: 10, description: 'The objective of the achievment.'})
	objective: number;
}