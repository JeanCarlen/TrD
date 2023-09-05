import { PartialType } from '@nestjs/mapped-types';
import { CreateAchievmentDto } from './create-achievment.dto';

export class UpdateAchievmentDto extends PartialType(CreateAchievmentDto) {}
