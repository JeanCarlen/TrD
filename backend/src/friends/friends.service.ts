import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { FriendsResponse } from './dto/friends.response';
import { BlockedusersService } from 'src/blockedusers/blockedusers.service';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private readonly friendsRepository: Repository<Friends>,
	@InjectRepository(Users)
	private readonly usersRepository: Repository<Users>,
	@Inject(BlockedusersService)
	private readonly blockedusersService: BlockedusersService,
  ) {}

  public async create(createFriendDto: CreateFriendDto) {
	if (createFriendDto.requester == createFriendDto.requested) {
		throw new BadRequestException(['Cannot add yourself as a friend.'], {
			cause: new Error(),
			description: `Cannot add yourself as a friend.`,
		});
	}
	  const found = await this.friendsRepository.find({
		  where: [
			  { requester: createFriendDto.requester, requested: createFriendDto.requested },
			  { requester: createFriendDto.requested, requested: createFriendDto.requester },
		  ],
		});
	if (found.length > 0) {
		throw new ConflictException(['Friend request already exists.'], {
			cause: new Error(),
			description: `Friend request already exists.`,
		});
	}
    const friends: Friends = new Friends();
    friends.requester = createFriendDto.requester;
    friends.requested = createFriendDto.requested;
    friends.status = 0;
    return await this.friendsRepository.save(friends);
  }

  public async addFriendById(id: number, current_id: number) {
	const blockedusers = await this.blockedusersService.getBlockedListByUser(current_id);
	if (blockedusers.includes(id)) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
    })
  }
	if (id == current_id) {
		throw new BadRequestException(['Cannot add yourself as a friend.'], {
			cause: new Error(),
			description: `Cannot add yourself as a friend.`,
		});
	}
	const found = await this.friendsRepository.find({
		where: [
			{ requester: current_id, requested: id },
			{ requester: id, requested: current_id },
		],
	  });
	if (found.length > 0) {
		throw new ConflictException(['Friend request already exists.'], {
			cause: new Error(),
			description: `Friend request already exists.`,
		});
	}
	const friends: Friends = new Friends();
	friends.requester = current_id;
	friends.requested = id;
	friends.status = 0;
	return await this.friendsRepository.save(friends);
  }

  public async addFriendByUsername(username: string, current_id: number) {
	if (username == undefined) {
		throw new BadRequestException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
		});
	}
	const found = await this.usersRepository.find({
		where: { username: username },
	  });
	if (found.length == 0) {
		throw new BadRequestException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
		});
	}
	const blockedusers = await this.blockedusersService.getBlockedListByUser(current_id);
	if (blockedusers.includes(found[0].id)) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
    })
  }
	if (found[0].id == current_id) {
		throw new BadRequestException(['Cannot add yourself as a friend.'], {
			cause: new Error(),
			description: `Cannot add yourself as a friend.`,
		});
	}
	const found2 = await this.friendsRepository.find({
		where: [
			{ requester: current_id, requested: found[0].id },
			{ requester: found[0].id, requested: current_id },
		],
	  });
	if (found2.length > 0) {
		throw new ConflictException(['Friend request already exists.'], {
			cause: new Error(),
			description: `Friend request already exists.`,
		});
	}
	const friends: Friends = new Friends();
	friends.requester = current_id;
	friends.requested = found[0].id;
	friends.status = 0;
	return await this.friendsRepository.save(friends);
  }

  public async areFriends(id1: number, id2: number): Promise<[boolean, number]> {
	const found = await this.friendsRepository.find({
		where: [
			{ requester: id1, requested: id2, status: 1 },
			{ requester: id2, requested: id1, status: 1 },
		],
	  });
	if (found.length == 0) {
		return [false, -1];
	}
	return [true, found[0].id];
  }

  private getUsersData(friend: Friends, requested: Users, requester: Users, count?: number) : FriendsResponse {
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
		},
		total_count: count
	}
	return tmp;
  }

  public async findOne(id: number, user_id: number) {
	const friends: Friends = await this.friendsRepository.findOne({
	  where: { id: id },
	});
	if (friends == undefined) {
		throw new NotFoundException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friends.requester != user_id && friends.requested != user_id) {
		throw new BadRequestException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
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

  public async findAllByUser(id: number) {
	const friendList: Friends[] =  await this.friendsRepository.find({
		where: [
			{ requester: id},
			{ requested: id},
		],
	});
	const users: Users[] = await this.usersRepository.find();
	let ret: FriendsResponse[] = [];
	friendList.forEach(friend => {
		let requested: Users = users.find(user => {
			return user.id == friend.requested
		})
		let requester : Users = users.find(user => {
			return user.id == friend.requester
		})
		ret.push(this.getUsersData(friend, requested, requester, friendList.length));
	})
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
		ret.push(this.getUsersData(friend, requested, requester, friendlist.length));
	})
	return ret;
  }

  public async findFriendsListByUsername(username: string) {
	const found = await this.usersRepository.find({
		where: { username: username },
	  });
	if (found.length == 0) {
		throw new BadRequestException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
		});
	}
	return this.findFriendsList(found[0].id);
	}

  public async findFriendsCount(id: number) {
	const friendlist: Friends[] =  await this.friendsRepository.find({
	  where: [
		{ requester: id, status: 1 },
		{ requested: id, status: 1 },
	  ],
	});
	return friendlist.length;
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
		ret.push(this.getUsersData(friend, requested, requester, pendinglist.length));
  })
  return ret;
}

public async findPendingFriendsByUsername(username: string) {
	const found = await this.usersRepository.find({
		where: { username: username },
	  });
	if (found.length == 0) {
		throw new BadRequestException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
		});
	}
	return this.findPendingFriends(found[0].id);
}

  public async findPendingCount(id: number) {
	const pendinglist: Friends[] = await this.friendsRepository.find({
	  where: { requested: id, status: 0 },
	});
	return pendinglist.length;
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
		ret.push(this.getUsersData(friend, requested, requester, requestlist.length));
	})
	return ret;
  }

  public async findPendingRequestsByUsername(username: string) {
	const found = await this.usersRepository.find({
		where: { username: username },
	  });
	if (found.length == 0) {
		throw new BadRequestException(['User not found.'], {
			cause: new Error(),
			description: `User not found.`,
		});
	}
	return this.findPendingRequests(found[0].id);
}

  public async findRequestsCount(id: number) {
	const requestlist: Friends[] = await this.friendsRepository.find({
	  where: { requester: id, status: 0 },
	});
	return requestlist.length;
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
    const friend: Friends = await this.friendsRepository.findOne({
      where: { id: id },
    });
	if (!friend) {
		throw new NotFoundException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
    return await this.friendsRepository.update({id: id}, updateFriendDto);
  }

  public async delete(id: number) {
	const friend: Friends = await this.friendsRepository.findOne({
	  where: { id: id },
	});
	return await this.friendsRepository.remove(friend);
  }

  public async remove(id: number, user_id: number) {
    const friend: Friends = await this.friendsRepository.findOne({
      where: { id: id },
    });
	if (friend == undefined) {
		throw new NotFoundException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friend.requester != user_id && friend.requested != user_id) {
		throw new BadRequestException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
    return await this.friendsRepository.remove(friend);
  }

  public async cancel(id: number, user_id: number) {
	const friend: Friends = await this.friendsRepository.findOne({
	  where: { id: id },
	});
	if (friend == undefined) {
		throw new NotFoundException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friend.requester != user_id) {
		throw new BadRequestException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friend.status != 0) {
		throw new BadRequestException(['Friend request already accepted.'], {
			cause: new Error(),
			description: `Friend request already accepted.`,
		});
	}
	return await this.friendsRepository.remove(friend);
  }

  public async reject(id: number, user_id: number) {
	const friend: Friends = await this.friendsRepository.findOne({
	  where: { id: id },
	});
	if (friend == undefined) {
		throw new NotFoundException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friend.requested != user_id) {
		throw new BadRequestException(['Friend request not found.'], {
			cause: new Error(),
			description: `Friend request not found.`,
		});
	}
	if (friend.status != 0) {
		throw new BadRequestException(['Friend request already accepted.'], {
			cause: new Error(),
			description: `Friend request already accepted.`,
		});
	}
	return await this.friendsRepository.remove(friend);
  }
}
