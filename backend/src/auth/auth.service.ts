import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Users } from '../users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Create42UserDto } from 'src/users/dto/create-42-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  private async getValidUsername(username: string): Promise<string> {
    const found = await this.usersService.findByUsername(username);
    if (found.length > 0) return username + uuidv4();
    return username;
  }

  public create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  public login(loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  public async getToken(
    code: string | undefined,
  ): Promise<{ message: string[]; token: string; twofaenabled?: boolean }> {
    if (!code)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', process.env.API42_CLIENT_ID);
    formData.append('client_secret', process.env.API42_CLIENT_SECRET);
    formData.append('code', code);
    formData.append('redirect_uri', process.env.API42_REDIRECT_URI);
    let response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    let response2 = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    const user42 = await response2.json();

    const user = {
      login42: user42.login,
      username: user42.login,
      refreshtoken: data.refresh_token,
      avatar: user42.image.link,
    };

    const found = await this.usersService.find42User(user.login42);
    const validUsername = await this.getValidUsername(user.username);

    if (found.length == 0) {
      const create42UserDto = new Create42UserDto();
      create42UserDto.avatar = user.avatar;
      create42UserDto.username = validUsername;
      create42UserDto.login42 = user.username;
      const insertedUser = await this.usersService.create42User(
        create42UserDto,
      );
      return insertedUser;
    } else {
      if (found[0].twofaenabled)
        return {
          message: ['Two Factor Code needed.'],
          token: this.usersService.getJWT(found[0], true),
          twofaenabled: true,
        };
      return {
        message: ['Successfully logged in.'],
        token: this.usersService.getJWT(found[0]),
      };
    }
  }

  public async setUp2FA(user: Users) {
    const data: { secret: string; otpUri: string } =
      await this.generate2FASecret(user);
    return this.generateQRDataURL(data.otpUri);
  }

  private async generate2FASecret(
    user: Users,
  ): Promise<{ secret: string; otpUri: string }> {
    const secret = authenticator.generateSecret();
    const otpUri = authenticator.keyuri(user.username, 'TRANS&DANCE', secret);
    await this.usersService.set2FASecret(user.id, secret);

    return {
      secret,
      otpUri,
    };
  }

  private async generateQRDataURL(otpUri: string): Promise<string> {
    return toDataURL(otpUri);
  }

  public async is2FACodeValid(code: string, id: number) {
    const user = await this.usersService.findTwoFaSecret(id);
    const verif = authenticator.verify({
      token: code,
      secret: user.twofasecret.trim(),
    });
    return verif;
  }

  public async turnOn2FA(id: number) {
    return await this.usersService.turnOn2FA(id);
  }
}
