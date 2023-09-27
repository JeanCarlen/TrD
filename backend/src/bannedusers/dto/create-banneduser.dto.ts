import { IsDateString, MaxLength, IsNumberString } from 'class-validator';

export class CreateBanneduserDto {
  @IsNumberString({}, { message: '$property must be a number.'})
  user_id: number;

  @IsNumberString({}, { message: '$property must be a number.'})
  chat_id: number;

  @IsDateString(
    {},
    { message: '$property must be a stringified date in format yyyy-mm-dd.' },
  )
  @MaxLength(10)
  until: string;
}
