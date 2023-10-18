import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMatchDto {
  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 1, description: 'User 1 ID' })
  user_1: number;

  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 2, description: 'User 2 ID' })
  user_2: number;
}
