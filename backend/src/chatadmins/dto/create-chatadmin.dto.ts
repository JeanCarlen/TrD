import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";


export class CreateChatadminDto {
	@ApiProperty({example: 0,  description: 'The id of the chat.'})
	@IsInt({message: '$property must be an integer.'})
	chat_id: number;

	@ApiProperty({example: 1, description: 'The id of the user.'})
	@IsInt({message: '$property must be an integer.'})
	user_id: number;
}
