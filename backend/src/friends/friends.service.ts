import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
  ) {}

  public async create(createFriendDto: CreateFriendDto) {
    const friends: Friends = new Friends();
    friends.requester = createFriendDto.requester;
    friends.requested = createFriendDto.requested;
    friends.status = 0;
    return await this.friendsRepository.save(friends);
  }

  public async findFriendsList(id: number) {
    return await this.friendsRepository.find({
      where: [
        { requester: id, status: 1 },
        { requested: id, status: 1 },
      ],
    });
  }

  public async findPendingFriends(id: number) {
    return await this.friendsRepository.find({
      where: { requested: id, status: 0 },
    });
  }

  public async findPendingRequests(id: number) {
    return await this.friendsRepository.find({
      where: { requester: id, status: 0 },
    });
  }

  public async findAll() {
    return await this.friendsRepository.find();
  }

  public async update(id: number, updateFriendDto: UpdateFriendDto) {
    const friends: Friends = await this.friendsRepository.findOne({
      where: { id: id },
    });
    return await this.friendsRepository.update(id, friends);
  }

  public async remove(id: number) {
    const friends: Friends = await this.friendsRepository.findOne({
      where: { id: id },
    });
    return await this.friendsRepository.remove(friends);
  }
}
