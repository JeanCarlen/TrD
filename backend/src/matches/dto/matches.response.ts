import { ApiProperty } from "@nestjs/swagger";

export class MatchesResponse {
	@ApiProperty({ example: 1, description: 'Match ID' })
	id: number;
	
	@ApiProperty({ example: 1, description: 'User 1 ID' })
	user_1: number;

	@ApiProperty({ example: 2, description: 'User 2 ID' })
	user_2: number;

	@ApiProperty({ example: { id: 1, username: 'laendrun', avatar: 'https://trd.laendrun.ch/images/default.png' }})
	user_1_data: {
		username: string,
		avatar: string,
		login42: string|null,
	};

	@ApiProperty({ example: { id: 2, username: 'saeby', avatar: 'https://trd.laendrun.ch/images/default.png' }})
	user_2_data: {
		username: string,
		avatar: string,
		login42: string|null,
	};

	@ApiProperty({ example: 1, description: 'User 1 score' })
	score_1: number;

	@ApiProperty({ example: 2, description: 'User 2 score' })
	score_2: number;

	@ApiProperty({ example: 1, description: 'Status of the match' })
	status: number;

	@ApiProperty({ example: 'Finished', description: '(EN) Text status of the match.' })
	status_text_en: string;

	@ApiProperty({ example: 'Terminé', description: '(FR) Text status of the match.' })
	status_text_fr: string;
}