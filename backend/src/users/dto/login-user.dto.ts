import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message:
      '$property must be at least 3 characters, but actual value is $value.',
  })
  username: string;

  @IsString({ message: '$property must be a string.' })
  password: string;
}
