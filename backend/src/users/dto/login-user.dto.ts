import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsValidPassword } from 'src/validation/validPassword.decorator';

@ApiTags('Schemas')
export class LoginUserDto {
  @ApiProperty({example: 'laendrun', description: 'Username of the user.'})
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message:
      '$property must be at least 3 characters, but actual value is $value.',
  })
  @MaxLength(100, {
	message: '$property must be at most 100 characters.'
  })
  username: string;

  @ApiProperty({example: 'Abcdefg1234!', description: 'Non-hashed password of the user.'})
  @IsString({ message: '$property must be a string.' })
  @IsValidPassword()
  password: string;
}
