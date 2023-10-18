import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBanneduserDto } from './dto/create-banneduser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannedUsers } from './entities/banneduser.entity';

@Injectable()
export class BannedusersService {
  constructor(
    @InjectRepository(BannedUsers)
    private readonly bannedUsersRepository: Repository<BannedUsers>,
  ) {}

  public create(createBanneduserDto: CreateBanneduserDto) {
    const bannedUser = new BannedUsers();
    bannedUser.chat_id = createBanneduserDto.chat_id;
    bannedUser.user_id = createBanneduserDto.user_id;
    bannedUser.until = new Date(createBanneduserDto.until);
    return this.bannedUsersRepository.save(bannedUser);
  }

  public async findAll() {
	// only return the users that are banned from chats where you are admin
    return await this.bannedUsersRepository.find();
  }

  public async findOne(id: number): Promise<BannedUsers> {
	// only return the users that are banned from chats where you are admin
    const bannedUser: BannedUsers = await this.bannedUsersRepository.findOne({ where: { id: id } });
	if (!bannedUser) {
		throw new NotFoundException(['Banned user not found.'], {
			cause: new Error(),
			description: `Banned user not found.`,
		});
	}
	return bannedUser;
  }

  public async remove(id: number) {
	// only return the users that are banned from chats where you are admin
    const bannedUser = await this.bannedUsersRepository.findOne({
      where: { id: id },
    });
	if (!bannedUser) {
		throw new NotFoundException(['Banned user not found.'], {
			cause: new Error(),
			description: `Banned user not found.`,
		});
	}
    return this.bannedUsersRepository.remove(bannedUser);
  }
}
