import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";


export class CreateUserchatDto {
	@ApiProperty({example: 0, description: 'The id of the user.'})
	@IsNumberString()
	user_id: number;

	@ApiProperty({example: 0, description: 'The id of the chat.'})
	@IsNumberString()
	chat_id: number;

	@ApiProperty({example: true, description: 'if the chat is protected by password'})
	protected: boolean;
}
