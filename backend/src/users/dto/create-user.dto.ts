import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message: '$property must be at least 3, but actual value is $value.',
  })
  username: string;

  @IsString({ message: '$property must be a string.' })
  password: string;

  @IsString({ message: '$property must be a string.' })
  confirm_password: string;
}
