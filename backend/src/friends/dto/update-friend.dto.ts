import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { IsEnum } from 'class-validator';
import { FriendStatus } from '../entities/friend.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFriendDto {
  @IsEnum(FriendStatus, {message: '$property must be either PENDING, ACCEPTED or REJECTED.'})
  @ApiProperty({example: 1, description: 'The status of the friend (request).'})
  status: number;
}
