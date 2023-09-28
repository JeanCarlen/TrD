import { Injectable } from '@nestjs/common';
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

  public async create(createChatadminDto: CreateChatadminDto) {
	const chatadmin = new ChatAdmins();
	chatadmin.user_id = createChatadminDto.user_id;
	chatadmin.chat_id = createChatadminDto.chat_id;
	this.chatadminsRepository.save(ChatAdmins);
  }

  public async findAll() {
	return await this.chatadminsRepository.find();
  }

  public async findOne(id: number) {
	return await this.chatadminsRepository.findOne({where: { id: id}});
  }

  public async remove(id: number) {
	const chatadmin = await this.findOne(id);
	await this.chatadminsRepository.remove(chatadmin)
  }
}