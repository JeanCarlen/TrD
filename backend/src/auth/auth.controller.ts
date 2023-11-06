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
import { AuthGuard, CurrentGuard, OTPGuard } from 'src/auth.guard';
import { otpBody } from 'src/validation/param.validators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from 'src/auth/dto/auth.response';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(UsersService)
  private readonly usersService: UsersService;

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user.' })
  @ApiResponse({ status: 200, description: 'Return the token of the user.', type: [AuthResponse] })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return await this.authService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a user.' })
  @ApiResponse({ status: 201, description: 'Return the token of the user.', type: [AuthResponse] })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.authService.create(createUserDto);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Callback for 42 OAuth2.' })

  async callback(@Res() response, @Query() query) {
	if (!query.code) {
		throw new UnauthorizedException(['No code provided.'], {
			cause: new Error(),
			description: 'No code provided.'
		});
	}
    const insertedUser = await this.authService.getToken(query.code);
    response.cookie('token', insertedUser.token);
    if (insertedUser.twofaenabled)
      response.redirect('https://trd.laendrun.ch/authenticate'); // redirect to page asking for the code when implemented on the frontend
    response.redirect('https://trd.laendrun.ch/login');
  }

  @Delete('2fa')
  @UseGuards(OTPGuard)
  async turnOff2FA(@Req() request:any, @Body() body: otpBody) {
	const isCodeValid = await this.authService.is2FACodeValid(
		body.code, request.user.user
	);
	if (!isCodeValid)
		throw new UnauthorizedException('Wrong authentication code.');
	return await this.authService.turnOff2FA(request.user.user);
  }

  @Post('2fa/generate')
  @UseGuards(AuthGuard)
  async generate(@Req() request) {
    const user = await this.usersService.findOneUser(request.user.user);
    return this.authService.setUp2FA(user);
  }

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard)
  async turnOn2FA(@Req() request, @Body() body: otpBody) {
    const isCodeValid = await this.authService.is2FACodeValid(
      body.code,
      request.user.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code.');
    return await this.authService.turnOn2FA(request.user.user);
  }

  @Post('2fa/authenticate')
  @UseGuards(OTPGuard)
  async authenticate(@Req() request, @Body() body: otpBody) {
    const isCodeValid = await this.authService.is2FACodeValid(
      body.code,
      request.user.user,
    );
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code.');
	request.user.id = request.user.user;
    return {
      message: ['Succesffully logged in'],
      token: this.usersService.getJWT(request.user, false, true),
    };
  }
}
