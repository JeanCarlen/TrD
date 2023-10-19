import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserchatDto } from './create-userchat.dto';
import { IsNumberString } from "class-validator";



export class UpdateUserchatDto extends PartialType(CreateUserchatDto) {
	@ApiProperty({example: 0, description: 'The id of the user.'})
	@IsNumberString()
	user_id: number;

	@ApiProperty({example: 0, description: 'The id of the chat.'})
	@IsNumberString()
	chat_id: number;
}
