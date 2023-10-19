import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
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

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(UserChats)
		private readonly userchatsRepository: Repository<UserChats>,
		@InjectRepository(Chats)
		private readonly chatsRepository: Repository<Chats>,
		@InjectRepository(ChatAdmins)
		private readonly chatadminsRepository: Repository<ChatAdmins>,
		@Inject(UserchatsService)
		private readonly userchatsService: UserchatsService,
	) {}

  private async isChatAdmin(chat_id: number, user_id: number) {
	const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: chat_id, user_id: user_id}})
	if (!chatAdmin)
		throw new BadRequestException(['You\'re not an admin on this chat.'], {
			cause: new Error(),
			description: `You're not an admin on this chat.`,
		});
	return true;
  }

  public async create(createChatDto: CreateChatDto) {
	if (!createChatDto.name) {
		createChatDto.name = uuidv4();
	}
	const chat = new Chats();
	chat.type = createChatDto.type;
	chat.name = createChatDto.name;
	chat.owner = createChatDto.owner;
	chat.password = createChatDto?.password;
	return await this.chatsRepository.save(chat);
}

public async findChatUsers(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.userchatsRepository.find({where: {chat_id: id}})
}

  public async findUserChats(id: number) {
	return await this.userchatsRepository.find({where: {user_id: id}})
  }

  public async addUserToChat(id: number, body) {
	const userChat: CreateUserchatDto = {
		user_id: body.user_id,
		chat_id: id,
		chat_name: body.chat_name,
		protected: body.protected,
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
	await this.isChatAdmin(id, body.user_id);
	const chatAdmin = new ChatAdmins();
	chatAdmin.user_id = body.user_id;
	chatAdmin.chat_id = id;
	return await this.chatadminsRepository.save(chatAdmin);
  }

  public async unbanUserFromChat(id: number, body) {
	await this.isChatAdmin(id, body.user_id);
	const chatAdmin = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.chatadminsRepository.remove(chatAdmin);
  }

  public async leaveChat(id: number, body) {
	const userChat = await this.userchatsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.userchatsRepository.remove(userChat);
  }

  public async muteUserInChat(id: number, body) {
	await this.isChatAdmin(id, body.user_id);
	const mutedUser = new MutedUsers();
	mutedUser.user_id = body.user_id;
	mutedUser.chat_id = id;
	return await this.chatadminsRepository.save(mutedUser);
  }

  public async unmuteUserInChat(id: number, body) {
	await this.isChatAdmin(id, body.user_id);
	const mutedUser = await this.chatadminsRepository.findOne({where: {chat_id: id, user_id: body.user_id}})
	return await this.chatadminsRepository.remove(mutedUser);
  }

  public async setAdminInChat(id: number, body) {
	await this.isChatAdmin(id, body.user_id);
	const chatAdmin = new ChatAdmins();
	chatAdmin.user_id = body.user_id;
	chatAdmin.chat_id = id;
	return await this.chatadminsRepository.save(chatAdmin);
  }

  public async unsetAdminInChat(id: number, body) {
	await this.isChatAdmin(id, body.user_id);
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
	return await this.chatadminsRepository.find({where: {chat_id: id}})
  }

  public async findChatBannedUsers(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.chatadminsRepository.find({where: {chat_id: id}})
  }

  public async update(id: number, updateChatDto: UpdateChatDto) {
	const chat: Chats = await this.chatsRepository.findOne({ where: { id: id}})
	if (!chat)
		throw new BadRequestException(['Unknown chat.'], {
			cause: new Error(),
			description: `Username already taken.`,
		});
	if (updateChatDto.type)
		chat.type = updateChatDto.type;
	if (updateChatDto.name)
		chat.name = updateChatDto.name;
	await this.chatsRepository.save(chat);
  }

  public async remove(id: number) {
	const chat = await this.chatsRepository.findOne({where: {id: id}})
	return await this.chatsRepository.remove(chat)
  }
}
