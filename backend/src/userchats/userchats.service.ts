import { BadRequestException, Inject, Injectable, UseGuards, forwardRef } from '@nestjs/common';
import { CreateUserchatDto } from './dto/create-userchat.dto';
import { UpdateUserchatDto } from './dto/update-userchat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChats } from './entities/userchat.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth.guard';
import { UsersService } from 'src/users/users.service';

@Injectable()
@UseGuards(AuthGuard)
export class UserchatsService {
	constructor(
		@InjectRepository(UserChats)
		private readonly userchatsRepository: Repository<UserChats>,
	) {}
  
  public async create(createUserchatDto: CreateUserchatDto) {
	const userChat = new UserChats();
	userChat.user_id = createUserchatDto.user_id;
	userChat.chat_id = createUserchatDto.chat_id;
	return await this.userchatsRepository.save(userChat);
  }

  public async findAll() {
	return await this.userchatsRepository.find();
  }

  public async findOne(id: number) {
	return await this.userchatsRepository.findOne({where: { id: id}})
  }

  public async findByChatId(id: number) {
	return await this.userchatsRepository.find({where: { chat_id: id}})
  }

  public async findByUserId(id: number) {
	return await this.userchatsRepository.find({where: { user_id: id}})
  }

  public async update(id: number, updateUserchatDto: UpdateUserchatDto) {
	const userChat: UserChats = await this.userchatsRepository.findOne({ where: { id: id}})
	if (!userChat)
		throw new BadRequestException(['Unknown userchat.'], {
			cause: new Error(),
			description: `Userchat not found.`,
		});
	userChat.user_id = updateUserchatDto.user_id;
	userChat.chat_id = updateUserchatDto.chat_id;
	await this.userchatsRepository.save(userChat);
  }

  public async remove(id: number) {
	const userChat = await this.userchatsRepository.findOne({where: {id: id}})
	return await this.userchatsRepository.remove(userChat)
  }
}
