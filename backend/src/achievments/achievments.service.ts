import { Injectable } from '@nestjs/common';
import { CreateAchievmentDto } from './dto/create-achievment.dto';
import { UpdateAchievmentDto } from './dto/update-achievment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievments } from './entities/achievment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchievmentsService {
	constructor (
		@InjectRepository(Achievments)
		private readonly achievmentsRepository: Repository<Achievments>
	) {}

  public create(createAchievmentDto: CreateAchievmentDto) {
	const achievment: Achievments = new Achievments();
	achievment.description = createAchievmentDto.description;
	achievment.title = createAchievmentDto.title;
	achievment.objective = createAchievmentDto.objective;
	return this.achievmentsRepository.save(achievment);
  }

  public findAll() {
	return this.achievmentsRepository.find();
  }

  public findOne(id: number) {
	return this.achievmentsRepository.findOne({ where: { id: id } });
  }

  public update(id: number, updateAchievmentDto: UpdateAchievmentDto) {
	return this.achievmentsRepository.update({ id: id }, updateAchievmentDto);
  }

  public async remove(id: number) {
	const achievment = await this.achievmentsRepository.findOne({ where: { id: id } });
	return this.achievmentsRepository.remove(achievment);
  }
}
