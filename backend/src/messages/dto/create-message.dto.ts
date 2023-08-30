import { IsInt, IsString, IsDateString, MaxLength, IsOptional } from 'class-validator'

export class CreateMessageDto {
	@IsInt({ message: '$property must be an integer value.' })
	user_id: number;

	@IsInt({ message: '$property must be an integer value.' })
	chat_id: number;

	@IsString({ message: '$property must be a string.' })
	text: string;
}
