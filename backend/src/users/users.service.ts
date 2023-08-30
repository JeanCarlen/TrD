import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<Users> {
    const user: Users = new Users();
	user.login42 = createUserDto.login42;
    user.username = createUserDto.username;
	user.avatar = createUserDto.avatar;
	user.refreshtoken = createUserDto.refreshtoken;
	user.twofaenabled = createUserDto.twofaenabled;
	if (await this.usersRepository.exist({ where: { login42: user.login42 }}))
		throw new BadRequestException(['login42 should be unique.'], { cause: new Error(), description: `${user.login42} already exists.`})

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

  public async remove(id: number) {
	const user = await this.usersRepository.findOne({ where: { id: id } });
	return this.usersRepository.remove(user);
  }

  public async loginTaken(login42: string) {
	return this.usersRepository.exist({ where: { login42: login42 } });
  }
}
