import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAchievmentDto } from './create-user_achievment.dto';

export class UpdateUserAchievmentDto extends PartialType(CreateUserAchievmentDto) {}
