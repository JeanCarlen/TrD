import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
  ) {}

  public create(createMessageDto: CreateMessageDto) {
    const message = new Messages();
    message.chat_id = createMessageDto.chat_id;
    message.user_id = createMessageDto.user_id;
    message.text = createMessageDto.text;
    message.created = new Date();
    return this.messagesRepository.save(message);
  }

  public async findChatMessages(id: number) {
	return await this.messagesRepository.find({ where: { chat_id: id } });
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
