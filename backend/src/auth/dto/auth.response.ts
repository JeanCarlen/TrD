import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
	@ApiProperty({example: ['User successfully logged in.'], description: 'The message of the response. Can be multiple error messages.'})
	message: string[];

	@ApiProperty({example: 'JWT token', description: 'The token of the user.'})
	token: string;
}