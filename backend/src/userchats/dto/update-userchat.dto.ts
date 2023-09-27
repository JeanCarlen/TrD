import { PartialType } from '@nestjs/swagger';
import { CreateUserchatDto } from './create-userchat.dto';

export class UpdateUserchatDto extends PartialType(CreateUserchatDto) {}
