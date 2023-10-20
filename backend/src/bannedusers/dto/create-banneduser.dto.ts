import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, MaxLength, IsNumberString } from 'class-validator';

export class CreateBanneduserDto {
  @IsNumberString({}, { message: '$property must be a number.'})
  @ApiProperty({ example: 1, description: 'The ID of the User.' })
  user_id: number;

  @IsNumberString({}, { message: '$property must be a number.'})
  @ApiProperty({ example: 1, description: 'The ID of the Chat.' })
  chat_id: number;

  @IsDateString(
    {},
    { message: '$property must be a stringified date in format yyyy-mm-dd.' },
  )
  @MaxLength(10)
  @ApiProperty({
	example: '2021-12-31',
	description: 'Date until the user is banned.',
  })
  until: string;
}
