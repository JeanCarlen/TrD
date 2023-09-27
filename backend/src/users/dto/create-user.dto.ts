import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, ValidateIf } from 'class-validator';
import { IsMatching } from 'src/validation/matches.decorator';
import { IsValidPassword } from 'src/validation/validPassword.decorator';

@ApiTags('Schemas')
export class CreateUserDto {
  @ApiProperty({example: 'laendrun', description: 'Username of the user.'})
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message: '$property must be at least 3 characters.',
  })
  @MaxLength(100, {
    message: '$property must be at most 100 character.',
  })
  username: string;

  @ApiProperty({example: 'Abcdefg1234!', description: 'Non-hashed password of the user.'})
  @IsString({ message: '$property must be a string.' })
  @IsValidPassword()
  @IsMatching('confirm_password')
  password: string;

  @ApiProperty({example: 'Abcdefg1234!', description: 'Non-hashed password of the user, has to be the exact same as `password`.'})
  @IsString({ message: '$property must be a string.' })
  @IsValidPassword()
  @IsMatching('password')
  confirm_password: string;
}
