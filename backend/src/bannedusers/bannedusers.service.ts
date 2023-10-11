import { Injectable } from '@nestjs/common';
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

  public findAll() {
	// only return the users that are banned from chats where you are admin
    return this.bannedUsersRepository.find();
  }

  public findOne(id: number) {
	// only return the users that are banned from chats where you are admin
    return this.bannedUsersRepository.findOne({ where: { id: id } });
  }

  public async remove(id: number) {
	// only return the users that are banned from chats where you are admin
    const bannedUser = await this.bannedUsersRepository.findOne({
      where: { id: id },
    });
    return this.bannedUsersRepository.remove(bannedUser);
  }
}
