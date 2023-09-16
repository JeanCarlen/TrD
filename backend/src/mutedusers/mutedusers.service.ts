import { Injectable } from '@nestjs/common';
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

  public create(createMuteduserDto: CreateMuteduserDto) {
    const muteduser = new MutedUsers();
    muteduser.chat_id = createMuteduserDto.chat_id;
    muteduser.user_id = createMuteduserDto.user_id;
    muteduser.until = new Date(createMuteduserDto.until);
    return this.mutedUsersRepository.save(muteduser);
  }

  public findAll() {
    return this.mutedUsersRepository.find();
  }

  public findOne(id: number) {
    return this.mutedUsersRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateMuteduserDto: UpdateMuteduserDto) {
    return this.mutedUsersRepository.update({ id: id }, updateMuteduserDto);
  }

  public async remove(id: number) {
    const muteduser = await this.mutedUsersRepository.findOne({
      where: { id: id },
    });
    return this.mutedUsersRepository.remove(muteduser);
  }
}
