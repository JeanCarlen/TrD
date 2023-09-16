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

  @Get('/username/:name')
  @UseGuards(AuthGuard)
  findByUsername(@Param('name') name: string) {
    return this.usersService.findByUsername(name);
  }

  @Get(':id')
  @UseGuards(AuthGuard, CurrentOrAdminGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //check if id is a number for ALL ROUTES
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
