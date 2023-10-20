import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not, In, And, Equal } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from './entities/users.entity';
import { Create42UserDto } from './dto/create-42-user.dto';
import { UserchatsService } from 'src/userchats/userchats.service';
import { FriendsService } from 'src/friends/friends.service';
import { UsersResponse } from './dto/users.response';
import { FriendsResponse } from '../friends/dto/friends.response';
import { BlockedusersService } from 'src/blockedusers/blockedusers.service';
import { BlockedUsers } from 'src/blockedusers/entities/blockeduser.entity';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
	@Inject(UserchatsService)
	private readonly userchatsService: UserchatsService,
	@Inject(FriendsService)
	private readonly friendsService: FriendsService,
	@Inject(BlockedusersService)
	private readonly blockedusersService: BlockedusersService,
) {}

  public getJWT(
    user:
      | { id: string; username: string; avatar: string; login42: string }
      | Users,
	  twoFaCodeReq: boolean,
	  twoFaEnabled?: boolean,
  ): string {
    let payload;
    if (twoFaEnabled) {
      payload = {
        user: user.id,
        username: user.username,
        avatar: user.avatar,
        login42: user.login42 || null,
        twofaenabled: true,
		twofacodereq: twoFaCodeReq || false,
      };
    } else {
      payload = {
        user: user.id,
        username: user.username,
        avatar: user.avatar,
        login42: user.login42 || null,
		twofaenabled: false,
		twofacodereq: false
      };
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  private async updatePassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string[]; token: string }> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
        user.password = this.hashPassword(updateUserDto.password);
        await this.usersRepository.save(user);
        return { message: ['Password changed.'], token: this.getJWT(user, user.twofaenabled) };
  }

  private async updateUsername(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string[]; token: string }> {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    const found: Users | null = await this.usersRepository.findOne({
      where: { username: updateUserDto.username },
    });
    if (found)
      throw new BadRequestException(['Username already taken.'], {
        cause: new Error(),
        description: `Username already taken.`,
      });
    user.username = updateUserDto.username;
	  await this.usersRepository.save(user);
    return { message: [''], token: this.getJWT(user, user.twofaenabled) };
  }

  private async localLogin(
    loginUserDto: LoginUserDto,
    user: Users,
  ): Promise<{ message: string[]; token: string }> {
    const match = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!match)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });

    return { message: ['Successfully logged in.'], token: this.getJWT(user, false, false) };
  }

  private async login2FA(loginUserDto: LoginUserDto, user: Users) {
    const match = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!match)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });
    return {
      message: ['Two Factor Code needed.'],
      token: this.getJWT(user, true, true),
    };
  }

  public async login(loginUserDto: LoginUserDto) {
    const user: Users = await this.usersRepository.findOne({
      where: { username: loginUserDto.username },
    });
    if (!user)
      throw new BadRequestException(['Unknown username or password.'], {
        cause: new Error(),
        description: `Unknown username or password.`,
      });
    if (user.twofaenabled) return await this.login2FA(loginUserDto, user);
    return await this.localLogin(loginUserDto, user);
  }

  public async create(createUserDto: CreateUserDto) {
    const user: Users = new Users();
    user.username = createUserDto.username;
    user.avatar = process.env.HOST + 'images/default.png';
    user.twofaenabled = false;

    // check if username is already taken
    const found = await this.findByUsername(user.username);
    if (found.length > 0)
      throw new BadRequestException(['Username already taken.'], {
        cause: new Error(),
        description: `Username ${user.username} already taken.`,
      });

    if (createUserDto.password != createUserDto.confirm_password)
      throw new BadRequestException(["Passwords don't match."], {
        cause: new Error(),
        description: `password and confirm_password don't match.`,
      });

    user.password = this.hashPassword(createUserDto.password);
    const token = this.getJWT(await this.usersRepository.save(user), false);
    return { message: ['Successfully registered.'], token: token };
  }

  public async create42User(create42User: Create42UserDto) {
    // no need to check for uniqueness here, already done in auth.service.ts

    const user: Users = new Users();
    user.username = create42User.username;
    user.avatar = create42User.avatar;
    user.twofaenabled = false;
    user.login42 = create42User.login42;
    user.is42 = true;

    const token = this.getJWT(await this.usersRepository.save(user), false);
    return { message: ['Successfully registered.'], token: token };
  }

  public async findAll(current_id: number): Promise<UsersResponse[]> {
	const blocked: number[] = await this.blockedusersService.getBlockedListByUser(current_id);
    return await this.usersRepository.find({
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
	  where: { id: Not(In(blocked)) }
    });
  }

  public async findOne(id: number): Promise<UsersResponse> {
    const blocked: number[] = await this.blockedusersService.getBlockedListByUser(id);
	if (blocked.includes(id)) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: 'User not found.'
		})
	}
	const user: Users = await this.usersRepository.findOne({
		where: { id: id },
		select: ['id', 'username', 'login42', 'avatar', 'twofaenabled']
	})

	const friends: FriendsResponse[] = await this.friendsService.findAllByUser(user.id);
	const pending: FriendsResponse[] = friends.filter(friend => {
		return friend.status == 0 && friend.requested == user.id
	})
	const requests: FriendsResponse[] = friends.filter(friend => {
		return friend.status == 0 && friend.requester == user.id
	})
	const active: FriendsResponse[] = friends.filter(friend => {
		return friend.status == 1 && (friend.requested == user.id || friend.requester == user.id)
	})

	const ret: UsersResponse = {
		...user,
		active_friends: active.length,
		pending_requests: pending.length,
		requests_sent: requests.length
	}
	return ret;
  }

  public async findOneUser(id: number): Promise<Users> {
	return await this.usersRepository.findOne({
		where: { id: id }
	})
  }

  public async findUserChats(id: number) {
	return await this.userchatsService.findByUserId(id);
  }

  public findTwoFaSecret(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
      select: ['twofasecret'],
    });
  }

  public async findByUsername(name: string, current_id?: number) {
	let blocked: number[];
	let users: Users[]
	if (current_id) {
		blocked = await this.blockedusersService.getBlockedListByUser(current_id);
		users = await this.usersRepository.find({
			where: { username: ILike(`%${name}%`), id: Not(In(blocked)) },
			select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
		});
	} else {
		users = await this.usersRepository.find({
		  where: { username: ILike(`%${name}%`) },
		  select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
		});
	}
	if (users.length > 0) {
		const friends: FriendsResponse[] = await this.friendsService.findAllByUser(users[0].id);
		const ret: UsersResponse[] = [];
		users.forEach((user) => {
			if (blocked && blocked.includes(user.id))
				return ; // basically the same thing as doing continue in a for loop
			let tmp: UsersResponse;
			const pending: FriendsResponse[] = friends.filter(friend => {
				return friend.status == 0 && friend.requested == user.id
			})
			const requests: FriendsResponse[] = friends.filter(friend => {
				return friend.status == 0 && friend.requester == user.id
			})
			const active: FriendsResponse[] = friends.filter(friend => {
				return friend.status == 1 && (friend.requested == user.id || friend.requester == user.id)
			})
			tmp = {
				...user,
				active_friends: active.length,
				pending_requests: pending.length,
				requests_sent: requests.length
			}
			ret.push(tmp)
			return ret;
		})
	}
	return users;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
	const user: Users = await this.usersRepository.findOne({where: {id: id}});
	if (!user) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: 'User not found.'
		})
	}
	if (updateUserDto.username) return this.updateUsername(id, updateUserDto);
    else if (updateUserDto.password || updateUserDto.confirm_password)
      return this.updatePassword(id, updateUserDto);
    throw new BadRequestException(['Unable to update'], {
      cause: new Error(),
      description: 'Unable to update user.',
    });
  }

  public find42User(username: string) {
    return this.usersRepository.find({
      where: { login42: username },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
  }

  public async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
	if (!user) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: 'User not found.'
		})
	}
    return this.usersRepository.remove(user);
  }

  public async updateUserImage(id: number, imageName: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'login42', 'avatar', 'twofaenabled'],
    });
	if (!user) {
		throw new NotFoundException(['User not found.'], {
			cause: new Error(),
			description: 'User not found.'
		})
	}
    if (!user.avatar.includes('default')) {
      const image = user.avatar.replace(process.env.HOST + 'images/', '');
      fs.unlinkSync('/app/uploads/' + image);
    }

    user.avatar = process.env.HOST + 'images/' + imageName;
    const inserted = await this.usersRepository.save(user);
    const token = this.getJWT(inserted, false);
    return { message: ['Avatar successfully saved.'], token: token };
  }

  public async blockUser(blocked_id: number, blocker_id: number) {

	if (blocker_id == blocked_id) {
		throw new BadRequestException(['You cannot block yourself.'], {
			cause: new Error(),
			description: 'You cannot block yourself.'
		})
	}
	const blocked: BlockedUsers = await this.blockedusersService.findOneByUsers(blocked_id, blocker_id);
	if (blocked) {
		throw new BadRequestException(['You already blocked this user.'], {
			cause: new Error(),
			description: 'You already blocked this user.'
		})
	}
	const [fb, fid] = await this.friendsService.areFriends(blocker_id, blocked_id);
	if (fb)
		await this.friendsService.delete(fid);
	const [cb, cid] = await this.userchatsService.areInOneToOneChat(blocker_id, blocked_id);
	if (cb)
		await this.userchatsService.remove(cid);

	const blockedUser = new BlockedUsers();
	blockedUser.blockeduser_id = blocked_id;
	blockedUser.blockinguser_id = blocker_id;
	return await this.blockedusersService.create(blockedUser);
  }

  public async blockedUsersList(blocker_id: number) {
	const blocked: BlockedUsers[] = await this.blockedusersService.findAllWhereBlockerIs(blocker_id);
	const ret: UsersResponse[] = [];
	for (const block of blocked) {
		if (block.blockinguser_id == blocker_id) {
			const user: UsersResponse = await this.findOne(block.blockeduser_id);
			ret.push(user);
		}
	}
	return ret;
  }

  public async unblockUser(blocked_id: number, blocker_id: number) {
	const blocked: BlockedUsers = await this.blockedusersService.findOneByUsers(blocked_id, blocker_id);
	if (!blocked) {
		throw new BadRequestException(['You did not block this user.'], {
			cause: new Error(),
			description: 'You did not block this user.'
		})
	}
	if (blocked.blockinguser_id != blocker_id) {
		throw new BadRequestException(['You did not block this user.'], {
			cause: new Error(),
			description: 'You did not block this user.'
		})
	}
	return await this.blockedusersService.remove(blocked.id);
  }

  public async set2FASecret(id: number, secret: string) {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    user.twofasecret = secret.trim();
    return this.usersRepository.update({ id: id }, user);
  }

  public async turnOn2FA(id: number) {
    const user: Users = await this.usersRepository.findOne({
      where: { id: id },
    });
    user.twofaenabled = true;
    await this.usersRepository.save(user);
    return {
      message: ['Two factor authentication successfully turned on.'],
      token: this.getJWT(user, false),
    };
  }

  public async turnOff2FA(id: number) {
	const user: Users = await this.usersRepository.findOne({
		where: { id: id }
	})
	user.twofaenabled = false;
	user.twofasecret = '';
	await this.usersRepository.save(user);
	return {
		message: ['Two factor authentication successfully turned off.'],
		token: this.getJWT(user, false, false)
	}
  }
}
