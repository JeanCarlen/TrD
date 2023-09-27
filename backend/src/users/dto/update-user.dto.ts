import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsMatching } from 'src/validation/matches.decorator';
import { IsValidPassword } from 'src/validation/validPassword.decorator';

@ApiTags('Schemas')
export class UpdateUserDto {
	@ApiPropertyOptional({example: 'laendrun', description: 'New username that will be set if available.'})
	@IsOptional()
	@IsString({ message: '$property must be a string.' })
	@MinLength(3, {
	  message: '$property must be at least 3 characters.',
	})
	@MaxLength(100, {
	  message: '$property must be at most 100 character.',
	})
	username: string;

	@ApiPropertyOptional({example: 'Abcdefg1234!', description: 'Non-hashed password of the user.'})
	@IsOptional()
	@IsString({ message: '$property must be a string.' })
	@IsValidPassword()
	@IsMatching('confirm_password')
	password: string;
  
	@ApiPropertyOptional({example: 'Abcdefg1234!', description: 'Non-hashed password of the user, has to be the exact same as `password`.'})
	@IsOptional()
	@IsString({ message: '$property must be a string.' })
	@IsValidPassword()
	@IsMatching('password')
	confirm_password: string;
}
