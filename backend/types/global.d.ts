export {};

declare global {
	type UnauthorizedResponse = {
		message: string
		statusCode: number
	}

	type Message = {
		id: number;
		text: string;
		sender: number;
		sender_name: string;
		chat_id: number;
		date: string;
	}
}
