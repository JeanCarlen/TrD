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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, CurrentOrAdminGuard } from 'src/auth.guard';
import { paramValidator } from 'src/validation/param.validators';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Users } from './entities/users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(CurrentOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 201, description: 'User created.'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all users.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of all users.', type: [Users]})
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/username/:username')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get users by username.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Users by username.', type: [Users]})
  findByUsername(@Param() params: paramValidator) {
    return this.usersService.findByUsername(params.username);
  }

  @Get(':id')
  @UseGuards(AuthGuard, CurrentOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user by id.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User by id.', type: Users})
  findOne(@Param() params: paramValidator) {
    return this.usersService.findOne(+params.id);
  }

  @Get('/42')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all 42 users.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of 42 users.', type: [Users]})
  fin42Users() {
    return this.usersService.find42Users();
  }

  @Get('/non42/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all non-42 users.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'Array of non-42 users.', type: [Users]})
  findNon42Users() {
    return this.usersService.findNon42Users();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User updated successfully.'})
  update(@Param() params: paramValidator, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+params.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a user.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized.'})
  @ApiResponse({status: 200, description: 'User deleted successfully.'})
  remove(@Param() params: paramValidator) {
    return this.usersService.remove(+params.id);
  }
}
