import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Users } from '../users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  public create(createUserDto: CreateUserDto) {
	return this.usersService.create(createUserDto);
  }

  public login(loginUserDto: LoginUserDto) {
	return this.usersService.login(loginUserDto);
  }

  public async getToken(code: string | undefined) {
	if (!code)
		throw new BadRequestException(['Unknown username or password.'], { cause: new Error(), description: `Unknown username or password.` })
	const formData = new FormData();
	formData.append('grant_type', 'authorization_code');
	formData.append('client_id', process.env.API42_CLIENT_ID);
	formData.append('client_secret', process.env.API42_CLIENT_SECRET);
	formData.append('code', code);
	formData.append('redirect_uri', process.env.API42_REDIRECT_URI);
	let response = await fetch('https://api.intra.42.fr/oauth/token', {
		method: 'POST',
		body: formData
	})
	const data = await response.json();
	console.log(data);

	let response2 = await fetch('https://api.intra.42.fr/v2/me', {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${data.access_token}`
		}
	})
	const user42 = await response2.json();

	const user = {
		login42: user42.login,
		username: user42.login,
		refreshtoken: data.refresh_token,
		avatar: user42.image.link
	}

	return user;
  }
}