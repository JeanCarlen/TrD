import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { In, Repository, Not } from 'typeorm';
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
import { MessagesService } from 'src/messages/messages.service';
import { Messages } from 'src/messages/entities/message.entity';
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
		@Inject(MessagesService)
		private readonly messagesService: MessagesService,
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
		chat.password = this.hashPassword(createChatDto.password)
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
	if (chat.password !== null && password !== null)
	{
		console.log('returned here');
		return await bcrypt.compare(password, chat.password);
	}
	else if (chat.password === null)
	{
		console.log('returned here 2');
		return (true);
	}
	else
	{
		console.log('returned here 3');
		return (false);
	}
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
	if (!chats.includes(id) && current_id !== -1) {
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
		select: ['id', 'username', 'login42', 'avatar', 'status']
	});
	await Promise.all(users.map(async (user: UsersResponse) => {
		user.isAdmin = await this.isUserAdmin(id, user.id);
		user.isMuted = await this.isUserMuted(id, user.id);
		user.isOwner = await this.isUserOwner(id, user.id);
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
	if (foundUser === null)
		return false;
	console.log('foundUser', foundUser, 'user_id', user_id);
	return true;
  }

  //       check if user is in chat
  //       if chat owner, transfer ownership to another user
  //       if no other user, delete chat
  //       if one other admin, transfer ownership to that user
  //       if no admin, transfer ownership to first user in chat and make him admin
  public async leaveChat(id: number, body) {
	console.log('leaving chat: ', id, body);
	const userChat = await this.userchatsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	if (!userChat) {
		throw new BadRequestException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	if (chatAdmin)
		await this.chatadminsRepository.remove(chatAdmin);

	const chat = await this.chatsRepository.findOne({where: {id: id}})
	if (chat.owner == body.user_id) {
		// check for other admins in this chat
		const otherAdmin = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: Not(body.user_id)}})
		if (otherAdmin) {
			// transfer ownership to this admin
			chat.owner = otherAdmin.user_id;
			console.log('new owner as admin: ', chat.owner);
			await this.chatsRepository.save(chat);
			await this.userchatsRepository.remove(userChat);
			return ;
		} else {
			// transfer ownership to first user in chat
			const otherUser = await this.userchatsRepository.findOne({where: {chat_id: id, user_id: Not(body.user_id)}});
			if (otherUser) {
				// transfer ownership to this user
				chat.owner = otherUser.user_id;
				console.log('new owner: ', chat.owner);
				await this.chatsRepository.save(chat);
				// add this user to chatadmins
				const new_admin: ChatAdmins = new ChatAdmins();
				new_admin.chat_id = id;
				new_admin.user_id = otherUser.user_id;
				await this.chatadminsRepository.save(new_admin);
				await this.userchatsRepository.remove(userChat);
				return ;
			} else {
				this.deleteChat(id, body.user_id);
			}
		}
	}
	else
		await this.userchatsRepository.remove(userChat);
  }

  private async deleteChat(id: number, user_id: number): Promise<{ success: boolean, message: string}>{
	// Remove every USERCHATS corresponding to this chat from the database
	// Remove every MUTEDUSERS corresponding to this chat from the database
	// Remove every BANNEDUSERS corresponding to this chat from the database
	// Remove every CHATADMINS corresponding to this chat from the database
	// Remove every MESSAGE corresponding to this chat from the database
	// Remove the CHAT from the database
	const chat = await this.chatsRepository.findOne({where: {id: id}});
	if (!chat) {
		throw new NotFoundException(['Chat not found.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	}
	// Deleting all userchats
	const userchats: UserChats[] = await this.userchatsRepository.find({where: {chat_id: id}});
	await Promise.all(userchats.map(async (userchat: UserChats) => {
		await this.userchatsRepository.remove(userchat);
	}))
	// Deleting all mutedusers
	const mutedusers: MutedUsers[] = await this.mutedusersRepository.find({where: {chat_id: id}});
	await Promise.all(mutedusers.map(async (muteduser: MutedUsers) => {
		await this.mutedusersRepository.remove(muteduser);
	}))
	// Deleting all bannedusers
	const bannedusers: BannedUsers[] = await this.bannedusersRepository.find({where: {chat_id: id}});
	await Promise.all(bannedusers.map(async (banneduser: BannedUsers) => {
		await this.bannedusersRepository.remove(banneduser);
	}))
	// Deleting all chatadmins
	const chatadmins: ChatAdmins[] = await this.chatadminsRepository.find({where: {chat_id: id}});
	await Promise.all(chatadmins.map(async (chatadmin: ChatAdmins) => {
		await this.chatadminsRepository.remove(chatadmin);
	}))
	// Deleting all messages
	const messages: Messages[] = await this.messagesService.findChatMessagesByChatId(id, user_id);
	await Promise.all(messages.map(async (message: Messages) => {
		await this.messagesService.removeChannelMessage(message.id);
	}))
	// Deleting the chat
	await this.chatsRepository.remove(chat);
	return { success: true, message: 'Chat deleted.'};
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
	let banList = await this.bannedusersRepository.find({where: {chat_id: id}})
	const user_ids: number[] = banList.map((banned) => {
		return banned.user_id;
	})
	let users: UsersResponse[] =  await this.usersRepository.find({
		where: { id: In(user_ids) },
		select: ['id', 'username', 'login42', 'avatar']
	});
	return users;
  }

  private hashPassword(password: string): string {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
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
		chat.password = this.hashPassword(updateChatDto.password);
	if (updateChatDto.password == undefined)
		chat.password = null;
	console.log('updating chat to', chat);
	await this.chatsRepository.save(chat);
  }

  public async remove(id: number, user_id: number) {
	if (!this.isUserOwner(id, user_id)) {
		throw new UnauthorizedException(['You\'re not the owner of this chat.'], {
			cause: new Error(),
			description: `You're not the owner of this chat.`,
		});
	}
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id } })
	if (!chat) {
		throw new NotFoundException(['Chat not found.'], {
			cause: new Error(),
			description: `Chat not found.`,
		});
	}
	return await this.deleteChat(id, user_id);
  }
}
