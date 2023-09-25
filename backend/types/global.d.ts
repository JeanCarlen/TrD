export {};

declare global {
	type UnauthorizedResponse = {
		message: string
		statusCode: number
	}
}
