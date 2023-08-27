import { IsInt } from 'class-validator'

import { Users } from '../../users/entities/users.entity'

export class CreateMatchDto {
	@IsInt({ message: '$property must be an integer value.'})
	user_1: number;

	@IsInt({ message: '$property must be an integer value.'})
	user_2: number;
}