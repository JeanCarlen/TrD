import {
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength
} from 'class-validator';

export class paramValidator {
	@IsOptional()
	@IsNumberString({}, {message: '$property must be a number.'})
	id: number;

	@IsOptional()
	@IsString({ message: '$property must be a string.' })
	@MinLength(3, { message: '$property must be at least 3 characters.' })
	@MaxLength(100, { message: '$property must be at most 100 characters' })
	username: string;
}

export class otpBody {
	@IsNumberString({}, { message: '$property must be a number.'})
	@Length(6, 6, { message: '$property must be a 6 digits. code'})
	code: string
}