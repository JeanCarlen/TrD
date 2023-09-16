import { IsInt } from 'class-validator';

export class CreateBlockeduserDto {
  @IsInt({ message: '$property must be an integer value.' })
  user_id: number;

  @IsInt({ message: '$property must be an integer value.' })
  chat_id: number;
}
