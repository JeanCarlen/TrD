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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/username/:username')
  @UseGuards(AuthGuard)
  findByUsername(@Param() params: paramValidator) {
    return this.usersService.findByUsername(params.username);
  }

  @Get(':id')
  @UseGuards(AuthGuard, CurrentOrAdminGuard)
  findOne(@Param() params: paramValidator) {
    return this.usersService.findOne(+params.id);
  }

  @Get('/42')
  @UseGuards(AuthGuard)
  fin42Users() {
    return this.usersService.find42Users();
  }

  @Get('/non42/')
  @UseGuards(AuthGuard)
  findNon42Users() {
    return this.usersService.findNon42Users();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param() params: paramValidator, @Body() updateUserDto: UpdateUserDto) {
    //check if id is a number for ALL ROUTES
    return this.usersService.update(+params.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param() params: paramValidator) {
    return this.usersService.remove(+params.id);
  }
}
