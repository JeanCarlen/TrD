import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ChatsBodyDto {
	@ApiProperty({example: 1, description: 'The id of the user to do the operation on.'})
	@IsNumber({}, {message: '$property should be a number.'})
	user_id: number;
}