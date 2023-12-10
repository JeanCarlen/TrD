import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';


export class CreateUserAchievmentDto {
	@ApiProperty({example: '1', description: 'Current progress of the achievment.'})
  @IsInt({ message: '$property must be an integer value.' })
  current: number;

	@ApiProperty({example: '1', description: 'User id.'})
  @IsInt({ message: '$property must be an integer value.' })
  user_id: number;

  @ApiProperty({example: '1', description: 'Achievment id.'})
  @IsInt({ message: '$property must be an integer value.' })
  achievment_id: number;

	@ApiProperty({example: 'games_played', description: 'Achievment type.'})
	type: string;

	@ApiProperty({example: 'false', description: 'If the achievment is completed.'})
	completed: boolean;

}
