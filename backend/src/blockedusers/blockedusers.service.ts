import { Injectable } from '@nestjs/common';
import { CreateBlockeduserDto } from './dto/create-blockeduser.dto';
import { UpdateBlockeduserDto } from './dto/update-blockeduser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedUsers } from './entities/blockeduser.entity';

@Injectable()
export class BlockedusersService {
  constructor(
    @InjectRepository(BlockedUsers)
    private readonly blockedUsersRepository: Repository<BlockedUsers>,
  ) {}

  public create(createBlockeduserDto: CreateBlockeduserDto) {
    const blockedUser = new BlockedUsers();
    blockedUser.chat_id = createBlockeduserDto.chat_id;
    blockedUser.user_id = createBlockeduserDto.user_id;
    return this.blockedUsersRepository.save(blockedUser);
  }

  public findAll() {
    return this.blockedUsersRepository.find();
  }

  public findOne(id: number) {
    return this.blockedUsersRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateBlockeduserDto: UpdateBlockeduserDto) {
    return this.blockedUsersRepository.update({ id: id }, updateBlockeduserDto);
  }

  public async remove(id: number) {
    const blockedUser = await this.blockedUsersRepository.findOne({
      where: { id: id },
    });
    return this.blockedUsersRepository.remove(blockedUser);
  }
}
