import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

@ApiTags('Schemas')
export class Create42UserDto {
  @ApiProperty({example: ['saeby', 'saeby5cbd0e39-e742-402b-9b24-b4ba0c846357'], description: 'Username of the 42 user, can be either the 42 login if available, or the 42 login followed by a V4 UUID.'})
  @IsString({ message: '$property must be a string.' })
  @MinLength(3, {
    message: '$property must be at least 3, but actual value is $value.',
  })
  username: string;

  @ApiProperty({example: 'saeby', description: 'The 42 login of the user.'})
  @IsString({ message: '$property must be a string.' })
  login42: string;

  @ApiProperty({example: 'https://cdn.intra.42.fr/users/6ea1909662bc486359d1b31ab0b694c0/saeby.jpg', description: 'URL of the 42 photo of the user.'})
  @IsString({ message: '$property must be a string.' })
  avatar: string;
}
