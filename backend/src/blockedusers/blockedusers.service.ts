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

  public async getBlockedListByUser(user_id: number) : Promise<number[]>{
	const blockedUsersPairs = await this.blockedUsersRepository.find({
		where: [{ blockinguser_id: user_id }, { blockeduser_id: user_id }],
	});
	const blockedUsersIds = blockedUsersPairs.map((pair) => {
		return pair.blockinguser_id == user_id
		? pair.blockeduser_id
		: pair.blockinguser_id;
	});
	return blockedUsersIds;
  }

  public create(createBlockeduserDto: CreateBlockeduserDto) {
    const blockedUser = new BlockedUsers();
    blockedUser.blockeduser_id = createBlockeduserDto.blockeduser_id;
    blockedUser.blockinguser_id = createBlockeduserDto.blockinguser_id;
    return this.blockedUsersRepository.save(blockedUser);
  }

  public findAll() {
    return this.blockedUsersRepository.find();
  }

  public findOne(id: number) {
    return this.blockedUsersRepository.findOne({ where: { id: id } });
  }

  public async findOneByUsers(id1: number, id2: number): Promise<BlockedUsers> {
	return await this.blockedUsersRepository.findOne({
	  where: [
		{ blockeduser_id: id1, blockinguser_id: id2 },
		{ blockeduser_id: id2, blockinguser_id: id1 },
	  ],
	});
  }

  public async findAllWhereBlockerIs(id: number): Promise<BlockedUsers[]> {
	return await this.blockedUsersRepository.find({
	  where: { blockinguser_id: id },
	});
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
