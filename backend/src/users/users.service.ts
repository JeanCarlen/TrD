import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from './entities/users.entity';
import { Create42UserDto } from './dto/create-42-user.dto';
import { UserchatsService } from 'src/userchats/userchats.service';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
	@Inject(UserchatsService)
	private readonly userchatsService: UserchatsService,
) {}

  public getJWT(
    user:
      | { id: string; username: string; avatar: string; login42: string }
      | Users,
	  twoFaCodeReq: boolean,
	  twoFaEnabled?: boolean,
  ): string {
    let payload;
    if (twoFaEnabled) {
      payload = {
        user: user.id,
        username: user.username,
        avatar: user.avatar,
        login42: user.login42 || null,
        twofaenabled: true,
		twofacodereq: twoFaCodeReq || false,
      };
    } else {
      payload = {
        user: user.id,
        username: user.username,
        avatar: user.avatar,
        login42: user.login42 || null,
		twofaenabled: false,
		twofacodereq: false
      };
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  private async updatePassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string[]; token: string }> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
        user.password = this.hashPassword(updateUserDto.password);
        await this.usersRepository.save(user);
        return { message: ['Password changed.'], token: this.getJWT(user, user.twofaenabled) };
  }

  private async updateUsername(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string[]; token: string }> {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    const found: Users | null = await this.usersRepository.findOne({
      where: { username: updateUserDto.username },
    });
    if (found)
      throw new BadRequestException(['Username already taken.'], {
        cause: new Error(),
        description: `Username already taken.`,
      });
    user.username = updateUserDto.username;
	  await this.usersRepository.save(user);
    return { message: [''], token: this.getJWT(user, user.twofaenabled) };
  }

  private async localLogin(
    loginUserDto: LoginUserDto,
    user: Users,
  ): Promise<{ message: string[]; token: string }> {
    const match = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!match)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });

    return { message: ['Successfully logged in.'], token: this.getJWT(user, false, false) };
  }

  private async login2FA(loginUserDto: LoginUserDto, user: Users) {
    const match = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!match)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });
    return {
      message: ['Two Factor Code needed.'],
      token: this.getJWT(user, true, true),
    };
  }

  public async login(loginUserDto: LoginUserDto) {
    const user: Users = await this.usersRepository.findOne({
      where: { username: loginUserDto.username },
    });
    if (!user)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });
    // check if twofaenabled or not
    // console.log(user);
    if (user.twofaenabled) return await this.login2FA(loginUserDto, user);
    return await this.localLogin(loginUserDto, user);
  }

  public async create(createUserDto: CreateUserDto) {
    const user: Users = new Users();
    user.username = createUserDto.username;
    user.avatar = process.env.HOST + 'images/default.png';
    user.twofaenabled = false;

    // check if username is already taken
    const found = await this.findByUsername(user.username);
    if (found.length > 0)
      throw new BadRequestException(['Username already taken.'], {
        cause: new Error(),
        description: `Username ${user.username} already taken.`,
      });

    if (createUserDto.password != createUserDto.confirm_password)
      throw new BadRequestException(["Passwords don't match."], {
        cause: new Error(),
        description: `password and confirm_password don't match.`,
      });

    user.password = this.hashPassword(createUserDto.password);
    const token = this.getJWT(await this.usersRepository.save(user), false);
    return { message: ['Successfully registered.'], token: token };
  }

  public async create42User(create42User: Create42UserDto) {
    // no need to check for uniqueness here, already done in auth.service.ts

    const user: Users = new Users();
    user.username = create42User.username;
    user.avatar = create42User.avatar;
    user.twofaenabled = false;
    user.login42 = create42User.login42;
    user.is42 = true;

    const token = this.getJWT(await this.usersRepository.save(user), false);
    return { message: ['Successfully registered.'], token: token };
  }

  public findAll() {
    return this.usersRepository.find({
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public async findUserChats(id: number) {
	return await this.userchatsService.findByUserId(id);
  }

  public findTwoFaSecret(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
      select: ['twofasecret'],
    });
  }

  public findByUsername(name: string) {
    return this.usersRepository.find({
      where: { username: Like(`%${name}%`) },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) return this.updateUsername(id, updateUserDto);
    else if (updateUserDto.password || updateUserDto.confirm_password)
      return this.updatePassword(id, updateUserDto);
    throw new BadRequestException(['Unable to update'], {
      cause: new Error(),
      description: 'Unable to update user.',
    });
  }

  public find42Users() {
    return this.usersRepository.find({
      where: { is42: true },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public find42User(username: string) {
    return this.usersRepository.find({
      where: { login42: username },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public findNon42Users() {
    return this.usersRepository.find({
      where: { is42: false },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
    return this.usersRepository.remove(user);
  }

  public async updateUserImage(id: number, imageName: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
    if (!user.avatar.includes('default')) {
      const image = user.avatar.replace(process.env.HOST + 'images/', '');
      fs.unlinkSync('/app/uploads/' + image);
    }

    user.avatar = process.env.HOST + 'images/' + imageName;
    const inserted = await this.usersRepository.save(user);
    const token = this.getJWT(inserted, false);
    return { message: ['Avatar successfully saved.'], token: token };
  }

  public async set2FASecret(id: number, secret: string) {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    user.twofasecret = secret.trim();
    return this.usersRepository.update({ id: id }, user);
  }

  public async turnOn2FA(id: number) {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    user.twofaenabled = true;
    await this.usersRepository.save(user);
    return {
      message: ['Two factor authentication successfully turned on.'],
      token: this.getJWT(user, false),
    };
  }

  public async turnOff2FA(id: number) {
	const user: Users = await this.usersRepository.findOne({
		where: { id: id }
	})
	user.twofaenabled = false;
	user.twofasecret = '';
	await this.usersRepository.save(user);
	return {
		message: ['Two factor authentication successfully turned off.'],
		token: this.getJWT(user, false, false)
	}
  }
}
