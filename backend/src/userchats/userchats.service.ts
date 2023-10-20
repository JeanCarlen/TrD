import { BadRequestException, Inject, Injectable, NotFoundException, UseGuards, forwardRef } from '@nestjs/common';
import { CreateUserchatDto } from './dto/create-userchat.dto';
import { UpdateUserchatDto } from './dto/update-userchat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChats } from './entities/userchat.entity';
import { In, Repository } from 'typeorm';
import { AuthGuard } from 'src/auth.guard';
import { UserChatsResponse } from './dto/userchat.response';
import { Users } from 'src/users/entities/users.entity';
import { Chats } from 'src/chats/entities/chat.entity';

@Injectable()
@UseGuards(AuthGuard)
export class UserchatsService {
	constructor(
		@InjectRepository(UserChats)
		private readonly userchatsRepository: Repository<UserChats>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@InjectRepository(Chats)
		private readonly chatsRepository: Repository<Chats>,
	) {}
  
  public async create(createUserchatDto: CreateUserchatDto): Promise<UserChatsResponse> {
	const userChat = new UserChats();
	userChat.user_id = createUserchatDto.user_id;
	userChat.chat_id = createUserchatDto.chat_id;
    
	const user: Users = await this.usersRepository.findOne({
		where: {id: createUserchatDto.user_id}, 
		select: ['id', 'username', 'avatar', 'login42']
	});
	const chat: Chats = await this.chatsRepository.findOne({
		where: {id: createUserchatDto.chat_id}, 
		select: ['id', 'name', 'type', 'owner']
	});
	if (!user) {
		throw new BadRequestException(['Unknown user.'], {
			cause: new Error(),
			description: `User not found.`,
		});
  	}
	if (!chat) {
		throw new BadRequestException(['Unknown chat.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	}
	const inserted: UserChats = await this.userchatsRepository.save(userChat);
	const response: UserChatsResponse = {
		id: inserted.id,
		user_id: inserted.user_id,
		chat_id: inserted.chat_id,
		user: {
			username: user.username,
			avatar: user.avatar,
			login42: user.login42,
		},
		chat: {
			name: chat.name,
			type: chat.type,
			owner: chat.owner,
		},
	};
	return response;
  }

  public async findAll(): Promise<UserChatsResponse[]> {
	const userChats: UserChats[] = await this.userchatsRepository.find();
	const userIds: number[] = userChats.map((userChat) => {
		return userChat.user_id;
	});
	const chatIds: number[] = userChats.map((userChat) => {
		return userChat.chat_id;
	});
	const users: Users[] = await this.usersRepository.find({
		where: {id: In(userIds)},
		select: ['id', 'username', 'avatar', 'login42']
	});
	const chats: Chats[] = await this.chatsRepository.find({
		where: {id: In(chatIds)},
		select: ['id', 'name', 'type', 'owner']
	});
	let responses: UserChatsResponse[] = [];
	for (let i = 0; i < userChats.length; i++) {
		const userChat = userChats[i];
		const user = users.find((user) => {
			return user.id == userChat.user_id;
		});
		const chat = chats.find((chat) => {
			return chat.id == userChat.chat_id;
		});
		const response: UserChatsResponse = {
			id: userChat.id,
			user_id: userChat.user_id,
			chat_id: userChat.chat_id,
			user: {
				username: user.username,
				avatar: user.avatar,
				login42: user.login42,
			},
			chat: {
				name: chat.name,
				type: chat.type,
				owner: chat.owner,
			},
		};
		responses.push(response);
	}
	return responses;
  }

  public async findOne(id: number): Promise<UserChatsResponse> {
	const userChat: UserChats = await this.userchatsRepository.findOne({where: { id: id}})
	if (!userChat) {
		throw new NotFoundException(['Unknown userchat.'], {
			cause: new Error(),
			description: `Userchat not found.`,
		});
	}
	const user: Users = await this.usersRepository.findOne({
		where: {id: userChat.user_id}, 
		select: ['id', 'username', 'avatar', 'login42']
	});
	const chat: Chats = await this.chatsRepository.findOne({
		where: {id: userChat.chat_id}, 
		select: ['id', 'name', 'type', 'owner']
	});
	const response: UserChatsResponse = {
		id: userChat.id,
		user_id: userChat.user_id,
		chat_id: userChat.chat_id,
		user: {
			username: user.username,
			avatar: user.avatar,
			login42: user.login42,
		},
		chat: {
			name: chat.name,
			type: chat.type,
			owner: chat.owner,
		},
	};
	return response;
  }

  public async findByChatId(id: number): Promise<UserChatsResponse[]> {
	const userChats: UserChats[] = await this.userchatsRepository.find({
		where: {chat_id: id}
	});
	const userIds: number[] = userChats.map((userChat) => {
		return userChat.user_id;
	});
	const chatIds: number[] = userChats.map((userChat) => {
		return userChat.chat_id;
	});
	const users: Users[] = await this.usersRepository.find({
		where: {id: In(userIds)},
		select: ['id', 'username', 'avatar', 'login42']
	});
	const chats: Chats[] = await this.chatsRepository.find({
		where: {id: In(chatIds)},
		select: ['id', 'name', 'type', 'owner']
	});
	let responses: UserChatsResponse[] = [];
	for (let i = 0; i < userChats.length; i++) {
		const userChat = userChats[i];
		const user = users.find((user) => {
			return user.id == userChat.user_id;
		});
		const chat = chats.find((chat) => {
			return chat.id == userChat.chat_id;
		});
		const response: UserChatsResponse = {
			id: userChat.id,
			user_id: userChat.user_id,
			chat_id: userChat.chat_id,
			user: {
				username: user.username,
				avatar: user.avatar,
				login42: user.login42,
			},
			chat: {
				name: chat.name,
				type: chat.type,
				owner: chat.owner,
			},
		};
		responses.push(response);
	}
	return responses;
  }

  public async findByUserId(id: number): Promise<UserChatsResponse[]> {
	const userChats: UserChats[] = await this.userchatsRepository.find({
		where: {user_id: id}
	});
	const userIds: number[] = userChats.map((userChat) => {
		return userChat.user_id;
	});
	const chatIds: number[] = userChats.map((userChat) => {
		return userChat.chat_id;
	});
	const users: Users[] = await this.usersRepository.find({
		where: {id: In(userIds)},
		select: ['id', 'username', 'avatar', 'login42']
	});
	const chats: Chats[] = await this.chatsRepository.find({
		where: {id: In(chatIds)},
		select: ['id', 'name', 'type', 'owner']
	});
	let responses: UserChatsResponse[] = [];
	for (let i = 0; i < userChats.length; i++) {
		const userChat = userChats[i];
		const user = users.find((user) => {
			return user.id == userChat.user_id;
		});
		const chat = chats.find((chat) => {
			return chat.id == userChat.chat_id;
		});
		const response: UserChatsResponse = {
			id: userChat.id,
			user_id: userChat.user_id,
			chat_id: userChat.chat_id,
			user: {
				username: user.username,
				avatar: user.avatar,
				login42: user.login42,
			},
			chat: {
				name: chat.name,
				type: chat.type,
				owner: chat.owner,
			},
		};
		responses.push(response);
	}
	return responses;
  }

  public async getChatIdListByUser(id: number): Promise<number[]> {
	const userChats = await this.userchatsRepository.find({where: { user_id: id}})
	const chatIds = userChats.map((userChat) => {
		return userChat.chat_id;
	});
	return chatIds;
  }

  public async areInOneToOneChat(id1: number, id2: number): Promise<[boolean, number]> {
	const userChats = await this.userchatsRepository.find({where: { user_id: id1}})
	for (let i = 0; i < userChats.length; i++) {
		const userChat = userChats[i];
		const userChats2 = await this.userchatsRepository.find({where: { chat_id: userChat.chat_id}})
		for (let j = 0; j < userChats2.length; j++) {
			const userChat2 = userChats2[j];
			if (userChat2.user_id == id2) {
				return [true, userChat.chat_id];
			}
		}
	}
	return [false, -1];
  }

  public async update(id: number, updateUserchatDto: UpdateUserchatDto) {
	const userChat: UserChats = await this.userchatsRepository.findOne({ where: { id: id}})
	if (!userChat)
		throw new NotFoundException(['Unknown userchat.'], {
			cause: new Error(),
			description: `Userchat not found.`,
		});
	userChat.user_id = updateUserchatDto.user_id;
	userChat.chat_id = updateUserchatDto.chat_id;
	await this.userchatsRepository.save(userChat);
  }

  public async remove(id: number) {
	const userChat = await this.userchatsRepository.findOne({where: {id: id}})
	return await this.userchatsRepository.remove(userChat)
  }
}
