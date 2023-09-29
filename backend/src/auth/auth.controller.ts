import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Query,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
  Inject,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthGuard, OTPGuard } from 'src/auth.guard';
import { otpBody } from 'src/validation/param.validators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Get('callback')
  async callback(@Res() response, @Query() query) {
    const insertedUser = await this.authService.getToken(query.code);
    response.cookie('token', insertedUser.token);
    if (insertedUser.twofaenabled)
      response.redirect('https://trd.laendrun.ch/login'); // redirect to page asking for the code when implemented on the frontend
    response.redirect('https://trd.laendrun.ch/login');
  }

  @Delete('2fa')
  @UseGuards(OTPGuard)
  async turnOff2FA(@Req() request:any, @Body() body: otpBody) {
	const isCodeValid = await this.authService.is2FACodeValid(
		body.code, request.user.id
	);
	if (!isCodeValid)
		throw new UnauthorizedException('Wrong authentication code.');
	return await this.authService.turnOff2FA(request.user.id);
  }

  @Post('2fa/generate')
  @UseGuards(AuthGuard)
  async generate(@Req() request) {
    const user = await this.usersService.findOneUser(request.user.id);
    return this.authService.setUp2FA(user);
  }

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard)
  async turnOn2FA(@Req() request, @Body() body: otpBody) {
    const isCodeValid = await this.authService.is2FACodeValid(
      body.code,
      request.user.id,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code.');
    return await this.authService.turnOn2FA(request.user.id);
  }

  @Post('2fa/authenticate')
  @UseGuards(OTPGuard)
  async authenticate(@Req() request, @Body() body: otpBody) {
    const isCodeValid = await this.authService.is2FACodeValid(
      body.code,
      request.user.id,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code.');
    return {
      message: ['Succesffully logged in'],
      token: this.usersService.getJWT(request.user, false, true),
    };
  }
}
