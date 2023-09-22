import { IsIn, IsInt } from 'class-validator';

export class CreateUserAchievmentDto {
  @IsInt({ message: '$property must be an integer value.' })
  current: number;

  @IsInt({ message: '$property must be an integer value.' })
  user_id: number;

  @IsInt({ message: '$property must be an integer value.' })
  achievment_id: number;
}
