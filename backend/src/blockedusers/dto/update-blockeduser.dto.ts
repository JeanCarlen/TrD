import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockeduserDto } from './create-blockeduser.dto';

export class UpdateBlockeduserDto extends PartialType(CreateBlockeduserDto) {}
