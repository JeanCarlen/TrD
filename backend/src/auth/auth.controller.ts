import { Controller, Get, Post, Body, HttpCode, Query, Res, Redirect } from '@nestjs/common';
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
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
	return await this.authService.create(createUserDto)
  }

  @Get('callback')
  async callback(@Res() response, @Query() query) {
	const insertedUser = await this.authService.getToken(query.code);
	response.cookie('token', insertedUser.token);
	response.redirect('https://trd.laendrun.ch/login');
  }
}
