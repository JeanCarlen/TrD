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
import { UserAchievmentResponse } from './dto/userachievment.response'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('User Achievments')
@Controller('userachievments')
export class UserAchievmentsController {
  constructor(
    private readonly userAchievmentsService: UserAchievmentsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create a user_achievments.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User_achievment created.',  type: CreateUserAchievmentDto})
  @UseGuards(AuthGuard)
  create(@Body() createUserAchievmentDto: CreateUserAchievmentDto) {
    return this.userAchievmentsService.create(createUserAchievmentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all user_achievments.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all user_achievments.', type: [UserAchievmentResponse]})
  findAll() {
    return this.userAchievmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user_achievment by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User_achievment by id.', type: UserAchievmentResponse})
  findOne(@Param('id') id: string) {
    return this.userAchievmentsService.findOne(+id);
  }

  @Get('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user_achievment by user id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User_achievment by user id.', type: [UserAchievmentResponse]})
  findUserAchievments(@Param('id') id: number) {
	return this.userAchievmentsService.findUserAchievments(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update user_achievment by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User_achievment updated.'})
  update(
    @Param('id') id: string,
    @Body() updateUserAchievmentDto: UpdateUserAchievmentDto,
  ) {
    return this.userAchievmentsService.update(+id, updateUserAchievmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete user_achievment by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User_achievment deleted.'})
  remove(@Param('id') id: string) {
    return this.userAchievmentsService.remove(+id);
  }
}
