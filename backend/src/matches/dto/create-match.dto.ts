import { IsInt } from 'class-validator';

export class CreateMatchDto {
  @IsInt({ message: '$property must be an integer value.' })
  user_1: number;

  @IsInt({ message: '$property must be an integer value.' })
  user_2: number;
}
