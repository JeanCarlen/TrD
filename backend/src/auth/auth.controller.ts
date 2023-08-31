import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

// import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('Bitch please.');
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
	console.log('Registering bitches');
	return await this.authService.create(createUserDto)
  }
}
