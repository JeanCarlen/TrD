import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { CreateUserchatDto } from 'src/userchats/dto/create-userchat.dto';
import { UserChats } from 'src/userchats/entities/userchat.entity';
import { ChatAdmins } from 'src/chatadmins/entities/chatadmin.entity';
import { MutedUsers } from 'src/mutedusers/entities/muteduser.entity';
import { UserchatsService } from 'src/userchats/userchats.service';
import { UsersResponse } from 'src/users/dto/users.response';
import { Users } from 'src/users/entities/users.entity';
import { UserChatsResponse } from 'src/userchats/dto/userchat.response';
import { ChatsResponse } from './dto/chats.response';
import { BannedUsers } from 'src/bannedusers/entities/banneduser.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(UserChats)
		private readonly userchatsRepository: Repository<UserChats>,
		@InjectRepository(MutedUsers)
		private readonly mutedusersRepository: Repository<MutedUsers>,
		@InjectRepository(BannedUsers)
		private readonly bannedusersRepository: Repository<BannedUsers>,
		@InjectRepository(Chats)
		private readonly chatsRepository: Repository<Chats>,
		@InjectRepository(ChatAdmins)
		private readonly chatadminsRepository: Repository<ChatAdmins>,
		@InjectRepository(Users)
		private readonly usersRepository: Repository<Users>,
		@Inject(UserchatsService)
		private readonly userchatsService: UserchatsService,
	) {}

	private async isUserAdmin(chat_id: number, user_id: number) {
		const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: chat_id, user_id: user_id}})
		if (!chatAdmin)
			return false;
		return true;
	}

  private async isChatAdmin(chat_id: number, user_id: number) {
	const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: chat_id, user_id: user_id}})
	if (!chatAdmin)
		throw new BadRequestException(['You\'re not an admin on this chat.'], {
			cause: new Error(),
			description: `You're not an admin on this chat.`,
		});
	return true;
  }

  public async create(createChatDto: CreateChatDto): Promise<ChatsResponse> {
	if (!createChatDto.name) {
		createChatDto.name = uuidv4();
	}
	const chat = new Chats();
	chat.type = createChatDto.type;
	chat.name = createChatDto.name;
	chat.owner = createChatDto.owner;
	if (createChatDto.password){
		chat.password = await bcrypt.hash(createChatDto.password, 10);
		chat.protected = true;
	}
	else {
		chat.password = null;
		chat.protected = false;
	}

	const inserted_chat: Chats = await this.chatsRepository.save(chat);
	const inserted: UserChatsResponse = await this.userchatsService.create({chat_id: inserted_chat.id, user_id: chat.owner});
	if (!inserted.chat_id || inserted.chat_id != inserted_chat.id) {
		throw new InternalServerErrorException(['Error creating chat.'], {
			cause: new Error(),
			description: `Error creating chat.`,
		});
	}
	const response: ChatsResponse = {
		id: inserted_chat.id,
		type: inserted_chat.type,
		name: inserted_chat.name,
		owner: inserted_chat.owner,
		total_count: 1,
	}
    return response;
  }

  public async isProtected(id: number): Promise<boolean> {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id}})
	if (!chat) {
		throw new NotFoundException(['Unknown chat.'], {
			cause: new Error(),
			description: `Unknown chat.`,
		});
	}
	return chat.protected;
  }

  public async isPasswordValid(id: number, password: string): Promise<boolean> {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id}})
	if (!chat) {
		throw new NotFoundException(['Unknown chat.'], {
			cause: new Error(),
			description: `Unknown chat.`,
		});
	}
	return await bcrypt.compare(password, chat.password);
  }

  public async isUserOwner(chat_id: number, user_id: number): Promise<boolean> {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: chat_id}})
	if (!chat) {
		throw new NotFoundException(['Unknown chat.'], {
			cause: new Error(),
			description: `Unknown chat.`,
		});
	}
	if (chat.owner != user_id)
		return false;
	return true;
  }

  public async findChatUsers(id: number, current_id: number): Promise<UsersResponse[]> {
	let userRet: UsersResponse[] = [];
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	const userschats: UserChats[] = await this.userchatsRepository.find({where: {chat_id: id}});
	const user_ids: number[] = userschats.map((userchat) => {
		return userchat.user_id;
	})

	let users: UsersResponse[] =  await this.usersRepository.find({
		where: { id: In(user_ids) },
		select: ['id', 'username', 'login42', 'avatar']
	});
	await Promise.all(users.map(async (user: UsersResponse) => {
		// const userAdmin = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: user.id}});
		// const userMuted = await this.mutedusersRepository.findOne({where: {chat_id: id, user_id: user.id}});
		user.isAdmin = await this.isUserAdmin(id, user.id);
		user.isMuted = await this.isUserMuted(id, user.id);
		user.isOwner = await this.isUserOwner(id, user.id);
		// if (userAdmin === null)
		// 	user.isAdmin = false;
		// else
		// 	user.isAdmin = true;
		// if (userMuted === null)
		// 	user.isMuted = false;
		// else
		// 	user.isMuted = true;
		userRet.push(user);
	}))
	return userRet;
  }

  public async findUserChats(id: number) {
	return await this.userchatsRepository.find({where: {user_id: id}})
  }

  public async isUserInChat(chat_id: number, user_id: number) {
	let foundUser = await this.userchatsRepository.findOne({where: {user_id: user_id, chat_id: chat_id}});
	if (!foundUser)
		throw new BadRequestException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	return true;
  }

  public async addUserToChat(id: number, body) {
	const userChat: CreateUserchatDto = {
		user_id: body.user_id,
		chat_id: id,
	}

	return await this.userchatsRepository.save(userChat)
  }

  public async findAll(current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	return await this.chatsRepository.find({
		where: { id: In(chats)}
	});
  }

  public async findAllFromSocket() {
	return await this.chatsRepository.find();
  }

  public async findOne(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new NotFoundException(['Chat not found.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	}
	return await this.chatsRepository.findOne({where: { id: id}})
  }

  public async findName(name: string) {
	return await this.chatsRepository.findOne({where: { name: name}})
  }

  public async banUserFromChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const newBan = new BannedUsers();
	newBan.user_id = body.user_id;
	newBan.chat_id = id;
	newBan.until = new Date();
	return await this.bannedusersRepository.save(newBan);
  }

  public async unbanUserFromChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const newUnban = await this.bannedusersRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.bannedusersRepository.remove(newUnban);
  }

  public async isUserBanned(chat_id: number, user_id: number) {
	let foundUser = await this.bannedusersRepository.findOne({where: {user_id: user_id, chat_id: chat_id}});
	if (!foundUser)
		return false;
	return true;
  }

  public async leaveChat(id: number, body) {
	const userChat = await this.userchatsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.userchatsRepository.remove(userChat);
  }

  public async muteUserInChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const mutedUser = new MutedUsers();
	mutedUser.user_id = body.user_id;
	mutedUser.chat_id = id;
	mutedUser.until = new Date();
	return await this.mutedusersRepository.save(mutedUser);
  }

  public async unmuteUserInChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const mutedUser = await this.mutedusersRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.mutedusersRepository.remove(mutedUser);
  }

  public async isUserMuted(chat_id: number, user_id: number) {
	let foundUser = await this.mutedusersRepository.findOne({where: {user_id: user_id, chat_id: chat_id}});
	if (!foundUser)
		return false;
	return true;
  }

  public async setAdminInChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const chatAdmin = new ChatAdmins();
	chatAdmin.user_id = body.user_id;
	chatAdmin.chat_id = id;
	return await this.chatadminsRepository.save(chatAdmin);
  }

  public async unsetAdminInChat(id: number, body) {
	await this.isChatAdmin(id, body.requester);
	const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.chatadminsRepository.remove(chatAdmin);
  }

  public async findChatAdmins(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.chatadminsRepository.find({where: {chat_id: id}})
  }

  public async findChatMutedUsers(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.mutedusersRepository.find({where: {chat_id: id}})
  }

  public async findChatBannedUsers(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.bannedusersRepository.find({where: {chat_id: id}})
  }

  public async update(id: number, updateChatDto: UpdateChatDto) {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id}})
	if (!chat)
		throw new NotFoundException(['Unknown chat.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	if (updateChatDto.type)
		chat.type = updateChatDto.type;
	if (updateChatDto.name)
		chat.name = updateChatDto.name;
	if (updateChatDto.password)
		chat.password = updateChatDto.password;
	if (updateChatDto.password == undefined)
		chat.password = null;
	console.log('updating chat to', chat);
	await this.chatsRepository.save(chat);
  }

  public async remove(id: number) {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id } })
	if (!chat) {
		throw new NotFoundException(['Chat not found.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	}
	return await this.chatsRepository.remove(chat)
  }
}
