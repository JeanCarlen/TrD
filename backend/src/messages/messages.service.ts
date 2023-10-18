import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { In, Repository } from 'typeorm';
import { UserchatsService } from 'src/userchats/userchats.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
	@Inject(UserchatsService)
	private readonly userchatsService: UserchatsService,
	@Inject(UsersService)
	private readonly usersService: UsersService,
  ) {}

  public create(createMessageDto: CreateMessageDto) {
    const message = new Messages();
    message.chat_id = createMessageDto.chat_id;
    message.user_id = createMessageDto.user_id;
    message.text = createMessageDto.text;
	  message.user_name = createMessageDto.user_name;
    message.created = new Date();
    return this.messagesRepository.save(message);
  }

  public async findChatMessages(id: number, current_id: number) {
	const chats = await this.userchatsService.getChatIdListByUser(current_id);
	if (!chats.includes(id)) {
		throw new UnauthorizedException(['You\'re not in this chat.'], {
			cause: new Error(),
			description: `You're not in this chat.`,
		});
	}
  // let complete = incomplete.map(async (message)=>{
  //   let user = await this.usersService.findOneUser(message.user_id);
  //   return {
  //     id: message.id,
  //     chat_id: message.chat_id,
  //     user_id: message.user_id,
  //     text: message.text,
  //     user_name: user.username,
  //     created: message.created,
  //   }
  // })
	return this.messagesRepository.find({ where: { chat_id: id } });
  }

  public findAll() {
    return this.messagesRepository.find();
  }

  public findOne(id: number) {
    return this.messagesRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.messagesRepository.update({ id: id }, updateMessageDto);
  }

  public async remove(id: number) {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    return this.messagesRepository.remove(message);
  }
}
