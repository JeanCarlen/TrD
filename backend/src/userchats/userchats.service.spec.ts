import { Test, TestingModule } from '@nestjs/testing';
import { UserchatsService } from './userchats.service';

describe('UserchatsService', () => {
  let service: UserchatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserchatsService],
    }).compile();

    service = module.get<UserchatsService>(UserchatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
