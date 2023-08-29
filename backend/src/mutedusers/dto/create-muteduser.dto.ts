import { IsString, IsInt } from "class-validator";

export class CreateMuteduserDto {
	@IsInt({ message: '$property must be an integer value.' })
	user_id: number;

	@IsInt({ message: '$property must be an integer value.' })
	chat_id: number;

	@IsString({ message: '$property must be a stringified date.' })
	until: string;
}
