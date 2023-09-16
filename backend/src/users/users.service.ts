import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from './entities/users.entity';
import { Create42UserDto } from './dto/create-42-user.dto';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public getJWT(user: { id: string, username: string, avatar: string, login42: string} | Users): string {
	const payload = {
		user: user.id,
		username: user.username,
		avatar: user.avatar,
		login42: user.login42 || null
	}
	return (jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }));
  }

  public async login(loginUserDto: LoginUserDto) {

	const user: Users = await this.usersRepository.findOne({ where: { username: loginUserDto.username } });
	if (!user)
		throw new BadRequestException(['Unknown username or password.'], { cause: new Error(), description: `Unknown username or password.` })
	const match = await bcrypt.compareSync(loginUserDto.password, user.password);
	if (!match)
		throw new BadRequestException(['Unknown username or password.'], { cause: new Error(), description: `Unknown username or password.` })
	const token = this.getJWT(user);

	return { message: ['Successfully logged in.'], token: token }

  }

  public async create(createUserDto: CreateUserDto) {
	const saltRounds = 10;
    const user: Users = new Users();
    user.username = createUserDto.username;
	user.avatar = '/path/to/default';
	user.twofaenabled = false;
	if (createUserDto.password != createUserDto.confirm_password)
		throw new BadRequestException(['Passwords don\'t match.'], { cause: new Error(), description: `password and confirm_password don't match.`});

	const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
	user.password = hash;

	const inserted = await this.usersRepository.save(user);
	const token = this.getJWT(inserted);
	// if (await this.usersRepository.exist({ where: { login42: user.login42 }}))
	// 	throw new BadRequestException(['login42 should be unique.'], { cause: new Error(), description: `${user.login42} already exists.`})
    return { message: ['Successfully registered.'], token: token}
  }

  public async create42User(create42User: Create42UserDto) {
	const user: Users = new Users();
	user.username = create42User.username;
	user.avatar = create42User.avatar;
	user.twofaenabled = false;
	user.login42 = create42User.login42;
	user.is42 = true;
	
	const inserted = await this.usersRepository.save(user);
	const token = this.getJWT(inserted);
	return { message: ['Successfully registered.'], token: token}
  }

  public findAll() {
	return this.usersRepository.find();
  }

  public findOne(id: number) {
	return this.usersRepository.findOne({ where: { id: id } });
  }

  public findByUsername(name: string) {
	return this.usersRepository.findBy({ username: Like(`%${name}%`)});
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
	return this.usersRepository.update({id: id}, updateUserDto);
  }

  public find42Users() {
	return this.usersRepository.find({ where: { is42: true } });
  }

  public find42User(username: string) {
	return this.usersRepository.find({ where: { login42: username } });
  }

  public findNon42Users() {
	return this.usersRepository.find({ where: { is42: false } });
  }

  public async remove(id: number) {
	const user = await this.usersRepository.findOne({ where: { id: id } });
	return this.usersRepository.remove(user);
  }

  public async loginTaken(login42: string) {
	return this.usersRepository.exist({ where: { login42: login42 } });
  }
}
