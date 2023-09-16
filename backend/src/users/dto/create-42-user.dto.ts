import { IsString, MinLength } from 'class-validator';

export class Create42UserDto {
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message: '$property must be at least 3, but actual value is $value.',
  })
  username: string;

  @IsString({ message: '$property must be a string.' })
  login42: string;

  @IsString({ message: '$property must be a string.' })
  avatar: string;
}
