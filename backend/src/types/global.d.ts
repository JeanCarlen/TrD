export {};

declare global {
	type Message = {
		id: number;
		sender: number;
		sender_name: string;
		text: string;
		date: string;
	}
}