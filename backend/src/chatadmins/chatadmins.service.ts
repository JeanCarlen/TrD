import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatadminDto } from './dto/create-chatadmin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatAdmins } from './entities/chatadmin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatadminsService {
	constructor (
		@InjectRepository(ChatAdmins)
		private readonly chatadminsRepository: Repository<ChatAdmins>,
	) {}

  public async getChatsIdByUser(user_id: number) : Promise<number[]> {
	const chatAdmins = await this.chatadminsRepository.find({
		where: { user_id: user_id },
		select: ['id'],
	});
	const ids = chatAdmins.map((chatAdmin) => {
		return chatAdmin.chat_id;
	});
	return ids;
  }

  public async create(createChatadminDto: CreateChatadminDto) {
	const chatadmin = new ChatAdmins();
	chatadmin.user_id = createChatadminDto.user_id;
	chatadmin.chat_id = createChatadminDto.chat_id;
	this.chatadminsRepository.save(chatadmin);
  }

  public async findAll() {
	return await this.chatadminsRepository.find();
  }

  public async findOne(id: number) {
	return await this.chatadminsRepository.findOne({where: { id: id}});
  }

  public async remove(id: number) {
	const chatadmin = await this.findOne(id);
	if (!chatadmin) {
		throw new NotFoundException(['Chat admin not found.'], {
			cause: new Error(),
			description: `Chat admin not found.`,
		});
	}
	await this.chatadminsRepository.remove(chatadmin)
  }
}
