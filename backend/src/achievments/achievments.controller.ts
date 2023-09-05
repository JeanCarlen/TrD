import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AchievmentsService } from './achievments.service';
import { CreateAchievmentDto } from './dto/create-achievment.dto';
import { UpdateAchievmentDto } from './dto/update-achievment.dto';

@Controller('achievments')
export class AchievmentsController {
  constructor(private readonly achievmentsService: AchievmentsService) {}

  @Post()
  create(@Body() createAchievmentDto: CreateAchievmentDto) {
    return this.achievmentsService.create(createAchievmentDto);
  }

  @Get()
  findAll() {
    return this.achievmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAchievmentDto: UpdateAchievmentDto) {
    return this.achievmentsService.update(+id, updateAchievmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievmentsService.remove(+id);
  }
}
