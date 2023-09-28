import { IsNumberString } from 'class-validator';

export class CreateFriendDto {
  @IsNumberString()
  requester: number;

  @IsNumberString()
  requested: number;

  @IsNumberString()
  status: number;
}
