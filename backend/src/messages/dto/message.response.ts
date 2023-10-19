import { ApiProperty } from "@nestjs/swagger";

export class MessagesResopnse {
	@ApiProperty({ example: 1, description: 'Message ID' })
	id: number;

	@ApiProperty({ example: 1, description: 'Sender ID' })
	user_id: number;

	@ApiProperty({ example: { id: 1, username: 'laendrun', avatar: 'https://trd.laendrun.ch/images/default.png' }, description: 'Sender data' })
	user_data: {
		username: string,
		avatar: string,
		login42: string|null,
	};

	@ApiProperty({ example: 1, description: 'Chat ID' })
	chat_id: number;

	@ApiProperty({ example: {}, description: 'Chat data' })
	chat_data: {
		name: string,
		type: number,
		owner: number,
	}

	@ApiProperty({ example: 'Hello World!', description: 'Message text' })
	text: string;

	@ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date when the message was sent' })
	created: Date;
}