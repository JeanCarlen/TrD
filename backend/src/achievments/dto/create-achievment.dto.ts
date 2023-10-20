import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateAchievmentDto {
  @IsString({ message: '$property must be a string.' })
  @MaxLength(32, { message: '$property must be at most 32 characters long.' })
  @ApiProperty({ example: 'Achievment 1', description: 'The title of the achievment.' })
  title: string;

  @IsString({ message: '$property must be a string.' })
  @MaxLength(20, { message: '$property must be at most 256 characters long.' })
  @ApiProperty({ example: 'Description 1', description: 'The description of the achievment.' })
  description: string;

  @IsInt({ message: '$property must be a string.' })
  @ApiProperty({ example: 10, description: 'The objective of the achievment.' })
  objective: number;
}
