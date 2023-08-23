import { Injectable } from '@nestjs/common';
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

  public create(createUserDto: CreateUserDto): Promise<Users> {
    const user: Users = new Users();
    user.username = createUserDto.username;
	user.avatar = '/path/to/avatar.png';
	user.refreshtoken = 'refresh1234';
	user.twofaenabled = false;
    return this.usersRepository.save(user);
  }

  public findAll() {
	return this.usersRepository.find();
  }

  public findOne(id: number) {
	return this.usersRepository.findOne({ where: { id: id } });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
	return this.usersRepository.update({id: id}, updateUserDto);
  }

  public async remove(id: number) {
	const user = await this.usersRepository.findOne({ where: { id: id } });
	return this.usersRepository.remove(user);
  }
}
