import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matches } from './entities/matches.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Matches)
    private readonly matchesRepository: Repository<Matches>,
  ) {}

  public async create(createMatchDto: CreateMatchDto): Promise<Matches> {
    const match: Matches = new Matches();
    match.user_1 = createMatchDto.user_1;
    match.user_2 = createMatchDto.user_2;
    match.score_1 = 0;
    match.score_2 = 0;
    match.status = 0;
    return this.matchesRepository.save(match);
  }

  public findAll() {
    return this.matchesRepository.find();
  }

  public findOne(id: number) {
    return this.matchesRepository.findOne({ where: { id: id } });
  }

  public findByUserId(id: number) {
    return this.matchesRepository.find({
      where: [{ user_1: id }, { user_2: id }],
    });
  }

  public update(id: number, updateMatchDto: UpdateMatchDto) {
    return this.matchesRepository.update({ id: id }, updateMatchDto);
  }

  public async remove(id: number) {
    const match = await this.matchesRepository.findOne({ where: { id: id } });
    return this.matchesRepository.remove(match);
  }
}
