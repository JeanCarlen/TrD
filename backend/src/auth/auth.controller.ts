import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() createuserDto: CreateUserDto) {
    console.log('Bitch please.');
    return await this.authService.create(createuserDto);
  }
}
