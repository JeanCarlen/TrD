import { IsDateString, MaxLength, IsInt } from 'class-validator';

export class CreateMuteduserDto {
  @IsInt({ message: '$property must be an integer value.' })
  user_id: number;

  @IsInt({ message: '$property must be an integer value.' })
  chat_id: number;

  @IsDateString(
    {},
    { message: '$property must be a stringified date in format yyyy-mm-dd.' },
  )
  @MaxLength(10)
  until: string;
}
