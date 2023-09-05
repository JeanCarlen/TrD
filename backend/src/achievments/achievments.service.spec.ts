import { Test, TestingModule } from '@nestjs/testing';
import { AchievmentsService } from './achievments.service';

describe('AchievmentsService', () => {
  let service: AchievmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievmentsService],
    }).compile();

    service = module.get<AchievmentsService>(AchievmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
