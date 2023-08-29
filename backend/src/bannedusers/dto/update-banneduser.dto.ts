import { PartialType } from '@nestjs/mapped-types';
import { CreateBanneduserDto } from './create-banneduser.dto';

export class UpdateBanneduserDto extends PartialType(CreateBanneduserDto) {}
