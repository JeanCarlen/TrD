import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { FriendsResponse } from './dto/friends.response';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
	@InjectRepository(Users)
	private readonly usersRepository: Repository<Users>,
  ) {}

  public async create(createFriendDto: CreateFriendDto) {
    const friends: Friends = new Friends();
    friends.requester = createFriendDto.requester;
    friends.requested = createFriendDto.requested;
    friends.status = 0;
    return await this.friendsRepository.save(friends);
  }

  private getUsersData(friend: Friends, requested: Users, requester: Users) : FriendsResponse {
	let tmp: FriendsResponse = {
		id: friend.id,
		requester: friend.requester,
		requested: friend.requested,
		status: friend.status,
		requester_user: {
			username: requester.username,
			avatar: requester.avatar,
			login42: requester.login42,
		},
		requested_user: {
			username: requested.username,
			avatar: requested.avatar,
			login42: requested.login42,
		}
	}
	return tmp;
  }

  public async findOne(id: number) {
	const friends: Friends = await this.friendsRepository.findOne({
	  where: { id: id },
	});
	const users: Users[] = await this.usersRepository.find();
	let requested: Users = users.find(user => {
		return user.id == friends.requested
	})
	let requester : Users = users.find(user => {
		return user.id == friends.requester
	})
	let ret: FriendsResponse = this.getUsersData(friends, requested, requester);
	return ret;
  }

  public async findFriendsList(id: number) {
    const friendlist: Friends[] =  await this.friendsRepository.find({
      where: [
        { requester: id, status: 1 },
        { requested: id, status: 1 },
      ],
    });
	const users: Users[] = await this.usersRepository.find();
	let ret: FriendsResponse[] = [];
	friendlist.forEach(friend => {
		let requested: Users = users.find(user => {
			return user.id == friend.requested
		})
		let requester : Users = users.find(user => {
			return user.id == friend.requester
		})
		ret.push(this.getUsersData(friend, requested, requester));
	})
	return ret;
  }

  public async findPendingFriends(id: number) {
    const pendinglist: Friends[] = await this.friendsRepository.find({
      where: { requested: id, status: 0 },
    });
	const users: Users[] = await this.usersRepository.find();
	let ret: FriendsResponse[] = [];
	pendinglist.forEach(friend => {
		let requested: Users = users.find(user => {
			return user.id == friend.requested
		})
		let requester: Users = users.find(user => {
			return user.id == friend.requester
		})
		ret.push(this.getUsersData(friend, requested, requester));
  })
  return ret;
}

  public async findPendingRequests(id: number) {
    const requestlist: Friends[] = await this.friendsRepository.find({
      where: { requester: id, status: 0 },
    });
	const users: Users[] = await this.usersRepository.find();
	let ret: FriendsResponse[] = [];
	requestlist.forEach(friend => {
		let requested: Users = users.find(user => {
			return user.id == friend.requested
		})
		let requester: Users = users.find(user => {
			return user.id == friend.requester
		})
		ret.push(this.getUsersData(friend, requested, requester));
	})
	return ret;
  }

  public async findAll() {
    const friendslist: Friends[] =  await this.friendsRepository.find();
	const users: Users[] = await this.usersRepository.find();
	let ret: FriendsResponse[] = [];
	friendslist.forEach(friend => {
		let requested: Users = users.find(user => {
			return user.id == friend.requested
		})
		let requester : Users = users.find(user => {
			return user.id == friend.requester
		})
		ret.push(this.getUsersData(friend, requested, requester));
	})
	return ret;
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
