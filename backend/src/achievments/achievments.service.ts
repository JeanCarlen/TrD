import { Injectable } from '@nestjs/common';
import { CreateAchievmentDto } from './dto/create-achievment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievments } from './entities/achievment.entity';
import { Repository } from 'typeorm';
import { AchievmentsResponse } from './dto/achievments.response';

@Injectable()
export class AchievmentsService {
  constructor(
    @InjectRepository(Achievments)
    private readonly achievmentsRepository: Repository<Achievments>,
  ) {}

//   public create(createAchievmentDto: CreateAchievmentDto) {
//     const achievment: Achievments = new Achievments();
//     achievment.description = createAchievmentDto.description;
//     achievment.title = createAchievmentDto.title;
//     achievment.objective = createAchievmentDto.objective;
//     return this.achievmentsRepository.save(achievment);
//   }

  public async findAll(): Promise<AchievmentsResponse[]> {
	const achievements: AchievmentsResponse[] = await this.achievmentsRepository.find();
    return achievements;
  }

  public async findOne(id: number): Promise<AchievmentsResponse> {
	const achievment: AchievmentsResponse = await this.achievmentsRepository.findOne({ where: { id: id } });
	return achievment;
  }

}
