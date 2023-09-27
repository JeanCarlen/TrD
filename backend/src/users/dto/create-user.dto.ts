import { IsString, MinLength, MaxLength, ValidateIf } from 'class-validator';
import { IsMatching } from 'src/validation/matches.decorator';
import { IsValidPassword } from 'src/validation/validPassword.decorator';

export class CreateUserDto {
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message: '$property must be at least 3 characters.',
  })
  @MaxLength(100, {
    message: '$property must be at most 100 character.',
  })
  username: string;

  @IsString({ message: '$property must be a string.' })
  @IsValidPassword()
  @IsMatching('confirm_password')
  password: string;

  @IsString({ message: '$property must be a string.' })
  @IsValidPassword()
  @IsMatching('password')
  confirm_password: string;
}
