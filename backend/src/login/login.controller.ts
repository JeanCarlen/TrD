import { Controller, Post, Body } from '@nestjs/common';

import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  addUser(@Body('username') user: string, @Body('password') pass: string) {
    const generatedDate = this.loginService.insertLogin(user, pass);
    return { Date: generatedDate };
  }
}
