import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockeduserDto {
  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 1, description: 'The ID of the user being blocked.' })
  blockeduser_id: number;

  @IsInt({ message: '$property must be an integer value.' })
  @ApiProperty({ example: 2, description: 'The ID of the user blocking.' })
  blockinguser_id: number;
}
