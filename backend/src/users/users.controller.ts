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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, CurrentGuard } from 'src/auth.guard';
import { paramValidator } from 'src/validation/param.validators';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Users } from './entities/users.entity';
import { UsersResponse } from './dto/users.response';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all users.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all users.', type: [Users]})
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.user);
  }

  @Get('/username/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get users by username.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Users by username.', type: [UsersResponse]})
  findByUsername(@Param() params: paramValidator, @Req() req: any) {
    return this.usersService.findByUsername(params.username, req.user.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User by id.', type: UsersResponse})
  findOne(@Param() params: paramValidator) {
    return this.usersService.findOne(+params.id);
  }

  @Get(':id/chats')
  @UseGuards(AuthGuard, CurrentGuard)
  @ApiOperation({ summary: 'Get all chats of a user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiResponse({status: 200, description: 'Return all chats of a user.'})
  @ApiBearerAuth()
  findUserChats(@Param() params: paramValidator) {
	return this.usersService.findUserChats(+params.id);
  }

  @Get(':id/blocked')
  @UseGuards(AuthGuard, CurrentGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all blocked users of a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Return all blocked users of a user.', type: [UsersResponse]})
  findUserBlockedUsers(@Param() params: paramValidator) {
	return this.usersService.blockedUsersList(+params.id);
  }

  @Post('/block/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Block a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User blocked successfully.'})
  blockUser(@Param() params: paramValidator, @Req() req: any) {
	return this.usersService.blockUser(params.id, req.user.user);
  }

  @Delete('/unblock/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Unblock a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User unblocked successfully.'})
  @ApiBadRequestResponse({description: 'User not blocked.'})
  unblockUser(@Param() params: paramValidator, @Req() req: any) {
	return this.usersService.unblockUser(params.id, req.user.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, CurrentGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User updated successfully.'})
  update(@Param() params: paramValidator, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+params.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CurrentGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User deleted successfully.'})
  remove(@Param() params: paramValidator) {
    return this.usersService.remove(+params.id);
  }
}
