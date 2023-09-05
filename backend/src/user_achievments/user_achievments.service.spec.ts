import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievmentsService } from './user_achievments.service';

describe('UserAchievmentsService', () => {
  let service: UserAchievmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAchievmentsService],
    }).compile();

    service = module.get<UserAchievmentsService>(UserAchievmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
