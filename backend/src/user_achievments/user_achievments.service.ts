import { Injectable } from '@nestjs/common';
import { CreateUserAchievmentDto } from './dto/create-user_achievment.dto';
import { UpdateUserAchievmentDto } from './dto/update-user_achievment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievments } from './entities/user_achievment.entity';
import { Repository } from 'typeorm';
import { Achievments } from 'src/achievments/entities/achievment.entity';

@Injectable()
export class UserAchievmentsService {
  constructor(
    @InjectRepository(UserAchievments)
    private readonly userachievmentsRepository: Repository<UserAchievments>,
	@InjectRepository(Achievments)
	private readonly achievmentsRepository: Repository<Achievments>
  ) {}

  public create(createUserAchievmentDto: CreateUserAchievmentDto) {
    const userachievment: UserAchievments = new UserAchievments();
    userachievment.user_id = createUserAchievmentDto.user_id;
    userachievment.achievment_id = createUserAchievmentDto.achievment_id;
    userachievment.current = createUserAchievmentDto.current;
    return this.userachievmentsRepository.save(userachievment);
  }

  public async findAll() {
	const userAchievments: UserAchievments[] = await this.userachievmentsRepository.find();
	const achievments: Achievments[] = await this.achievmentsRepository.find();

	let ret : UserAchievmentReponse[] = [];

	userAchievments.forEach(userachievment => {
		let tmp :UserAchievmentReponse = {
			achievment_id: userachievment.achievment_id,
			current: userachievment.current,
			user_id: userachievment.user_id,
			achievment_data: achievments.find(achiv => {
				return achiv.id == userachievment.achievment_id
			})
		};
		ret.push(tmp)
	})
	return ret;
  }

  public async findUserAchievments(id: number) {
	const userAchievments: UserAchievments[] = await this.userachievmentsRepository.find({where: {user_id: id}});
	const achievments: Achievments[] = await this.achievmentsRepository.find();

	let ret: UserAchievmentReponse[] = [];

	userAchievments.forEach(userachievment => {
		let tmp: UserAchievmentReponse = {
			achievment_id: userachievment.achievment_id,
			current: userachievment.current,
			user_id: userachievment.user_id,
			achievment_data: achievments.find(achi => {
				return achi.id == userachievment.achievment_id
			})
		}
		ret.push(tmp);
	})
	return ret;
  }

  public findOne(id: number) {
    return this.userachievmentsRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateUserAchievmentDto: UpdateUserAchievmentDto) {
    return this.userachievmentsRepository.update(
      { id: id },
      updateUserAchievmentDto,
    );
  }

  public async remove(id: number) {
    const userachievment = await this.userachievmentsRepository.findOne({
      where: { id: id },
    });
    return this.userachievmentsRepository.remove(userachievment);
  }
}
