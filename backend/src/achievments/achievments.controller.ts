import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { AchievmentsService } from './achievments.service';
import { CreateAchievmentDto } from './dto/create-achievment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AchievmentsResponse } from './dto/achievments.response';

@Controller('achievments')
@ApiTags('Achievments')
export class AchievmentsController {
  constructor(private readonly achievmentsService: AchievmentsService) {}

//   @Post()
//   @UseGuards(AuthGuard)
//   create(@Body() createAchievmentDto: CreateAchievmentDto) {
//     return this.achievmentsService.create(createAchievmentDto);
//   }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all achievments.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all achievments.', type: [AchievmentsResponse]})
  findAll() {
    return this.achievmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get achievment by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Achievment by id.', type: AchievmentsResponse})
  findOne(@Param('id') id: string) {
    return this.achievmentsService.findOne(+id);
  }

}
