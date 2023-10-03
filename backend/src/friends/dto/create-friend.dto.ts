import { IsEnum, IsNumberString } from 'class-validator';
import { FriendStatus } from '../entities/friend.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendDto {
  @IsNumberString()
  @ApiProperty({example: 1, description: 'The ID of the requester user.'})
  requester: number;

  @IsNumberString()
  @ApiProperty({example: 2, description: 'The ID of the requested user.'})
  requested: number;

  @IsNumberString()
  @IsEnum(FriendStatus, {message: '$property must be either PENDING, ACCEPTED or REJECTED.'})
  @ApiProperty({example: 0, description: 'The status of the friend (request).'}) 
  status: number;
}
