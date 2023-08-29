import { PartialType } from '@nestjs/mapped-types';
import { CreateMuteduserDto } from './create-muteduser.dto';

export class UpdateMuteduserDto extends PartialType(CreateMuteduserDto) {}
