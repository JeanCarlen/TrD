import { IsNumber, IsNumberString } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  requester: number;

  @IsNumber()
  requested: number;

  @IsNumber()
  status: number;
}
