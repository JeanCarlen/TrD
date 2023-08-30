import { Injectable } from '@nestjs/common';
import { CreateUserAchievmentDto } from './dto/create-user_achievment.dto';
import { UpdateUserAchievmentDto } from './dto/update-user_achievment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievments } from './entities/user_achievment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAchievmentsService {
	constructor (
		@InjectRepository(UserAchievments)
		private readonly userachievmentsRepository: Repository<UserAchievments>
	) {}

  public create(createUserAchievmentDto: CreateUserAchievmentDto) {
	const userachievment: UserAchievments = new UserAchievments();
	userachievment.user_id = createUserAchievmentDto.user_id;
	userachievment.achievment_id = createUserAchievmentDto.achievment_id;
	userachievment.current = createUserAchievmentDto.current;
	return this.userachievmentsRepository.save(userachievment);
  }

  public findAll() {
    return this.userachievmentsRepository.find();
  }

  public findOne(id: number) {
	return this.userachievmentsRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateUserAchievmentDto: UpdateUserAchievmentDto) {
	return this.userachievmentsRepository.update({ id: id }, updateUserAchievmentDto);
  }

  public async remove(id: number) {
	const userachievment = await this.userachievmentsRepository.findOne({ where: { id: id } });
	return this.userachievmentsRepository.remove(userachievment);
  }
}
