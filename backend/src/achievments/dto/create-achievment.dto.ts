import { IsInt, IsString, MaxLength } from 'class-validator'

export class CreateAchievmentDto {
	@IsString({ message: '$property must be a string.'})
	@MaxLength(32, { message: '$property must be at most 32 characters long.'})
	title: string;

	@IsString({ message: '$property must be a string.'})
	@MaxLength(20, { message: '$property must be at most 256 characters long.'})
	description: string;

	@IsInt({ message: '$property must be a string.'})
	objective: number;
}
