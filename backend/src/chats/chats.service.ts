import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateUserchatDto } from 'src/userchats/dto/create-userchat.dto';
import { UserChats } from 'src/userchats/entities/userchat.entity';

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(UserChats)
		private readonly userchatsRepository: Repository<UserChats>,
		@InjectRepository(Chats)
		private readonly chatsRepository: Repository<Chats>,
	) {}

  public async create(createChatDto: CreateChatDto) {
	if (!createChatDto.name) {
		createChatDto.name = uuidv4();
	}
	const chat = new Chats();
	chat.type = createChatDto.type;
	chat.name = createChatDto.name;
    return await this.chatsRepository.save(chat);
  }

  public async findChatUsers(id: number) {
	return await this.userchatsRepository.find({where: {chat_id: id}})
  }

  public async findUserChats(id: number) {
	return await this.userchatsRepository.find({where: {user_id: id}})
  }

  public async addUserToChat(id: number, body) {
	const userChat: CreateUserchatDto = {
		user_id: body.user_id,
		chat_id: id,
	}

	return await this.userchatsRepository.save(userChat)
  }

  public async findAll() {
	return await this.chatsRepository.find();
  }

  public async findOne(id: number) {
	return await this.chatsRepository.findOne({where: { id: id}})
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
