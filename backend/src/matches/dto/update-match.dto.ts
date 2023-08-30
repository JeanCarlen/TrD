import { IsInt, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export enum Status {
	IN_PROGRESS,
	FINISHED
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {

	@IsInt({ message: '$property must be an integer value.'})
	score_1: number;

	@IsInt({ message: '$property must be an integer value.'})
	score_2: number;

	@IsEnum(Status, { message: '$property must be either 0 or 1.'})
	status: number;
}
