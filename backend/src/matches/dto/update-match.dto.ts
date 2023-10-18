import { IsInt, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  IN_PROGRESS,
  FINISHED,
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 1, description: 'User 1 ID' })
  score_1: number;

  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 2, description: 'User 2 ID' })
  score_2: number;

  @IsEnum(Status, { message: '$property must be either 0 or 1.' })
  @ApiProperty({ example: 0, description: 'Match status (0: In Progress or 1: Finished)' })
  status: number;
}
