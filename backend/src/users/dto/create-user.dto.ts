import {
	IsString,
	MinLength,
	IsAlphanumeric,
	IsBoolean
} from 'class-validator'

export class CreateUserDto {
	@MinLength(4, { message: '$property must have at least 4 characters.' })
	@IsString({ message: '$property must be a string.'})
	username: string;

	@IsString({ message: '$property must be a string.'})
	login42: string;

	@IsAlphanumeric('fr-FR', { message: '$property must be alphanumeric.' })
	refreshtoken: string;

	@IsBoolean({ message: '$property must be a boolean.' })
	twofaenabled: boolean;

	@IsString({ message: '$property must be a string.' })
	avatar: string;
}