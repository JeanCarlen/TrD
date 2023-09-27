export {};

declare global {
	type Message = {
		sender: number,
		receiver: number,
		message: string,
	}
}