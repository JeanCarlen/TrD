import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMuteduserDto } from './dto/create-muteduser.dto';
import { UpdateMuteduserDto } from './dto/update-muteduser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MutedUsers } from './entities/muteduser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MutedusersService {
  constructor(
    @InjectRepository(MutedUsers)
    private readonly mutedUsersRepository: Repository<MutedUsers>,
  ) {}

  public async create(createMuteduserDto: CreateMuteduserDto) {
    const muteduser = new MutedUsers();
    muteduser.chat_id = createMuteduserDto.chat_id;
    muteduser.user_id = createMuteduserDto.user_id;
    muteduser.until = new Date(createMuteduserDto.until);
    return await this.mutedUsersRepository.save(muteduser);
  }

  public async findAll() {
    return await this.mutedUsersRepository.find();
  }

  public async findOne(id: number) {
    return await this.mutedUsersRepository.findOne({ where: { id: id } });
  }

  public async update(id: number, updateMuteduserDto: UpdateMuteduserDto) {
	const muteduser = this.mutedUsersRepository.findOne({ where: { id: id } });
	if (!muteduser) {
		throw new NotFoundException(['Muted user not found.'], {
			cause: new Error(),
			description: `Muted user not found.`,
		});
	}
    return await this.mutedUsersRepository.update({ id: id }, updateMuteduserDto);
  }

  public async remove(id: number) {
    const muteduser = await this.mutedUsersRepository.findOne({
      where: { id: id },
    });
	if (!muteduser) {
		throw new NotFoundException(['Muted user not found.'], {
			cause: new Error(),
			description: `Muted user not found.`,
		});
	}
    return await this.mutedUsersRepository.remove(muteduser);
  }
}
