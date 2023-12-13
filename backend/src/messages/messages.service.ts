import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { In, Not, Repository } from 'typeorm';
import { UserchatsService } from 'src/userchats/userchats.service';
import { MessagesResponse } from './dto/message.response';
import { Users } from 'src/users/entities/users.entity';
import { Chats } from 'src/chats/entities/chat.entity';
import { UsersService } from 'src/users/users.service';
import { BlockedusersService } from 'src/blockedusers/blockedusers.service';

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
	@Inject(UsersService)
	private readonly usersService: UsersService,
	@Inject(BlockedusersService)
	private readonly blockedusersService: BlockedusersService,
  ) {}

  public async create(createMessageDto: CreateMessageDto): Promise<MessagesResponse> {
    const message = new Messages();
    message.chat_id = createMessageDto.chat_id;
    message.user_id = createMessageDto.user_id;
    message.text = createMessageDto.text;
	  message.user_name = createMessageDto.user_name;
    message.created = new Date();
	const inserted: Messages = await this.messagesRepository.save(message);
	const user: Users = await this.usersRepository.findOne({ where: { id: inserted.user_id } });
    const chat: Chats = await this.chatsRepository.findOne({ where: { id: inserted.chat_id } });
	const messageResponse: MessagesResponse = {
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
	const blockedusers: number[] = await this.blockedusersService.getBlockedListByUser(current_id);
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
	return this.messagesRepository.find({ where: { chat_id: id, user_id: Not(In(blockedusers)) } });
  }

  public async findChatMessagesByChatId(id: number, user_id: number) {
	return await this.messagesRepository.find({ where: { chat_id: id } });
  }

  public async findAll(current_id: number) {
	const blockedusers: number[] = await this.blockedusersService.getBlockedListByUser(current_id);
	console.log('got blocked users:', blockedusers);
    return await this.messagesRepository.find({
		where: { user_id: Not(In(blockedusers))}
	});
  }

  public async findOne(id: number, user_id: number) {
	const blockedusers: number[] = await this.blockedusersService.getBlockedListByUser(user_id);
    return await this.messagesRepository.findOne({ where: { id: id, user_id: Not(In(blockedusers)) } });
  }

  public async update(id: number, updateMessageDto: UpdateMessageDto, user_id: number) {
	const message = await this.messagesRepository.findOne({ where: { id: id } });
	if (!message || message.user_id != user_id) {
		throw new NotFoundException(['Message not found.'], {
			cause: new Error(),
			description: `Message not found.`,
		});
	}
    return this.messagesRepository.update({ id: id }, updateMessageDto);
  }

  public async remove(id: number, user_id: number) {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
	if (!message || message.user_id != user_id) {
		throw new NotFoundException(['Message not found.'], {
			cause: new Error(),
			description: `Message not found.`,
		});
	}
    return this.messagesRepository.remove(message);
  }

  public async removeChannelMessage(message_id: number) {
	const message = await this.messagesRepository.findOne({
	  where: { id: message_id },
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
