import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from './entities/users.entity';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async login(loginUserDto: LoginUserDto) {
	const user: Users = await this.usersRepository.findOne({ where: { username: loginUserDto.username } });
	if (!user)
		throw new BadRequestException(['Unknown username or password.'], { cause: new Error(), description: `Unknown username or password.` })
	const match = await bcrypt.compareSync(loginUserDto.password, user.password);
	if (!match)
		throw new BadRequestException(['Unknown username or password.'], { cause: new Error(), description: `Unknown username or password.` })

	const payload = {
		user: user.id,
		username: user.username
	}

	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'});
	// generate JWT and send it back to te frontend as an auth token

	return { message: ['Successfully logged in.'], token: token }

  }

  public async create(createUserDto: CreateUserDto) {
	const saltRounds = 10;
    const user: Users = new Users();
    user.username = createUserDto.username;
	user.avatar = '/path/to/default';
	user.twofaenabled = false;
	// check `password` == `confirm_password`
	if (createUserDto.password != createUserDto.confirm_password)
		throw new BadRequestException(['Passwords don\'t match.'], { cause: new Error(), description: `password and confirm_password don't match.`});

	const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
	user.password = hash;

	// if (await this.usersRepository.exist({ where: { login42: user.login42 }}))
	// 	throw new BadRequestException(['login42 should be unique.'], { cause: new Error(), description: `${user.login42} already exists.`})
    return this.usersRepository.save(user);
  }

  public findAll() {
	return this.usersRepository.find();
  }

  public findOne(id: number) {
	return this.usersRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
	return this.usersRepository.update({id: id}, updateUserDto);
  }

  public find42Users() {
	return this.usersRepository.find({ where: { is42: true } });
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
