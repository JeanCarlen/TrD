import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UserAchievmentsService } from './user_achievments.service';
import { CreateUserAchievmentDto } from './dto/create-user_achievment.dto';
import { UpdateUserAchievmentDto } from './dto/update-user_achievment.dto';

@Controller('userachievments')
export class UserAchievmentsController {
  constructor(
    private readonly userAchievmentsService: UserAchievmentsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserAchievmentDto: CreateUserAchievmentDto) {
    return this.userAchievmentsService.create(createUserAchievmentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.userAchievmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userAchievmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserAchievmentDto: UpdateUserAchievmentDto,
  ) {
    return this.userAchievmentsService.update(+id, updateUserAchievmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userAchievmentsService.remove(+id);
  }
}
