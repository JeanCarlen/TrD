import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAchievmentDto } from './dto/create-user_achievment.dto';
import { UpdateUserAchievmentDto } from './dto/update-user_achievment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievments } from './entities/user_achievment.entity';
import { Repository } from 'typeorm';
import { Achievments } from 'src/achievments/entities/achievment.entity';
import { UserAchievmentResponse } from './dto/userachievment.response';

@Injectable()
export class UserAchievmentsService {
  constructor(
    @InjectRepository(UserAchievments)
    private readonly userachievmentsRepository: Repository<UserAchievments>,
	@InjectRepository(Achievments)
	private readonly achievmentsRepository: Repository<Achievments>
  ) {}

  public async create(createUserAchievmentDto: CreateUserAchievmentDto) {
    const userachievment: UserAchievments = new UserAchievments();
	const achievment: Achievments = await this.achievmentsRepository.findOne({where: {id: createUserAchievmentDto.achievment_id}});

	
    userachievment.user_id = createUserAchievmentDto.user_id;
    userachievment.achievment_id = createUserAchievmentDto.achievment_id;
    userachievment.current = createUserAchievmentDto.current;
	userachievment.type = achievment.type;
	let completed = userachievment.current == achievment.objective ? true : false;
	userachievment.completed = completed;
	const ret: UserAchievmentResponse = {
		achievment_id: userachievment.achievment_id,
		current: userachievment.current,
		user_id: userachievment.user_id,
		type: achievment.type,
		completed: completed,
		achievment_data: achievment
	}
	await this.userachievmentsRepository.save(userachievment);
    return ret;
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

  public async findOneByUserAndAchievment(user_id: number, achievment_id: number) {
	return await this.userachievmentsRepository.findOne({where: {user_id: user_id, achievment_id: achievment_id}});
  }

  public async findAllByUserAndType(user_id: number, type: string) {
	return await this.userachievmentsRepository.find({where: {user_id: user_id, type: type}});
  }

  public async findAllCompletedByUser(user_id: number) {
	return await this.userachievmentsRepository.find({where: {user_id: user_id, completed: true}});
  }

  public async update(id: number, updateUserAchievmentDto: UpdateUserAchievmentDto) {
	const userachievment = await this.userachievmentsRepository.findOne({ where: { id: id } });
	if (!userachievment) {
		throw new NotFoundException(['User achievment not found.'], {
			cause: new Error(),
			description: `User achievment not found.`,
		});
	}
	const achi: Achievments = await this.achievmentsRepository.findOne({where: {id: userachievment.achievment_id}});

	let completed: boolean = updateUserAchievmentDto.current == achi.objective ? true : false;

	const ret: UserAchievmentResponse = {
		achievment_id: userachievment.achievment_id,
		current: userachievment.current,
		user_id: userachievment.user_id,
		completed: completed,
		type: achi.type,
		achievment_data: achi
	}
	updateUserAchievmentDto.completed = completed;
    await this.userachievmentsRepository.update(
      { id: id },
      updateUserAchievmentDto,
    );
	return ret;
  }

  public async remove(id: number) {
    const userachievment = await this.userachievmentsRepository.findOne({
      where: { id: id },
    });
	if (!userachievment) {
		throw new NotFoundException(['User achievment not found.'], {
			cause: new Error(),
			description: `User achievment not found.`,
		});
	}
    return await this.userachievmentsRepository.remove(userachievment);
  }
}
