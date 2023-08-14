// backend/src/user/user.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: Users): Promise<Users> {
    return this.userService.create(user);
  }
}
