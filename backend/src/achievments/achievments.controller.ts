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
import { AchievmentsService } from './achievments.service';
import { CreateAchievmentDto } from './dto/create-achievment.dto';
import { UpdateAchievmentDto } from './dto/update-achievment.dto';

@Controller('achievments')
export class AchievmentsController {
  constructor(private readonly achievmentsService: AchievmentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAchievmentDto: CreateAchievmentDto) {
    return this.achievmentsService.create(createAchievmentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.achievmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.achievmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAchievmentDto: UpdateAchievmentDto,
  ) {
    return this.achievmentsService.update(+id, updateAchievmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.achievmentsService.remove(+id);
  }
}
