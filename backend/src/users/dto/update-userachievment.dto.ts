import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateUserachievmentDto {
	@ApiProperty({example: '1', description: 'Value to add to achievment progress.'})
	@IsInt({ message: 'Value must be an integer.' })
	value: number;
}