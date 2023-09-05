import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAchievmentsService } from './user_achievments.service';
import { CreateUserAchievmentDto } from './dto/create-user_achievment.dto';
import { UpdateUserAchievmentDto } from './dto/update-user_achievment.dto';

@Controller('userachievments')
export class UserAchievmentsController {
  constructor(private readonly userAchievmentsService: UserAchievmentsService) {}

  @Post()
  create(@Body() createUserAchievmentDto: CreateUserAchievmentDto) {
    return this.userAchievmentsService.create(createUserAchievmentDto);
  }

  @Get()
  findAll() {
    return this.userAchievmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAchievmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAchievmentDto: UpdateUserAchievmentDto) {
    return this.userAchievmentsService.update(+id, updateUserAchievmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAchievmentsService.remove(+id);
  }
}
