import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { Repository } from 'typeorm';
import { UserchatsService } from 'src/userchats/userchats.service';
import { MessagesResopnse } from './dto/message.response';
import { Users } from 'src/users/entities/users.entity';
import { Chats } from 'src/chats/entities/chat.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
	@InjectRepository(Users)
	private readonly usersRepository: Repository<Users>,
	@InjectRepository(Chats)
	private readonly chatsRepository: Repository<Chats>,
	@Inject(UserchatsService)
	private readonly userchatsService: UserchatsService,
  ) {}

  public async create(createMessageDto: CreateMessageDto): Promise<MessagesResopnse> {
    const message = new Messages();
    message.chat_id = createMessageDto.chat_id;
    message.user_id = createMessageDto.user_id;
    message.text = createMessageDto.text;
    message.created = new Date();
	const inserted: Messages = await this.messagesRepository.save(message);
	const user: Users = await this.usersRepository.findOne({ where: { id: inserted.user_id } });
    const chat: Chats = await this.chatsRepository.findOne({ where: { id: inserted.chat_id } });
	const messageResponse: MessagesResopnse = {
		id: inserted.id,
		user_id: inserted.user_id,
		user_data: {
			username: user.username,
			avatar: user.avatar,
			login42: user.login42
		},
		chat_id: inserted.chat_id,
		chat_data: {
			name: chat.name,
			type: chat.type,
			owner: chat.owner,
		},
		text: inserted.text,
		created: inserted.created,
	}
	return messageResponse;
  }

  public async findChatMessages(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return await this.messagesRepository.find({ where: { chat_id: id } });
  }

  public async findAll() {
    return await this.messagesRepository.find();
  }

  public async findOne(id: number) {
    return await this.messagesRepository.findOne({ where: { id: id } });
  }

  public async update(id: number, updateMessageDto: UpdateMessageDto) {
	const message = await this.messagesRepository.findOne({ where: { id: id } });
	if (!message) {
		throw new NotFoundException(['Message not found.'], {
			cause: new Error(),
			description: `Message not found.`,
		});
	}
    return this.messagesRepository.update({ id: id }, updateMessageDto);
  }

  public async remove(id: number) {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
	if (!message) {
		throw new NotFoundException(['Message not found.'], {
			cause: new Error(),
			description: `Message not found.`,
		});
	}
    return this.messagesRepository.remove(message);
  }
}
