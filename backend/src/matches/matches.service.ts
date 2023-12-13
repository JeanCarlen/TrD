import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Matches } from './entities/matches.entity';
import { MatchesResponse } from './dto/matches.response';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Matches)
    private readonly matchesRepository: Repository<Matches>,
	@InjectRepository(Users)
	private readonly usersRepository: Repository<Users>,
  ) {}

  public async create(createMatchDto: CreateMatchDto): Promise<MatchesResponse> {
    const match: Matches = new Matches();
    match.user_1 = createMatchDto.user_1;
    match.user_2 = createMatchDto.user_2;
    match.score_1 = 0;
    match.score_2 = 0;
    match.status = 0;
	const inserted: Matches = await this.matchesRepository.save(match);
	const users: Users[] = await this.usersRepository.find({
		where: [ { id: inserted.user_1 }, { id: inserted.user_2 }]
	})
	if (users.length < 2)
		throw new NotFoundException('Users not found.');
	const matchResponse: MatchesResponse = {
		id: inserted.id,
		user_1: inserted.user_1,
		user_2: inserted.user_2,
		user_1_data: {
			username: inserted.user_1 == users[0].id ? users[0].username : users[1].username,
			avatar: inserted.user_1 == users[0].id ? users[0].avatar : users[1].avatar,
			login42: inserted.user_1 == users[0].id ? users[0].login42 : users[1].login42,
		},
		user_2_data: {
			username: inserted.user_2 == users[0].id ? users[0].username : users[1].username,
			avatar: inserted.user_2 == users[0].id ? users[0].avatar : users[1].avatar,
			login42: inserted.user_2 == users[0].id ? users[0].login42 : users[1].login42,
		},
		score_1: inserted.score_1,
		score_2: inserted.score_2,
		status: inserted.status,
		status_text_en: inserted.status == 0 ? 'In Progress' : 'Finished',
		status_text_fr: inserted.status == 0 ? 'En cours' : 'Terminé',
	}
	return matchResponse;
  }

  public async findAll(current_id: number): Promise<MatchesResponse[]> {
	const matches: Matches[] = await this.matchesRepository.find({where: {status: 1}})
	if (matches.length == 0)
		return [];
	let user_ids: number[] = [];
	matches.map((match: Matches) => {
		if (!user_ids.includes(match.user_1))
			user_ids.push(match.user_1);
		if (!user_ids.includes(match.user_2))
			user_ids.push(match.user_2);
	});
	const users: Users[] = await this.usersRepository.find({
		where: { id: In(user_ids) }
	})
	let matchesResponse: MatchesResponse[] = [];
	await matches.forEach(async (match: Matches) => {
		const user_1: Users = await users.find((user: Users) => user.id == match.user_1);
		const user_2: Users = await users.find((user: Users) => user.id == match.user_2);
		const matchResponse: MatchesResponse = {
			id: match.id,
			user_1: match.user_1,
			user_2: match.user_2,
			user_1_data: {
				username: user_1.username,
				avatar: user_1.avatar,
				login42: user_1.login42,
			},
			user_2_data: {
				username: user_2.username,
				avatar: user_2.avatar,
				login42: user_2.login42,
			},
			score_1: match.score_1,
			score_2: match.score_2,
			status: match.status,
			status_text_en: match.status == 0 ? 'In Progress' : 'Finished',
			status_text_fr: match.status == 0 ? 'En cours' : 'Terminé',
		}
		matchesResponse.push(matchResponse);
	})
	return matchesResponse;
  }

  public async findOne(id: number, current_id: number) {
	const match: Matches = await this.matchesRepository.findOne({ where: { id: id } });
	if ((!match) || (match.user_1 != current_id && match.user_2 != current_id))
		throw new NotFoundException('Match not found.');
	const users: Users[] = await this.usersRepository.find({
		where: [
			{ id: match.user_1 },
			{ id: match.user_2 }
		]
	})
	const user_1 = users.find((user: Users) => user.id == match.user_1);
	const user_2 = users.find((user: Users) => user.id == match.user_2);
	const matchResponse: MatchesResponse = {
		id: match.id,
		user_1: match.user_1,
		user_2: match.user_2,
		user_1_data: {
			username: user_1.username,
			avatar: user_1.avatar,
			login42: user_1.login42,
		},
		user_2_data: {
			username: user_2.username,
			avatar: user_2.avatar,
			login42: user_2.login42,
		},
		score_1: match.score_1,
		score_2: match.score_2,
		status: match.status,
		status_text_en: match.status == 0 ? 'In Progress' : 'Finished',
		status_text_fr: match.status == 0 ? 'En cours' : 'Terminé',
	}
    return matchResponse;
  }

  public async findAllMatches() {
	await console.log('we got here 2');
	return await this.matchesRepository.find({ where: { status: 1 } });
  }

  public async findByUserId(id: number, current_id: number) {
	let matches = await this.findAll(id);
	let retArray: MatchesResponse[] = [];
	await Promise.all (matches.map((match) => {
		if (match.user_1 == id || match.user_2 == id)
		{
			retArray.push(match);
		}
	}))
	return retArray;
  }

  public async update(id: number, updateMatchDto: UpdateMatchDto, current_id: number) {
    const match: Matches = await this.matchesRepository.findOne({ where: { id: id } });
	if ((!match) || (match.user_1 != current_id && match.user_2 != current_id))
		throw new NotFoundException('Match not found.');
	if (match.status != 0)
		throw new UnauthorizedException('Match already finished.');
	return this.matchesRepository.update({ id: id }, updateMatchDto);
  }

  public async remove(id: number, current_id: number) {
    const match = await this.matchesRepository.findOne({ where: { id: id } });
	if ((!match) || (match.user_1 != current_id && match.user_2 != current_id))
		throw new NotFoundException('Match not found.');
    return this.matchesRepository.remove(match);
  }
}
